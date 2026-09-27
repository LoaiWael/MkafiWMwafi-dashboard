import { MapPin } from "lucide-react";
import FeaturePage from "@/components/layout/feature-page";

export default function RegionsSection() {
  return (
    <FeaturePage
      title="المناطق والمدن"
      description="إدارة مناطق ومدن المملكة العربية السعودية وتوزيعها الجغرافي."
      icon={MapPin}
      emptyTitle="لا توجد مناطق أو مدن مسجّلة"
      emptyDescription="ستظهر هنا قائمة المناطق الإدارية بالمملكة والمدن التابعة لكل منطقة."
    />
  );
}
