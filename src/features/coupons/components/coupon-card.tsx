import { useState } from "react";
import { toast } from "sonner";
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
  SaudiRiyal,
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
}

export default function CouponCard({
  coupon,
  onEdit,
  onToggleStatus,
  onDuplicate,
  onDelete,
}: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast.success(`تم نسخ كود الكوبون: ${coupon.code}`);
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
        <Badge className="border-tertiary-200/80 bg-tertiary-50 text-tertiary-700 dark:border-tertiary-800/60 dark:bg-tertiary-950/40 dark:text-tertiary-300 font-medium">
          نشط ومفعل
        </Badge>
      );
    }
    if (coupon.status === "scheduled") {
      return (
        <Badge className="border-secondary-200/80 bg-secondary-50 text-secondary-700 dark:border-secondary-800/60 dark:bg-secondary-950/40 dark:text-secondary-300 font-medium">
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
      <Badge className="border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/40 dark:bg-destructive/15 font-medium">
        معطل
      </Badge>
    );
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-3.5 sm:p-5 shadow-xs transition-colors duration-200 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-md">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2.5">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {getStatusBadge()}
              {coupon.isPublic ? (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-primary">
                  <Eye className="size-3" />
                  <span>عرض عام</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                  <EyeOff className="size-3" />
                  <span>رمز حصري</span>
                </span>
              )}
            </div>
            <h3 className="truncate text-sm sm:text-base font-bold text-foreground">
              {coupon.name}
            </h3>
          </div>

          {/* Action Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              aria-label="خيارات الكوبون"
              className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none cursor-pointer"
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEdit(coupon)}>
                <Edit2 className="size-4" />
                <span>تعديل الكوبون</span>
              </DropdownMenuItem>
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
        <p className="mt-2 line-clamp-2 text-[11px] sm:text-xs leading-relaxed text-muted-foreground min-h-[28px] sm:min-h-[32px]">
          {coupon.description || "كود خصم حصري لتسجيل وتوثيق عقود الإيجار في شبكة إيجار"}
        </p>

        {/* Coupon Ticket Box */}
        <div className="relative my-3 sm:my-4 rounded-xl border border-dashed border-primary-200 dark:border-primary-900/60 bg-primary-50/50 dark:bg-primary-950/20 p-2.5 sm:p-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs">
                {coupon.discountType === "percentage" ? (
                  <span className="text-xs sm:text-sm font-extrabold">{coupon.discountValue}%</span>
                ) : (
                  <span className="inline-flex items-center text-[11px] sm:text-xs font-extrabold gap-0.5">
                    <span>{coupon.discountValue}</span>
                    <SaudiRiyal className="size-2.5 sm:size-3" />
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                  رمز القسيمة
                </span>
                <span
                  dir="ltr"
                  className="block truncate font-mono text-sm sm:text-base font-black tracking-wider text-primary select-all"
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
                className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-95 shadow-xs cursor-pointer"
              >
                {copied ? (
                  <Check className="size-3.5 sm:size-4 text-tertiary-600 dark:text-tertiary-400 animate-in zoom-in-50" />
                ) : (
                  <Copy className="size-3.5 sm:size-4 text-muted-foreground" />
                )}
              </TooltipTrigger>
              <TooltipContent side="top">
                {copied ? "تم النسخ للحافظة!" : "نسخ الكود"}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Discount Details Note */}
          <div className="mt-2 sm:mt-2.5 flex items-center justify-between border-t border-dashed border-primary-200/70 dark:border-primary-900/40 pt-1.5 sm:pt-2 text-[10px] sm:text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span>الحد الأدنى:</span>
              <span className="font-semibold text-foreground">{coupon.minOrderAmount}</span>
              <SaudiRiyal className="size-2.5 sm:size-3" />
            </span>
            {coupon.discountType === "percentage" && coupon.maxDiscountAmount ? (
              <span className="inline-flex items-center gap-1">
                <span>أقصى خصم:</span>
                <span className="font-semibold text-foreground">{coupon.maxDiscountAmount}</span>
                <SaudiRiyal className="size-2.5 sm:size-3" />
              </span>
            ) : null}
          </div>
        </div>

        {/* Targets & Eligibility */}
        <div className="space-y-2 sm:space-y-3 text-xs">
          <div className="flex items-center justify-between gap-2 text-muted-foreground">
            <span className="flex items-center gap-1.5 text-[11px] sm:text-xs">
              <Tag className="size-3.5 text-primary" />
              <span>العقود المشمولة:</span>
            </span>
            <div className="flex items-center gap-1">
              {coupon.targetServices.includes("all") || coupon.targetServices.includes("residential") ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] sm:text-[11px] font-medium text-foreground">
                  <Home className="size-3" />
                  <span>سكني</span>
                </span>
              ) : null}
              {coupon.targetServices.includes("all") || coupon.targetServices.includes("commercial") ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] sm:text-[11px] font-medium text-foreground">
                  <Building2 className="size-3" />
                  <span>تجاري</span>
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 text-muted-foreground text-[11px] sm:text-xs">
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
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                <span className="text-muted-foreground">نسبة الاستخدام:</span>
                <span className="font-semibold text-foreground">
                  {coupon.usedCount.toLocaleString("en-US")} من {coupon.usageLimitTotal.toLocaleString("en-US")} ({usagePercent}%)
                </span>
              </div>
              <Progress value={usagePercent} className="h-1.5 bg-muted" />
            </div>
          ) : (
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-muted-foreground">
              <span>مرات الاستخدام:</span>
              <span className="font-semibold text-foreground">{coupon.usedCount.toLocaleString("en-US")} مرة</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Validity & Total Savings */}
      <div className="mt-3 sm:mt-4 flex items-center justify-between border-t border-border/80 pt-2.5 sm:pt-3 text-[10px] sm:text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="size-3.5 text-muted-foreground" />
          <span>ينتهي: {coupon.endDate}</span>
        </div>
        <div className="inline-flex items-center gap-1 font-semibold text-primary">
          <TrendingUp className="size-3.5" />
          <span>وفر {coupon.totalDiscountedAmount.toLocaleString("en-US")}</span>
          <SaudiRiyal className="size-3" />
        </div>
      </div>
    </div>
  );
}
