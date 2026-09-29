import OptionItemDialog from "@/features/unit-options/components/option-item-dialog";
import OptionItemsTable from "@/features/unit-options/components/option-items-table";
import type { OptionItem } from "@/features/unit-options/constants";
import { useOptionItemEditor } from "@/features/unit-options/hooks/use-option-item-editor";

interface PropertyTypesTabProps {
  items: OptionItem[];
  onItemsChange: (
    updater: OptionItem[] | ((prev: OptionItem[]) => OptionItem[]),
  ) => void;
  onResetDefaults: () => void;
}

export default function PropertyTypesTab({
  items,
  onItemsChange,
  onResetDefaults,
}: PropertyTypesTabProps) {
  const editor = useOptionItemEditor({
    defaultCategory: "تجاري",
    onItemsChange,
  });

  return (
    <>
      <OptionItemsTable
        items={items}
        tableId="property-types"
        title="أنواع العقارات والمباني"
        subtitle="الخيارات المتاحة لحقل (نوع العقار / المبنى) في استمارة بيانات العقار والوحدات"
        nameHeader="نوع العقار / المبنى"
        descriptionHeader="الوصف"
        addLabel="إضافة نوع مبنى"
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
        addTitle="إضافة نوع مبنى / عقار جديد"
        showCategory
        formData={editor.formData}
        onFormDataChange={editor.setFormData}
        onSave={editor.save}
      />
    </>
  );
}
