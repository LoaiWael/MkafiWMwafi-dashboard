import SettingsSection from "@/features/settings/components/settings-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function SettingsPage() {
  useDocumentTitle("الإعدادات");

  return <SettingsSection />;
}
