import EmployeesSection from "@/features/employees/components/employees-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function EmployeesPage() {
  useDocumentTitle("الموظفين");

  return <EmployeesSection />;
}
