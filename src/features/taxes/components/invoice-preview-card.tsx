import { useMemo, useState } from "react";
import {
  Banknote,
  Building,
  Clock,
  Home,
  Percent,
  Receipt,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaxSetting } from "@/features/taxes/constants";
import { CONTRACT_PRICING_PLANS, type PricingPlan } from "@/features/pricing/constants";

interface InvoicePreviewCardProps {
  taxes: TaxSetting[];
}

export default function InvoicePreviewCard({ taxes }: InvoicePreviewCardProps) {
  const [contractType, setContractType] = useState<"residential" | "commercial">("residential");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("2-years");

  const plans: readonly PricingPlan[] = CONTRACT_PRICING_PLANS;

  const selectedPlan = useMemo(() => {
    return plans.find((p) => p.id === selectedPlanId) || plans[3] || plans[0];
  }, [plans, selectedPlanId]);

  // Calculate taxes and breakdown
  const calculation = useMemo(() => {
    const baseAmount = selectedPlan?.amount || 399;

    // Filter applicable active taxes
    const applicableTaxes = taxes
      .filter((tax) => tax.isActive)
      .filter((tax) => {
        if (tax.appliesTo === "all") return true;
        return tax.appliesTo === contractType;
      })
      .sort((a, b) => a.order - b.order);

    let calculatedTaxTotal = 0;

    const breakdown = applicableTaxes.map((tax) => {
      let taxAmount = 0;
      if (!tax.isExempt) {
        if (tax.calculationType === "percentage") {
          taxAmount = Math.round(((baseAmount * tax.ratePercent) / 100) * 100) / 100;
        } else {
          taxAmount = tax.fixedAmount || 0;
        }
      }
      calculatedTaxTotal += taxAmount;

      return {
        id: tax.id,
        name: tax.nameAr,
        category: tax.category,
        description: tax.description,
        ratePercent: tax.ratePercent,
        isExempt: tax.isExempt,
        exemptionLabel: tax.exemptionLabel,
        amount: taxAmount,
      };
    });

    const finalTotal = baseAmount + calculatedTaxTotal;

    return {
      baseAmount,
      breakdown,
      taxTotal: calculatedTaxTotal,
      finalTotal,
    };
  }, [selectedPlan, taxes, contractType]);

  return (
    <div className="space-y-4">
      {/* Simulation Controls Toolbar */}
      <Card className="border-border/80 bg-muted/40 shadow-xs">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span className="text-xs font-semibold text-foreground">
                تجربة المحاكي المباشر:
              </span>
            </div>

            {/* Contract Type Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
              <Button
                type="button"
                size="sm"
                variant={contractType === "residential" ? "primary" : "ghost"}
                className="h-7 gap-1 px-3 text-xs"
                onClick={() => setContractType("residential")}
              >
                <Home className="size-3.5" />
                <span>عقد سكني</span>
              </Button>
              <Button
                type="button"
                size="sm"
                variant={contractType === "commercial" ? "primary" : "ghost"}
                className="h-7 gap-1 px-3 text-xs"
                onClick={() => setContractType("commercial")}
              >
                <Building className="size-3.5" />
                <span>عقد تجاري</span>
              </Button>
            </div>

            {/* Duration Selector */}
            <div className="flex items-center gap-2">
              <Label htmlFor="plan-select" className="text-xs text-muted-foreground whitespace-nowrap">
                مدة العقد:
              </Label>
              <Select
                value={selectedPlanId}
                onValueChange={(val) => {
                  if (val) setSelectedPlanId(val);
                }}
              >
                <SelectTrigger id="plan-select" className="h-8 w-44 bg-card text-xs">
                  <SelectValue placeholder="اختر مدة العقد" />
                </SelectTrigger>
                <SelectContent align="end">
                  {plans.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-xs">
                      {p.duration} — ({p.amount} ر.س)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="outline" className="gap-1 border-primary/30 text-primary text-xs">
              <ShieldCheck className="size-3" />
              <span>معاينة حية للمستخدم النهائي</span>
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Invoice Review Card Container */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          مراجعة الحساب وتأكيد السداد
        </h2>

        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs sm:p-7 space-y-4">
          {/* Header Row: ملخص الفاتورة والرسوم */}
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                <Receipt className="size-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-foreground">
                  ملخص الفاتورة والرسوم
                </h3>
                <p className="text-xs text-muted-foreground">
                  بيان الرسوم المستحقة لتوثيق العقد الإلكتروني
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className="gap-1.5 rounded-full border-primary/30 bg-primary-50/50 px-3 py-1 text-xs font-semibold text-primary"
            >
              <ShieldCheck className="size-3.5 text-primary" />
              <span>إيجار معتمد</span>
            </Badge>
          </div>

          {/* Row 1: ضريبة القيمة المضافة الحكومية (General VAT) */}
          {calculation.breakdown
            .filter((tax) => tax.category === "vat")
            .map((vat) => (
              <div
                key={vat.id}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <Percent className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-foreground">{vat.name}</h4>
                    <p className="text-xs text-muted-foreground">{vat.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-end">
                  <span className="text-xs font-medium text-muted-foreground">
                    {vat.isExempt ? vat.exemptionLabel : `${vat.ratePercent}%`}
                  </span>
                  <div className="flex items-baseline gap-1 text-sm font-bold text-foreground">
                    <span>{vat.amount}</span>
                    <span className="text-xs font-normal text-muted-foreground">﷼</span>
                  </div>
                </div>
              </div>
            ))}

          {/* Row 2: Contract Duration & Ejar Fees (مدة العقد) */}
          <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary-50/35 p-3.5 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Clock className="size-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-foreground sm:text-base">
                  مدة العقد {selectedPlan?.duration} (اجمالي الرسوم {selectedPlan?.amount})
                </h4>
                <p className="text-xs text-muted-foreground">
                  رسوم توثيق العقد المعتمد في منصة إيجار
                </p>
              </div>
            </div>

            <div className="text-end">
              <div className="flex items-baseline gap-1 text-base font-bold text-foreground sm:text-lg">
                <span>{selectedPlan?.amount}</span>
                <span className="text-xs font-normal text-muted-foreground">﷼</span>
              </div>
            </div>
          </div>

          {/* Row 3: Contract Tax (ضريبة العقد السكني / التجاري) */}
          {calculation.breakdown
            .filter((tax) => tax.category === "contract_tax")
            .map((contractTax) => (
              <div
                key={contractTax.id}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <Percent className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-foreground">
                      {contractTax.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {contractTax.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-end">
                  {contractTax.isExempt ? (
                    <Badge
                      variant="secondary"
                      className="bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                    >
                      {contractTax.exemptionLabel || "معفى"}
                    </Badge>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">
                      {contractTax.ratePercent}%
                    </span>
                  )}
                  <div className="flex items-baseline gap-1 text-sm font-bold text-foreground">
                    <span>{contractTax.amount}</span>
                    <span className="text-xs font-normal text-muted-foreground">﷼</span>
                  </div>
                </div>
              </div>
            ))}

          {/* Other custom taxes / fees if any */}
          {calculation.breakdown
            .filter((tax) => tax.category !== "vat" && tax.category !== "contract_tax")
            .map((customTax) => (
              <div
                key={customTax.id}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary">
                    <Banknote className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-foreground">{customTax.name}</h4>
                    <p className="text-xs text-muted-foreground">{customTax.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-end">
                  <div className="flex items-baseline gap-1 text-sm font-bold text-foreground">
                    <span>{customTax.amount}</span>
                    <span className="text-xs font-normal text-muted-foreground">﷼</span>
                  </div>
                </div>
              </div>
            ))}

          {/* Bottom Total Container (الاجمالي المبلغ النهائي للدفع) */}
          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border/80 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <Wallet className="size-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-base font-extrabold text-foreground sm:text-lg">
                    الاجمالي
                  </h4>
                  <span className="text-xs font-normal text-muted-foreground">
                    (المبلغ النهائي للدفع)
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  شامل جميع رسوم الخدمة والتوثيق المعتمدة
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="flex items-baseline gap-1.5 rounded-xl border border-primary/30 bg-primary-50/50 px-5 py-2">
                <span className="text-2xl font-black text-primary sm:text-3xl">
                  {calculation.finalTotal}
                </span>
                <span className="text-sm font-bold text-primary">﷼</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
