import LicensesSection from "@/features/licenses/components/licenses-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function LicensesPage() {
  useDocumentTitle("التراخيص");

  return <LicensesSection />;
}
