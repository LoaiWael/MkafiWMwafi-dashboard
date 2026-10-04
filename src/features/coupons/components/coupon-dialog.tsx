import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Percent, RefreshCw, Tag } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  type Coupon,
  type TargetService,
} from "@/features/coupons/constants";
import {
  couponSchema,
  type CouponFormData,
} from "@/features/coupons/schemas/coupon-schema";

function generateRandomCouponCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "MKFI-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getDefaultDates() {
  const d = new Date();
  const todayStr = d.toISOString().split("T")[0];
  d.setDate(d.getDate() + 30);
  const nextMonthStr = d.toISOString().split("T")[0];
  return { todayStr, nextMonthStr };
}

interface CouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: Coupon | null;
  onSave: (
    couponData: Omit<
      Coupon,
      "id" | "createdAt" | "createdBy" | "usedCount" | "totalDiscountedAmount"
    > & { id?: string },
  ) => void;
}

export default function CouponDialog({
  open,
  onOpenChange,
  coupon,
  onSave,
}: CouponDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <CouponDialogForm
          key={coupon ? coupon.id : "new-coupon"}
          coupon={coupon}
          onClose={() => onOpenChange(false)}
          onSave={onSave}
        />
      ) : null}
    </Dialog>
  );
}

function CouponDialogForm({
  coupon,
  onClose,
  onSave,
}: {
  coupon?: Coupon | null;
  onClose: () => void;
  onSave: (
    couponData: Omit<
      Coupon,
      "id" | "createdAt" | "createdBy" | "usedCount" | "totalDiscountedAmount"
    > & { id?: string },
  ) => void;
}) {
  const isEditing = Boolean(coupon);
  const defaultDates = getDefaultDates();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon ? coupon.code : generateRandomCouponCode(),
      name: coupon ? coupon.name : "",
      description: coupon ? coupon.description : "",
      discountType: coupon ? coupon.discountType : "percentage",
      discountValue: coupon ? String(coupon.discountValue) : "20",
      maxDiscountAmount: coupon?.maxDiscountAmount
        ? String(coupon.maxDiscountAmount)
        : "100",
      minOrderAmount: coupon ? String(coupon.minOrderAmount) : "200",
      targetServices: coupon
        ? coupon.targetServices
        : ["residential", "commercial"],
      targetUserType: coupon ? coupon.targetUserType : "all",
      hasUsageLimit: coupon ? coupon.usageLimitTotal !== undefined : true,
      usageLimitTotal: coupon?.usageLimitTotal
        ? String(coupon.usageLimitTotal)
        : "500",
      usageLimitPerUser: coupon ? String(coupon.usageLimitPerUser) : "1",
      status: coupon ? coupon.status : "active",
      startDate: coupon ? coupon.startDate : defaultDates.todayStr,
      endDate: coupon ? coupon.endDate : defaultDates.nextMonthStr,
      isPublic: coupon ? coupon.isPublic : true,
    },
  });

  const discountType = watch("discountType");
  const hasUsageLimit = watch("hasUsageLimit");

  function handleGenerateCode() {
    const generated = generateRandomCouponCode();
    setValue("code", generated, { shouldValidate: true });
    toast.info(`تم توليد رمز الكوبون تلقائياً: ${generated}`);
  }

  function onSubmit(data: CouponFormData) {
    onSave({
      id: coupon?.id,
      code: data.code.trim().toUpperCase(),
      name: data.name.trim(),
      description: data.description?.trim() || "",
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      maxDiscountAmount:
        data.discountType === "percentage" && data.maxDiscountAmount
          ? Number(data.maxDiscountAmount)
          : undefined,
      minOrderAmount: Number(data.minOrderAmount) || 0,
      targetServices: data.targetServices,
      targetUserType: data.targetUserType,
      usageLimitTotal:
        data.hasUsageLimit && data.usageLimitTotal
          ? Number(data.usageLimitTotal)
          : undefined,
      usageLimitPerUser: Number(data.usageLimitPerUser) || 1,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      isPublic: data.isPublic,
    });

    onClose();
  }

  return (
    <DialogContent className="max-h-[92vh] w-full max-w-[calc(100%-1rem)] sm:max-w-3xl overflow-y-auto no-scrollbar sm:max-h-[85vh] p-3.5 sm:p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6" noValidate>
        <DialogHeader className="gap-1 pe-6 text-start">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-xl font-bold">
            <div className="flex size-7 sm:size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Tag className="size-3.5 sm:size-4.5" />
            </div>
            <span>
              {isEditing ? "تعديل بيانات الكوبون" : "إنشاء كوبون خصم جديد"}
            </span>
          </DialogTitle>
          <DialogDescription className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed">
            {isEditing
              ? "تعديل معايير وشروط تطبيق كود الخصم في النظام"
              : "حدد رمز الخصم ونوعه وشروط الاستحقاق لتوثيق العقود السكنية والتجارية"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 sm:space-y-5 text-start">
          {/* Coupon Code & Generate Button */}
          <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="coupon-code"
                className="flex items-center justify-between text-xs sm:text-sm font-semibold"
              >
                <span>
                  رمز الكوبون (الكود){" "}
                  <span className="text-destructive">*</span>
                </span>
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-700 hover:underline cursor-pointer transition-colors"
                >
                  <RefreshCw className="size-3" />
                  <span>توليد تلقائي</span>
                </button>
              </Label>
              <div className="relative">
                <Input
                  id="coupon-code"
                  placeholder="مثال: RAMADAN2026"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.code)}
                  className="font-mono text-base font-bold tracking-wider uppercase text-primary bg-muted/30 focus:bg-background transition-colors"
                  dir="ltr"
                  {...register("code", {
                    onChange: (e) => {
                      e.target.value = e.target.value.toUpperCase();
                    },
                  })}
                />
              </div>
              {errors.code && (
                <p className="text-xs text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="coupon-name"
                className="text-xs sm:text-sm font-semibold"
              >
                اسم العرض / الكوبون <span className="text-destructive">*</span>
              </Label>
              <Input
                id="coupon-name"
                placeholder="مثال: خصم شهر رمضان المبارك"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.name)}
                className="bg-muted/30 focus:bg-background transition-colors"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label
              htmlFor="coupon-desc"
              className="text-xs sm:text-sm font-semibold"
            >
              وصف الكوبون والشروط الترويجية
            </Label>
            <Textarea
              id="coupon-desc"
              rows={2}
              placeholder="اكتب نبذة توضيحية عن العرض والجمهور المستهدف..."
              disabled={isSubmitting}
              className="resize-none bg-muted/30 focus:bg-background transition-colors text-xs sm:text-sm"
              {...register("description")}
            />
          </div>

          {/* Discount Type & Value */}
          <div className="rounded-xl border border-border bg-muted/30 p-3.5 sm:p-4 space-y-3.5 sm:space-y-4">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-semibold">
                نوع الخصم وقيمته
              </Label>
              <Controller
                control={control}
                name="discountType"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3"
                  >
                    <label
                      htmlFor="type-percentage"
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 sm:p-3 transition-all ${
                        field.value === "percentage"
                          ? "border-primary bg-primary-50 text-primary-900 font-semibold shadow-2xs"
                          : "border-border bg-card hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="percentage" id="type-percentage" />
                        <div className="flex items-center gap-1.5">
                          <Percent className="size-4 text-primary" />
                          <span className="text-xs sm:text-sm">
                            نسبة مئوية (%)
                          </span>
                        </div>
                      </div>
                    </label>

                    <label
                      htmlFor="type-fixed"
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 sm:p-3 transition-all ${
                        field.value === "fixed"
                          ? "border-primary bg-primary-50 text-primary-900 font-semibold shadow-2xs"
                          : "border-border bg-card hover:bg-muted/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="fixed" id="type-fixed" />
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="size-4 text-primary" />
                          <span className="text-xs sm:text-sm">
                            مبلغ ثابت (ريال)
                          </span>
                        </div>
                      </div>
                    </label>
                  </RadioGroup>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="discount-val"
                  className="text-xs font-semibold text-muted-foreground"
                >
                  {discountType === "percentage"
                    ? "نسبة الخصم المئوية (%)"
                    : "قيمة الخصم المباشر (ر.س)"}
                </Label>
                <div className="relative">
                  <Input
                    id="discount-val"
                    type="number"
                    min={1}
                    max={discountType === "percentage" ? 100 : undefined}
                    placeholder={discountType === "percentage" ? "20" : "50"}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.discountValue)}
                    className="font-bold pe-12 bg-card"
                    {...register("discountValue")}
                  />
                  <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    {discountType === "percentage" ? "%" : "ر.س"}
                  </span>
                </div>
                {errors.discountValue && (
                  <p className="text-xs text-destructive">
                    {errors.discountValue.message}
                  </p>
                )}
              </div>

              {discountType === "percentage" ? (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label
                    htmlFor="max-discount"
                    className="text-xs font-semibold text-muted-foreground"
                  >
                    الحد الأقصى للخصم (ر.س) - اختياري
                  </Label>
                  <div className="relative">
                    <Input
                      id="max-discount"
                      type="number"
                      min={1}
                      placeholder="غير محدد"
                      disabled={isSubmitting}
                      className="pe-12 bg-card"
                      {...register("maxDiscountAmount")}
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      ر.س
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 sm:space-y-2">
                  <Label
                    htmlFor="min-order"
                    className="text-xs font-semibold text-muted-foreground"
                  >
                    الحد الأدنى لقيمة العقد (ر.س)
                  </Label>
                  <div className="relative">
                    <Input
                      id="min-order"
                      type="number"
                      min={0}
                      placeholder="200"
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors.minOrderAmount)}
                      className="pe-12 bg-card"
                      {...register("minOrderAmount")}
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      ر.س
                    </span>
                  </div>
                  {errors.minOrderAmount && (
                    <p className="text-xs text-destructive">
                      {errors.minOrderAmount.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Applicable Services */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm font-semibold">
              العقود المشمولة بالخصم <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="targetServices"
              render={({ field }) => {
                const services = field.value || [];
                function toggleService(service: TargetService) {
                  if (services.includes(service)) {
                    if (services.length > 1) {
                      field.onChange(services.filter((s) => s !== service));
                    }
                  } else {
                    field.onChange([...services, service]);
                  }
                }

                return (
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => toggleService("residential")}
                      disabled={isSubmitting}
                      className={`rounded-lg border px-3 py-2 text-center text-xs font-medium cursor-pointer transition-all ${
                        services.includes("residential")
                          ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "border-border bg-card text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      }`}
                    >
                      العقود السكنية
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleService("commercial")}
                      disabled={isSubmitting}
                      className={`rounded-lg border px-3 py-2 text-center text-xs font-medium cursor-pointer transition-all ${
                        services.includes("commercial")
                          ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "border-border bg-card text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      }`}
                    >
                      العقود التجارية
                    </button>
                  </div>
                );
              }}
            />
            {errors.targetServices && (
              <p className="text-xs text-destructive">
                {errors.targetServices.message}
              </p>
            )}
          </div>

          {/* Usage Limits */}
          <div className="rounded-xl border border-border bg-card p-3.5 sm:p-4 space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <Label
                  htmlFor="limit-switch"
                  className="text-xs sm:text-sm font-semibold cursor-pointer block truncate"
                >
                  تحديد حد أقصى لعدد مرات الاستخدام
                </Label>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  إيقاف الكوبون تلقائياً عند استهلاك كامل السعة المخصصة
                </p>
              </div>
              <Controller
                control={control}
                name="hasUsageLimit"
                render={({ field }) => (
                  <Switch
                    id="limit-switch"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                    className="shrink-0"
                  />
                )}
              />
            </div>

            {hasUsageLimit ? (
              <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2 pt-3 border-t border-border">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="limit-total"
                    className="text-xs text-muted-foreground font-medium"
                  >
                    إجمالي عدد مرات الاستخدام المتاحة
                  </Label>
                  <Input
                    id="limit-total"
                    type="number"
                    min={1}
                    placeholder="مثال: 500"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.usageLimitTotal)}
                    {...register("usageLimitTotal")}
                  />
                  {errors.usageLimitTotal && (
                    <p className="text-xs text-destructive">
                      {errors.usageLimitTotal.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="limit-user"
                    className="text-xs text-muted-foreground font-medium"
                  >
                    الحد الأقصى لكل مستخدم / عميل
                  </Label>
                  <Input
                    id="limit-user"
                    type="number"
                    min={1}
                    placeholder="مثال: 1"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.usageLimitPerUser)}
                    {...register("usageLimitPerUser")}
                  />
                  {errors.usageLimitPerUser && (
                    <p className="text-xs text-destructive">
                      {errors.usageLimitPerUser.message}
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </div>

          {/* Dates & Status */}
          <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-3">
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="start-date"
                className="text-xs sm:text-sm font-semibold"
              >
                تاريخ بدء الصلاحية <span className="text-destructive">*</span>
              </Label>
              <Input
                id="start-date"
                type="date"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.startDate)}
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className="text-xs text-destructive">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="end-date"
                className="text-xs sm:text-sm font-semibold"
              >
                تاريخ انتهاء الصلاحية{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="end-date"
                type="date"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.endDate)}
                {...register("endDate")}
              />
              {errors.endDate && (
                <p className="text-xs text-destructive">
                  {errors.endDate.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2 sm:col-span-1">
              <Label
                htmlFor="coupon-status"
                className="text-xs sm:text-sm font-semibold"
              >
                حالة الكوبون
              </Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id="coupon-status"
                      className="w-full bg-card h-9"
                    >
                      <SelectValue placeholder="اختر حالة الكوبون" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط ومفعل</SelectItem>
                      <SelectItem value="scheduled">مجدول مستقبلاً</SelectItem>
                      <SelectItem value="inactive">معطل مؤقتاً</SelectItem>
                      <SelectItem value="expired">منتهي الصلاحية</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Public vs Private toggle */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-3 sm:p-3.5">
            <div className="space-y-0.5 min-w-0">
              <Label
                htmlFor="public-switch"
                className="text-xs sm:text-sm font-semibold cursor-pointer block"
              >
                عرض الكوبون في قائمة العروض العامة
              </Label>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                عند التفعيل يظهر الكوبون في لافتات الخصم بموقع العملاء، وإلا
                يكون رمزاً حصرياً
              </p>
            </div>
            <Controller
              control={control}
              name="isPublic"
              render={({ field }) => (
                <Switch
                  id="public-switch"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                  className="shrink-0"
                />
              )}
            />
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto cursor-pointer"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto gap-1.5 font-bold cursor-pointer"
          >
            <span>{isEditing ? "حفظ التعديلات" : "إنشاء وتفعيل الكوبون"}</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
