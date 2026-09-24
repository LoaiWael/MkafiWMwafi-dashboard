import { Users } from "lucide-react";
import FeaturePage from "@/components/layout/feature-page";

export default function UsersSection() {
  return (
    <FeaturePage
      title="العملاء"
      description="إدارة حسابات المؤجرين والمستأجرين والأطراف المفوضة في عقود الإيجار."
      icon={Users}
      emptyTitle="لا يوجد عملاء"
      emptyDescription="ستظهر هنا بيانات الهوية والجوال بعد تسجيل العملاء في المنصة."
    />
  );
}
