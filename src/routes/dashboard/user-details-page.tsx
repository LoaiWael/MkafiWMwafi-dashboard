import { lazy, Suspense } from "react";
import { useParams } from "react-router";
import { findCustomer } from "@/features/users/constants";
import { useDocumentTitle } from "@/hooks/use-document-title";
import EmployeeDetailsPageSkeleton from "@/routes/dashboard/employee-details-page-skeleton";

const UserDetailsView = lazy(
  () => import("@/features/users/components/user-details-view"),
);

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const customer = findCustomer(id);
  useDocumentTitle(customer?.name ?? "ملف العميل");

  return (
    <Suspense fallback={<EmployeeDetailsPageSkeleton />}>
      <UserDetailsView userId={id} />
    </Suspense>
  );
}
