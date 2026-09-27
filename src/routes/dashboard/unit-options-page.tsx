import UnitOptionsSection from "@/features/unit-options/components/unit-options-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function UnitOptionsPage() {
  useDocumentTitle("خيارات الوحدات");

  return <UnitOptionsSection />;
}
