import BrokersSection from "@/features/brokers/components/brokers-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function BrokersPage() {
  useDocumentTitle("الوسطاء");

  return <BrokersSection />;
}
