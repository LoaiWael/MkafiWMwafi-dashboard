import RequestsSection from "@/features/requests/components/requests-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function RequestsPage() {
  useDocumentTitle("طلبات التوثيق");

  return <RequestsSection />;
}
