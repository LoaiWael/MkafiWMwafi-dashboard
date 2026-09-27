import PartyOptionsSection from "@/features/party-options/components/party-options-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function PartyOptionsPage() {
  useDocumentTitle("أنواع التفويض والصفة");

  return <PartyOptionsSection />;
}
