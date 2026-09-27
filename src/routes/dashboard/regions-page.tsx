import RegionsSection from "@/features/regions/components/regions-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function RegionsPage() {
  useDocumentTitle("المناطق والمدن");

  return <RegionsSection />;
}
