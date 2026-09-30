import { Users } from "lucide-react";
import FeaturePage from "@/components/layout/feature-page";
import ProfileDirectory from "@/features/profile/components/profile-directory";
import { MOCK_CUSTOMERS } from "@/features/users/constants";
import { ROUTES } from "@/lib/constants";

export default function UsersSection() {
  return (
    <FeaturePage
      title="العملاء"
      description="إدارة حسابات المؤجرين والمستأجرين والأطراف المفوضة في عقود الإيجار."
      icon={Users}
      emptyTitle="لا يوجد عملاء"
      emptyDescription="ستظهر هنا بيانات الهوية والجوال بعد تسجيل العملاء في المنصة."
    >
      <ProfileDirectory people={MOCK_CUSTOMERS} basePath={ROUTES.users} />
    </FeaturePage>
  );
}
