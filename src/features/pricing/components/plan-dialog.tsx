import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Home,
  Loader2,
  Plus,
  SaudiRiyal,
  Sparkles,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { PricingPlanItem } from "../types";
import {
  pricingPlanSchema,
  type PricingPlanFormData,
} from "../schemas/pricing-schema";

interface PlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlan: PricingPlanItem | null;
  onSave: (data: PricingPlanFormData) => Promise<unknown> | void;
  isSaving?: boolean;
}

const defaultValues: PricingPlanFormData = {
  contractType: "residential",
  duration: "",
  durationUnit: "years",
  durationValue: "1",
  amount: "",
  sortOrder: "1",
  isPopular: false,
  isActive: true,
  notes: "",
};

export default function PlanDialog({
  isOpen,
  onClose,
  editingPlan,
  onSave,
  isSaving = false,
}: PlanDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PricingPlanFormData>({
    resolver: zodResolver(pricingPlanSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editingPlan) {
      reset({
        contractType: editingPlan.contractType,
        duration: editingPlan.duration,
        durationUnit: editingPlan.durationUnit,
        durationValue: String(editingPlan.durationValue),
        amount: String(editingPlan.amount),
        sortOrder: String(editingPlan.sortOrder ?? 1),
        isPopular: Boolean(editingPlan.isPopular),
        isActive: Boolean(editingPlan.isActive),
        notes: editingPlan.notes || "",
      });
    } else {
      reset(defaultValues);
    }
  }, [editingPlan, reset, isOpen]);

  async function onSubmit(data: PricingPlanFormData) {
    await onSave(data);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSaving && onClose()}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <DialogHeader className="text-start">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-950/40">
                {editingPlan ? (
                  <Sparkles className="size-5" />
                ) : (
                  <Plus className="size-5" />
                )}
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {editingPlan ? "تعديل باقة التوثيق" : "إضافة باقة توثيق جديدة"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  تحديد نوع العقد ومدة العقد ورسوم التوثيق المعتمدة في النظام
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3.5 py-1 text-start">
            {/* Contract Type */}
            <div className="space-y-1.5">
              <Label htmlFor="contract-type" className="text-xs font-semibold">
                نوع العقد <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="contractType"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSaving}
                  >
                    <SelectTrigger
                      id="contract-type"
                      aria-invalid={Boolean(errors.contractType)}
                      className="w-full h-10 text-xs font-medium"
                    >
                      <SelectValue placeholder="اختر نوع العقد">
                        {field.value === "commercial" ? (
                          <div className="flex items-center gap-2">
                            <Building2 className="size-3.5 text-secondary" />
                            <span>عقد تجاري</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Home className="size-3.5 text-primary" />
                            <span>عقد سكني</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">
                        <div className="flex items-center gap-2">
                          <Home className="size-3.5 text-primary" />
                          <span>عقد سكني</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="commercial">
                        <div className="flex items-center gap-2">
                          <Building2 className="size-3.5 text-secondary" />
                          <span>عقد تجاري</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.contractType && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.contractType.message}
                </p>
              )}
            </div>

            {/* Plan Duration Name */}
            <div className="space-y-1.5">
              <Label htmlFor="plan-duration" className="text-xs font-semibold">
                اسم المدة (كما يظهر للمستخدم){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="plan-duration"
                placeholder="مثال: سنة أو سنتين أو 6 شهور"
                disabled={isSaving}
                aria-invalid={Boolean(errors.duration)}
                className="h-10 text-xs"
                {...register("duration")}
              />
              {errors.duration && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.duration.message}
                </p>
              )}
            </div>

            {/* Time Unit & Numeric Value */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="unit-type" className="text-xs font-semibold">
                  الوحدة الزمنية <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="durationUnit"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSaving}
                    >
                      <SelectTrigger
                        id="unit-type"
                        aria-invalid={Boolean(errors.durationUnit)}
                        className="w-full h-10 text-xs font-medium"
                      >
                        <SelectValue placeholder="اختر الوحدة">
                          {field.value === "months" ? "شهور" : "سنوات"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="years">سنوات</SelectItem>
                        <SelectItem value="months">شهور</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.durationUnit && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.durationUnit.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="unit-val" className="text-xs font-semibold">
                  القيمة الرقمية <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="unit-val"
                  type="number"
                  min="1"
                  placeholder="1"
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.durationValue)}
                  className="h-10 text-xs"
                  {...register("durationValue")}
                />
                {errors.durationValue && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.durationValue.message}
                  </p>
                )}
              </div>
            </div>

            {/* Fee Amount & Sort Order */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="plan-amount"
                  className="text-xs font-semibold flex items-center gap-1"
                >
                  <span>رسوم التوثيق</span>
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="plan-amount"
                    type="number"
                    min="0"
                    placeholder="249"
                    disabled={isSaving}
                    aria-invalid={Boolean(errors.amount)}
                    className="h-10 text-xs pe-8 font-bold"
                    {...register("amount")}
                  />
                  <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5 text-muted-foreground">
                    <SaudiRiyal className="size-3.5 text-primary" />
                  </div>
                </div>
                {errors.amount && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="plan-sort" className="text-xs font-semibold">
                  ترتيب العرض
                </Label>
                <Input
                  id="plan-sort"
                  type="number"
                  min="0"
                  placeholder="1"
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.sortOrder)}
                  className="h-10 text-xs"
                  {...register("sortOrder")}
                />
                {errors.sortOrder && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.sortOrder.message}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="plan-notes" className="text-xs font-semibold">
                ملاحظات / وصف إضافي (اختياري)
              </Label>
              <Input
                id="plan-notes"
                placeholder="مثال: الباقة الأكثر توفيراً للعقود السكنية"
                disabled={isSaving}
                className="h-10 text-xs"
                {...register("notes")}
              />
            </div>

            {/* Toggles: Popular & Active */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/30 p-3">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="is-popular"
                    className="cursor-pointer font-bold text-xs"
                  >
                    تمييز كباقة الأكثر طلباً
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    إظهار شارة مميزة وإبراز الباقة في واجهة التسعير
                  </p>
                </div>
                <Controller
                  control={control}
                  name="isPopular"
                  render={({ field }) => (
                    <Switch
                      id="is-popular"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSaving}
                    />
                  )}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/30 p-3">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="is-active"
                    className="cursor-pointer font-bold text-xs"
                  >
                    تفعيل الباقة في النظام
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    تكون الباقة متاحة للمستخدمين للاختيار عند توثيق العقد
                  </p>
                </div>
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <Switch
                      id="is-active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSaving}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2.5 sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="cursor-pointer text-xs"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              className="cursor-pointer text-xs font-bold gap-1.5"
            >
              {isSaving && <Loader2 className="size-3.5 animate-spin" />}
              <span>{editingPlan ? "حفظ التعديلات" : "إضافة الباقة"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
