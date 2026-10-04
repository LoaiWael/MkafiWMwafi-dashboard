import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CheckSquare,
  Pencil,
  ShieldAlert,
  ShieldCheck,
  Square,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { FadeIn } from "@/components/animations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSidebar } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { profileInitials } from "@/features/profile/components/profile-banner";
import ProfileBreadcrumb from "@/features/profile/components/profile-breadcrumb";
import ProfileMissing from "@/features/profile/components/profile-missing";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { PERMISSION_MODULE_GROUPS, SYSTEM_PERMISSIONS } from "../constants";
import { useRole } from "../hooks/use-roles";
import { createRole, getRoleEmployees, updateRole } from "../roles-store";
import type { RoleInput } from "../types";

interface RoleEditorViewProps {
  roleId?: string;
}

export default function RoleEditorView({ roleId }: RoleEditorViewProps) {
  const isCreating = !roleId;
  const role = useRole(roleId);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(
    isCreating || searchParams.get("edit") === "true",
  );
  const navigate = useNavigate();

  if (!isCreating && !role) {
    return (
      <div className="page-shell space-y-6 py-6 sm:py-8">
        <ProfileMissing
          title="الدور الوظيفي غير موجود"
          description="لا يوجد دور وظيفي مسجل بهذا المعرّف في النظام."
          backTo={ROUTES.roles}
          backLabel="العودة إلى قائمة الأدوار"
        />
      </div>
    );
  }

  function handleToggleEdit(editing: boolean) {
    setIsEditing(editing);
    if (editing) {
      setSearchParams({ edit: "true" }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }

  return (
    <RoleEditorContent
      key={`${role?.id ?? "new"}-${isEditing ? "edit" : "view"}`}
      role={role}
      isCreating={isCreating}
      isEditing={isEditing}
      onToggleEdit={handleToggleEdit}
      onSuccessCreate={() => navigate(ROUTES.roles, { viewTransition: true })}
    />
  );
}

interface RoleEditorContentProps {
  role?: ReturnType<typeof useRole>;
  isCreating: boolean;
  isEditing: boolean;
  onToggleEdit: (editing: boolean) => void;
  onSuccessCreate: () => void;
}

function RoleEditorContent({
  role,
  isCreating,
  isEditing,
  onToggleEdit,
  onSuccessCreate,
}: RoleEditorContentProps) {
  const { isMobile, state } = useSidebar();
  const sidebarGap = isMobile
    ? undefined
    : state === "collapsed"
      ? "var(--sidebar-width-icon)"
      : "var(--sidebar-width)";

  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    role ? [...role.permissionKeys] : [],
  );
  const [errors, setErrors] = useState<{
    name?: string;
    permissions?: string;
    form?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAvailable = SYSTEM_PERMISSIONS.length;
  const isAllSelected = selectedKeys.length === totalAvailable;
  const employees = role ? getRoleEmployees(role.name) : [];

  function handleTogglePermission(key: string) {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
    if (errors.permissions) {
      setErrors((prev) => ({ ...prev, permissions: undefined }));
    }
  }

  function handleToggleModule(moduleKeys: readonly string[]) {
    const allModuleSelected = moduleKeys.every((key) =>
      selectedKeys.includes(key),
    );

    if (allModuleSelected) {
      setSelectedKeys((prev) => prev.filter((k) => !moduleKeys.includes(k)));
    } else {
      setSelectedKeys((prev) => [
        ...prev,
        ...moduleKeys.filter((k) => !prev.includes(k)),
      ]);
    }

    if (errors.permissions) {
      setErrors((prev) => ({ ...prev, permissions: undefined }));
    }
  }

  function handleToggleAll() {
    if (isAllSelected) {
      setSelectedKeys([]);
    } else {
      setSelectedKeys(SYSTEM_PERMISSIONS.map((p) => p.key));
    }
    if (errors.permissions) {
      setErrors((prev) => ({ ...prev, permissions: undefined }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: { name?: string; permissions?: string; form?: string } =
      {};
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();

    if (trimmedName.length < 2) {
      nextErrors.name = "اسم الدور يجب أن يتكون من حرفين على الأقل.";
    }
    if (selectedKeys.length === 0) {
      nextErrors.permissions = "يجب تحديد صلاحية واحدة على الأقل لهذا الدور.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    const input: RoleInput = {
      name: trimmedName,
      description: trimmedDesc,
      permissionKeys: selectedKeys,
    };

    const res = role ? updateRole(role.id, input) : createRole(input);

    if (res.error) {
      setIsSubmitting(false);
      setErrors({ form: res.error });
      return;
    }

    toast.success(
      role
        ? `تم تحديث دور "${trimmedName}" بنجاح`
        : `تمت إضافة دور "${trimmedName}" بنجاح`,
    );

    if (isCreating) {
      onSuccessCreate();
    } else {
      setIsSubmitting(false);
      onToggleEdit(false);
    }
  }

  return (
    <div className="page-shell space-y-4 py-3 sm:space-y-5 sm:py-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <ProfileBreadcrumb
            items={[
              { label: "الأدوار والصلاحيات", to: ROUTES.roles },
              {
                label: isCreating ? "إضافة دور جديد" : role?.name ?? "",
              },
            ]}
          />
        </div>
        <Link
          to={ROUTES.roles}
          viewTransition
          className="inline-flex h-8 sm:h-9 shrink-0 items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 sm:px-3.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ArrowRight className="size-3.5" />
          <span className="hidden xs:inline">العودة للأدوار</span>
          <span className="xs:hidden">عودة</span>
        </Link>
      </div>

      {/* Main Page Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-border bg-card p-3.5 sm:p-5">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-4.5 sm:size-5" />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
              <h1 className="text-base sm:text-xl font-bold text-foreground truncate">
                {isCreating
                  ? "إضافة دور وظيفي جديد"
                  : isEditing
                    ? `تعديل: ${role?.name}`
                    : role?.name}
              </h1>
              {role ? (
                role.isSystem ? (
                  <Badge
                    variant="outline"
                    className="border-primary/30 bg-primary/10 text-primary text-[10px] sm:text-[11px] font-semibold shrink-0"
                  >
                    أساسي للنظام
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] sm:text-[11px] shrink-0">
                    مخصص
                  </Badge>
                )
              ) : null}
            </div>
          </div>

          {!isCreating && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isEditing ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleEdit(false)}
                  className="h-8 sm:h-8 w-full sm:w-auto justify-center gap-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <X className="size-3.5" />
                  إلغاء التعديل
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onToggleEdit(true)}
                  className="h-8 sm:h-8 w-full sm:w-auto justify-center gap-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <Pencil className="size-3.5" />
                  تعديل الدور والصلاحيات
                </Button>
              )}
            </div>
          )}
        </div>
      </FadeIn>

      {/* Form / Content Area */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Card 1: General Details */}
          <FadeIn delay={0.05}>
            <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
              <h2 className="text-xs sm:text-sm font-bold text-foreground">بيانات الدور</h2>

              <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 sm:gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="role-name"
                    className="text-xs font-semibold text-foreground"
                  >
                    اسم الدور <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="role-name"
                    placeholder="مثال: مسؤول توثيق"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    className={cn(
                      "h-9.5 sm:h-10 rounded-xl text-xs sm:text-sm",
                      errors.name && "border-destructive",
                    )}
                  />
                  {errors.name ? (
                    <p className="text-xs font-medium text-destructive">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="role-desc"
                    className="text-xs font-semibold text-foreground"
                  >
                    الوصف
                  </Label>
                  <Textarea
                    id="role-desc"
                    placeholder="نبذة مختصرة عن مهام هذا الدور..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="rounded-xl resize-none text-xs sm:text-sm"
                  />
                </div>
              </div>

              {!isCreating && employees.length > 0 ? (
                <div className="pt-3 border-t border-border space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground">
                    الموظفون المرتبطون ({employees.length}):
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {employees.map((emp) => (
                      <Link
                        key={emp.id}
                        to={`${ROUTES.employees}/${emp.id}`}
                        viewTransition
                        className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2 sm:px-2.5 py-1 text-xs transition-colors hover:bg-muted"
                      >
                        <Avatar className="size-4.5 sm:size-5 shrink-0 border border-border">
                          {emp.avatarUrl ? (
                            <AvatarImage src={emp.avatarUrl} alt="" />
                          ) : null}
                          <AvatarFallback className="bg-primary/10 text-[9px] font-bold text-primary">
                            {profileInitials(emp.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground truncate">
                          {emp.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </FadeIn>

          {/* Card 2: Permissions Matrix (Edit Mode) */}
          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <h2 className="text-xs sm:text-sm font-bold text-foreground truncate">
                    مصفوفة الصلاحيات
                  </h2>
                  <Badge
                    variant="secondary"
                    className="font-mono text-[11px] sm:text-xs px-2 py-0.5 shrink-0"
                  >
                    {selectedKeys.length} / {totalAvailable}
                  </Badge>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleAll}
                  className="h-8 shrink-0 gap-1.5 px-2 sm:px-3 text-xs font-semibold text-primary hover:bg-primary/10 cursor-pointer"
                >
                  {isAllSelected ? (
                    <>
                      <Square className="size-3.5" />
                      <span>إلغاء تحديد الكل</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="size-3.5" />
                      <span>تحديد الكل</span>
                    </>
                  )}
                </Button>
              </div>

              {errors.permissions ? (
                <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-2.5 text-xs font-medium text-destructive">
                  <ShieldAlert className="size-4 shrink-0" />
                  <span>{errors.permissions}</span>
                </div>
              ) : null}

              {/* Modules Grid */}
              <div className="space-y-2.5 sm:space-y-3">
                {PERMISSION_MODULE_GROUPS.map((group) => {
                  const GroupIcon = group.icon;
                  const moduleKeys = group.permissions.map((p) => p.key);
                  const selectedCount = moduleKeys.filter((k) =>
                    selectedKeys.includes(k),
                  ).length;
                  const isGroupAll = selectedCount === moduleKeys.length;
                  const isGroupPartial =
                    selectedCount > 0 && selectedCount < moduleKeys.length;

                  return (
                    <div
                      key={group.id}
                      className="rounded-xl border border-border bg-card/60 p-3 sm:p-4 space-y-2.5 sm:space-y-3 transition-colors hover:border-primary/30"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex size-6.5 sm:size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <GroupIcon className="size-3.5 sm:size-4" />
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                            <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                              {group.label}
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-mono shrink-0">
                              ({selectedCount}/{group.permissions.length})
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleModule(moduleKeys)}
                          className={cn(
                            "h-7 shrink-0 rounded-lg text-xs font-medium cursor-pointer transition-colors px-2 sm:px-2.5",
                            isGroupAll &&
                              "border-primary/30 bg-primary/10 text-primary font-semibold",
                          )}
                        >
                          {isGroupAll ? (
                            <span className="flex items-center gap-1">
                              <Check className="size-3" />
                              محدد
                            </span>
                          ) : isGroupPartial ? (
                            "تحديد المتبقي"
                          ) : (
                            "تحديد القسم"
                          )}
                        </Button>
                      </div>

                      {/* Permissions list grid */}
                      <div className="grid grid-cols-1 gap-1.5 sm:gap-2 pt-0.5 sm:grid-cols-2 lg:grid-cols-3">
                        {group.permissions.map((permission) => {
                          const isChecked = selectedKeys.includes(
                            permission.key,
                          );
                          return (
                            <label
                              key={permission.id}
                              htmlFor={`perm-${permission.id}`}
                              className={cn(
                                "flex items-start gap-2 sm:gap-2.5 rounded-lg border p-2 sm:p-2.5 transition-all cursor-pointer select-none active:scale-[0.99] touch-manipulation",
                                isChecked
                                  ? "border-primary/40 bg-primary-50/50 dark:bg-primary-950/20"
                                  : "border-border/60 bg-muted/20 hover:bg-muted/40",
                              )}
                            >
                              <Checkbox
                                id={`perm-${permission.id}`}
                                checked={isChecked}
                                onCheckedChange={() =>
                                  handleTogglePermission(permission.key)
                                }
                                className="mt-0.5 shrink-0"
                              />
                              <div className="min-w-0 flex-1 space-y-0.5">
                                <span className="block text-xs font-bold text-foreground leading-snug break-words">
                                  {permission.name}
                                </span>
                                <span className="block text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                                  {permission.description}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          {/* Global form error */}
          {errors.form ? (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-semibold text-destructive"
            >
              <ShieldAlert className="size-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          ) : null}

          {/* Spacer so content isn't covered by the fixed bottom action bar */}
          <div className="h-28 sm:h-20" aria-hidden="true" />

          {/* Fixed Action Footer */}
          <motion.div
            role="region"
            aria-label="إجراءات حفظ الدور"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="pointer-events-none fixed inset-x-0 bottom-2.5 sm:bottom-4 z-40 flex justify-center px-2.5 sm:px-4"
            style={{ marginInlineStart: sidebarGap }}
          >
            <div className="pointer-events-auto flex w-full max-w-(--page-max-width) flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 rounded-2xl border border-border bg-card/95 p-3 sm:p-3.5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between sm:justify-start gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-primary shrink-0" />
                  <span className="font-medium">
                    {selectedKeys.length} من {totalAvailable} صلاحية
                  </span>
                </div>
                <span className="text-[11px] font-mono sm:hidden text-muted-foreground/80">
                  {isCreating ? "إنشاء جديد" : "تعديل الصلاحيات"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5">
                {isCreating ? (
                  <Link
                    to={ROUTES.roles}
                    viewTransition
                    className="inline-flex h-9 w-full sm:w-auto items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    إلغاء
                  </Link>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onToggleEdit(false)}
                    className="h-9 w-full sm:w-auto rounded-xl px-4 text-xs font-semibold cursor-pointer"
                  >
                    إلغاء
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 w-full sm:w-auto rounded-xl px-5 text-xs font-semibold cursor-pointer"
                >
                  {isCreating ? "إضافة الدور" : "حفظ التعديلات"}
                </Button>
              </div>
            </div>
          </motion.div>
        </form>
      ) : (
        /* View Details Mode */
        <div className="space-y-4 sm:space-y-5">
          {/* Card 1: Role Overview & Assigned Employees */}
          <FadeIn delay={0.05}>
            <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 sm:gap-2 border-b border-border pb-3">
                <h2 className="text-xs sm:text-sm font-bold text-foreground">بيانات الدور</h2>
                <span className="text-[11px] sm:text-xs text-muted-foreground font-mono">
                  {role?.createdAt ? `تاريخ الإنشاء: ${role.createdAt}` : ""}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {role?.description || "لا يوجد وصف مسجل لهذا الدور."}
                </p>
              </div>

              {/* Assigned Employees */}
              <div className="pt-3 border-t border-border space-y-2 sm:space-y-2.5">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">
                    الموظفون المسند إليهم ({employees.length})
                  </span>
                </div>

                {employees.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    لا يوجد موظفون مسندون لهذا الدور حالياً.
                  </p>
                ) : (
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {employees.map((emp) => (
                      <Link
                        key={emp.id}
                        to={`${ROUTES.employees}/${emp.id}`}
                        viewTransition
                        className="inline-flex max-w-full items-center gap-2 rounded-xl border border-border bg-muted/40 px-2.5 py-1.5 transition-colors hover:bg-muted hover:border-primary/40"
                      >
                        <Avatar className="size-5 sm:size-6 shrink-0 border border-border">
                          {emp.avatarUrl ? (
                            <AvatarImage src={emp.avatarUrl} alt="" />
                          ) : null}
                          <AvatarFallback className="bg-primary/10 text-[9px] sm:text-[10px] font-bold text-primary">
                            {profileInitials(emp.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold text-foreground truncate">
                          {emp.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Card 2: Permissions Matrix (Readonly Breakdown) */}
          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <h2 className="text-xs sm:text-sm font-bold text-foreground truncate">
                    تفاصيل الصلاحيات
                  </h2>
                  <Badge
                    variant="secondary"
                    className="font-mono text-[11px] sm:text-xs px-2 py-0.5 shrink-0"
                  >
                    {role?.permissionKeys.length} / {totalAvailable}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                {PERMISSION_MODULE_GROUPS.map((group) => {
                  const GroupIcon = group.icon;
                  const activeInGroup = group.permissions.filter((p) =>
                    role?.permissionKeys.includes(p.key),
                  );
                  const hasAny = activeInGroup.length > 0;

                  return (
                    <div
                      key={group.id}
                      className={cn(
                        "rounded-xl border p-3 sm:p-3.5 space-y-2 sm:space-y-2.5 transition-colors",
                        hasAny
                          ? "border-border bg-card"
                          : "border-border/40 bg-muted/20 opacity-60",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex size-5.5 sm:size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <GroupIcon className="size-3 sm:size-3.5" />
                          </div>
                          <span className="text-xs font-bold text-foreground truncate">
                            {group.label}
                          </span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground shrink-0">
                          {activeInGroup.length}/{group.permissions.length}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {group.permissions.map((perm) => {
                          const isGranted = Boolean(
                            role?.permissionKeys.includes(perm.key),
                          );
                          return (
                            <div
                              key={perm.id}
                              className="flex items-start justify-between gap-2 text-xs py-0.5"
                            >
                              <span
                                className={cn(
                                  "leading-snug min-w-0 flex-1",
                                  isGranted
                                    ? "text-foreground font-medium"
                                    : "text-muted-foreground line-through opacity-60",
                                )}
                              >
                                {perm.name}
                              </span>
                              {isGranted ? (
                                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="size-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      )}
    </div>
  );
}
