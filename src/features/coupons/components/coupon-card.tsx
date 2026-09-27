import { useState } from "react";
import {
  Building2,
  Calendar,
  Check,
  Copy,
  Edit2,
  Eye,
  EyeOff,
  Home,
  MoreVertical,
  Power,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TARGET_USERS_MAP,
  type Coupon,
} from "@/features/coupons/constants";

interface CouponCardProps {
  coupon: Coupon;
  onEdit: (coupon: Coupon) => void;
  onToggleStatus: (couponId: string) => void;
  onDuplicate: (coupon: Coupon) => void;
  onDelete: (couponId: string) => void;
  onTestInSimulator?: (coupon: Coupon) => void;
}

export default function CouponCard({
  coupon,
  onEdit,
  onToggleStatus,
  onDuplicate,
  onDelete,
  onTestInSimulator,
}: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const usagePercent = coupon.usageLimitTotal
    ? Math.min(100, Math.round((coupon.usedCount / coupon.usageLimitTotal) * 100))
    : 0;

  const isExpired =
    coupon.status === "expired" ||
    (coupon.endDate && new Date(coupon.endDate) < new Date());

  const getStatusBadge = () => {
    if (coupon.status === "active") {
      return (
        <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-medium">
          نشط ومفعل
        </Badge>
      );
    }
    if (coupon.status === "scheduled") {
      return (
        <Badge className="border-sky-500/20 bg-sky-500/10 text-sky-600 font-medium">
          مجدول
        </Badge>
      );
    }
    if (coupon.status === "expired" || isExpired) {
      return (
        <Badge variant="outline" className="border-border text-muted-foreground font-medium">
          منتهي الصلاحية
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-muted-foreground font-medium">
        معطل
      </Badge>
    );
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge()}
            {coupon.isPublic ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                <Eye className="size-3" />
                <span>عرض عام</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <EyeOff className="size-3" />
                <span>رمز حصري</span>
              </span>
            )}
          </div>
          <h3 className="truncate text-base font-bold text-foreground">
            {coupon.name}
          </h3>
        </div>

        {/* Action Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            type="button"
            aria-label="خيارات الكوبون"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
          >
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onEdit(coupon)}>
              <Edit2 className="size-4" />
              <span>تعديل الكوبون</span>
            </DropdownMenuItem>
            {onTestInSimulator ? (
              <DropdownMenuItem onClick={() => onTestInSimulator(coupon)}>
                <Sparkles className="size-4" />
                <span>تجربة في المحاكي</span>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onClick={() => onToggleStatus(coupon.id)}>
              <Power className="size-4" />
              <span>{coupon.status === "active" ? "تعطيل الكوبون" : "تفعيل الكوبون"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(coupon)}>
              <Copy className="size-4" />
              <span>نسخ كقالب جديد</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(coupon.id)}
            >
              <Trash2 className="size-4" />
              <span>حذف الكوبون</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground min-h-[32px]">
        {coupon.description || "كود خصم حصري لتسجيل وتوثيق عقود الإيجار في شبكة إيجار"}
      </p>

      {/* Coupon Ticket Box */}
      <div className="relative my-4 rounded-xl border border-dashed border-primary/40 bg-primary-50/40 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs">
              {coupon.discountType === "percentage" ? (
                <span className="text-sm font-extrabold">{coupon.discountValue}%</span>
              ) : (
                <span className="text-xs font-extrabold">{coupon.discountValue}ر.س</span>
              )}
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-medium text-muted-foreground">
                رمز القسيمة
              </span>
              <span
                dir="ltr"
                className="block truncate font-mono text-base font-black tracking-wider text-primary select-all"
              >
                {coupon.code}
              </span>
            </div>
          </div>

          {/* Copy Button */}
          <Tooltip>
            <TooltipTrigger
              type="button"
              onClick={handleCopy}
              aria-label="نسخ رمز الكوبون"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-95 shadow-xs"
            >
              {copied ? (
                <Check className="size-4 text-emerald-600 animate-in zoom-in-50" />
              ) : (
                <Copy className="size-4 text-muted-foreground" />
              )}
            </TooltipTrigger>
            <TooltipContent side="top">
              {copied ? "تم النسخ للحافظة!" : "نسخ الكود"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Discount Details Note */}
        <div className="mt-2.5 flex items-center justify-between border-t border-dashed border-primary/20 pt-2 text-[11px] text-muted-foreground">
          <span>الحد الأدنى: {coupon.minOrderAmount} ر.س</span>
          {coupon.discountType === "percentage" && coupon.maxDiscountAmount ? (
            <span>أقصى خصم: {coupon.maxDiscountAmount} ر.س</span>
          ) : null}
        </div>
      </div>

      {/* Targets & Eligibility */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between gap-2 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Tag className="size-3.5 text-primary" />
            <span>العقود المشمولة:</span>
          </span>
          <div className="flex items-center gap-1">
            {coupon.targetServices.includes("residential") ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-foreground">
                <Home className="size-3" />
                <span>سكني</span>
              </span>
            ) : null}
            {coupon.targetServices.includes("commercial") ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-foreground">
                <Building2 className="size-3" />
                <span>تجاري</span>
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5 text-primary" />
            <span>المستفيدين:</span>
          </span>
          <span className="font-medium text-foreground">
            {TARGET_USERS_MAP[coupon.targetUserType]?.label || "الجميع"}
          </span>
        </div>

        {/* Usage Progress */}
        {coupon.usageLimitTotal ? (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">نسبة الاستخدام:</span>
              <span className="font-semibold text-foreground">
                {coupon.usedCount} من {coupon.usageLimitTotal} ({usagePercent}%)
              </span>
            </div>
            <Progress value={usagePercent} className="h-1.5 bg-muted" />
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>مرات الاستخدام:</span>
            <span className="font-semibold text-foreground">{coupon.usedCount} مرة</span>
          </div>
        )}
      </div>

      {/* Card Footer: Validity & Total Savings */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="size-3.5 text-muted-foreground" />
          <span>ينتهي: {coupon.endDate}</span>
        </div>
        <div className="flex items-center gap-1 font-semibold text-primary">
          <TrendingUp className="size-3.5" />
          <span>وفر {coupon.totalDiscountedAmount.toLocaleString("ar-SA")} ر.س</span>
        </div>
      </div>
    </div>
  );
}
