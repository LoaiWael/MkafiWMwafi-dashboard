import SupportSection from "@/features/support/components/support-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function SupportPage() {
  useDocumentTitle("الدعم");

  return <SupportSection />;
}
