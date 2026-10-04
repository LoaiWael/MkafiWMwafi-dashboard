import { useState } from "react";
import { toast } from "sonner";
import type { OptionItem } from "@/features/unit-options/constants";
import {
  optionItemSchema,
  type OptionItemFormData,
} from "../schemas/unit-options-schema";

export type OptionItemFormValues = OptionItemFormData;

interface UseOptionItemEditorOptions {
  defaultCategory: string;
  onItemsChange: (
    updater: OptionItem[] | ((prev: OptionItem[]) => OptionItem[]),
  ) => void;
}

export function useOptionItemEditor({
  defaultCategory,
  onItemsChange,
}: UseOptionItemEditorOptions) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OptionItem | null>(null);
  const [formData, setFormData] = useState<OptionItemFormValues>({
    nameAr: "",
    category: defaultCategory,
    description: "",
    isActive: true,
  });

  function openAdd() {
    setEditingItem(null);
    setFormData({
      nameAr: "",
      category: defaultCategory,
      description: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  }

  function openEdit(item: OptionItem) {
    setEditingItem(item);
    setFormData({
      nameAr: item.nameAr,
      category: item.category || defaultCategory,
      description: item.description || "",
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  }

  function save() {
    const result = optionItemSchema.safeParse(formData);
    if (!result.success) {
      toast.error(
        result.error.issues[0]?.message || "يرجى التحقق من صحة البيانات المدخلة",
      );
      return;
    }

    const validData = result.data;

    if (editingItem) {
      const updated: OptionItem = {
        ...editingItem,
        nameAr: validData.nameAr,
        category: validData.category,
        description: validData.description,
        isActive: validData.isActive,
      };
      onItemsChange((prev) =>
        prev.map((item) => (item.id === editingItem.id ? updated : item)),
      );
      toast.success("تم تحديث بيانات الخيار بنجاح");
    } else {
      const newItem: OptionItem = {
        id: `custom_${Date.now()}`,
        nameAr: validData.nameAr,
        category: validData.category,
        description: validData.description,
        isActive: validData.isActive,
      };
      onItemsChange((prev) => [...prev, newItem]);
      toast.success("تمت إضافة الخيار الجديد بنجاح");
    }

    setIsDialogOpen(false);
  }

  function remove(id: string) {
    onItemsChange((prev) => prev.filter((item) => item.id !== id));
    toast.success("تم حذف الخيار بنجاح");
  }

  function toggle(id: string) {
    onItemsChange((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item,
      ),
    );
    toast.success("تم تحديث حالة تفعيل الخيار");
  }

  return {
    isDialogOpen,
    setIsDialogOpen,
    editingItem,
    formData,
    setFormData,
    openAdd,
    openEdit,
    save,
    remove,
    toggle,
  };
}
