import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Grid,
  Percent,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Table as TableIcon,
  Tag,
  TicketPercent,
  TrendingUp,
  Users,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  COUPONS_METADATA,
  COUPONS_STORAGE_KEYS,
  INITIAL_COUPONS,
  type Coupon,
  type CouponStatus,
  type TargetService,
} from "@/features/coupons/constants";
import CouponCard from "@/features/coupons/components/coupon-card";
import CouponDialog from "@/features/coupons/components/coupon-dialog";
import CouponSimulatorCard from "@/features/coupons/components/coupon-simulator-card";
import CouponsTable from "@/features/coupons/components/coupons-table";

export default function CouponsSection() {
  const [activeTab, setActiveTab] = useState<string>("manage");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Coupons State with LocalStorage Persistence
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(COUPONS_STORAGE_KEYS.coupons);
    return saved ? JSON.parse(saved) : [...INITIAL_COUPONS];
  });

  useEffect(() => {
    localStorage.setItem(COUPONS_STORAGE_KEYS.coupons, JSON.stringify(coupons));
  }, [coupons]);

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [simulatorPresetCode, setSimulatorPresetCode] = useState<string>("");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  // Filtered list
  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      // Search
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesCode = coupon.code.toLowerCase().includes(query);
        const matchesName = coupon.name.toLowerCase().includes(query);
        const matchesDesc = coupon.description.toLowerCase().includes(query);
        if (!matchesCode && !matchesName && !matchesDesc) return false;
      }

      // Status
      if (statusFilter !== "all") {
        if (coupon.status !== statusFilter) return false;
      }

      // Service
      if (serviceFilter !== "all") {
        if (
          !coupon.targetServices.includes("all") &&
          !coupon.targetServices.includes(serviceFilter as TargetService)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [coupons, searchQuery, serviceFilter, statusFilter]);

  // Key Metrics
  const metrics = useMemo(() => {
    const totalCount = coupons.length;
    const activeCount = coupons.filter((c) => c.status === "active").length;
    const totalRedemptions = coupons.reduce((sum, c) => sum + c.usedCount, 0);
    const totalSavings = coupons.reduce((sum, c) => sum + c.totalDiscountedAmount, 0);
    const avgDiscount =
      coupons.filter((c) => c.discountType === "percentage").length > 0
        ? Math.round(
            coupons
              .filter((c) => c.discountType === "percentage")
              .reduce((sum, c) => sum + c.discountValue, 0) /
              coupons.filter((c) => c.discountType === "percentage").length
          )
        : 0;

    return {
      totalCount,
      activeCount,
      totalRedemptions,
      totalSavings,
      avgDiscount,
    };
  }, [coupons]);

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
    couponData: Omit<Coupon, "id" | "createdAt" | "createdBy" | "usedCount" | "totalDiscountedAmount"> & {
      id?: string;
    }
  ) {
    if (couponData.id) {
      // Edit
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === couponData.id
            ? {
                ...c,
                ...couponData,
              }
            : c
        )
      );
    } else {
      // Create
      const newCoupon: Coupon = {
        ...couponData,
        id: `CPN-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString().split("T")[0],
        createdBy: "مدير النظام",
        usedCount: 0,
        totalDiscountedAmount: 0,
      };
      setCoupons((prev) => [newCoupon, ...prev]);
    }
  }

  function handleToggleStatus(couponId: string) {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id !== couponId) return c;
        const newStatus: CouponStatus = c.status === "active" ? "inactive" : "active";
        return { ...c, status: newStatus };
      })
    );
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
  }

  function handleDeleteConfirm() {
    if (!deletingId) return;
    setCoupons((prev) => prev.filter((c) => c.id !== deletingId));
    setDeletingId(null);
  }

  function handleResetDefaults() {
    setCoupons([...INITIAL_COUPONS]);
    localStorage.setItem(COUPONS_STORAGE_KEYS.coupons, JSON.stringify(INITIAL_COUPONS));
  }

  function handleTestInSimulator(coupon: Coupon) {
    setSimulatorPresetCode(coupon.code);
    setActiveTab("simulator");
  }

  return (
    <div className="page-shell space-y-6 py-8">
      {/* Header */}
      <PageHeader
        title={COUPONS_METADATA.title}
        description={COUPONS_METADATA.description}
        badge={
          <Badge variant="secondary" className="gap-1.5 font-medium">
            <TicketPercent className="size-3.5" />
            <span>{COUPONS_METADATA.subtitle}</span>
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="size-3.5" />
              <span>استعادة الافتراضي</span>
            </Button>
            <Button onClick={handleOpenCreate} className="gap-1.5 font-bold shadow-xs">
              <Plus className="size-4" />
              <span>إضافة كوبون جديد</span>
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Coupons */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                الكوبونات النشطة
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-foreground">
                  {metrics.activeCount}
                </span>
                <span className="text-xs text-muted-foreground">
                  من إجمالي {metrics.totalCount}
                </span>
              </div>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <Tag className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Redemptions */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                إجمالي مرات الاستخدام
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-foreground">
                  {metrics.totalRedemptions.toLocaleString("ar-SA")}
                </span>
                <span className="text-xs text-muted-foreground">عقد موثق</span>
              </div>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <Users className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Savings Given */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                إجمالي الوفورات الممنوحة
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-foreground">
                  {metrics.totalSavings.toLocaleString("ar-SA")}
                </span>
                <span className="text-xs font-bold text-primary">ر.س</span>
              </div>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <TrendingUp className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Average Discount % */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                متوسط نسبة الخصم
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-foreground">
                  {metrics.avgDiscount}%
                </span>
                <span className="text-xs text-muted-foreground">على العقود</span>
              </div>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <Percent className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="manage" className="gap-2">
              <Tag className="size-3.5" />
              <span>إدارة وتصفح الكوبونات</span>
            </TabsTrigger>
            <TabsTrigger value="simulator" className="gap-2">
              <Sparkles className="size-3.5" />
              <span>محاكي واختبار الخصومات</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TicketPercent className="size-4 text-primary" />
            <span>تطبيق فوري معتمد لتوثيق منصة إيجار</span>
          </div>
        </div>

        {/* TAB 1: MANAGE COUPONS */}
        <TabsContent value="manage" className="space-y-6">
          {/* Toolbar: Search, Filters, and View Mode Switch */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث برمز الكوبون أو اسم العرض..."
                className="ps-9"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">كل الحالات ({coupons.length})</option>
                <option value="active">النشطة فقط</option>
                <option value="scheduled">المجدولة</option>
                <option value="inactive">المعطلة</option>
                <option value="expired">المنتهية</option>
              </select>

              {/* Service Filter */}
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
              >
                <option value="all">كل أنواع العقود</option>
                <option value="residential">عقود سكنية</option>
                <option value="commercial">عقود تجارية</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center rounded-lg border border-border bg-muted/50 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="عرض البطاقات"
                  className={`flex size-7 items-center justify-center rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Grid className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  aria-label="عرض الجدول"
                  className={`flex size-7 items-center justify-center rounded-md transition-colors ${
                    viewMode === "table"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TableIcon className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* List Display (Grid vs Table vs Empty) */}
          {filteredCoupons.length === 0 ? (
            <Empty className="border border-dashed border-border bg-card py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <TicketPercent className="size-8 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>لا توجد كوبونات تطابق البحث</EmptyTitle>
                <EmptyDescription>
                  لم يتم العثور على أي كوبونات خصم تطابق معايير البحث أو التصفية الحالية
                </EmptyDescription>
              </EmptyHeader>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setServiceFilter("all");
                }}
              >
                إعادة ضبط الفلاتر
              </Button>
            </Empty>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCoupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onEdit={handleOpenEdit}
                  onToggleStatus={handleToggleStatus}
                  onDuplicate={handleDuplicate}
                  onDelete={(id) => setDeletingId(id)}
                  onTestInSimulator={handleTestInSimulator}
                />
              ))}
            </div>
          ) : (
            <CouponsTable
              coupons={filteredCoupons}
              onEdit={handleOpenEdit}
              onToggleStatus={handleToggleStatus}
              onDuplicate={handleDuplicate}
              onDelete={(id) => setDeletingId(id)}
              onTestInSimulator={handleTestInSimulator}
            />
          )}
        </TabsContent>

        {/* TAB 2: COUPON SIMULATOR */}
        <TabsContent value="simulator" className="space-y-6">
          <div className="mx-auto max-w-3xl">
            <CouponSimulatorCard
              coupons={coupons}
              selectedCodePreset={simulatorPresetCode}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Compliance Note */}
      <div className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary-50/50 p-4 text-center text-sm font-medium text-foreground">
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
      <AlertDialog open={Boolean(deletingId)} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا الكوبون؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم إزالة الكوبون نهائياً من النظام ولن يتمكن المستخدمون من الاستفادة منه في سداد العقود الجديدة.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              تأكيد الحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
