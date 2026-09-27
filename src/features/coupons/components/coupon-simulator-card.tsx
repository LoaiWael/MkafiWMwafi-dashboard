import { useId, useMemo, useState } from "react";
import {
  AlertCircle,
  Building2,
  Calculator,
  CheckCircle2,
  Home,
  Sparkles,
  Tag,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Coupon } from "@/features/coupons/constants";

interface CouponSimulatorCardProps {
  coupons: Coupon[];
  selectedCodePreset?: string;
}

export default function CouponSimulatorCard({
  coupons,
  selectedCodePreset = "",
}: CouponSimulatorCardProps) {
  const codeId = useId();
  const [contractType, setContractType] = useState<"residential" | "commercial">("residential");
  const [contractPrice, setContractPrice] = useState<number>(249);
  const [couponCodeInput, setCouponCodeInput] = useState<string>(selectedCodePreset);

  const activeCoupon = useMemo(() => {
    const trimmed = couponCodeInput.trim().toUpperCase();
    if (!trimmed) return null;
    return coupons.find((c) => c.code.toUpperCase() === trimmed) || null;
  }, [couponCodeInput, coupons]);

  // Validation & Calculation
  const simulation = useMemo(() => {
    if (!couponCodeInput.trim()) {
      return {
        isValid: false,
        message: "أدخل رمز الكوبون لمعاينة الخصم والحسبة الضريبية",
        discountAmount: 0,
        subtotalAfterDiscount: contractPrice,
        vatAmount: contractType === "residential" ? 0 : Number((contractPrice * 0.15).toFixed(2)),
        total:
          contractType === "residential"
            ? contractPrice
            : Number((contractPrice * 1.15).toFixed(2)),
      };
    }

    if (!activeCoupon) {
      return {
        isValid: false,
        isError: true,
        message: "رمز الكوبون غير موجود في النظام أو غير مسجل",
        discountAmount: 0,
        subtotalAfterDiscount: contractPrice,
        vatAmount: contractType === "residential" ? 0 : Number((contractPrice * 0.15).toFixed(2)),
        total:
          contractType === "residential"
            ? contractPrice
            : Number((contractPrice * 1.15).toFixed(2)),
      };
    }

    if (activeCoupon.status !== "active") {
      const statusLabels: Record<string, string> = {
        inactive: "الكوبون معطل حالياً من قِبل الإدارة",
        expired: "الكوبون منتهي الصلاحية",
        scheduled: "الكوبون مجدول ولم يبدأ تفعيله بعد",
      };
      return {
        isValid: false,
        isError: true,
        message: statusLabels[activeCoupon.status] || "الكوبون غير نشط",
        discountAmount: 0,
        subtotalAfterDiscount: contractPrice,
        vatAmount: contractType === "residential" ? 0 : Number((contractPrice * 0.15).toFixed(2)),
        total:
          contractType === "residential"
            ? contractPrice
            : Number((contractPrice * 1.15).toFixed(2)),
      };
    }

    // Check target services
    if (
      !activeCoupon.targetServices.includes("all") &&
      !activeCoupon.targetServices.includes(contractType)
    ) {
      return {
        isValid: false,
        isError: true,
        message: `هذا الكوبون مخصص لـ (${
          activeCoupon.targetServices.includes("residential")
            ? "العقود السكنية فقط"
            : "العقود التجارية فقط"
        }) ولا يسري على ${contractType === "residential" ? "السكني" : "التجاري"}`,
        discountAmount: 0,
        subtotalAfterDiscount: contractPrice,
        vatAmount: contractType === "residential" ? 0 : Number((contractPrice * 0.15).toFixed(2)),
        total:
          contractType === "residential"
            ? contractPrice
            : Number((contractPrice * 1.15).toFixed(2)),
      };
    }

    // Check minimum order amount
    if (contractPrice < activeCoupon.minOrderAmount) {
      return {
        isValid: false,
        isError: true,
        message: `الحد الأدنى للاستفادة من هذا الكوبون هو ${activeCoupon.minOrderAmount} ر.س`,
        discountAmount: 0,
        subtotalAfterDiscount: contractPrice,
        vatAmount: contractType === "residential" ? 0 : Number((contractPrice * 0.15).toFixed(2)),
        total:
          contractType === "residential"
            ? contractPrice
            : Number((contractPrice * 1.15).toFixed(2)),
      };
    }

    // Calculate discount
    const calculatedDiscount =
      activeCoupon.discountType === "percentage"
        ? Math.min(
            (contractPrice * activeCoupon.discountValue) / 100,
            activeCoupon.maxDiscountAmount ?? Infinity
          )
        : Math.min(activeCoupon.discountValue, contractPrice);

    const discount = Number(calculatedDiscount.toFixed(2));
    const subtotalAfterDiscount = Math.max(0, Number((contractPrice - discount).toFixed(2)));
    // VAT: residential exempt in KSA (ZATCA rental exemption), commercial is standard 15%
    const vatRate = contractType === "residential" ? 0 : 0.15;
    const vatAmount = Number((subtotalAfterDiscount * vatRate).toFixed(2));
    const total = Number((subtotalAfterDiscount + vatAmount).toFixed(2));

    return {
      isValid: true,
      isError: false,
      message: `تم تطبيق كود الخصم بنجاح (${activeCoupon.name})`,
      discountAmount: discount,
      subtotalAfterDiscount,
      vatAmount,
      total,
    };
  }, [activeCoupon, contractPrice, contractType, couponCodeInput]);

  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Calculator className="size-5 text-primary" />
            <span>محاكي واختبار الخصومات</span>
          </CardTitle>
          <Badge variant="secondary" className="gap-1.5 font-medium">
            <Sparkles className="size-3.5" />
            <span>معاينة فورية للمشتريات</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Contract Type Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">نوع عقد الإيجار المراد تجربة الكوبون عليه</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setContractType("residential")}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition-all ${
                contractType === "residential"
                  ? "border-primary bg-primary-50 text-primary-900 shadow-xs"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <Home className="size-4" />
              <span>عقد سكني (معفى من الضريبة)</span>
            </button>

            <button
              type="button"
              onClick={() => setContractType("commercial")}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition-all ${
                contractType === "commercial"
                  ? "border-primary bg-primary-50 text-primary-900 shadow-xs"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <Building2 className="size-4" />
              <span>عقد تجاري (ضريبة 15%)</span>
            </button>
          </div>
        </div>

        {/* Contract Price Preset buttons & input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="contract-price" className="text-sm font-semibold">
              قيمة رسوم التوثيق الأساسية (ر.س)
            </Label>
            <div className="flex gap-1.5">
              {[249, 399, 599, 950].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setContractPrice(preset)}
                  className={`rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors ${
                    contractPrice === preset
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {preset} ر.س
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Input
              id="contract-price"
              type="number"
              min={1}
              value={contractPrice}
              onChange={(e) => setContractPrice(Math.max(1, Number(e.target.value)))}
              className="pe-12 font-bold"
            />
            <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
              ر.س
            </span>
          </div>
        </div>

        {/* Coupon Code Input */}
        <div className="space-y-2">
          <Label htmlFor={codeId} className="text-sm font-semibold">
            رمز الكوبون للتجربة
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id={codeId}
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                placeholder="مثال: RAMADAN2026"
                className="font-mono text-base font-bold uppercase tracking-wider text-primary"
                dir="ltr"
              />
              <Tag className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {couponCodeInput ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCouponCodeInput("")}
                className="h-10"
              >
                مسح
              </Button>
            ) : null}
          </div>

          {/* Quick pick chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-muted-foreground">كوبونات نشطة:</span>
            {coupons
              .filter((c) => c.status === "active")
              .slice(0, 4)
              .map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCouponCodeInput(c.code)}
                  className="rounded-md border border-dashed border-primary/40 bg-primary-50/50 px-2 py-0.5 font-mono text-[11px] font-bold text-primary hover:bg-primary-100"
                >
                  {c.code}
                </button>
              ))}
          </div>
        </div>

        {/* Status Message */}
        <div
          className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed ${
            simulation.isValid
              ? "border-emerald-500/20 bg-emerald-50/50 text-emerald-800"
              : simulation.isError
              ? "border-destructive/20 bg-destructive/10 text-destructive"
              : "border-border bg-muted/40 text-muted-foreground"
          }`}
        >
          {simulation.isValid ? (
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : simulation.isError ? (
            <XCircle className="size-4 text-destructive shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="size-4 text-muted-foreground shrink-0 mt-0.5" />
          )}
          <span>{simulation.message}</span>
        </div>

        {/* Calculation Invoice Simulation Receipt */}
        <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/80">
            <span className="font-semibold text-muted-foreground">تفاصيل الحسبة التقديرية</span>
            <span className="text-[11px] text-muted-foreground">
              {contractType === "residential" ? "عقد سكني معتمد" : "عقد تجاري معتمد"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">رسوم العقد الأصلية</span>
            <span className="font-semibold text-foreground">{contractPrice.toFixed(2)} ر.س</span>
          </div>

          <div className="flex items-center justify-between text-emerald-600">
            <span className="font-medium">الخصم المطبق</span>
            <span className="font-bold">
              {simulation.discountAmount > 0 ? `-${simulation.discountAmount.toFixed(2)}` : "0.00"} ر.س
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">المبلغ بعد الخصم</span>
            <span className="font-semibold text-foreground">
              {simulation.subtotalAfterDiscount.toFixed(2)} ر.س
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              ضريبة القيمة المضافة ({contractType === "residential" ? "0%" : "15%"})
            </span>
            <span className="font-semibold text-foreground">
              {simulation.vatAmount.toFixed(2)} ر.س
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border font-bold text-sm">
            <span className="text-foreground">الإجمالي المستحق للدفع</span>
            <span className="text-base text-primary font-black">
              {simulation.total.toFixed(2)} ر.س
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
