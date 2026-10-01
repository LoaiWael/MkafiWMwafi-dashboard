import { useState } from "react";
import { ArrowRight, Bell, Pencil, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router";
import { FadeIn } from "@/components/animations";
import WarningDialog from "@/components/warning-dialog";
import { Button } from "@/components/ui/button";
import { setEmployeeActive } from "@/features/employees/employees-store";
import { useEmployee } from "@/features/employees/hooks/use-employees";
import ProfileActivityLog from "@/features/profile/components/profile-activity-log";
import ProfileBanner from "@/features/profile/components/profile-banner";
import ProfileBreadcrumb from "@/features/profile/components/profile-breadcrumb";
import ProfileFacts from "@/features/profile/components/profile-facts";
import ProfileMissing from "@/features/profile/components/profile-missing";
import ProfilePermissions from "@/features/profile/components/profile-permissions";
import { ROUTES } from "@/lib/constants";
import EmployeeDialog from "./employee-dialog";
import EmployeeNotifyDialog from "./employee-notify-dialog";

interface EmployeeDetailsViewProps {
  employeeId: string | undefined;
}

export default function EmployeeDetailsView({
  employeeId,
}: EmployeeDetailsViewProps) {
  const employee = useEmployee(employeeId);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  if (!employee) {
    return (
      <div className="page-shell space-y-6 py-6 sm:py-8">
        <ProfileMissing
          title="الموظف غير موجود"
          description="لا يوجد حساب موظف بهذا المعرّف."
          backTo={ROUTES.employees}
          backLabel="العودة إلى الموظفين"
        />
      </div>
    );
  }

  function handleActivate() {
    if (!employee) return;
    setEmployeeActive(employee.id, true);
    toast.success("تم تفعيل الحساب");
  }

  function handleDeactivateConfirm() {
    if (!employee) return;
    setEmployeeActive(employee.id, false);
    toast.success("تم إيقاف الحساب");
  }

  return (
    <div className="page-shell space-y-6 py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProfileBreadcrumb
          items={[
            { label: "الرئيسية", to: ROUTES.home },
            { label: "الموظفين", to: ROUTES.employees },
            { label: employee.name },
          ]}
        />
        <Link
          to={ROUTES.employees}
          viewTransition
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground hover:bg-muted"
        >
          <ArrowRight className="size-4" />
          العودة إلى الموظفين
        </Link>
      </div>

      <FadeIn>
        <ProfileBanner
          name={employee.name}
          role={employee.role}
          avatarUrl={employee.avatarUrl}
          kindLabel="حساب موظف"
          active={employee.active}
          actions={
            <>
              <Button variant="outline" onClick={() => setEditOpen(true)}>
                <Pencil className="size-4" />
                تعديل بيانات الموظف
              </Button>
              <Button
                variant="outline"
                onClick={() => setNotifyOpen(true)}
              >
                <Bell className="size-4" />
                إرسال إشعار
              </Button>
              {employee.active ? (
                <Button
                  variant="destructive"
                  onClick={() => setDeactivateOpen(true)}
                >
                  <UserX className="size-4" />
                  إيقاف الحساب
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleActivate}
                  className="border-emerald-600/30 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                >
                  <UserCheck className="size-4" />
                  تفعيل الحساب
                </Button>
              )}
            </>
          }
        />
      </FadeIn>

      <ProfileFacts
        title="بيانات الموظف"
        email={employee.email}
        phone={employee.phone}
        joinedAt={employee.joinedAt}
        role={employee.role}
        idPrefix={employee.id}
      />
      <ProfilePermissions
        permissions={employee.permissions}
        description="الصلاحيات الممنوحة لهذا الموظف داخل لوحة التحكم."
      />
      <ProfileActivityLog entries={employee.activity} />

      <EmployeeDialog
        open={editOpen}
        employee={employee}
        onOpenChange={setEditOpen}
      />
      <EmployeeNotifyDialog
        open={notifyOpen}
        employeeName={employee.name}
        onOpenChange={setNotifyOpen}
      />
      <WarningDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="إيقاف الحساب"
        description={`إيقاف حساب ${employee.name} يمنع الدخول إلى لوحة التحكم إلى حين إعادة التفعيل.`}
        confirmLabel="إيقاف الحساب"
        onConfirm={handleDeactivateConfirm}
      />
    </div>
  );
}
