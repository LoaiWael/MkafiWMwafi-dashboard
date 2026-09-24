import ContractsSection from "@/features/contracts/components/contracts-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function ContractsPage() {
  useDocumentTitle("العقود");

  return <ContractsSection />;
}
