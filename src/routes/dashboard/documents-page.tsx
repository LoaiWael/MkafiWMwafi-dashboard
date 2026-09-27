import DocumentsSection from "@/features/documents/components/documents-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function DocumentsPage() {
  useDocumentTitle("الصكوك");

  return <DocumentsSection />;
}
