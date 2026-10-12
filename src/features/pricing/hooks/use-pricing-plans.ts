import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchPricingPlans,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
} from "../api/pricing-api";
import type {
  PricingPlanDto,
  PricingPlanItem,
  PricingPlanPayload,
} from "../types";
import { mapPricingPlanDto } from "../types";
import type { PricingPlanFormData } from "../schemas/pricing-schema";

export function usePricingPlans() {
  const [plans, setPlans] = useState<PricingPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function loadPlans() {
    setIsLoading(true);
    setError(null);
    try {
      const dtos: PricingPlanDto[] = await fetchPricingPlans();
      const mapped = Array.isArray(dtos) ? dtos.map(mapPricingPlanDto) : [];
      setPlans(mapped);
      return mapped;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      setPlans([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  function formDataToPayload(formData: PricingPlanFormData): PricingPlanPayload {
    return {
      contract_type: formData.contractType,
      duration: formData.duration.trim(),
      duration_unit: formData.durationUnit,
      duration_value: Number(formData.durationValue),
      amount: String(formData.amount),
      is_popular: Boolean(formData.isPopular),
      is_active: Boolean(formData.isActive),
      sort_order: formData.sortOrder ? Number(formData.sortOrder) : 0,
      notes: formData.notes?.trim() ? formData.notes.trim() : null,
    };
  }

  async function createPlan(formData: PricingPlanFormData): Promise<PricingPlanItem> {
    setIsSaving(true);
    const payload = formDataToPayload(formData);

    const promise = (async () => {
      const createdDto = await createPricingPlan(payload);
      const mapped = mapPricingPlanDto(createdDto);
      setPlans((prev) => [mapped, ...prev]);
      return mapped;
    })();

    toast.promise(promise, {
      loading: "جاري حفظ باقة التوثيق...",
      success: "تمت إضافة باقة التوثيق بنجاح",
      error: (err: any) => err?.message || "حدث خطأ أثناء إضافة باقة التوثيق",
    });

    try {
      const result = await promise;
      return result;
    } finally {
      setIsSaving(false);
    }
  }

  async function updatePlan(
    id: string | number,
    formData: PricingPlanFormData,
  ): Promise<PricingPlanItem> {
    setIsSaving(true);
    const payload = formDataToPayload(formData);

    const promise = (async () => {
      const updatedDto = await updatePricingPlan(id, payload);
      const mapped = mapPricingPlanDto(updatedDto);
      setPlans((prev) =>
        prev.map((item) => (String(item.id) === String(id) ? mapped : item)),
      );
      return mapped;
    })();

    toast.promise(promise, {
      loading: "جاري حفظ التعديلات...",
      success: "تم تحديث باقة التوثيق بنجاح",
      error: (err: any) => err?.message || "حدث خطأ أثناء تحديث باقة التوثيق",
    });

    try {
      const result = await promise;
      return result;
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleActive(plan: PricingPlanItem): Promise<void> {
    const updatedStatus = !plan.isActive;
    const payload: PricingPlanPayload = {
      contract_type: plan.contractType,
      duration: plan.duration,
      duration_unit: plan.durationUnit,
      duration_value: plan.durationValue,
      amount: String(plan.amount),
      is_popular: plan.isPopular,
      is_active: updatedStatus,
      sort_order: plan.sortOrder,
      notes: plan.notes || null,
    };

    try {
      await updatePricingPlan(plan.id, payload);
      setPlans((prev) =>
        prev.map((item) =>
          item.id === plan.id ? { ...item, isActive: updatedStatus } : item,
        ),
      );
      toast.success(
        updatedStatus ? "تم تفعيل باقة التوثيق بنجاح" : "تم تعطيل باقة التوثيق بنجاح",
      );
    } catch (err: any) {
      toast.error(err?.message || "فشل تعديل حالة الباقة");
    }
  }

  async function deletePlan(id: string | number): Promise<void> {
    setIsDeleting(true);
    const promise = (async () => {
      await deletePricingPlan(id);
      setPlans((prev) => prev.filter((item) => String(item.id) !== String(id)));
    })();

    toast.promise(promise, {
      loading: "جاري حذف باقة التوثيق...",
      success: "تم حذف باقة التوثيق بنجاح",
      error: (err: any) => err?.message || "حدث خطأ أثناء حذف باقة التوثيق",
    });

    try {
      await promise;
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    plans,
    setPlans,
    isLoading,
    isSaving,
    isDeleting,
    error,
    refetch: loadPlans,
    createPlan,
    updatePlan,
    toggleActive,
    deletePlan,
  };
}
