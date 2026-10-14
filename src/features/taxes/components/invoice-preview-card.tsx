import { useState } from "react";
import {
  Building2,
  CircleDollarSign,
  Clock,
  Home,
  Percent,
  Receipt,
  SaudiRiyal,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FadeIn } from "@/components/animations";
import type { TaxSetting } from "../types";
import { usePricingPlans } from "@/features/pricing/hooks/use-pricing-plans";

interface InvoicePreviewCardProps {
  taxes: TaxSetting[];
}

export default function InvoicePreviewCard({ taxes }: InvoicePreviewCardProps) {
  const [contractType, setContractType] = useState<
    "residential" | "commercial"
  >("residential");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  const { plans: allPlans, isLoading: isPlansLoading } = usePricingPlans();
  const plans = allPlans.filter(
    (p) => p.contractType === contractType && p.isActive,
  );
  const selectedPlan =
    plans.find((p) => p.id === selectedPlanId) || plans[0] || null;

  const basePrice = selectedPlan ? selectedPlan.amount : 0;
  const durationLabel = selectedPlan ? selectedPlan.duration : "—";

  // Filter applicable active taxes
  const applicableTaxes = taxes
    .filter((tax) => tax.isActive)
    .filter((tax) => {
      if (tax.appliesTo === "all") return true;
      return tax.appliesTo === contractType;
    })
    .sort((a, b) => a.order - b.order);

  const breakdown = applicableTaxes.map((tax) => {
    let taxAmount = 0;
    if (!tax.isExempt) {
      if (tax.calculationType === "percentage") {
        taxAmount =
          Math.round(((basePrice * tax.ratePercent) / 100) * 100) / 100;
      } else {
        taxAmount = tax.fixedAmount || 0;
      }
    }

    return {
      id: tax.id,
      name: tax.nameAr,
      calculationType: tax.calculationType,
      description: tax.description,
      ratePercent: tax.ratePercent,
      isExempt: tax.isExempt,
      exemptionLabel: tax.exemptionLabel,
      amount: taxAmount,
    };
  });

  const calculatedTaxTotal = breakdown.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const finalPrice = basePrice + calculatedTaxTotal;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col space-y-4 sm:space-y-6">
      {/* Simulation Controls Toolbar & Optimized Tabs */}
      <FadeIn duration={0.3}>
        <Card className="border-border/80 bg-card shadow-xs overflow-hidden">
          <CardContent className="p-3.5 sm:p-5">
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
              {/* Contract Type Segmented Tabs */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-3.5 sm:size-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">
                    نوع العقد للتجربة والمحاكاة:
                  </span>
                </div>

                <div className="grid grid-cols-2 rounded-xl border border-border bg-muted/40 p-1 gap-1 sm:inline-flex">
                  <button
                    type="button"
                    onClick={() => setContractType("residential")}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                      contractType === "residential"
                        ? "bg-linear-to-r from-primary-800 via-primary to-primary-400 text-primary-foreground shadow-md shadow-inner-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Home className="size-3.5 sm:size-4 shrink-0" />
                    <span>عقد سكني</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContractType("commercial")}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                      contractType === "commercial"
                        ? "bg-linear-to-r from-primary-800 via-primary to-primary-400 text-primary-foreground shadow-md shadow-inner-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Building2 className="size-3.5 sm:size-4 shrink-0" />
                    <span>عقد تجاري</span>
                  </button>
                </div>
              </div>

              {/* Duration Selector */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label
                  htmlFor="plan-select"
                  className="text-xs font-bold text-foreground block"
                >
                  مدة العقد المعتمدة:
                </Label>
                <Select
                  value={selectedPlan?.id || ""}
                  onValueChange={(val) => {
                    if (val) setSelectedPlanId(val);
                  }}
                  disabled={isPlansLoading || plans.length === 0}
                >
                  <SelectTrigger
                    id="plan-select"
                    className="h-9 sm:h-9.5 w-full sm:w-60 bg-background text-xs font-semibold"
                  >
                    <SelectValue
                      placeholder={
                        isPlansLoading
                          ? "جاري تحميل الباقات..."
                          : plans.length === 0
                            ? "لا توجد باقات متاحة"
                            : "اختر مدة العقد"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {plans.map((p) => (
                      <SelectItem
                        key={p.id}
                        value={p.id}
                        className="text-xs font-medium py-2"
                      >
                        <div className="flex items-center justify-between w-full gap-3">
                          <span className="font-bold">{p.duration}</span>
                          <div className="flex items-center gap-1 text-primary font-bold">
                            <span>{p.amount.toLocaleString("en-US")}</span>
                            <SaudiRiyal className="size-3 shrink-0" />
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      {/* Header */}
      <FadeIn duration={0.3} delay={0.05}>
        <div className="space-y-1 text-center sm:text-start">
          <h2 className="text-lg font-extrabold text-primary-950 sm:text-2xl tracking-tight">
            مراجعة الحساب وتأكيد السداد
          </h2>
        </div>
      </FadeIn>

      <FadeIn duration={0.3} delay={0.1}>
        <div className="space-y-4 sm:space-y-6">
          {/* Luxury Itemized Financial Summary Card */}
          <div className="rounded-2xl border border-border/80 bg-card p-3 sm:p-6 shadow-xs relative overflow-hidden sm:rounded-3xl">
            {/* Top Bar of the Card */}
            <div className="flex items-center justify-between gap-2.5 border-b border-border/60 pb-3 sm:pb-4">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex size-8 sm:size-10 items-center justify-center rounded-xl bg-primary-50 text-primary border border-primary-100 shrink-0 sm:rounded-2xl">
                  <Receipt className="size-4 sm:size-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-base font-bold text-foreground truncate">
                    ملخص الفاتورة والرسوم
                  </h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    بيان الرسوم المستحقة لتوثيق العقد الإلكتروني
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-foreground border border-border/50 shrink-0 sm:px-3 sm:py-1 sm:gap-1.5">
                <ShieldCheck className="size-3 sm:size-3.5 text-primary" />
                <span>إيجار معتمد</span>
              </div>
            </div>

            {/* Itemized Line Items */}
            <div className="divide-y divide-border/50 pt-1.5 sm:pt-2 text-start">
              {/* Duration and Fees (مدة العقد) - Base price row */}
              <div className="flex items-center justify-between gap-2 py-2 sm:py-3 bg-primary-50/40 border border-primary-200/50 px-2 sm:px-3 rounded-xl my-1">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <span className="flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Clock className="size-3 sm:size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-bold text-primary-950 truncate block">
                      مدة العقد {durationLabel} (اجمالي الرسوم {basePrice})
                    </span>
                    <p className="text-[10px] sm:text-[11px] text-primary-700 font-medium truncate">
                      رسوم توثيق العقد المعتمد في منصة إيجار
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-extrabold text-primary-900 text-xs sm:text-base shrink-0">
                  <span>{basePrice.toLocaleString("en-US")}</span>
                  <SaudiRiyal
                    className="size-3 sm:size-4 text-primary-900"
                    aria-label="ريال سعودي"
                  />
                </div>
              </div>

              {/* Dynamic Taxes & Fees */}
              {breakdown.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 py-2 sm:py-3.5 transition-colors hover:bg-muted/20 px-1 sm:px-2 rounded-xl"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className="flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {item.calculationType === "percentage" ? (
                        <Percent className="size-3 sm:size-3.5" />
                      ) : (
                        <SaudiRiyal className="size-3 sm:size-3.5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs sm:text-sm font-semibold text-foreground truncate block">
                        {item.name}
                      </span>
                      {item.description && (
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className="inline-block rounded-md bg-muted/70 px-1.5 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground">
                      {item.isExempt
                        ? item.exemptionLabel || "معفى"
                        : item.calculationType === "percentage"
                          ? `${item.ratePercent}%`
                          : `${item.amount} ر.س`}
                    </span>
                    <div className="flex items-center gap-1 text-xs sm:text-base font-bold text-foreground">
                      <span>{item.amount.toLocaleString("en-US")}</span>
                      <SaudiRiyal
                        className="size-3 sm:size-4 text-foreground/80"
                        aria-label="ريال سعودي"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Box (الاجمالي) */}
            <div className="mt-3 sm:mt-4 rounded-2xl bg-muted/50 border border-border/80 p-3 sm:p-4.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3 text-start min-w-0">
                <div className="flex size-8 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                  <CircleDollarSign className="size-4.5 sm:size-5.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-base font-extrabold text-foreground">
                      الاجمالي
                    </span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-normal">
                      (المبلغ النهائي للدفع)
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    شامل جميع رسوم الخدمة والتوثيق المعتمدة
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 border-t border-border/50 sm:pt-0 sm:border-0">
                <div className="flex items-center justify-center gap-1.5 rounded-xl bg-card px-3 py-1.5 sm:px-4 sm:py-2 border border-border shadow-2xs w-full sm:w-auto">
                  <span className="text-lg sm:text-2xl font-black text-primary tracking-tight">
                    {finalPrice.toLocaleString("en-US")}
                  </span>
                  <SaudiRiyal
                    className="size-4 sm:size-5 text-primary"
                    aria-label="ريال سعودي"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
