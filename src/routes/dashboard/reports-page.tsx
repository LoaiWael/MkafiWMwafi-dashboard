import ReportsSection from "@/features/reports/components/reports-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function ReportsPage() {
  useDocumentTitle("التقارير");

  return <ReportsSection />;
}
