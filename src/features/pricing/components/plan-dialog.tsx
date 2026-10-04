import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, SaudiRiyal, Sparkles } from "lucide-react";
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
import type { PricingPlan } from "@/features/pricing/constants";
import {
  pricingPlanSchema,
  type PricingPlanFormData,
} from "@/features/pricing/schemas/pricing-schema";

interface PlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingPlan: PricingPlan | null;
  onSave: (data: PricingPlanFormData) => void;
}

const defaultValues: PricingPlanFormData = {
  duration: "",
  durationUnit: "years",
  durationValue: "1",
  amount: "",
  isPopular: false,
  notes: "",
};

export default function PlanDialog({
  isOpen,
  onClose,
  editingPlan,
  onSave,
}: PlanDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PricingPlanFormData>({
    resolver: zodResolver(pricingPlanSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editingPlan) {
      reset({
        duration: editingPlan.duration,
        durationUnit: editingPlan.durationUnit,
        durationValue: String(editingPlan.durationValue),
        amount: String(editingPlan.amount),
        isPopular: Boolean(editingPlan.isPopular),
        notes: editingPlan.notes || "",
      });
    } else {
      reset(defaultValues);
    }
  }, [editingPlan, reset, isOpen]);

  function onSubmit(data: PricingPlanFormData) {
    onSave(data);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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
                  {editingPlan ? "تعديل مدة التوثيق والسعر" : "إضافة مدة جديدة"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  تحديد مدة العقد ورسوم التوثيق المعتمدة في النظام
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3.5 py-1 text-start">
            <div className="space-y-1.5">
              <Label htmlFor="plan-duration" className="text-xs font-semibold">
                اسم المدة (كما يظهر للمستخدم){" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="plan-duration"
                placeholder="مثال: سنتين أو 3 سنوات أو 6 شهور"
                disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="unit-type"
                        aria-invalid={Boolean(errors.durationUnit)}
                        className="w-full h-10 text-xs font-medium"
                      >
                        <SelectValue placeholder="اختر الوحدة" />
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
                  disabled={isSubmitting}
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

            <div className="space-y-1.5">
              <Label
                htmlFor="plan-amount"
                className="text-xs font-semibold flex items-center gap-1.5"
              >
                <span>المبلغ الأساسي</span>
                <span className="text-destructive">*</span>
                <span className="flex items-center text-xs text-muted-foreground font-normal">
                  (<SaudiRiyal className="size-3 inline text-primary" />)
                </span>
              </Label>
              <div className="relative">
                <Input
                  id="plan-amount"
                  type="number"
                  min="0"
                  placeholder="249"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.amount)}
                  className="h-10 text-xs pe-9 font-bold"
                  {...register("amount")}
                />
                <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground">
                  <SaudiRiyal className="size-4 text-primary" />
                </div>
              </div>
              {errors.amount && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="plan-notes" className="text-xs font-semibold">
                ملاحظات / وصف إضافي (اختياري)
              </Label>
              <Input
                id="plan-notes"
                placeholder="مثال: الباقة الأكثر توفيراً للعقود طويلة الأجل"
                disabled={isSubmitting}
                className="h-10 text-xs"
                {...register("notes")}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/30 p-3">
              <div className="space-y-0.5">
                <Label
                  htmlFor="is-pop"
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
                    id="is-pop"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>

          <DialogFooter className="gap-2.5 sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer text-xs"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="cursor-pointer text-xs font-bold"
            >
              {editingPlan ? "حفظ التعديلات" : "إضافة الباقة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
