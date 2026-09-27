import TermsSection from "@/features/terms/components/terms-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function TermsPage() {
  useDocumentTitle("الشروط والأحكام");

  return <TermsSection />;
}
