import { useParams } from "react-router";
import ContractDetailsView from "@/features/contracts/components/contract-details-view";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function ContractDetailsPage() {
  const { id } = useParams<{ id: string }>();

  useDocumentTitle(id ? `تفاصيل العقد ${id}` : "تفاصيل العقد");

  return <ContractDetailsView contractId={id || "cnt-001"} />;
}
