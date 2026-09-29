import OptionItemDialog from "@/features/unit-options/components/option-item-dialog";
import OptionItemsTable from "@/features/unit-options/components/option-items-table";
import type { OptionItem } from "@/features/unit-options/constants";
import { useOptionItemEditor } from "@/features/unit-options/hooks/use-option-item-editor";

interface UnitTypesTabProps {
  items: OptionItem[];
  onItemsChange: (
    updater: OptionItem[] | ((prev: OptionItem[]) => OptionItem[]),
  ) => void;
  onResetDefaults: () => void;
}

export default function UnitTypesTab({
  items,
  onItemsChange,
  onResetDefaults,
}: UnitTypesTabProps) {
  const editor = useOptionItemEditor({
    defaultCategory: "سكني",
    onItemsChange,
  });

  return (
    <>
      <OptionItemsTable
        items={items}
        tableId="unit-types"
        title="أنواع الوحدات العقارية"
        subtitle="يمكنك تفعيل أو تعطيل أو إضافة أنواع وحدات جديدة لتظهر في القائمة المنسدلة بالموقع"
        nameHeader="اسم الوحدة"
        descriptionHeader="الوصف والتفاصيل"
        addLabel="إضافة نوع وحدة"
        showCategory
        onAdd={editor.openAdd}
        onEdit={editor.openEdit}
        onDelete={editor.remove}
        onToggleActive={editor.toggle}
        onResetDefaults={onResetDefaults}
      />
      <OptionItemDialog
        open={editor.isDialogOpen}
        onOpenChange={editor.setIsDialogOpen}
        editingItem={editor.editingItem}
        addTitle="إضافة نوع وحدة جديد"
        showCategory
        formData={editor.formData}
        onFormDataChange={editor.setFormData}
        onSave={editor.save}
      />
    </>
  );
}
