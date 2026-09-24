import { Handshake } from "lucide-react";
import FeaturePage from "@/components/layout/feature-page";

export default function BrokersSection() {
  return (
    <FeaturePage
      title="الوسطاء"
      description="متابعة الوسطاء العقاريين المعتمدين وربطهم بطلبات التوثيق."
      icon={Handshake}
      emptyTitle="لا يوجد وسطاء"
      emptyDescription="ستظهر هنا حسابات الوسطاء المعتمدين بعد إضافتهم إلى المنصة."
    />
  );
}
