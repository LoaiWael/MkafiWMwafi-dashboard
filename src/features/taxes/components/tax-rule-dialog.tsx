import { useEffect, useState } from "react";
import {
  Edit2,
  Eye,
  Plus,
  SaudiRiyal,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

interface TaxRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tax: TaxSetting | null;
  onSave: (taxData: Partial<TaxSetting>, id?: string) => void;
}

export default function TaxRuleDialog({
  open,
  onOpenChange,
  tax,
  onSave,
}: TaxRuleDialogProps) {
  const [formData, setFormData] = useState<Partial<TaxSetting>>({
    nameAr: "",
    category: "vat",
    description: "",
    ratePercent: 15,
    isExempt: false,
    exemptionLabel: "معفى",
    appliesTo: "all",
    calculationType: "percentage",
    fixedAmount: 0,
    isActive: true,
  });

  useEffect(() => {
    if (tax) {
      setFormData({
        nameAr: tax.nameAr,
        category: tax.category,
        description: tax.description,
        ratePercent: tax.ratePercent,
        isExempt: tax.isExempt,
        exemptionLabel: tax.exemptionLabel,
        appliesTo: tax.appliesTo,
        calculationType: tax.calculationType,
        fixedAmount: tax.fixedAmount || 0,
        isActive: tax.isActive,
      });
    } else {
      setFormData({
        nameAr: "",
        category: "vat",
        description: "",
        ratePercent: 15,
        isExempt: false,
        exemptionLabel: "معفى",
        appliesTo: "all",
        calculationType: "percentage",
        fixedAmount: 0,
        isActive: true,
      });
    }
  }, [tax, open]);

  const handleSave = () => {
    if (!formData.nameAr?.trim()) {
      toast.error("يرجى إدخال مسمى الضريبة أو الرسوم");
      return;
    }

    onSave(
      {
        ...formData,
        nameAr: formData.nameAr.trim(),
        description: formData.description?.trim() || "",
        ratePercent: Number(formData.ratePercent) || 0,
        fixedAmount: Number(formData.fixedAmount) || 0,
      },
      tax?.id,
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-xl md:max-w-2xl p-0 overflow-hidden border-border shadow-xl flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] rounded-2xl">
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
                  value={formData.nameAr}
                  onChange={(e) =>
                    setFormData({ ...formData, nameAr: e.target.value })
                  }
                  placeholder="مثال: ضريبة القيمة المضافة أو ضريبة العقد السكني"
                  className="h-9 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tax-category" className="text-xs font-semibold">
                  تصنيف البند
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => {
                    if (val) {
                      setFormData((prev) => ({
                        ...prev,
                        category: val as TaxSetting["category"],
                      }));
                    }
                  }}
                >
                  <SelectTrigger id="tax-category" className="w-full h-9 text-xs">
                    <SelectValue />
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
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tax-applies" className="text-xs font-semibold">
                  نطاق السريان
                </Label>
                <Select
                  value={formData.appliesTo}
                  onValueChange={(val) => {
                    if (val) {
                      setFormData((prev) => ({
                        ...prev,
                        appliesTo: val as
                          | "all"
                          | "residential"
                          | "commercial",
                      }));
                    }
                  }}
                >
                  <SelectTrigger id="tax-applies" className="w-full h-9 text-xs">
                    <SelectValue />
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
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="tax-desc" className="text-xs font-semibold">
                  الوصف التوضيحي (يظهر في التفاصيل)
                </Label>
                <Input
                  id="tax-desc"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  placeholder="مثال: ضريبة القيمة المضافة الحكومية أو معفى للوحدات السكنية"
                  className="h-9 text-xs"
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
                  نوع الاحتساب
                </Label>
                <Select
                  value={formData.calculationType}
                  onValueChange={(val) => {
                    if (val) {
                      setFormData((prev) => ({
                        ...prev,
                        calculationType: val as "percentage" | "fixed",
                      }));
                    }
                  }}
                >
                  <SelectTrigger id="calc-type" className="w-full h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                    <SelectItem value="fixed">
                      مبلغ ثابت مقطوع (﷼)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.calculationType === "percentage" ? (
                <div className="space-y-1.5">
                  <Label htmlFor="tax-rate" className="text-xs font-semibold">
                    النسبة المئوية (%)
                  </Label>
                  <div className="relative">
                    <Input
                      id="tax-rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={formData.ratePercent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ratePercent: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-9 pe-8 text-sm font-bold"
                    />
                    <div className="pointer-events-none absolute inset-y-0 end-2.5 flex items-center text-xs font-bold text-muted-foreground">
                      %
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor="tax-fixed" className="text-xs font-semibold">
                    المبلغ الثابت
                  </Label>
                  <div className="relative">
                    <Input
                      id="tax-fixed"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.fixedAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fixedAmount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="h-9 pe-8 text-sm font-bold"
                    />
                    <div className="pointer-events-none absolute inset-y-0 end-2.5 flex items-center text-primary">
                      <SaudiRiyal className="size-3.5" />
                    </div>
                  </div>
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
                <Switch
                  id="is-exempt"
                  checked={formData.isExempt}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isExempt: checked })
                  }
                  className="scale-90 sm:scale-100"
                />
              </div>

              {formData.isExempt && (
                <div className="space-y-1.5 pt-2 border-t border-border/50">
                  <Label
                    htmlFor="exemption-label"
                    className="text-xs font-medium"
                  >
                    نص علامة الإعفاء
                  </Label>
                  <Input
                    id="exemption-label"
                    value={formData.exemptionLabel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        exemptionLabel: e.target.value,
                      })
                    }
                    placeholder="مثال: معفى أو 0%"
                    className="h-8 text-xs bg-background"
                  />
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
              <Switch
                id="is-active"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
                className="scale-90 sm:scale-100"
              />
            </div>
          </div>

          {/* Section 4: Mini Live Preview Pill */}
          <div className="rounded-xl border border-primary/20 bg-primary-50/40 p-2.5 sm:p-3 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 truncate">
              <Eye className="size-3.5 text-primary shrink-0" />
              <span className="font-semibold text-foreground truncate">
                {formData.nameAr || "اسم الضريبة"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                {formData.appliesTo === "residential"
                  ? "سكني"
                  : formData.appliesTo === "commercial"
                    ? "تجاري"
                    : "شامل"}
              </Badge>
              {formData.isExempt ? (
                <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
                  {formData.exemptionLabel || "معفى"}
                </Badge>
              ) : (
                <span className="font-bold text-primary">
                  {formData.calculationType === "percentage"
                    ? `${formData.ratePercent || 0}%`
                    : `${formData.fixedAmount || 0} ﷼`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/70 bg-muted/20 px-4 py-3 sm:px-6 sm:py-3.5 shrink-0">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer h-9 text-xs w-full sm:w-auto"
            >
              إلغاء
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="bg-linear-to-r from-primary-800 via-primary to-primary-400 text-primary-foreground shadow-md shadow-inner-primary hover:brightness-105 active:scale-98 cursor-pointer h-9 text-xs font-semibold w-full sm:w-auto"
            >
              {tax ? "حفظ التعديلات" : "إضافة البند الضريبي"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
