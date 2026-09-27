import PricingSection from "@/features/pricing/components/pricing-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function PricingPage() {
  useDocumentTitle("تسعير الخدمات");

  return <PricingSection />;
}
