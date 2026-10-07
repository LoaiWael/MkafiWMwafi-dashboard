import { ListOrdered } from "lucide-react";
import UnitOptionDialog from "./unit-option-dialog";
import UnitOptionsTable from "./unit-options-table";
import type { useFloors } from "../hooks/use-floors";

interface FloorsTabProps {
  controller: ReturnType<typeof useFloors>;
}

export default function FloorsTab({ controller }: FloorsTabProps) {
  return (
    <>
      <UnitOptionsTable
        items={controller.items}
        tableId="floors"
        title="خيارات الأدوار والطوابق"
        subtitle="إدارة الأدوار والطوابق المتاحة لاختيار مكان الوحدة (مثل: الأرضي، الأول، الثاني، القبو، السطح)"
        nameHeader="اسم الدور / الطابق"
        entityLabel="الدور / الطابق"
        icon={ListOrdered}
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
        entityLabel="الدور / الطابق"
        isSaving={controller.isSaving}
        onSave={controller.saveItem}
      />
    </>
  );
}
