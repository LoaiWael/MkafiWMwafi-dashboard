import CouponsSection from "@/features/coupons/components/coupons-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function CouponsPage() {
  useDocumentTitle("كوبونات الخصم");

  return <CouponsSection />;
}
