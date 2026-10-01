import OptionItemDialog from "@/features/unit-options/components/option-item-dialog";
import OptionItemsTable from "@/features/unit-options/components/option-items-table";
import type { OptionItem } from "@/features/unit-options/constants";
import type { useOptionItemEditor } from "@/features/unit-options/hooks/use-option-item-editor";

interface FloorsTabProps {
  items: OptionItem[];
  editor: ReturnType<typeof useOptionItemEditor>;
}

export default function FloorsTab({ items, editor }: FloorsTabProps) {
  return (
    <>
      <OptionItemsTable
        items={items}
        tableId="floors"
        title="خيارات الأدوار والطوابق"
        subtitle="الخيارات المتاحة لاختيار (رقم الطابق) في تفاصيل الوحدات"
        nameHeader="اسم الطابق / الدور"
        descriptionHeader="التوضيح"
        showCategory={false}
        onEdit={editor.openEdit}
        onDelete={editor.remove}
        onToggleActive={editor.toggle}
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
