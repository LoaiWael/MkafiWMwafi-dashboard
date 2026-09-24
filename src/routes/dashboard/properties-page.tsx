import PropertiesSection from "@/features/properties/components/properties-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function PropertiesPage() {
  useDocumentTitle("العقارات");

  return <PropertiesSection />;
}
