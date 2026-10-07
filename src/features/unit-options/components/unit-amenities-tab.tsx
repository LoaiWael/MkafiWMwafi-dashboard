import { Layers } from "lucide-react";
import UnitOptionDialog from "./unit-option-dialog";
import UnitOptionsTable from "./unit-options-table";
import type { useUnitAmenities } from "../hooks/use-unit-amenities";

interface UnitAmenitiesTabProps {
  controller: ReturnType<typeof useUnitAmenities>;
}

export default function UnitAmenitiesTab({ controller }: UnitAmenitiesTabProps) {
  return (
    <>
      <UnitOptionsTable
        items={controller.items}
        tableId="unit-amenities"
        title="مرافق ومميزات الوحدات"
        subtitle="إدارة المرافق والتفاصيل الملحقة بالوحدات في عقود الإيجار (مثل: غرف النوم، الصالات، المطابخ، المصعد)"
        nameHeader="اسم المرفق / الميزة"
        entityLabel="مرفق الوحدة"
        icon={Layers}
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
        entityLabel="مرفق الوحدة"
        isSaving={controller.isSaving}
        onSave={controller.saveItem}
      />
    </>
  );
}
