import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteRole, getRoleEmployeesCount } from "../roles-store";
import type { RoleRecord } from "../types";

interface RoleDeleteDialogProps {
  open: boolean;
  role: RoleRecord | null;
  onOpenChange: (open: boolean) => void;
}

export default function RoleDeleteDialog({
  open,
  role,
  onOpenChange,
}: RoleDeleteDialogProps) {
  if (!role) return null;

  const assignedCount = getRoleEmployeesCount(role.name);

  function handleConfirm() {
    if (!role) return;
    const res = deleteRole(role.id);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success(`تم حذف دور "${role.name}" بنجاح`);
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-500">
            <AlertTriangle className="size-5" />
          </div>
          <AlertDialogTitle className="text-base sm:text-lg font-bold">
            هل أنت متأكد من حذف دور &quot;{role.name}&quot;؟
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {assignedCount > 0 ? (
              <span className="text-rose-600 dark:text-rose-500 font-medium">
                تنبيه: يوجد ({assignedCount}) موظف مسند إليهم هذا الدور. لا يمكن حذف الدور قبل إعادة تعيين أو نقل الموظفين لدور آخر.
              </span>
            ) : (
              "سيتم حذف هذا الدور الوظيفي وإلغاء مصفوفة الصلاحيات المخصصة له نهائياً من النظام. هذا الإجراء لا يمكن التراجع عنه."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0 mt-2">
          <AlertDialogCancel className="rounded-xl cursor-pointer">
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={assignedCount > 0 || role.isSystem}
            className="rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-none cursor-pointer font-semibold"
          >
            تأكيد الحذف
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
