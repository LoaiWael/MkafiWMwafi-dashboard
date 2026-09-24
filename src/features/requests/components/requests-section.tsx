import { ClipboardList } from "lucide-react";
import FeaturePage from "@/components/layout/feature-page";

export default function RequestsSection() {
  return (
    <FeaturePage
      title="طلبات التوثيق"
      description="متابعة طلبات توثيق العقود من استلام الهوية وصك الملكية حتى التسليم."
      icon={ClipboardList}
      emptyTitle="لا توجد طلبات توثيق"
      emptyDescription="ستظهر هنا الطلبات الجديدة بعد استكمال بيانات الأطراف والعقار والدفعات."
    />
  );
}
