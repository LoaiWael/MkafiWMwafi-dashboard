import UsersSection from "@/features/users/components/users-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function UsersPage() {
  useDocumentTitle("العملاء");

  return <UsersSection />;
}
