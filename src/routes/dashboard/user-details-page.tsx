import { lazy, Suspense } from "react";
import { useParams } from "react-router";
import { useCustomer } from "@/features/users/hooks/use-customers";
import { useDocumentTitle } from "@/hooks/use-document-title";
import UserDetailsPageSkeleton from "@/routes/dashboard/user-details-page-skeleton";

const UserDetailsView = lazy(
  () => import("@/features/users/components/user-details-view"),
);

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const customer = useCustomer(id);
  useDocumentTitle(customer?.name ?? "ملف العميل");

  return (
    <Suspense fallback={<UserDetailsPageSkeleton />}>
      <UserDetailsView userId={id} />
    </Suspense>
  );
}
