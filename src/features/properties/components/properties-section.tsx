import { Building2 } from "lucide-react";
import FeaturePage from "@/components/layout/feature-page";

export default function PropertiesSection() {
  return (
    <FeaturePage
      title="العقارات"
      description="إدارة العقارات والوحدات السكنية والتجارية المرتبطة بعقود الإيجار."
      icon={Building2}
      emptyTitle="لا توجد عقارات مسجّلة"
      emptyDescription="ستظهر هنا بيانات العنوان والوحدة وإثبات الملكية بعد إضافة العقار."
    />
  );
}
