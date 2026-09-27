import TaxesSection from "@/features/taxes/components/taxes-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function TaxesPage() {
  useDocumentTitle("الضرائب والرسوم");

  return <TaxesSection />;
}
