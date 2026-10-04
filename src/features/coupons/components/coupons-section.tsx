import { useState, type ReactNode } from "react";
import {
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
import { toast } from "sonner";
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
import {
  COUPONS_METADATA,
  INITIAL_COUPONS,
  type Coupon,
  type CouponStatus,
  type TargetService,
} from "@/features/coupons/constants";
import CouponCard from "@/features/coupons/components/coupon-card";
import CouponDialog from "@/features/coupons/components/coupon-dialog";
import CouponsStatCards from "@/features/coupons/components/coupons-stat-cards";

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

  const [coupons, setCoupons] = useState<Coupon[]>([...INITIAL_COUPONS]);

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Active filters from URL query parameters
  const searchQuery = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "all";
  const serviceFilter = searchParams.get("service") || "all";
  const discountTypeFilter = searchParams.get("discountType") || "all";

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
      { replace: true },
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
      { replace: true },
    );
  }

  const hasActiveFilters = Boolean(
    searchQuery ||
      statusFilter !== "all" ||
      serviceFilter !== "all" ||
      discountTypeFilter !== "all",
  );

  // Filtered list
  const filteredCoupons = coupons.filter((coupon) => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesCode = coupon.code.toLowerCase().includes(q);
      const matchesName = coupon.name.toLowerCase().includes(q);
      const matchesDesc = (coupon.description || "").toLowerCase().includes(q);
      if (!matchesCode && !matchesName && !matchesDesc) return false;
    }

    // Status filter
    if (statusFilter !== "all" && coupon.status !== statusFilter) {
      return false;
    }

    // Target service filter
    if (serviceFilter !== "all") {
      if (
        !coupon.targetServices.includes("all") &&
        !coupon.targetServices.includes(serviceFilter as TargetService)
      ) {
        return false;
      }
    }

    // Discount type filter
    if (
      discountTypeFilter !== "all" &&
      coupon.discountType !== discountTypeFilter
    ) {
      return false;
    }

    return true;
  });

  // Handlers
  function handleOpenCreate() {
    setEditingCoupon(null);
    setIsDialogOpen(true);
  }

  function handleOpenEdit(coupon: Coupon) {
    setEditingCoupon(coupon);
    setIsDialogOpen(true);
  }

  function handleSaveCoupon(
    couponData: Omit<
      Coupon,
      "id" | "createdAt" | "createdBy" | "usedCount" | "totalDiscountedAmount"
    > & {
      id?: string;
    },
  ) {
    if (couponData.id) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === couponData.id
            ? {
                ...c,
                ...couponData,
              }
            : c,
        ),
      );
      toast.success("تم تحديث بيانات الكوبون بنجاح");
    } else {
      const newCoupon: Coupon = {
        ...couponData,
        id: `CPN-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString().split("T")[0],
        createdBy: "مدير النظام",
        usedCount: 0,
        totalDiscountedAmount: 0,
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      toast.success("تمت إضافة الكوبون الجديد بنجاح");
    }
  }

  function handleToggleStatus(couponId: string) {
    const target = coupons.find((c) => c.id === couponId);
    if (!target) return;
    const nextStatus: CouponStatus =
      target.status === "active" ? "inactive" : "active";

    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, status: nextStatus } : c)),
    );

    if (nextStatus === "active") {
      toast.success(`تم تفعيل الكوبون "${target.name}" بنجاح`);
    } else {
      toast.info(`تم إيقاف تفعيل الكوبون "${target.name}"`);
    }
  }

  function handleDuplicate(coupon: Coupon) {
    const duplicated: Coupon = {
      ...coupon,
      id: `CPN-${Date.now().toString().slice(-4)}`,
      code: `${coupon.code}_COPY`,
      name: `${coupon.name} (نسخة)`,
      usedCount: 0,
      totalDiscountedAmount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "مدير النظام",
      status: "inactive",
    };
    setCoupons((prev) => [duplicated, ...prev]);
    toast.success("تم نسخ الكوبون كقالب جديد بنجاح");
  }

  function handleDeleteConfirm() {
    if (!deletingId) return;
    setCoupons((prev) => prev.filter((c) => c.id !== deletingId));
    setDeletingId(null);
    toast.success("تم حذف الكوبون بنجاح");
  }

  function handleResetDefaults() {
    setCoupons([...INITIAL_COUPONS]);
    toast.success("تمت استعادة الكوبونات الافتراضية بنجاح");
  }

  return (
    <div className="page-shell space-y-3.5 sm:space-y-6 py-3 sm:py-6">
      {/* Top Page Header */}
      <PageHeader
        title={COUPONS_METADATA.title}
        description={COUPONS_METADATA.description}
        actions={
          <div className="flex w-full sm:w-auto items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="flex-1 sm:flex-initial gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RefreshCw className="size-3.5" />
              <span className="hidden xs:inline">استعادة الافتراضي</span>
              <span className="xs:hidden">استعادة</span>
            </Button>
            <Button
              onClick={handleOpenCreate}
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
                عرض <strong>{filteredCoupons.length}</strong> من أصل{" "}
                <strong>{coupons.length}</strong> كوبون خصم
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

      {/* Coupons Cards Grid / Empty State */}
      <FadeIn duration={0.3} delay={0.15}>
        {filteredCoupons.length === 0 ? (
          <Empty className="border border-dashed border-border bg-card py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <TicketPercent className="size-8 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>لا توجد كوبونات تطابق البحث والتصفية</EmptyTitle>
              <EmptyDescription>
                لم يتم العثور على أي كوبونات خصم تطابق معايير البحث أو التصفية
                الحالية في النظام
              </EmptyDescription>
            </EmptyHeader>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="cursor-pointer"
              >
                إعادة ضبط الفلاتر
              </Button>
            )}
          </Empty>
        ) : (
          <StaggerContainer
            staggerDelay={0.04}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredCoupons.map((coupon) => (
              <StaggerItem key={coupon.id}>
                <CouponCard
                  coupon={coupon}
                  onEdit={handleOpenEdit}
                  onToggleStatus={handleToggleStatus}
                  onDuplicate={handleDuplicate}
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
        onSave={handleSaveCoupon}
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
            <AlertDialogCancel className="cursor-pointer">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="cursor-pointer"
            >
              تأكيد الحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
