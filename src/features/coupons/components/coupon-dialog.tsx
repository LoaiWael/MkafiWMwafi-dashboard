import { useState } from "react";
import {
  DollarSign,
  Percent,
  RefreshCw,
  Sparkles,
  Tag,
} from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  type Coupon,
  type CouponDiscountType,
  type CouponStatus,
  type TargetService,
  type TargetUserType,
} from "@/features/coupons/constants";

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
  onSave: (couponData: Omit<Coupon, "id" | "createdAt" | "createdBy" | "usedCount" | "totalDiscountedAmount"> & { id?: string }) => void;
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
  onSave: (couponData: Omit<Coupon, "id" | "createdAt" | "createdBy" | "usedCount" | "totalDiscountedAmount"> & { id?: string }) => void;
}) {
  const isEditing = Boolean(coupon);

  const [code, setCode] = useState(() => (coupon ? coupon.code : generateRandomCouponCode()));
  const [name, setName] = useState(() => (coupon ? coupon.name : ""));
  const [description, setDescription] = useState(() => (coupon ? coupon.description : ""));
  const [discountType, setDiscountType] = useState<CouponDiscountType>(() => (coupon ? coupon.discountType : "percentage"));
  const [discountValue, setDiscountValue] = useState<number>(() => (coupon ? coupon.discountValue : 20));
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | undefined>(() => (coupon ? coupon.maxDiscountAmount : 100));
  const [minOrderAmount, setMinOrderAmount] = useState<number>(() => (coupon ? coupon.minOrderAmount : 200));
  const [targetServices, setTargetServices] = useState<TargetService[]>(() => (coupon ? coupon.targetServices : ["residential", "commercial"]));
  const [targetUserType, setTargetUserType] = useState<TargetUserType>(() => (coupon ? coupon.targetUserType : "all"));
  const [hasUsageLimit, setHasUsageLimit] = useState<boolean>(() => (coupon ? coupon.usageLimitTotal !== undefined : true));
  const [usageLimitTotal, setUsageLimitTotal] = useState<number | undefined>(() => (coupon ? coupon.usageLimitTotal : 500));
  const [usageLimitPerUser, setUsageLimitPerUser] = useState<number>(() => (coupon ? coupon.usageLimitPerUser : 1));
  const [status, setStatus] = useState<CouponStatus>(() => (coupon ? coupon.status : "active"));
  const [startDate, setStartDate] = useState(() => (coupon ? coupon.startDate : getDefaultDates().todayStr));
  const [endDate, setEndDate] = useState(() => (coupon ? coupon.endDate : getDefaultDates().nextMonthStr));
  const [isPublic, setIsPublic] = useState(() => (coupon ? coupon.isPublic : true));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleGenerateCode() {
    setCode(generateRandomCouponCode());
  }

  function toggleService(service: TargetService) {
    if (targetServices.includes(service)) {
      if (targetServices.length > 1) {
        setTargetServices(targetServices.filter((s) => s !== service));
      }
    } else {
      setTargetServices([...targetServices, service]);
    }
  }

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!code.trim()) {
      newErrors.code = "رمز الكوبون مطلوب";
    } else if (code.trim().length < 3) {
      newErrors.code = "رمز الكوبون يجب أن يكون 3 أحرف على الأقل";
    }

    if (!name.trim()) {
      newErrors.name = "اسم الكوبون مطلوب";
    }

    if (discountValue <= 0) {
      newErrors.discountValue = "قيمة الخصم يجب أن تكون أكبر من الصفر";
    } else if (discountType === "percentage" && discountValue > 100) {
      newErrors.discountValue = "نسبة الخصم لا يمكن أن تتجاوز 100%";
    }

    if (minOrderAmount < 0) {
      newErrors.minOrderAmount = "الحد الأدنى لا يمكن أن يكون سالباً";
    }

    if (!startDate) {
      newErrors.startDate = "تاريخ البدء مطلوب";
    }

    if (!endDate) {
      newErrors.endDate = "تاريخ الانتهاء مطلوب";
    } else if (startDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      id: coupon?.id,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      discountType,
      discountValue: Number(discountValue),
      maxDiscountAmount:
        discountType === "percentage" && maxDiscountAmount
          ? Number(maxDiscountAmount)
          : undefined,
      minOrderAmount: Number(minOrderAmount),
      targetServices,
      targetUserType,
      usageLimitTotal: hasUsageLimit && usageLimitTotal ? Number(usageLimitTotal) : undefined,
      usageLimitPerUser: Number(usageLimitPerUser) || 1,
      status,
      startDate,
      endDate,
      isPublic,
    });

    onClose();
  }

  return (
    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto sm:max-h-[85vh]">
      <form onSubmit={handleSubmit} className="space-y-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Tag className="size-5 text-primary" />
            <span>{isEditing ? "تعديل بيانات الكوبون" : "إنشاء كوبون خصم جديد"}</span>
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "تعديل معايير وشروط تطبيق كود الخصم في النظام"
              : "حدد رمز الخصم ونوعه وشروط الاستحقاق لتوثيق العقود السكنية والتجارية"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Coupon Code & Generate Button */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="coupon-code" className="flex items-center justify-between text-sm font-semibold">
                <span>رمز الكوبون (الكود) <span className="text-destructive">*</span></span>
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <RefreshCw className="size-3" />
                  <span>توليد تلقائي</span>
                </button>
              </Label>
              <div className="relative">
                <Input
                  id="coupon-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="مثال: RAMADAN2026"
                  className="font-mono text-base font-bold tracking-wider uppercase text-primary"
                  dir="ltr"
                />
              </div>
              {errors.code ? (
                <p className="text-xs text-destructive">{errors.code}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coupon-name" className="text-sm font-semibold">
                اسم العرض / الكوبون <span className="text-destructive">*</span>
              </Label>
              <Input
                id="coupon-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: خصم شهر رمضان المبارك"
              />
              {errors.name ? (
                <p className="text-xs text-destructive">{errors.name}</p>
              ) : null}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="coupon-desc" className="text-sm font-semibold">
              وصف الكوبون والشروط الترويجية
            </Label>
            <Textarea
              id="coupon-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب نبذة توضيحية عن العرض والجمهور المستهدف..."
              className="resize-none"
            />
          </div>

          {/* Discount Type & Value */}
          <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">نوع الخصم وقيمته</Label>
              <RadioGroup
                value={discountType}
                onValueChange={(val) => setDiscountType(val as CouponDiscountType)}
                className="grid grid-cols-2 gap-3"
              >
                <label
                  htmlFor="type-percentage"
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                    discountType === "percentage"
                      ? "border-primary bg-primary-50 text-primary-900 font-semibold"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="percentage" id="type-percentage" />
                    <div className="flex items-center gap-1.5">
                      <Percent className="size-4 text-primary" />
                      <span className="text-sm">نسبة مئوية (%)</span>
                    </div>
                  </div>
                </label>

                <label
                  htmlFor="type-fixed"
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                    discountType === "fixed"
                      ? "border-primary bg-primary-50 text-primary-900 font-semibold"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="fixed" id="type-fixed" />
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="size-4 text-primary" />
                      <span className="text-sm">مبلغ ثابت (ريال)</span>
                    </div>
                  </div>
                </label>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="discount-val" className="text-xs font-semibold text-muted-foreground">
                  {discountType === "percentage" ? "نسبة الخصم المئوية (%)" : "قيمة الخصم المباشر (ر.س)"}
                </Label>
                <div className="relative">
                  <Input
                    id="discount-val"
                    type="number"
                    min={1}
                    max={discountType === "percentage" ? 100 : undefined}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="font-bold pe-12"
                  />
                  <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    {discountType === "percentage" ? "%" : "ر.س"}
                  </span>
                </div>
                {errors.discountValue ? (
                  <p className="text-xs text-destructive">{errors.discountValue}</p>
                ) : null}
              </div>

              {discountType === "percentage" ? (
                <div className="space-y-2">
                  <Label htmlFor="max-discount" className="text-xs font-semibold text-muted-foreground">
                    الحد الأقصى للخصم (ر.س) - اختياري
                  </Label>
                  <div className="relative">
                    <Input
                      id="max-discount"
                      type="number"
                      min={1}
                      value={maxDiscountAmount || ""}
                      onChange={(e) =>
                        setMaxDiscountAmount(e.target.value ? Number(e.target.value) : undefined)
                      }
                      placeholder="غير محدد"
                      className="pe-12"
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      ر.س
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="min-order" className="text-xs font-semibold text-muted-foreground">
                    الحد الأدنى لقيمة العقد (ر.س)
                  </Label>
                  <div className="relative">
                    <Input
                      id="min-order"
                      type="number"
                      min={0}
                      value={minOrderAmount}
                      onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                      className="pe-12"
                    />
                    <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      ر.س
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Applicable Services & Target Audience */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">العقود المشمولة بالخصم</Label>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => toggleService("residential")}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    targetServices.includes("residential")
                      ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  العقود السكنية
                </button>
                <button
                  type="button"
                  onClick={() => toggleService("commercial")}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    targetServices.includes("commercial")
                      ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  العقود التجارية
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-user" className="text-sm font-semibold">
                الفئة المستهدفة
              </Label>
              <select
                id="target-user"
                value={targetUserType}
                onChange={(e) => setTargetUserType(e.target.value as TargetUserType)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">جميع العملاء (عام)</option>
                <option value="individual">الأفراد والمستأجرين فقط</option>
                <option value="broker">الوسطاء العقاريون المعتمدون (فال)</option>
                <option value="company">الشركات والمؤسسات</option>
              </select>
            </div>
          </div>

          {/* Usage Limits */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="limit-switch" className="text-sm font-semibold cursor-pointer">
                  تحديد حد أقصى لعدد مرات الاستخدام
                </Label>
                <p className="text-xs text-muted-foreground">
                  إيقاف الكوبون تلقائياً عند استهلاك كامل السعة المخصصة
                </p>
              </div>
              <Switch
                id="limit-switch"
                checked={hasUsageLimit}
                onCheckedChange={setHasUsageLimit}
              />
            </div>

            {hasUsageLimit ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-border">
                <div className="space-y-1.5">
                  <Label htmlFor="limit-total" className="text-xs text-muted-foreground">
                    إجمالي عدد مرات الاستخدام المتاحة
                  </Label>
                  <Input
                    id="limit-total"
                    type="number"
                    min={1}
                    value={usageLimitTotal || ""}
                    onChange={(e) => setUsageLimitTotal(Number(e.target.value))}
                    placeholder="مثال: 500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="limit-user" className="text-xs text-muted-foreground">
                    الحد الأقصى لكل مستخدم / عميل
                  </Label>
                  <Input
                    id="limit-user"
                    type="number"
                    min={1}
                    value={usageLimitPerUser}
                    onChange={(e) => setUsageLimitPerUser(Number(e.target.value))}
                    placeholder="مثال: 1"
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* Dates & Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-sm font-semibold">
                تاريخ بدء الصلاحية <span className="text-destructive">*</span>
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              {errors.startDate ? (
                <p className="text-xs text-destructive">{errors.startDate}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-sm font-semibold">
                تاريخ انتهاء الصلاحية <span className="text-destructive">*</span>
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              {errors.endDate ? (
                <p className="text-xs text-destructive">{errors.endDate}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coupon-status" className="text-sm font-semibold">
                حالة الكوبون
              </Label>
              <select
                id="coupon-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as CouponStatus)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="active">نشط ومفعل</option>
                <option value="scheduled">مجدول مستقبلاً</option>
                <option value="inactive">معطل مؤقتاً</option>
                <option value="expired">منتهي الصلاحية</option>
              </select>
            </div>
          </div>

          {/* Public vs Private toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3">
            <div className="space-y-0.5">
              <Label htmlFor="public-switch" className="text-sm font-semibold cursor-pointer">
                عرض الكوبون في قائمة العروض العامة
              </Label>
              <p className="text-xs text-muted-foreground">
                عند التفعيل يظهر الكوبون في لافتات الخصم بموقع العملاء، وإلا يكون رمزاً حصرياً
              </p>
            </div>
            <Switch
              id="public-switch"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            إلغاء
          </Button>
          <Button type="submit" className="gap-1.5 font-bold">
            <Sparkles className="size-4" />
            <span>{isEditing ? "حفظ التعديلات" : "إنشاء وتفعيل الكوبون"}</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
