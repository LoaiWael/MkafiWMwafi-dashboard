import PrivacySection from "@/features/privacy/components/privacy-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function PrivacyPage() {
  useDocumentTitle("سياسة الخصوصية");

  return <PrivacySection />;
}
