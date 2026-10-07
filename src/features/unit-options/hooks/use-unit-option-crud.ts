import { useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  UnitOptionDto,
  UnitOptionItem,
  UnitOptionPayload,
} from "../types";
import { mapUnitOptionDto } from "../types";
import type { UnitOptionFormData } from "../schemas/unit-options-schema";

export interface UnitOptionApiHandlers {
  fetchAll: () => Promise<UnitOptionDto[]>;
  create: (payload: UnitOptionPayload) => Promise<UnitOptionDto>;
  update: (id: number, payload: UnitOptionPayload) => Promise<UnitOptionDto>;
  remove: (id: number) => Promise<void>;
}

interface UseUnitOptionCrudOptions {
  api: UnitOptionApiHandlers;
  entityLabel: string; // e.g. "نوع الوحدة", "مرفق الوحدة", "الدور / الطابق"
}

export function useUnitOptionCrud({
  api,
  entityLabel,
}: UseUnitOptionCrudOptions) {
  const [items, setItems] = useState<UnitOptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UnitOptionItem | null>(null);

  async function loadItems() {
    setIsLoading(true);
    setError(null);
    try {
      const dtos = await api.fetchAll();
      const mapped = (dtos || []).map(mapUnitOptionDto);
      setItems(mapped);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function openAdd() {
    setEditingItem(null);
    setIsDialogOpen(true);
  }

  function openEdit(item: UnitOptionItem) {
    setEditingItem(item);
    setIsDialogOpen(true);
  }

  function closeDialog() {
    setIsDialogOpen(false);
    setEditingItem(null);
  }

  async function saveItem(formData: UnitOptionFormData): Promise<boolean> {
    setIsSaving(true);
    const payload: UnitOptionPayload = {
      name: formData.name.trim(),
      is_active: formData.isActive,
      sort_order: formData.sortOrder,
    };

    if (editingItem) {
      const editPromise = api.update(editingItem.id, payload).then((updatedDto) => {
        const mapped = updatedDto
          ? mapUnitOptionDto(updatedDto)
          : {
              ...editingItem,
              name: payload.name,
              isActive: payload.is_active,
              sortOrder: payload.sort_order,
            };

        setItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? mapped : item))
        );
        closeDialog();
        return mapped;
      });

      toast.promise(editPromise, {
        loading: `جاري حفظ تعديلات ${entityLabel}...`,
        success: `تم تحديث ${entityLabel} بنجاح`,
        error: (err: any) => err?.message || `حدث خطأ أثناء تعديل ${entityLabel}`,
      });

      try {
        await editPromise;
        return true;
      } catch {
        return false;
      } finally {
        setIsSaving(false);
      }
    } else {
      const createPromise = api.create(payload).then((createdDto) => {
        const mapped = createdDto
          ? mapUnitOptionDto(createdDto)
          : {
              id: Date.now(),
              name: payload.name,
              isActive: payload.is_active,
              sortOrder: payload.sort_order,
            };

        setItems((prev) => [...prev, mapped]);
        closeDialog();
        return mapped;
      });

      toast.promise(createPromise, {
        loading: `جاري إضافة ${entityLabel}...`,
        success: `تمت إضافة ${entityLabel} بنجاح`,
        error: (err: any) => err?.message || `حدث خطأ أثناء إضافة ${entityLabel}`,
      });

      try {
        await createPromise;
        return true;
      } catch {
        return false;
      } finally {
        setIsSaving(false);
      }
    }
  }

  async function toggleActive(item: UnitOptionItem): Promise<boolean> {
    const nextActive = !item.isActive;
    const payload: UnitOptionPayload = {
      name: item.name,
      is_active: nextActive,
      sort_order: item.sortOrder,
    };

    const togglePromise = api.update(item.id, payload).then(() => {
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, isActive: nextActive } : it))
      );
    });

    toast.promise(togglePromise, {
      loading: `جاري تحديث حالة ${entityLabel}...`,
      success: nextActive
        ? `تم تفعيل ${entityLabel} "${item.name}"`
        : `تم تعطيل ${entityLabel} "${item.name}"`,
      error: (err: any) => err?.message || `فشل تحديث حالة ${entityLabel}`,
    });

    try {
      await togglePromise;
      return true;
    } catch {
      return false;
    }
  }

  async function deleteItem(id: number): Promise<boolean> {
    setIsDeleting(true);
    const deletePromise = api.remove(id).then(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    });

    toast.promise(deletePromise, {
      loading: `جاري حذف ${entityLabel}...`,
      success: `تم حذف ${entityLabel} بنجاح`,
      error: (err: any) => err?.message || `حدث خطأ أثناء حذف ${entityLabel}`,
    });

    try {
      await deletePromise;
      return true;
    } catch {
      return false;
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    items,
    isLoading,
    isSaving,
    isDeleting,
    error,
    refetch: loadItems,
    isDialogOpen,
    setIsDialogOpen,
    editingItem,
    openAdd,
    openEdit,
    closeDialog,
    saveItem,
    toggleActive,
    deleteItem,
  };
}
