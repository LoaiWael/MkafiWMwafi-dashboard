import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Edit2,
  Eye,
  Plus,
  SaudiRiyal,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import type { TaxSetting } from "@/features/taxes/constants";
import {
  taxRuleSchema,
  type TaxRuleFormData,
} from "@/features/taxes/schemas/tax-schema";

interface TaxRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tax: TaxSetting | null;
  onSave: (taxData: Partial<TaxSetting>, id?: string) => void;
}

const defaultValues: TaxRuleFormData = {
  nameAr: "",
  category: "vat",
  description: "",
  ratePercent: "15",
  fixedAmount: "0",
  isExempt: false,
  exemptionLabel: "معفى",
  appliesTo: "all",
  calculationType: "percentage",
  isActive: true,
};

export default function TaxRuleDialog({
  open,
  onOpenChange,
  tax,
  onSave,
}: TaxRuleDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaxRuleFormData>({
    resolver: zodResolver(taxRuleSchema),
    defaultValues,
  });

  const watchNameAr = useWatch({ control, name: "nameAr" });
  const watchAppliesTo = useWatch({ control, name: "appliesTo" });
  const watchCalculationType = useWatch({ control, name: "calculationType" });
  const watchRatePercent = useWatch({ control, name: "ratePercent" });
  const watchFixedAmount = useWatch({ control, name: "fixedAmount" });
  const watchIsExempt = useWatch({ control, name: "isExempt" });
  const watchExemptionLabel = useWatch({ control, name: "exemptionLabel" });

  useEffect(() => {
    if (tax) {
      reset({
        nameAr: tax.nameAr,
        category: tax.category,
        description: tax.description || "",
        ratePercent: String(tax.ratePercent ?? 0),
        fixedAmount: String(tax.fixedAmount ?? 0),
        isExempt: Boolean(tax.isExempt),
        exemptionLabel: tax.exemptionLabel || "معفى",
        appliesTo: tax.appliesTo,
        calculationType: tax.calculationType,
        isActive: Boolean(tax.isActive),
      });
    } else {
      reset(defaultValues);
    }
  }, [tax, open, reset]);

  function onSubmit(data: TaxRuleFormData) {
    onSave(
      {
        nameAr: data.nameAr.trim(),
        category: data.category,
        appliesTo: data.appliesTo,
        description: data.description?.trim() || "",
        calculationType: data.calculationType,
        ratePercent:
          data.calculationType === "percentage"
            ? Number(data.ratePercent) || 0
            : 0,
        fixedAmount:
          data.calculationType === "fixed"
            ? Number(data.fixedAmount) || 0
            : 0,
        isExempt: data.isExempt,
        exemptionLabel: data.isExempt
          ? data.exemptionLabel?.trim() || "معفى"
          : "",
        isActive: data.isActive,
      },
      tax?.id,
    );
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-xl md:max-w-2xl p-0 overflow-hidden border-border shadow-xl flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] rounded-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col h-full overflow-hidden"
        >
          {/* Header with stylized badge */}
          <div className="border-b border-border/70 bg-muted/20 px-4 py-3.5 sm:px-6 sm:py-4 shrink-0">
            <DialogHeader className="gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-primary-50 text-primary border border-primary/20 shadow-xs shrink-0">
                  {tax ? (
                    <Edit2 className="size-4 sm:size-5" />
                  ) : (
                    <Plus className="size-4 sm:size-5" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                    {tax ? "تعديل إعدادات الضريبة" : "إضافة ضريبة أو رسم جديد"}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    {tax
                      ? `تعديل قواعد وحساب ${tax.nameAr}`
                      : "تحديد مسمى الضريبة والنسبة وشروط التطبيق على العقود"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-4 py-3.5 sm:px-6 sm:py-4 space-y-3.5 sm:space-y-4">
            {/* Section 1: Basic Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px]">
                  1
                </span>
                <span>البيانات الأساسية والتصنيف</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="tax-name" className="text-xs font-semibold">
                    اسم الضريبة / الرسم{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="tax-name"
                    placeholder="مثال: ضريبة القيمة المضافة أو ضريبة العقد السكني"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.nameAr)}
                    className="h-9 text-xs sm:text-sm"
                    {...register("nameAr")}
                  />
                  {errors.nameAr && (
                    <p className="text-[11px] font-medium text-destructive">
                      {errors.nameAr.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tax-category" className="text-xs font-semibold">
                    تصنيف البند <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          id="tax-category"
                          aria-invalid={Boolean(errors.category)}
                          className="w-full h-9 text-xs"
                        >
                          <SelectValue placeholder="اختر تصنيف البند" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vat">
                            ضريبة القيمة المضافة (VAT)
                          </SelectItem>
                          <SelectItem value="contract_tax">
                            ضريبة عقد التوثيق
                          </SelectItem>
                          <SelectItem value="service_fee">
                            رسوم خدمة وتشغيل
                          </SelectItem>
                          <SelectItem value="custom">بند مخصص</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-[11px] font-medium text-destructive">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tax-applies" className="text-xs font-semibold">
                    نطاق السريان <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="appliesTo"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          id="tax-applies"
                          aria-invalid={Boolean(errors.appliesTo)}
                          className="w-full h-9 text-xs"
                        >
                          <SelectValue placeholder="اختر نطاق السريان" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            جميع العقود الإلكترونية
                          </SelectItem>
                          <SelectItem value="residential">
                            العقود السكنية فقط
                          </SelectItem>
                          <SelectItem value="commercial">
                            العقود التجارية فقط
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.appliesTo && (
                    <p className="text-[11px] font-medium text-destructive">
                      {errors.appliesTo.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="tax-desc" className="text-xs font-semibold">
                    الوصف التوضيحي (يظهر في التفاصيل)
                  </Label>
                  <Input
                    id="tax-desc"
                    placeholder="مثال: ضريبة القيمة المضافة الحكومية أو معفى للوحدات السكنية"
                    disabled={isSubmitting}
                    className="h-9 text-xs"
                    {...register("description")}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Calculation & Value */}
            <div className="space-y-3 pt-2 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px]">
                  2
                </span>
                <span>طريقة الاحتساب والقيمة</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="calc-type" className="text-xs font-semibold">
                    نوع الاحتساب <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="calculationType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger
                          id="calc-type"
                          aria-invalid={Boolean(errors.calculationType)}
                          className="w-full h-9 text-xs"
                        >
                          <SelectValue placeholder="اختر نوع الاحتساب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                          <SelectItem value="fixed">
                            مبلغ ثابت مقطوع (﷼)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.calculationType && (
                    <p className="text-[11px] font-medium text-destructive">
                      {errors.calculationType.message}
                    </p>
                  )}
                </div>

                {watchCalculationType === "percentage" ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="tax-rate" className="text-xs font-semibold">
                      النسبة المئوية (%) <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="tax-rate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        placeholder="15"
                        disabled={isSubmitting}
                        aria-invalid={Boolean(errors.ratePercent)}
                        className="h-9 pe-8 text-sm font-bold"
                        {...register("ratePercent")}
                      />
                      <div className="pointer-events-none absolute inset-y-0 end-2.5 flex items-center text-xs font-bold text-muted-foreground">
                        %
                      </div>
                    </div>
                    {errors.ratePercent && (
                      <p className="text-[11px] font-medium text-destructive">
                        {errors.ratePercent.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label htmlFor="tax-fixed" className="text-xs font-semibold">
                      المبلغ الثابت <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="tax-fixed"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        disabled={isSubmitting}
                        aria-invalid={Boolean(errors.fixedAmount)}
                        className="h-9 pe-8 text-sm font-bold"
                        {...register("fixedAmount")}
                      />
                      <div className="pointer-events-none absolute inset-y-0 end-2.5 flex items-center text-primary">
                        <SaudiRiyal className="size-3.5" />
                      </div>
                    </div>
                    {errors.fixedAmount && (
                      <p className="text-[11px] font-medium text-destructive">
                        {errors.fixedAmount.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Exemption & Active State Cards */}
            <div className="space-y-2.5 pt-2 border-t border-border/50">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px]">
                  3
                </span>
                <span>شروط الإعفاء وحالة التفعيل</span>
              </div>

              {/* Exemption Card */}
              <div className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2.5 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="is-exempt"
                      className="font-bold text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <ShieldCheck className="size-3.5 text-primary shrink-0" />
                      <span>معفى من الضريبة (إعفاء نظامي)</span>
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      إظهار علامة "معفى" في الفاتورة بدلاً من فرض القيمة
                      المالية
                    </p>
                  </div>
                  <Controller
                    control={control}
                    name="isExempt"
                    render={({ field }) => (
                      <Switch
                        id="is-exempt"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                        className="scale-90 sm:scale-100"
                      />
                    )}
                  />
                </div>

                {watchIsExempt && (
                  <div className="space-y-1.5 pt-2 border-t border-border/50">
                    <Label
                      htmlFor="exemption-label"
                      className="text-xs font-medium"
                    >
                      نص علامة الإعفاء <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="exemption-label"
                      placeholder="مثال: معفى أو 0%"
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors.exemptionLabel)}
                      className="h-8 text-xs bg-background"
                      {...register("exemptionLabel")}
                    />
                    {errors.exemptionLabel && (
                      <p className="text-[11px] font-medium text-destructive">
                        {errors.exemptionLabel.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Active Card */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/20 p-3">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="is-active"
                    className="cursor-pointer font-bold text-xs"
                  >
                    تفعيل البند في النظام
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    سريان هذا البند واحتسابه في محاكي الفواتير المعتمدة
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
                      disabled={isSubmitting}
                      className="scale-90 sm:scale-100"
                    />
                  )}
                />
              </div>
            </div>

            {/* Section 4: Mini Live Preview Pill */}
            <div className="rounded-xl border border-primary/20 bg-primary-50/40 p-2.5 sm:p-3 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 truncate">
                <Eye className="size-3.5 text-primary shrink-0" />
                <span className="font-semibold text-foreground truncate">
                  {watchNameAr || "اسم الضريبة"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                  {watchAppliesTo === "residential"
                    ? "سكني"
                    : watchAppliesTo === "commercial"
                      ? "تجاري"
                      : "شامل"}
                </Badge>
                {watchIsExempt ? (
                  <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
                    {watchExemptionLabel || "معفى"}
                  </Badge>
                ) : (
                  <span className="font-bold text-primary">
                    {watchCalculationType === "percentage"
                      ? `${watchRatePercent || 0}%`
                      : `${watchFixedAmount || 0} ﷼`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border/70 bg-muted/20 px-4 py-3 sm:px-6 sm:py-3.5 shrink-0">
            <DialogFooter className="gap-2 sm:gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
                className="cursor-pointer h-9 text-xs w-full sm:w-auto"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="bg-linear-to-r from-primary-800 via-primary to-primary-400 text-primary-foreground shadow-md shadow-inner-primary hover:brightness-105 active:scale-98 cursor-pointer h-9 text-xs font-semibold w-full sm:w-auto"
              >
                {tax ? "حفظ التعديلات" : "إضافة البند الضريبي"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
