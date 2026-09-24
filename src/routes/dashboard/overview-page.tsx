import OverviewSection from "@/features/overview/components/overview-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function OverviewPage() {
  useDocumentTitle("لوحة التحكم");

  return <OverviewSection />;
}
