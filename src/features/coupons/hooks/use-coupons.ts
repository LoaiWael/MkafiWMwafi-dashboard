import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createCoupon,
  deleteCoupon,
  fetchCoupons,
  updateCoupon,
  updateCouponStatus,
} from "../api/coupons-api";
import type { CouponFormData } from "../schemas/coupon-schema";
import type {
  Coupon,
  CouponListParams,
  CouponPayload,
  CouponStatus,
} from "../types";
import { mapCouponDto } from "../types";

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

export function useCoupons(filters?: CouponListParams) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Dialog & Action States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadCoupons(params?: CouponListParams): Promise<Coupon[]> {
    setIsLoading(true);
    setError(null);
    try {
      const dtos = await fetchCoupons(params ?? filters);
      const mapped = Array.isArray(dtos) ? dtos.map(mapCouponDto) : [];
      setCoupons(mapped);
      return mapped;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      setCoupons([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }

  const searchFilter = filters?.search;
  const statusFilter = filters?.status;
  const serviceFilter = filters?.service;
  const discountTypeFilter = filters?.discount_type;
  const perPageFilter = filters?.per_page;
  const pageFilter = filters?.page;

  useEffect(() => {
    let ignore = false;

    async function initialFetch() {
      try {
        const dtos = await fetchCoupons({
          search: searchFilter,
          status: statusFilter,
          service: serviceFilter,
          discount_type: discountTypeFilter,
          per_page: perPageFilter,
          page: pageFilter,
        });
        if (ignore) return;
        const mapped = Array.isArray(dtos) ? dtos.map(mapCouponDto) : [];
        setCoupons(mapped);
      } catch (err) {
        if (ignore) return;
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        setCoupons([]);
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
  }, [
    searchFilter,
    statusFilter,
    serviceFilter,
    discountTypeFilter,
    perPageFilter,
    pageFilter,
  ]);

  function openCreate() {
    setEditingCoupon(null);
    setIsDialogOpen(true);
  }

  function openEdit(coupon: Coupon) {
    setEditingCoupon(coupon);
    setIsDialogOpen(true);
  }

  function openDuplicate(coupon: Coupon) {
    const template: Coupon = {
      ...coupon,
      id: "", // clear id to indicate a new creation
      code: `${coupon.code}_COPY`.toUpperCase(),
      name: `${coupon.name} (نسخة)`,
      status: "inactive",
      usedCount: 0,
      totalDiscountedAmount: 0,
    };
    setEditingCoupon(template);
    setIsDialogOpen(true);
    toast.info("تم تجهيز نسخة من الكوبون، يمكنك مراجعتها وحفظها الآن");
  }

  async function saveCoupon(
    formData: CouponFormData,
    id?: string | number
  ): Promise<boolean> {
    setIsSaving(true);
    try {
      const payload: CouponPayload = {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        description: formData.description?.trim()
          ? formData.description.trim()
          : null,
        discount_type: formData.discountType,
        discount_value: Number(formData.discountValue),
        max_discount_amount:
          formData.discountType === "percentage" &&
          formData.maxDiscountAmount &&
          formData.maxDiscountAmount.trim() !== ""
            ? Number(formData.maxDiscountAmount)
            : null,
        min_order_amount:
          formData.minOrderAmount && formData.minOrderAmount.trim() !== ""
            ? Number(formData.minOrderAmount)
            : 0,
        target_services: formData.targetServices,
        usage_limit_total:
          formData.hasUsageLimit &&
          formData.usageLimitTotal &&
          formData.usageLimitTotal.trim() !== ""
            ? Number(formData.usageLimitTotal)
            : null,
        usage_limit_per_user: Number(formData.usageLimitPerUser) || 1,
        status: formData.status,
        start_date: formData.startDate,
        end_date: formData.endDate,
        is_public: formData.isPublic,
      };

      if (id) {
        await updateCoupon(id, payload);
        toast.success("تم تحديث بيانات الكوبون بنجاح");
      } else {
        await createCoupon(payload);
        toast.success("تم إنشاء وتفعيل الكوبون الجديد بنجاح");
      }

      await loadCoupons();
      setIsDialogOpen(false);
      setEditingCoupon(null);
      return true;
    } catch (err) {
      const msg = getApiErrorMessage(
        err,
        id ? "تعذر تحديث الكوبون، يرجى المحاولة لاحقاً" : "تعذر إنشاء الكوبون، يرجى المحاولة لاحقاً"
      );
      toast.error(msg);
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleStatus(
    couponId: string,
    currentStatus: CouponStatus
  ): Promise<boolean> {
    const nextStatus: CouponStatus =
      currentStatus === "active" ? "inactive" : "active";
    setUpdatingStatusId(couponId);
    try {
      await updateCouponStatus(couponId, nextStatus);
      setCoupons((prev) =>
        prev.map((c) => (c.id === couponId ? { ...c, status: nextStatus } : c))
      );
      if (nextStatus === "active") {
        toast.success("تم تفعيل الكوبون بنجاح");
      } else {
        toast.info("تم إيقاف تفعيل الكوبون");
      }
      return true;
    } catch (err) {
      const msg = getApiErrorMessage(err, "تعذر تغيير حالة الكوبون");
      toast.error(msg);
      return false;
    } finally {
      setUpdatingStatusId(null);
    }
  }

  async function removeCoupon(): Promise<boolean> {
    if (!deletingId) return false;
    setIsDeleting(true);
    try {
      await deleteCoupon(deletingId);
      toast.success("تم حذف الكوبون بنجاح");
      setCoupons((prev) => prev.filter((c) => c.id !== deletingId));
      setDeletingId(null);
      return true;
    } catch (err) {
      const msg = getApiErrorMessage(err, "تعذر حذف الكوبون");
      toast.error(msg);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    coupons,
    isLoading,
    isSaving,
    isDeleting,
    updatingStatusId,
    error,
    isDialogOpen,
    setIsDialogOpen,
    editingCoupon,
    deletingId,
    setDeletingId,
    openCreate,
    openEdit,
    openDuplicate,
    saveCoupon,
    toggleStatus,
    removeCoupon,
    loadCoupons,
  };
}
