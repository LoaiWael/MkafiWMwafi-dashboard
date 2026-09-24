import { BarChart3 } from "lucide-react";
import FeaturePage from "@/components/layout/feature-page";

export default function ReportsSection() {
  return (
    <FeaturePage
      title="التقارير"
      description="تقارير التشغيل حول العقود المكتملة، والطلبات، والإيرادات حسب نوع العقد."
      icon={BarChart3}
      emptyTitle="لا توجد تقارير بعد"
      emptyDescription="ستظهر هنا مؤشرات التوثيق بعد توفر بيانات العقود والمدفوعات."
    />
  );
}
