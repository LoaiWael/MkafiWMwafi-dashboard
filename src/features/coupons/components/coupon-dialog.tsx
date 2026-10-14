import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isBefore, isValid, parseISO, startOfDay } from "date-fns";
import { arSA } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  DollarSign,
  Loader2,
  Percent,
  RefreshCw,
  Tag,
} from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  COUPON_STATUS_LABELS,
  type Coupon,
} from "@/features/coupons/constants";
import {
  couponSchema,
  type CouponFormData,
} from "@/features/coupons/schemas/coupon-schema";
import { cn } from "@/lib/utils";

interface CouponDatePickerProps {
  value?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  minDate?: string;
  placeholder: string;
  hasError?: boolean;
  id?: string;
}

function CouponDatePicker({
  value,
  onChange,
  disabled,
  minDate,
  placeholder,
  hasError,
  id,
}: CouponDatePickerProps) {
  const [open, setOpen] = useState(false);

  const parsedDate = value ? parseISO(value) : undefined;
  const isDateValid = Boolean(parsedDate && isValid(parsedDate));

  const minDateObj = minDate ? parseISO(minDate) : undefined;
  const isMinValid = Boolean(minDateObj && isValid(minDateObj));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        type="button"
        disabled={disabled}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-lg border border-border bg-card px-3 text-start text-xs sm:text-sm font-normal transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer disabled:pointer-events-none disabled:opacity-50",
          !isDateValid && "text-muted-foreground",
          hasError && "border-destructive focus-visible:ring-destructive"
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="size-4 shrink-0 text-primary" />
          {isDateValid && parsedDate ? (
            <span className="truncate font-medium text-foreground">
              {format(parsedDate, "yyyy/MM/dd")}
              <span className="ms-1.5 text-xs text-muted-foreground font-normal">
                ({format(parsedDate, "d MMMM yyyy", { locale: arSA })})
              </span>
            </span>
          ) : (
            <span className="truncate">{placeholder}</span>
          )}
        </div>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto p-0 border border-border bg-popover shadow-xl rounded-xl z-50"
      >
        <Calendar
          mode="single"
          selected={isDateValid ? parsedDate : undefined}
          defaultMonth={isDateValid ? parsedDate : isMinValid ? minDateObj : new Date()}
          onSelect={(selected) => {
            if (selected) {
              onChange(format(selected, "yyyy-MM-dd"));
              setOpen(false);
            }
          }}
          disabled={
            isMinValid && minDateObj
              ? (day) => isBefore(startOfDay(day), startOfDay(minDateObj))
              : undefined
          }
        />
      </PopoverContent>
    </Popover>
  );
}

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
    data: CouponFormData,
    id?: string | number
  ) => Promise<boolean>;
  isSaving?: boolean;
}

export default function CouponDialog({
  open,
  onOpenChange,
  coupon,
  onSave,
  isSaving = false,
}: CouponDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <CouponDialogForm
          key={coupon?.id ? coupon.id : "new-coupon"}
          coupon={coupon}
          onClose={() => onOpenChange(false)}
          onSave={onSave}
          isSaving={isSaving}
        />
      ) : null}
    </Dialog>
  );
}

function CouponDialogForm({
  coupon,
  onClose,
  onSave,
  isSaving,
}: {
  coupon?: Coupon | null;
  onClose: () => void;
  onSave: (
    data: CouponFormData,
    id?: string | number
  ) => Promise<boolean>;
  isSaving: boolean;
}) {
  const isEditing = Boolean(coupon && coupon.id);
  const defaultDates = getDefaultDates();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon?.code ? coupon.code : generateRandomCouponCode(),
      name: coupon?.name ? coupon.name : "",
      description: coupon?.description ? coupon.description : "",
      discountType: coupon?.discountType ? coupon.discountType : "percentage",
      discountValue: coupon?.discountValue ? String(coupon.discountValue) : "20",
      maxDiscountAmount:
        coupon?.maxDiscountAmount !== undefined &&
        coupon?.maxDiscountAmount !== null
          ? String(coupon.maxDiscountAmount)
          : "",
      minOrderAmount:
        coupon?.minOrderAmount !== undefined && coupon?.minOrderAmount !== null
          ? String(coupon.minOrderAmount)
          : "0",
      targetServices:
        coupon?.targetServices && coupon.targetServices.length > 0
          ? coupon.targetServices
          : ["all"],
      hasUsageLimit:
        coupon?.usageLimitTotal !== undefined &&
        coupon?.usageLimitTotal !== null
          ? true
          : coupon
            ? false
            : true,
      usageLimitTotal:
        coupon?.usageLimitTotal !== undefined &&
        coupon?.usageLimitTotal !== null
          ? String(coupon.usageLimitTotal)
          : "500",
      usageLimitPerUser:
        coupon?.usageLimitPerUser !== undefined &&
        coupon?.usageLimitPerUser !== null
          ? String(coupon.usageLimitPerUser)
          : "1",
      status: coupon?.status ? coupon.status : "active",
      startDate: coupon?.startDate ? coupon.startDate : defaultDates.todayStr,
      endDate: coupon?.endDate ? coupon.endDate : defaultDates.nextMonthStr,
      isPublic: coupon?.isPublic !== undefined ? coupon.isPublic : true,
    },
  });

  const discountType = useWatch({
    control,
    name: "discountType",
    defaultValue: "percentage",
  });
  const hasUsageLimit = useWatch({
    control,
    name: "hasUsageLimit",
    defaultValue: true,
  });
  const startDate = useWatch({
    control,
    name: "startDate",
  });
  const endDate = useWatch({
    control,
    name: "endDate",
  });
  const busy = isSubmitting || isSaving;

  function handleStartDateChange(newStartDate: string) {
    setValue("startDate", newStartDate, { shouldValidate: true });
    if (endDate && newStartDate > endDate) {
      setValue("endDate", newStartDate, { shouldValidate: true });
    }
  }

  function handleEndDateChange(newEndDate: string) {
    setValue("endDate", newEndDate, { shouldValidate: true });
  }

  function handleGenerateCode() {
    const generated = generateRandomCouponCode();
    setValue("code", generated, { shouldValidate: true });
    toast.info(`تم توليد رمز الكوبون تلقائياً: ${generated}`);
  }

  async function onSubmit(data: CouponFormData) {
    await onSave(data, coupon?.id ? coupon.id : undefined);
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
                  disabled={busy}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-700 hover:underline cursor-pointer transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="size-3" />
                  <span>توليد تلقائي</span>
                </button>
              </Label>
              <div className="relative">
                <Input
                  id="coupon-code"
                  placeholder="مثال: SAVE10"
                  disabled={busy}
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
                placeholder="مثال: خصم 10% على العقود"
                disabled={busy}
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
              disabled={busy}
              className="resize-none bg-muted/30 focus:bg-background transition-colors text-xs sm:text-sm"
              {...register("description")}
            />
          </div>

          {/* Discount Type & Value */}
          <div className="rounded-xl border border-border bg-muted/30 p-3.5 sm:p-4 space-y-3.5 sm:space-y-4">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-semibold">
                نوع الخصم وقيمته <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="discountType"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={busy}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3"
                  >
                    <label
                      htmlFor="type-percentage"
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 sm:p-3 transition-all ${
                        field.value === "percentage"
                          ? "border-primary bg-primary-50 text-primary-900 dark:bg-primary-950/40 dark:text-primary-200 font-semibold shadow-2xs"
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
                          ? "border-primary bg-primary-50 text-primary-900 dark:bg-primary-950/40 dark:text-primary-200 font-semibold shadow-2xs"
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

            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Discount Value */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="discount-val"
                  className="text-xs font-semibold text-muted-foreground"
                >
                  {discountType === "percentage"
                    ? "نسبة الخصم (%)"
                    : "قيمة الخصم (ر.س)"}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="discount-val"
                    type="number"
                    min={1}
                    max={discountType === "percentage" ? 100 : undefined}
                    placeholder={discountType === "percentage" ? "10" : "50"}
                    disabled={busy}
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

              {/* Min Order Amount (Applies to both percentage and fixed) */}
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
                    placeholder="0"
                    disabled={busy}
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

              {/* Max Discount Amount (Only for percentage) */}
              {discountType === "percentage" ? (
                <div className="space-y-1.5 sm:space-y-2 sm:col-span-2 lg:col-span-1">
                  <Label
                    htmlFor="max-discount"
                    className="text-xs font-semibold text-muted-foreground"
                  >
                    أقصى مبلغ خصم (ر.س) - اختياري
                  </Label>
                  <div className="relative">
                    <Input
                      id="max-discount"
                      type="number"
                      min={1}
                      placeholder="غير محدد"
                      disabled={busy}
                      aria-invalid={Boolean(errors.maxDiscountAmount)}
                      className="pe-12 bg-card"
                      {...register("maxDiscountAmount")}
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      ر.س
                    </span>
                  </div>
                  {errors.maxDiscountAmount && (
                    <p className="text-xs text-destructive">
                      {errors.maxDiscountAmount.message}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Applicable Services & Target User Type (Added Missing Inputs) */}
          {/* Target Services */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm font-semibold">
              العقود المشمولة بالخصم <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="targetServices"
              render={({ field }) => {
                const services = field.value || ["all"];

                function handleSelectMode(mode: "all" | "residential" | "commercial") {
                  if (mode === "all") {
                    field.onChange(["all"]);
                    return;
                  }

                  // If currently "all", switch to selected specific
                  if (services.includes("all")) {
                    field.onChange([mode]);
                    return;
                  }

                  // Toggle specific mode
                  if (services.includes(mode)) {
                    const next = services.filter((s) => s !== mode);
                    field.onChange(next.length > 0 ? next : ["all"]);
                  } else {
                    const next = [...services, mode];
                    if (next.includes("residential") && next.includes("commercial")) {
                      field.onChange(["all"]);
                    } else {
                      field.onChange(next);
                    }
                  }
                }

                const isAll = services.includes("all");
                const isRes = isAll || services.includes("residential");
                const isCom = isAll || services.includes("commercial");

                return (
                  <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleSelectMode("all")}
                      disabled={busy}
                      className={`rounded-lg border px-2 py-2 text-center text-xs font-medium cursor-pointer transition-all ${
                        isAll
                          ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "border-border bg-card text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      }`}
                    >
                      الكل (سكني وتجاري)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectMode("residential")}
                      disabled={busy}
                      className={`rounded-lg border px-2 py-2 text-center text-xs font-medium cursor-pointer transition-all ${
                        !isAll && isRes
                          ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "border-border bg-card text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      }`}
                    >
                      سكني فقط
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectMode("commercial")}
                      disabled={busy}
                      className={`rounded-lg border px-2 py-2 text-center text-xs font-medium cursor-pointer transition-all ${
                        !isAll && isCom
                          ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "border-border bg-card text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      }`}
                    >
                      تجاري فقط
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
                    disabled={busy}
                    className="shrink-0"
                  />
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2 pt-3 border-t border-border">
              {hasUsageLimit ? (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="limit-total"
                    className="text-xs text-muted-foreground font-medium"
                  >
                    إجمالي مرات الاستخدام المتاحة
                  </Label>
                  <Input
                    id="limit-total"
                    type="number"
                    min={1}
                    placeholder="مثال: 1000"
                    disabled={busy}
                    aria-invalid={Boolean(errors.usageLimitTotal)}
                    {...register("usageLimitTotal")}
                  />
                  {errors.usageLimitTotal && (
                    <p className="text-xs text-destructive">
                      {errors.usageLimitTotal.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5 flex flex-col justify-center">
                  <span className="text-xs text-muted-foreground font-medium">
                    إجمالي مرات الاستخدام
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    استخدام غير محدود (مفتوح)
                  </span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label
                  htmlFor="limit-user"
                  className="text-xs text-muted-foreground font-medium"
                >
                  الحد الأقصى لكل مستخدم <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="limit-user"
                  type="number"
                  min={1}
                  placeholder="مثال: 1"
                  disabled={busy}
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
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <CouponDatePicker
                    id="start-date"
                    value={field.value}
                    onChange={handleStartDateChange}
                    disabled={busy}
                    placeholder="اختر تاريخ بدء الصلاحية"
                    hasError={Boolean(errors.startDate)}
                  />
                )}
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
              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                  <CouponDatePicker
                    id="end-date"
                    value={field.value}
                    onChange={handleEndDateChange}
                    disabled={busy}
                    minDate={startDate}
                    placeholder="اختر تاريخ انتهاء الصلاحية"
                    hasError={Boolean(errors.endDate)}
                  />
                )}
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
                    disabled={busy}
                  >
                    <SelectTrigger
                      id="coupon-status"
                      className="w-full bg-card h-9"
                    >
                      <SelectValue placeholder="اختر حالة الكوبون">
                        {COUPON_STATUS_LABELS[field.value] || "اختر حالة الكوبون"}
                      </SelectValue>
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
                  disabled={busy}
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
            disabled={busy}
            className="w-full sm:w-auto cursor-pointer"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={busy}
            className="w-full sm:w-auto gap-1.5 font-bold cursor-pointer"
          >
            {busy && <Loader2 className="size-4 animate-spin" />}
            <span>
              {busy
                ? "جاري الحفظ..."
                : isEditing
                  ? "حفظ التعديلات"
                  : "إنشاء وتفعيل الكوبون"}
            </span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
