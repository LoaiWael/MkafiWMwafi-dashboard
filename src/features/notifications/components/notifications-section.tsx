import { Bell } from "lucide-react";
import FeaturePage from "@/components/layout/feature-page";

export default function NotificationsSection() {
  return (
    <FeaturePage
      title="الإشعارات"
      description="تنبيهات الطلبات الجديدة، وتحديث حالة التوثيق، وتذكيرات السداد."
      icon={Bell}
      emptyTitle="لا توجد إشعارات"
      emptyDescription="ستظهر هنا التنبيهات عند وصول طلب جديد أو تغيّر حالة العقد."
    />
  );
}
