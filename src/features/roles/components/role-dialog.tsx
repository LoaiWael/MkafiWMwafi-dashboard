import { useState, type FormEvent } from "react";
import { Check, CheckSquare, ShieldCheck, Square } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { PERMISSION_MODULE_GROUPS, SYSTEM_PERMISSIONS } from "../constants";
import { createRole, updateRole } from "../roles-store";
import type { RoleInput, RoleRecord } from "../types";

interface RoleDialogProps {
  open: boolean;
  role?: RoleRecord | null;
  onOpenChange: (open: boolean) => void;
}

export default function RoleDialog({
  open,
  role,
  onOpenChange,
}: RoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <RoleForm
          key={role?.id ?? "new"}
          role={role}
          onClose={() => onOpenChange(false)}
        />
      ) : null}
    </Dialog>
  );
}

function RoleForm({
  role,
  onClose,
}: {
  role?: RoleRecord | null;
  onClose: () => void;
}) {
  const isEditing = Boolean(role);
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [selectedKeys, setSelectedKeys] = useState<string[]>(
    role ? [...role.permissionKeys] : [],
  );
  const [errors, setErrors] = useState<{ name?: string; permissions?: string; form?: string }>({});

  const totalAvailable = SYSTEM_PERMISSIONS.length;
  const isAllSelected = selectedKeys.length === totalAvailable;

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
    const nextErrors: { name?: string; permissions?: string; form?: string } = {};
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

    const input: RoleInput = {
      name: trimmedName,
      description: trimmedDesc,
      permissionKeys: selectedKeys,
    };

    const res = role ? updateRole(role.id, input) : createRole(input);

    if (res.error) {
      setErrors({ form: res.error });
      return;
    }

    toast.success(
      role
        ? `تم تحديث دور "${trimmedName}" بنجاح`
        : `تمت إضافة دور "${trimmedName}" بنجاح`,
    );
    onClose();
  }

  return (
    <DialogContent className="w-full sm:max-w-4xl lg:max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
      <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border pe-14">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold">
              {isEditing ? "تعديل الدور والصلاحيات" : "إضافة دور وظيفي جديد"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm mt-0.5">
              {isEditing
                ? "تعديل مسمى الدور ووصفه وتخصيص الصلاحيات الممنوحة للمستخدمين."
                : "حدد اسم الدور ووصفه ومصفوفة الصلاحيات المتاحة لهذا المسمى الوظيفي."}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Role Name and Description */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="role-name" className="text-xs sm:text-sm font-semibold">
                اسم الدور الوظيفي <span className="text-destructive">*</span>
              </Label>
              <Input
                id="role-name"
                placeholder="مثال: مسؤول توثيق متقدم"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={cn("rounded-xl", errors.name && "border-destructive")}
              />
              {errors.name ? (
                <p className="text-xs text-destructive">{errors.name}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role-desc" className="text-xs sm:text-sm font-semibold">
                وصف الدور والمهام
              </Label>
              <Textarea
                id="role-desc"
                placeholder="نبذة مختصرة عن مهام ومسؤوليات هذا الدور في لوحة التحكم..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="rounded-xl resize-none text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Permissions Matrix */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <Label className="text-sm sm:text-base font-bold text-foreground">
                  مصفوفة الصلاحيات
                </Label>
                <Badge variant="secondary" className="font-mono text-xs">
                  {selectedKeys.length} / {totalAvailable} مختارة
                </Badge>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleToggleAll}
                className="h-8 gap-1.5 text-xs font-semibold text-primary hover:bg-primary/10 cursor-pointer"
              >
                {isAllSelected ? (
                  <>
                    <Square className="size-3.5" />
                    <span>إلغاء تحديد الكل</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="size-3.5" />
                    <span>تحديد جميع الصلاحيات</span>
                  </>
                )}
              </Button>
            </div>

            {errors.permissions ? (
              <p className="text-xs font-medium text-destructive">{errors.permissions}</p>
            ) : null}

            {/* Modules Accordion / List */}
            <div className="space-y-3">
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
                    className="rounded-xl border border-border bg-card/60 p-3 sm:p-4 space-y-3 transition-colors hover:border-primary/30"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <GroupIcon className="size-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-foreground">
                              {group.label}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono">
                              ({selectedCount}/{group.permissions.length})
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {group.description}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleModule(moduleKeys)}
                        className={cn(
                          "h-7 rounded-lg text-xs font-medium cursor-pointer transition-colors px-2.5",
                          isGroupAll && "border-primary/30 bg-primary/10 text-primary font-semibold",
                        )}
                      >
                        {isGroupAll ? (
                          <span className="flex items-center gap-1">
                            <Check className="size-3" />
                            محدد بالكامل
                          </span>
                        ) : isGroupPartial ? (
                          "تحديد المتبقي"
                        ) : (
                          "تحديد القسم"
                        )}
                      </Button>
                    </div>

                    {/* Permissions list */}
                    <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
                      {group.permissions.map((permission) => {
                        const isChecked = selectedKeys.includes(permission.key);
                        return (
                          <label
                            key={permission.id}
                            htmlFor={`perm-${permission.id}`}
                            className={cn(
                              "flex items-start gap-2.5 rounded-lg border p-2.5 transition-all cursor-pointer select-none",
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
                              className="mt-0.5"
                            />
                            <div className="min-w-0 space-y-0.5">
                              <span className="block text-xs font-bold text-foreground">
                                {permission.name}
                              </span>
                              <span className="block text-[11px] text-muted-foreground line-clamp-2">
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

          {errors.form ? (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.form}
            </p>
          ) : null}
        </div>

        <DialogFooter className="m-0 flex flex-row items-center justify-end gap-3 p-3 sm:p-4 border-t border-border bg-muted/20">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl cursor-pointer"
          >
            إلغاء
          </Button>
          <Button type="submit" className="rounded-xl font-semibold cursor-pointer">
            {isEditing ? "حفظ التعديلات" : "إضافة الدور"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
