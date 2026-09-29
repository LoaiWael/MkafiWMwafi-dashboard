import OptionItemDialog from "@/features/unit-options/components/option-item-dialog";
import OptionItemsTable from "@/features/unit-options/components/option-items-table";
import type { OptionItem } from "@/features/unit-options/constants";
import { useOptionItemEditor } from "@/features/unit-options/hooks/use-option-item-editor";

interface FloorsTabProps {
  items: OptionItem[];
  onItemsChange: (
    updater: OptionItem[] | ((prev: OptionItem[]) => OptionItem[]),
  ) => void;
  onResetDefaults: () => void;
}

export default function FloorsTab({
  items,
  onItemsChange,
  onResetDefaults,
}: FloorsTabProps) {
  const editor = useOptionItemEditor({
    defaultCategory: "سكني",
    onItemsChange,
  });

  return (
    <>
      <OptionItemsTable
        items={items}
        tableId="floors"
        title="خيارات الأدوار والطوابق"
        subtitle="الخيارات المتاحة لاختيار (رقم الطابق) في تفاصيل الوحدات"
        nameHeader="اسم الطابق / الدور"
        descriptionHeader="التوضيح"
        addLabel="إضافة طابق / دور"
        showCategory={false}
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
        addTitle="إضافة دور / طابق جديد"
        showCategory={false}
        formData={editor.formData}
        onFormDataChange={editor.setFormData}
        onSave={editor.save}
      />
    </>
  );
}
