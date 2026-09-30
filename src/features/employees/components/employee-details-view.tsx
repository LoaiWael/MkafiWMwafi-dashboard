import { ArrowRight, Calendar, Mail, Phone, Shield } from "lucide-react";
import { Link } from "react-router";
import { FadeIn } from "@/components/animations";
import ProfileBanner from "@/features/profile/components/profile-banner";
import ProfileBreadcrumb from "@/features/profile/components/profile-breadcrumb";
import ProfileFacts from "@/features/profile/components/profile-facts";
import ProfileMissing from "@/features/profile/components/profile-missing";
import ProfilePermissions from "@/features/profile/components/profile-permissions";
import { ROUTES } from "@/lib/constants";
import { findEmployee } from "@/features/employees/constants";
import type { ProfileFact } from "@/features/profile/types";

interface EmployeeDetailsViewProps {
  employeeId: string | undefined;
}

export default function EmployeeDetailsView({
  employeeId,
}: EmployeeDetailsViewProps) {
  const employee = findEmployee(employeeId);

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

  const facts: ProfileFact[] = [
    {
      id: "email",
      label: "البريد الإلكتروني",
      value: employee.email,
      icon: Mail,
      ltr: true,
      copyable: true,
    },
    {
      id: "phone",
      label: "رقم الجوال",
      value: employee.phone,
      icon: Phone,
      ltr: true,
      copyable: true,
    },
    {
      id: "joined",
      label: "تاريخ الانضمام",
      value: employee.joinedAt,
      icon: Calendar,
    },
    {
      id: "role",
      label: "الدور",
      value: employee.role,
      icon: Shield,
    },
  ];

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
        />
      </FadeIn>

      <ProfileFacts title="بيانات الموظف" facts={facts} />
      <ProfilePermissions
        permissions={employee.permissions}
        description="الصلاحيات الممنوحة لهذا الموظف داخل لوحة التحكم."
      />
    </div>
  );
}
