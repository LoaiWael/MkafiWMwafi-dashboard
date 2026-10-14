import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createTaxRule,
  deleteTaxRule,
  fetchTaxRules,
  toggleTaxRuleActive,
  updateTaxRule,
} from "../api/tax-rules-api";
import type { TaxRuleFormData } from "../schemas/tax-schema";
import type { TaxRulePayload, TaxSetting } from "../types";
import { mapTaxRuleDto } from "../types";

function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object") {
    const errorRecord = err as {
      message?: string;
      data?: {
        message?: string;
        errors?: Record<string, string[]>;
      };
    };

    const validationErrors = errorRecord.data?.errors;
    if (validationErrors) {
      const firstField = Object.keys(validationErrors)[0];
      if (firstField && validationErrors[firstField]?.length) {
        return validationErrors[firstField][0];
      }
    }

    if (errorRecord.data?.message) {
      return errorRecord.data.message;
    }
    if (errorRecord.message) {
      return errorRecord.message;
    }
  }
  return fallback;
}

export function useTaxRules() {
  const [taxes, setTaxes] = useState<TaxSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTax, setEditingTax] = useState<TaxSetting | null>(null);

  async function loadTaxRules(): Promise<TaxSetting[]> {
    setIsLoading(true);
    setError(null);
    try {
      const dtos = await fetchTaxRules();
      const mapped = Array.isArray(dtos) ? dtos.map(mapTaxRuleDto) : [];
      setTaxes(mapped);
      return mapped;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      setTaxes([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function initialFetch() {
      try {
        const dtos = await fetchTaxRules();
        if (ignore) return;
        const mapped = Array.isArray(dtos) ? dtos.map(mapTaxRuleDto) : [];
        setTaxes(mapped);
      } catch (err) {
        if (ignore) return;
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        setTaxes([]);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void initialFetch();

    return () => {
      ignore = true;
    };
  }, []);

  function openAdd() {
    setEditingTax(null);
    setIsDialogOpen(true);
  }

  function openEdit(tax: TaxSetting) {
    setEditingTax(tax);
    setIsDialogOpen(true);
  }

  function closeDialog() {
    setIsDialogOpen(false);
    setEditingTax(null);
  }

  function buildPayload(
    formData: TaxRuleFormData,
    existing?: TaxSetting | null,
  ): TaxRulePayload {
    const isPercentage = formData.calculationType === "percentage";
    const ratePercent = isPercentage
      ? Number(formData.ratePercent) || 0
      : undefined;
    const fixedAmount = !isPercentage
      ? Number(formData.fixedAmount) || 0
      : undefined;

    return {
      name_ar: formData.nameAr.trim(),
      applies_to: formData.appliesTo,
      description: formData.description?.trim() || null,
      calculation_type: formData.calculationType,
      rate_percent: ratePercent,
      fixed_amount: fixedAmount,
      is_exempt: Boolean(formData.isExempt),
      exemption_label: formData.isExempt
        ? formData.exemptionLabel?.trim() || "معفى"
        : null,
      is_active: Boolean(formData.isActive),
      is_mandatory: existing?.isMandatory ?? false,
      order: existing?.order ?? taxes.length + 1,
    };
  }

  async function saveRule(
    formData: TaxRuleFormData,
    existingId?: string | number,
  ): Promise<boolean> {
    setIsSaving(true);
    const existing = existingId
      ? taxes.find((t) => String(t.id) === String(existingId)) ?? null
      : null;

    const payload = buildPayload(formData, existing);

    if (existingId) {
      const targetId = existing?.numericId ?? existingId;
      const updatePromise = (async () => {
        const updatedDto = await updateTaxRule(targetId, payload);
        if (updatedDto && updatedDto.id) {
          const mapped = mapTaxRuleDto(updatedDto);
          setTaxes((prev) =>
            prev.map((t) =>
              String(t.id) === String(existingId) ? mapped : t,
            ),
          );
        } else {
          await loadTaxRules();
        }
        closeDialog();
      })();

      toast.promise(updatePromise, {
        loading: "جاري حفظ التعديلات الضريبية...",
        success: "تم تحديث البند الضريبي بنجاح",
        error: (err: unknown) =>
          getApiErrorMessage(err, "فشل تحديث البند الضريبي"),
      });

      try {
        await updatePromise;
        return true;
      } catch {
        return false;
      } finally {
        setIsSaving(false);
      }
    } else {
      const createPromise = (async () => {
        const createdDto = await createTaxRule(payload);
        if (createdDto && createdDto.id) {
          const mapped = mapTaxRuleDto(createdDto);
          setTaxes((prev) => [...prev, mapped]);
        } else {
          await loadTaxRules();
        }
        closeDialog();
      })();

      toast.promise(createPromise, {
        loading: "جاري إضافة البند الضريبي الجديد...",
        success: "تمت إضافة البند الضريبي بنجاح",
        error: (err: unknown) =>
          getApiErrorMessage(err, "فشل إضافة البند الضريبي"),
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

  async function toggleActive(
    tax: TaxSetting,
    nextChecked: boolean,
  ): Promise<boolean> {
    const targetId = tax.numericId ?? tax.id;

    // Optimistically update UI
    setTaxes((prev) =>
      prev.map((t) => (t.id === tax.id ? { ...t, isActive: nextChecked } : t)),
    );

    const togglePromise = toggleTaxRuleActive(targetId, nextChecked).catch(
      (err) => {
        // Rollback on failure
        setTaxes((prev) =>
          prev.map((t) =>
            t.id === tax.id ? { ...t, isActive: !nextChecked } : t,
          ),
        );
        throw err;
      },
    );

    toast.promise(togglePromise, {
      loading: "جاري تحديث حالة البند...",
      success: nextChecked
        ? `تم تفعيل البند الضريبي "${tax.nameAr}"`
        : `تم تعطيل البند الضريبي "${tax.nameAr}"`,
      error: (err: unknown) =>
        getApiErrorMessage(err, "فشل تحديث حالة البند الضريبي"),
    });

    try {
      await togglePromise;
      return true;
    } catch {
      return false;
    }
  }

  async function deleteRule(id: string | number): Promise<boolean> {
    const target = taxes.find((t) => String(t.id) === String(id));
    if (target?.isMandatory) {
      toast.error("لا يمكن حذف بند ضريبي إلزامي أساسي في النظام");
      return false;
    }

    setIsDeleting(true);
    const targetId = target?.numericId ?? id;

    const delPromise = deleteTaxRule(targetId).then(() => {
      setTaxes((prev) => prev.filter((t) => String(t.id) !== String(id)));
    });

    toast.promise(delPromise, {
      loading: "جاري حذف البند الضريبي...",
      success: "تم حذف البند الضريبي بنجاح",
      error: (err: unknown) =>
        getApiErrorMessage(err, "فشل حذف البند الضريبي"),
    });

    try {
      await delPromise;
      return true;
    } catch {
      return false;
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    taxes,
    setTaxes,
    isLoading,
    isSaving,
    isDeleting,
    error,
    refetch: loadTaxRules,
    isDialogOpen,
    setIsDialogOpen,
    editingTax,
    openAdd,
    openEdit,
    closeDialog,
    saveRule,
    toggleActive,
    deleteRule,
  };
}
