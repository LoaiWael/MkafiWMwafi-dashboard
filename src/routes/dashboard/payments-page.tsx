import PaymentsSection from "@/features/payments/components/payments-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function PaymentsPage() {
  useDocumentTitle("المدفوعات");

  return <PaymentsSection />;
}
