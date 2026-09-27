import { useState } from "react";
import {
  Building2,
  Check,
  Copy,
  Edit2,
  Home,
  MoreVertical,
  Power,
  Sparkles,
  Trash2,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TARGET_USERS_MAP,
  type Coupon,
} from "@/features/coupons/constants";

interface CouponsTableProps {
  coupons: Coupon[];
  onEdit: (coupon: Coupon) => void;
  onToggleStatus: (couponId: string) => void;
  onDuplicate: (coupon: Coupon) => void;
  onDelete: (couponId: string) => void;
  onTestInSimulator?: (coupon: Coupon) => void;
}

export default function CouponsTable({
  coupons,
  onEdit,
  onToggleStatus,
  onDuplicate,
  onDelete,
  onTestInSimulator,
}: CouponsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(code: string, id: string) {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const getStatusBadge = (coupon: Coupon) => {
    const isExpired =
      coupon.status === "expired" ||
      (coupon.endDate && new Date(coupon.endDate) < new Date());

    if (coupon.status === "active") {
      return (
        <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-medium">
          نشط
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
          منتهي
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
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-start font-bold">كود الكوبون</TableHead>
            <TableHead className="text-start font-bold">اسم العرض</TableHead>
            <TableHead className="text-start font-bold">نوع وقيمة الخصم</TableHead>
            <TableHead className="text-start font-bold">العقود المشمولة</TableHead>
            <TableHead className="text-start font-bold">الاستخدام والمتبقي</TableHead>
            <TableHead className="text-start font-bold">تاريخ الصلاحية</TableHead>
            <TableHead className="text-start font-bold">الحالة</TableHead>
            <TableHead className="text-center font-bold">إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => {
            const usagePercent = coupon.usageLimitTotal
              ? Math.min(
                  100,
                  Math.round((coupon.usedCount / coupon.usageLimitTotal) * 100)
                )
              : 0;

            return (
              <TableRow key={coupon.id} className="transition-colors hover:bg-muted/30">
                {/* Code & Copy */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span
                      dir="ltr"
                      className="font-mono text-sm font-bold text-primary select-all"
                    >
                      {coupon.code}
                    </span>
                    <Tooltip>
                      <TooltipTrigger
                        type="button"
                        onClick={() => handleCopy(coupon.code, coupon.id)}
                        aria-label="نسخ الكود"
                        className="flex size-7 items-center justify-center rounded-md border border-border/80 text-muted-foreground transition-all hover:bg-muted active:scale-95"
                      >
                        {copiedId === coupon.id ? (
                          <Check className="size-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {copiedId === coupon.id ? "تم النسخ!" : "نسخ الكود"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>

                {/* Name & Target User */}
                <TableCell>
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground text-sm block">
                      {coupon.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {TARGET_USERS_MAP[coupon.targetUserType]?.label}
                    </span>
                  </div>
                </TableCell>

                {/* Discount Value */}
                <TableCell>
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground text-sm">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `${coupon.discountValue} ر.س`}
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      الحد الأدنى: {coupon.minOrderAmount} ر.س
                    </span>
                  </div>
                </TableCell>

                {/* Target Services */}
                <TableCell>
                  <div className="flex flex-wrap items-center gap-1">
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
                </TableCell>

                {/* Usage Progress */}
                <TableCell className="min-w-[140px]">
                  {coupon.usageLimitTotal ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">
                          {coupon.usedCount} / {coupon.usageLimitTotal}
                        </span>
                        <span className="text-muted-foreground text-[11px]">
                          {usagePercent}%
                        </span>
                      </div>
                      <Progress value={usagePercent} className="h-1.5 bg-muted" />
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-foreground">
                      {coupon.usedCount} استخدام (غير محدود)
                    </span>
                  )}
                </TableCell>

                {/* Expiry */}
                <TableCell>
                  <div className="space-y-0.5 text-xs text-muted-foreground">
                    <span>من: {coupon.startDate}</span>
                    <span className="block text-foreground font-medium">
                      إلى: {coupon.endDate}
                    </span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>{getStatusBadge(coupon)}</TableCell>

                {/* Actions */}
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      type="button"
                      aria-label="خيارات الكوبون"
                      className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
