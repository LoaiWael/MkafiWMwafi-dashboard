import PropertiesTable from "@/features/properties/components/properties-table";
import type { Property } from "@/features/properties/types";

interface UserPropertiesPanelProps {
  properties: Property[];
}

export default function UserPropertiesPanel({
  properties,
}: UserPropertiesPanelProps) {
  return (
    <PropertiesTable
      properties={properties}
      syncWithUrl={false}
      title="عقارات العميل"
      subtitle="العقارات والوحدات المسجلة على هذا الحساب."
      emptyTitle="لا توجد عقارات لهذا العميل"
      emptyDescription="ستظهر هنا العقارات بعد تسجيلها وربطها بهذا الحساب."
    />
  );
}
