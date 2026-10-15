import { useState } from "react";
import { Link } from "react-router";
import {
  AlertCircle,
  Building2,
  CalendarDays,
  CalendarRange,
  Clock,
  Home,
  LayoutGrid,
  Percent,
  Plus,
  RefreshCw,
  SaudiRiyal,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { FadeIn } from "@/components/animations";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { PRICING_METADATA } from "@/features/pricing/constants";
import DurationPlansCard from "@/features/pricing/components/duration-plans-card";
import { PopularBadge } from "@/features/pricing/components/popular-badge";
import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import { useUrlTab } from "@/hooks/use-url-tab";
import { usePricingPlans } from "@/features/pricing/hooks/use-pricing-plans";
import PlanDialog from "@/features/pricing/components/plan-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { PricingPlanFormData } from "@/features/pricing/schemas/pricing-schema";
import type { PricingPlanItem } from "@/features/pricing/types";

const PRICING_TABS = ["all", "short", "medium", "long", "manage"] as const;
type FilterTab = (typeof PRICING_TABS)[number];

export default function PricingSection() {
  const [selectedFilter, setSelectedFilter] = useUrlTab<FilterTab>({
    paramKey: "tab",
    defaultValue: "all",
    validValues: PRICING_TABS,
  });

  const {
    plans,
    isLoading,
    isSaving,
    error,
    refetch,
    createPlan,
    updatePlan,
    toggleActive,
    deletePlan,
  } = usePricingPlans();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const shortPlansCount = plans.filter((p) => p.durationUnit === "months").length;
  const mediumPlansCount = plans.filter(
    (p) => p.durationUnit === "years" && p.durationValue <= 5,
  ).length;
  const longPlansCount = plans.filter(
    (p) => p.durationUnit === "years" && p.durationValue > 5,
  ).length;

  const filteredPlans = plans.filter((plan: PricingPlanItem) => {
    if (selectedFilter === "short") {
      return plan.durationUnit === "months";
    }
    if (selectedFilter === "medium") {
      return plan.durationUnit === "years" && plan.durationValue <= 5;
    }
    if (selectedFilter === "long") {
      return plan.durationUnit === "years" && plan.durationValue > 5;
    }
    return true;
  });

  const filterTabs: FilterTabItem<FilterTab>[] = [
    { id: "all", label: "عرض البطاقات", icon: LayoutGrid, count: plans.length },
    { id: "short", label: "أقل من سنة", icon: Clock, count: shortPlansCount },
    { id: "medium", label: "1 - 5 سنوات", icon: CalendarDays, count: mediumPlansCount },
    { id: "long", label: "6 - 10 سنوات", icon: CalendarRange, count: longPlansCount },
    { id: "manage", label: "جدول التعديل والإدارة", icon: SlidersHorizontal },
  ];

  async function handleCreatePlan(data: PricingPlanFormData) {
    await createPlan(data);
    setIsAddDialogOpen(false);
  }

  async function handleCardSave(
    data: PricingPlanFormData,
    editingPlan: PricingPlanItem | null,
  ) {
    if (editingPlan) {
      await updatePlan(editingPlan.id, data);
    } else {
      await createPlan(data);
    }
  }

  return (
    <div className="page-shell space-y-4 sm:space-y-6 py-4 sm:py-8">
      <FadeIn duration={0.3}>
        <PageHeader
          title={PRICING_METADATA.title}
          description={PRICING_METADATA.description}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                className="gap-1.5 font-bold cursor-pointer text-xs"
                onClick={() => setIsAddDialogOpen(true)}
                disabled={isLoading || isSaving}
              >
                <Plus className="size-4" />
                <span>إضافة باقة جديدة</span>
              </Button>
            </div>
          }
        />
      </FadeIn>

      {/* Error state banner */}
      {error && (
        <FadeIn duration={0.25}>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="size-4 shrink-0" />
              <span>
                تعذر جلب باقات التسعير من الخادم. يرجى التأكد من اتصال الشبكة وإعادة المحاولة.
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="h-8 gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 text-xs shrink-0 cursor-pointer"
            >
              <RefreshCw className="size-3" />
              <span>إعادة المحاولة</span>
            </Button>
          </div>
        </FadeIn>
      )}

      {/* Filter Tabs and Quick Navigation */}
      <FadeIn duration={0.3} delay={0.05}>
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <FilterTabs
            items={filterTabs}
            value={selectedFilter}
            onValueChange={setSelectedFilter}
            layout="scroll"
            className="w-full lg:w-auto"
            ariaLabel="تصفية الباقات"
            idPrefix="pricing-filter"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto self-stretch lg:self-center">
            <Link to={ROUTES.taxes} viewTransition className="w-full sm:w-auto">
              <button
                type="button"
                className="inline-flex h-9.5 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-linear-to-r from-secondary-800 via-secondary to-secondary-400 px-4 text-xs font-bold text-secondary-foreground shadow-md shadow-inner-secondary transition-all duration-200 hover:brightness-105 active:scale-98 cursor-pointer"
              >
                <Percent className="size-3.5" />
                <span>إدارة الضرائب والرسوم</span>
              </button>
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Tab Panels with AnimatePresence */}
      <AnimatePresence mode="wait">
        {selectedFilter === "manage" ? (
          <motion.div
            key="manage"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <DurationPlansCard
              plans={plans}
              isLoading={isLoading}
              isSaving={isSaving}
              onSave={handleCardSave}
              onDelete={deletePlan}
              onToggleActive={toggleActive}
            />
          </motion.div>
        ) : (
          /* Pricing Cards Grid with Animated Stagger */
          <motion.div
            key={selectedFilter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-xl" />
                        <div className="space-y-1">
                          <Skeleton className="h-3 w-14" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                    <Skeleton className="h-18 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : plans.length === 0 ? (
              /* Global Empty State (No plans in backend) */
              <Empty className="border border-dashed border-border/80 bg-card py-16 sm:py-24 shadow-2xs">
                <EmptyHeader>
                  <EmptyMedia
                    variant="icon"
                    className="size-14 rounded-2xl bg-primary/10 text-primary"
                  >
                    <SlidersHorizontal className="size-7 text-primary" />
                  </EmptyMedia>
                  <EmptyTitle className="text-base sm:text-lg font-bold">
                    لا توجد باقات توثيق مسجلة حالياً
                  </EmptyTitle>
                  <EmptyDescription className="text-xs sm:text-sm max-w-md">
                    لم يتم إضافة أي باقات تسعير لتوثيق العقود في النظام بعد. أضف باقة جديدة الآن لتكون متاحة فورياً للمستخدمين.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => setIsAddDialogOpen(true)}
                    className="gap-2 font-bold cursor-pointer"
                  >
                    <Plus className="size-4" />
                    <span>إضافة أول باقة توثيق</span>
                  </Button>
                </EmptyContent>
              </Empty>
            ) : filteredPlans.length === 0 ? (
              /* Filter Empty State (Plans exist, but not in current filter) */
              <Empty className="border border-dashed border-border/80 bg-card py-14 sm:py-20 shadow-2xs">
                <EmptyHeader>
                  <EmptyMedia
                    variant="icon"
                    className="size-12 rounded-xl bg-muted text-muted-foreground"
                  >
                    <Clock className="size-6 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle className="text-base sm:text-lg font-bold">
                    لا توجد باقات في هذا التصنيف
                  </EmptyTitle>
                  <EmptyDescription className="text-xs sm:text-sm max-w-md">
                    لا توجد باقات توثيق مسجلة تندرج تحت هذه المدة الزمنية حالياً. يمكنك تغيير التصنيف أو إضافة باقة جديدة لهذا النطاق.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedFilter("all")}
                    className="text-xs cursor-pointer"
                  >
                    عرض كل الباقات ({plans.length})
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsAddDialogOpen(true)}
                    className="text-xs font-bold gap-1.5 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>إضافة باقة جديدة</span>
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredPlans.map((plan) => {
                  const isLongTerm =
                    plan.durationUnit === "years" && plan.durationValue >= 5;
                  const PlanIcon =
                    plan.durationUnit === "months"
                      ? Clock
                      : isLongTerm
                        ? CalendarRange
                        : CalendarDays;

                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className={cn(
                        "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-card p-5 shadow-2xs transition-all duration-200 hover:shadow-md",
                        plan.isPopular
                          ? "border-primary/50 bg-linear-to-b from-primary-50/30 via-card to-card ring-1 ring-primary/30 dark:from-primary-950/20"
                          : "border-border/80 hover:border-primary/40",
                        !plan.isActive && "opacity-75 bg-muted/20 border-dashed",
                      )}
                    >
                        <div className="space-y-4">
                          {/* Header: Icon + Duration + Badges */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "flex size-10 items-center justify-center rounded-xl transition-colors",
                                  plan.isPopular
                                    ? "bg-primary text-primary-foreground shadow-xs shadow-inner-primary"
                                    : "bg-primary-50 text-primary dark:bg-primary-950/40 dark:text-primary-400",
                                )}
                              >
                                <PlanIcon className="size-5" />
                              </div>
                              <div className="space-y-0.5 text-start">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-medium text-muted-foreground">
                                    مدة العقد
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-[10px] px-1.5 py-0 h-4 font-normal",
                                      plan.contractType === "commercial"
                                        ? "border-secondary/30 text-secondary"
                                        : "border-primary/30 text-primary",
                                    )}
                                  >
                                    {plan.contractType === "commercial" ? (
                                      <Building2 className="size-2.5 me-0.5 inline" />
                                    ) : (
                                      <Home className="size-2.5 me-0.5 inline" />
                                    )}
                                    {plan.contractType === "commercial"
                                      ? "تجاري"
                                      : "سكني"}
                                  </Badge>
                                </div>
                                <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
                                  {plan.duration}
                                </h3>
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                              {plan.isPopular && <PopularBadge />}
                              {!plan.isActive && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] text-muted-foreground"
                                >
                                  معطلة
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Price Block */}
                          <div className="rounded-xl border border-border/50 bg-muted/30 p-3.5 text-start transition-colors group-hover:border-border dark:bg-muted/15">
                            <div className="flex items-baseline justify-between gap-1">
                              <span className="text-xs font-medium text-muted-foreground">
                                الرسوم الإجمالية
                              </span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                                  <bdi>{plan.amount.toLocaleString("en-US")}</bdi>
                                </span>
                                <SaudiRiyal className="size-4 text-primary" />
                              </div>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                              <span>شامل الضريبة المضافة</span>
                              {plan.durationUnit === "years" &&
                                plan.durationValue > 1 && (
                                  <span className="flex items-center gap-1 font-semibold text-primary/80">
                                    ~
                                    {plan.yearlyAverage ??
                                      Math.round(
                                        plan.amount / plan.durationValue,
                                      )}{" "}
                                    <SaudiRiyal className="size-3" /> / سنة
                                  </span>
                                )}
                            </div>
                          </div>

                          {/* Optional Note if present */}
                          {plan.notes && (
                            <div className="flex items-center gap-2 pt-0.5 text-start text-[11px] text-muted-foreground/80">
                              <Zap className="size-3 text-secondary shrink-0" />
                              <span className="truncate">{plan.notes}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Add Plan Dialog */}
      <PlanDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        editingPlan={null}
        onSave={handleCreatePlan}
        isSaving={isSaving}
      />
    </div>
  );
}
