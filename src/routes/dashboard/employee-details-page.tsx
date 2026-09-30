import { lazy, Suspense } from "react";
import { useParams } from "react-router";
import { findEmployee } from "@/features/employees/constants";
import { useDocumentTitle } from "@/hooks/use-document-title";
import EmployeeDetailsPageSkeleton from "@/routes/dashboard/employee-details-page-skeleton";

const EmployeeDetailsView = lazy(
  () => import("@/features/employees/components/employee-details-view"),
);

export default function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const employee = findEmployee(id);
  useDocumentTitle(employee?.name ?? "ملف الموظف");

  return (
    <Suspense fallback={<EmployeeDetailsPageSkeleton />}>
      <EmployeeDetailsView employeeId={id} />
    </Suspense>
  );
}
