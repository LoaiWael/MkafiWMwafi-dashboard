import RolesSection from "@/features/roles/components/roles-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function RolesPage() {
  useDocumentTitle("الأدوار والصلاحيات");

  return <RolesSection />;
}
