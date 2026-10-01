import { CheckCircle2, ShieldCheck, Users, XCircle } from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { profileInitials } from "@/features/profile/components/profile-banner";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { PERMISSION_MODULE_GROUPS } from "../constants";
import { getRoleEmployees } from "../roles-store";
import type { RoleRecord } from "../types";

interface RolePermissionsDialogProps {
  open: boolean;
  role: RoleRecord | null;
  onOpenChange: (open: boolean) => void;
  onEdit?: (role: RoleRecord) => void;
}

export default function RolePermissionsDialog({
  open,
  role,
  onOpenChange,
  onEdit,
}: RolePermissionsDialogProps) {
  if (!role) return null;

  const employees = getRoleEmployees(role.name);
  const totalPermissions = role.permissionKeys.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-4xl lg:max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-border pe-14">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-lg font-bold">
                  {role.name}
                </DialogTitle>
                {role.isSystem ? (
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary text-[10px]">
                    أساسي للنظام
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px]">
                    مخصص
                  </Badge>
                )}
                <Badge variant="secondary" className="font-mono text-xs">
                  {totalPermissions} صلاحية مفعلة
                </Badge>
              </div>
              <DialogDescription className="text-xs sm:text-sm mt-0.5 line-clamp-1">
                {role.description || "لا يوجد وصف إضافي لهذا الدور."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Assigned Employees Section */}
          <div className="rounded-xl border border-border bg-card p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                <h4 className="text-xs sm:text-sm font-bold text-foreground">
                  الموظفين المسند إليهم هذا الدور
                </h4>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {employees.length} موظف
              </Badge>
            </div>

            {employees.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                لا يوجد موظفون مسندون لهذا الدور حالياً.
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {employees.map((emp) => (
                  <Link
                    key={emp.id}
                    to={`${ROUTES.employees}/${emp.id}`}
                    viewTransition
                    className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 transition-colors hover:bg-muted hover:border-primary/30 cursor-pointer"
                  >
                    <Avatar className="size-6 border border-border">
                      {emp.avatarUrl ? (
                        <AvatarImage src={emp.avatarUrl} alt="" />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                        {profileInitials(emp.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-foreground">
                      {emp.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Module Breakdown */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground">
              تفاصيل الصلاحيات حسب الأقسام
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PERMISSION_MODULE_GROUPS.map((group) => {
                const GroupIcon = group.icon;
                const activeInGroup = group.permissions.filter((p) =>
                  role.permissionKeys.includes(p.key),
                );
                const hasAny = activeInGroup.length > 0;

                return (
                  <div
                    key={group.id}
                    className={cn(
                      "rounded-xl border p-3.5 space-y-2.5 transition-colors",
                      hasAny
                        ? "border-border bg-card"
                        : "border-border/40 bg-muted/20 opacity-60",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <GroupIcon className="size-3.5" />
                        </div>
                        <span className="text-xs font-bold text-foreground">
                          {group.label}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {activeInGroup.length}/{group.permissions.length}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {group.permissions.map((perm) => {
                        const isGranted = role.permissionKeys.includes(perm.key);
                        return (
                          <div
                            key={perm.id}
                            className="flex items-center justify-between gap-2 text-xs"
                          >
                            <span
                              className={cn(
                                "line-clamp-1",
                                isGranted
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground line-through opacity-70",
                              )}
                            >
                              {perm.name}
                            </span>
                            {isGranted ? (
                              <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ) : (
                              <XCircle className="size-3.5 text-muted-foreground/40 shrink-0" />
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
        </div>

        <DialogFooter className="m-0 flex flex-row items-center justify-end gap-3 p-3 sm:p-4 border-t border-border bg-muted/20">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl cursor-pointer"
          >
            إغلاق
          </Button>
          {onEdit ? (
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onEdit(role);
              }}
              className="rounded-xl font-semibold cursor-pointer"
            >
              تعديل الدور والصلاحيات
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
