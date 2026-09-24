import { Settings } from "lucide-react";
import FeaturePage from "@/components/layout/feature-page";

export default function SettingsSection() {
  return (
    <FeaturePage
      title="الإعدادات"
      description="إعدادات الحساب، وصلاحيات المشغّلين، وتفضيلات لوحة التشغيل."
      icon={Settings}
      emptyTitle="الإعدادات غير متاحة بعد"
      emptyDescription="سيتم ربط إعدادات الحساب والصلاحيات بعد تفعيل خدمة الدخول."
    />
  );
}
