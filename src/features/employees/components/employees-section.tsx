import { UserCog } from "lucide-react";
import FeaturePage from "@/components/layout/feature-page";
import ProfileDirectory from "@/features/profile/components/profile-directory";
import { MOCK_EMPLOYEES } from "@/features/employees/constants";
import { ROUTES } from "@/lib/constants";

export default function EmployeesSection() {
  return (
    <FeaturePage
      title="الموظفين"
      description="إدارة حسابات الموظفين والصلاحيات وفريق العمل في لوحة التحكم."
      icon={UserCog}
      emptyTitle="لا يوجد موظفين"
      emptyDescription="ستظهر هنا قائمة الموظفين وصلاحياتهم وأدوارهم الإدارية."
    >
      <ProfileDirectory people={MOCK_EMPLOYEES} basePath={ROUTES.employees} />
    </FeaturePage>
  );
}
