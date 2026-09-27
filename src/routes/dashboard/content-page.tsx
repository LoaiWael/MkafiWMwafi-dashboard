import ContentSection from "@/features/content/components/content-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function ContentPage() {
  useDocumentTitle("محتوى الموقع");

  return <ContentSection />;
}
