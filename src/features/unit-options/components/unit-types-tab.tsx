import OptionItemDialog from "@/features/unit-options/components/option-item-dialog";
import OptionItemsTable from "@/features/unit-options/components/option-items-table";
import type { OptionItem } from "@/features/unit-options/constants";
import type { useOptionItemEditor } from "@/features/unit-options/hooks/use-option-item-editor";

interface UnitTypesTabProps {
  items: OptionItem[];
  editor: ReturnType<typeof useOptionItemEditor>;
}

export default function UnitTypesTab({ items, editor }: UnitTypesTabProps) {
  return (
    <>
      <OptionItemsTable
        items={items}
        tableId="unit-types"
        title="أنواع الوحدات العقارية"
        subtitle="يمكنك تفعيل أو تعطيل أو إضافة أنواع وحدات جديدة لتظهر في القائمة المنسدلة بالموقع"
        nameHeader="اسم الوحدة"
        descriptionHeader="الوصف والتفاصيل"
        showCategory
        onEdit={editor.openEdit}
        onDelete={editor.remove}
        onToggleActive={editor.toggle}
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
