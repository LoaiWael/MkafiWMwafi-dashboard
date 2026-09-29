import PartyOptionsSection from "@/features/party-options/components/party-options-section";
import { PARTY_OPTIONS_METADATA } from "@/features/party-options/constants";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function PartyOptionsPage() {
  useDocumentTitle(PARTY_OPTIONS_METADATA.title);

  return <PartyOptionsSection />;
}
