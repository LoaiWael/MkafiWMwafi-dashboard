import { type ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  RefreshCw,
  RotateCcw,
  SaudiRiyal,
  Search,
  Sparkles,
  TicketPercent,
  X,
} from "lucide-react";
import { useSearchParams } from "react-router";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  COUPONS_METADATA,
  type CouponDiscountType,
  type CouponStatus,
  type TargetService,
} from "@/features/coupons/constants";
import CouponCard from "@/features/coupons/components/coupon-card";
import CouponDialog from "@/features/coupons/components/coupon-dialog";
import CouponsStatCards from "@/features/coupons/components/coupons-stat-cards";
import { useCoupons } from "@/features/coupons/hooks/use-coupons";

const statusLabels: Record<string, string> = {
  all: "كل الحالات",
  active: "النشطة فقط",
  scheduled: "المجدولة",
  inactive: "المعطلة",
  expired: "المنتهية",
};

const serviceLabels: Record<string, string> = {
  all: "كل أنواع العقود",
  residential: "عقود سكنية",
  commercial: "عقود تجارية",
};

const discountTypeLabels: Record<string, ReactNode> = {
  all: "كل أنواع الخصم",
  percentage: "نسبة مئوية (%)",
  fixed: (
    <span className="inline-flex items-center gap-1">
      <span>مبلغ ثابت</span>
      <SaudiRiyal className="size-3 text-muted-foreground" />
    </span>
  ),
};

export default function CouponsSection() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Active filters from URL query parameters
  const searchQuery = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "all";
  const serviceFilter = searchParams.get("service") || "all";
  const discountTypeFilter = searchParams.get("discountType") || "all";

  const {
    coupons,
    isLoading,
    isSaving,
    isDeleting,
    error,
    isDialogOpen,
    setIsDialogOpen,
    editingCoupon,
    deletingId,
    setDeletingId,
    openCreate,
    openEdit,
    openDuplicate,
    saveCoupon,
    toggleStatus,
    removeCoupon,
    loadCoupons,
  } = useCoupons({
    search: searchQuery || undefined,
    status:
      statusFilter !== "all" ? (statusFilter as CouponStatus) : undefined,
    service:
      serviceFilter !== "all" ? (serviceFilter as TargetService) : undefined,
    discount_type:
      discountTypeFilter !== "all"
        ? (discountTypeFilter as CouponDiscountType)
        : undefined,
  });

  // URL query parameter updater
  function handleFilterChange(key: string, value: string | null) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (!value || value === "all" || value.trim() === "") {
          next.delete(key);
        } else {
          next.set(key, value.trim());
        }
        return next;
      },
      { replace: true }
    );
  }

  // Clear all active filters
  function handleClearFilters() {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete("search");
        next.delete("status");
        next.delete("service");
        next.delete("discountType");
        return next;
      },
      { replace: true }
    );
  }

  const hasActiveFilters = Boolean(
    searchQuery ||
      statusFilter !== "all" ||
      serviceFilter !== "all" ||
      discountTypeFilter !== "all"
  );

  return (
    <div className="page-shell space-y-3.5 sm:space-y-6 py-3 sm:py-6">
      {/* Top Page Header */}
      <PageHeader
        title={COUPONS_METADATA.title}
        description={COUPONS_METADATA.description}
        actions={
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Button
              onClick={openCreate}
              size="sm"
              className="flex-1 sm:flex-initial gap-1.5 font-bold shadow-xs cursor-pointer"
            >
              <Plus className="size-4" />
              <span>إضافة كوبون</span>
            </Button>
          </div>
        }
      />

      {/* KPI Stat Cards */}
      <CouponsStatCards coupons={coupons} />

      {/* Filter Toolbar with shadcn Dropdowns & Search */}
      <FadeIn duration={0.3} delay={0.1}>
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-xs">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-0">
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="ابحث برمز الكوبون أو اسم العرض..."
                className="ps-9 pe-9 h-9 text-xs rounded-xl"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => handleFilterChange("search", "")}
                  aria-label="مسح البحث"
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
              {/* Status Filter Dropdown */}
              <Select
                value={statusFilter}
                onValueChange={(val) => handleFilterChange("status", val)}
              >
                <SelectTrigger className="w-full sm:w-[145px] h-9 text-xs rounded-xl bg-card border-border cursor-pointer">
                  <SelectValue>
                    {statusLabels[statusFilter] || "حالة الكوبون"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="all">كل الحالات ({coupons.length})</SelectItem>
                  <SelectItem value="active">النشطة فقط</SelectItem>
                  <SelectItem value="scheduled">المجدولة</SelectItem>
                  <SelectItem value="inactive">المعطلة</SelectItem>
                  <SelectItem value="expired">المنتهية</SelectItem>
                </SelectContent>
              </Select>

              {/* Service Type Filter Dropdown */}
              <Select
                value={serviceFilter}
                onValueChange={(val) => handleFilterChange("service", val)}
              >
                <SelectTrigger className="w-full sm:w-[140px] h-9 text-xs rounded-xl bg-card border-border cursor-pointer">
                  <SelectValue>
                    {serviceLabels[serviceFilter] || "نوع العقد"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="all">كل أنواع العقود</SelectItem>
                  <SelectItem value="residential">عقود سكنية</SelectItem>
                  <SelectItem value="commercial">عقود تجارية</SelectItem>
                </SelectContent>
              </Select>

              {/* Discount Type Filter Dropdown */}
              <Select
                value={discountTypeFilter}
                onValueChange={(val) => handleFilterChange("discountType", val)}
              >
                <SelectTrigger className="w-full sm:w-[140px] h-9 text-xs rounded-xl bg-card border-border cursor-pointer col-span-2 sm:col-span-1">
                  <SelectValue>
                    {discountTypeLabels[discountTypeFilter] || "نوع الخصم"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="all">كل أنواع الخصم</SelectItem>
                  <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                  <SelectItem value="fixed">
                    <span className="inline-flex items-center gap-1">
                      <span>مبلغ ثابت</span>
                      <SaudiRiyal className="size-3 text-muted-foreground" />
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Filters Button */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer col-span-2 sm:col-span-1 justify-center"
                >
                  <RotateCcw className="size-3.5" />
                  <span>إعادة ضبط</span>
                </Button>
              )}
            </div>
          </div>

          {/* Results Count & Quick Info */}
          <div className="flex items-center justify-between border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <TicketPercent className="size-4 text-primary" />
              <span>
                عرض <strong>{coupons.length}</strong> كوبون خصم
              </span>
            </div>
            {hasActiveFilters && (
              <span className="text-[11px] text-primary font-medium">
                (نتائج مصفاة)
              </span>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Coupons Cards Grid / Loading / Error / Empty State */}
      <FadeIn duration={0.3} delay={0.15}>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`coupon-skeleton-${i}`}
                className="rounded-2xl border border-border/80 bg-card p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-20 rounded-md" />
                  <Skeleton className="size-7 rounded-lg" />
                </div>
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-1/2 rounded-md" />
                  <Skeleton className="h-3.5 w-2/3 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Empty className="border border-destructive/20 bg-destructive/5 py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlertCircle className="size-8 text-destructive" />
              </EmptyMedia>
              <EmptyTitle className="text-destructive">
                تعذر تحميل كوبونات الخصم
              </EmptyTitle>
              <EmptyDescription>
                {error.message ||
                  "حدث خطأ أثناء جلب قائمة الكوبونات من الخادم، يرجى إعادة المحاولة."}
              </EmptyDescription>
            </EmptyHeader>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadCoupons()}
              className="gap-1.5 cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span>إعادة المحاولة</span>
            </Button>
          </Empty>
        ) : coupons.length === 0 ? (
          <Empty className="border border-dashed border-border bg-card py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TicketPercent className="size-8 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>لا توجد كوبونات خصم حالياً</EmptyTitle>
              <EmptyDescription>
                {hasActiveFilters
                  ? "لم يتم العثور على أي كوبونات خصم تطابق معايير البحث أو التصفية الحالية"
                  : "لم يتم إنشاء أي كوبونات خصم بعد. يمكنك إضافة كوبون جديد للبدء."}
              </EmptyDescription>
            </EmptyHeader>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="cursor-pointer"
              >
                إعادة ضبط الفلاتر
              </Button>
            ) : (
              <Button
                onClick={openCreate}
                size="sm"
                className="gap-1.5 cursor-pointer font-bold"
              >
                <Plus className="size-4" />
                <span>إضافة أول كوبون</span>
              </Button>
            )}
          </Empty>
        ) : (
          <StaggerContainer
            staggerDelay={0.04}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {coupons.map((coupon) => (
              <StaggerItem key={coupon.id}>
                <CouponCard
                  coupon={coupon}
                  onEdit={openEdit}
                  onToggleStatus={(id) => {
                    const target = coupons.find((c) => c.id === id);
                    if (target) {
                      void toggleStatus(id, target.status);
                    }
                  }}
                  onDuplicate={openDuplicate}
                  onDelete={(id) => setDeletingId(id)}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </FadeIn>

      {/* Official Platform Compliance Note */}
      <div className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary-50/50 dark:bg-primary-950/20 p-4 text-center text-xs sm:text-sm font-medium text-foreground">
        <Sparkles className="size-4 text-primary shrink-0" />
        <span>{COUPONS_METADATA.note}</span>
        <CheckCircle2 className="size-4 text-primary shrink-0" />
      </div>

      {/* Create / Edit Dialog */}
      <CouponDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        coupon={editingCoupon}
        onSave={saveCoupon}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              هل أنت متأكد من حذف هذا الكوبون؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              سيتم إزالة الكوبون نهائياً من النظام ولن يتمكن المستخدمون من
              الاستفادة منه في سداد العقود الجديدة.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="cursor-pointer">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void removeCoupon()}
              className="cursor-pointer"
            >
              {isDeleting ? "جاري الحذف..." : "تأكيد الحذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
