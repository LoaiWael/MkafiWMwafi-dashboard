import BlogsSection from "@/features/blogs/components/blogs-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function BlogsPage() {
  useDocumentTitle("المدونة والمقالات");

  return <BlogsSection />;
}
