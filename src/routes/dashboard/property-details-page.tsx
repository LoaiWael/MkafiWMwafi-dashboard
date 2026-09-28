import { useParams } from "react-router";
import PropertyDetailsView from "@/features/properties/components/property-details-view";
import { MOCK_PROPERTIES } from "@/features/properties/constants";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const property =
    MOCK_PROPERTIES.find((p) => p.id === id) ||
    MOCK_PROPERTIES.find((p) => p.code === id);

  const title = property
    ? `تفاصيل ${property.name} (${property.code})`
    : "تفاصيل العقار";

  useDocumentTitle(title);

  return <PropertyDetailsView propertyId={id || "re-residential-narjis"} />;
}
