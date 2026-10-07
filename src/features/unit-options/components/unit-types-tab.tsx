import { Home } from "lucide-react";
import UnitOptionDialog from "./unit-option-dialog";
import UnitOptionsTable from "./unit-options-table";
import type { useUnitTypes } from "../hooks/use-unit-types";

interface UnitTypesTabProps {
  controller: ReturnType<typeof useUnitTypes>;
}

export default function UnitTypesTab({ controller }: UnitTypesTabProps) {
  return (
    <>
      <UnitOptionsTable
        items={controller.items}
        tableId="unit-types"
        title="أنواع الوحدات العقارية"
        subtitle="إدارة أنواع الوحدات المتاحة عند إنشاء عقود الإيجار (مثل: شقة، فيلا، مكتب، مستودع)"
        nameHeader="نوع الوحدة"
        entityLabel="نوع الوحدة"
        icon={Home}
        isLoading={controller.isLoading}
        onAdd={controller.openAdd}
        onEdit={controller.openEdit}
        onDelete={controller.deleteItem}
        onToggleActive={controller.toggleActive}
      />
      <UnitOptionDialog
        open={controller.isDialogOpen}
        onOpenChange={controller.setIsDialogOpen}
        editingItem={controller.editingItem}
        entityLabel="نوع الوحدة"
        isSaving={controller.isSaving}
        onSave={controller.saveItem}
      />
    </>
  );
}
