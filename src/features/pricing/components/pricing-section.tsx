import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import {
  CalendarDays,
  CalendarRange,
  Clock,
  LayoutGrid,
  Percent,
  SaudiRiyal,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import {
  CONTRACT_PRICING_PLANS,
  PRICING_METADATA,
  type PricingPlan,
} from "@/features/pricing/constants";
import DurationPlansCard from "@/features/pricing/components/duration-plans-card";
import { PopularBadge } from "@/features/pricing/components/popular-badge";
import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import { useUrlTab } from "@/hooks/use-url-tab";

const PRICING_TABS = ["all", "short", "medium", "long", "manage"] as const;
type FilterTab = (typeof PRICING_TABS)[number];

export default function PricingSection() {
  const [selectedFilter, setSelectedFilter] = useUrlTab<FilterTab>({
    paramKey: "tab",
    defaultValue: "all",
    validValues: PRICING_TABS,
  });

  const [plans, setPlans] = useState<PricingPlan[]>([...CONTRACT_PRICING_PLANS]);

  const handleResetPlans = () => {
    setPlans([...CONTRACT_PRICING_PLANS]);
    toast.success("تمت استعادة باقات التوثيق الافتراضية بنجاح");
  };

  const filteredPlans = plans.filter((plan: PricingPlan) => {
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
    { id: "short", label: "أقل من سنة", icon: Clock },
    { id: "medium", label: "1 - 5 سنوات", icon: CalendarDays },
    { id: "long", label: "6 - 10 سنوات", icon: CalendarRange },
    { id: "manage", label: "جدول التعديل والإدارة", icon: SlidersHorizontal },
  ];

  return (
    <div className="page-shell space-y-4 sm:space-y-6 py-4 sm:py-8">
      <FadeIn duration={0.3}>
        <PageHeader
          title={PRICING_METADATA.title}
          description={PRICING_METADATA.description}
        />
      </FadeIn>

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
              onPlansChange={setPlans}
              onResetDefaults={handleResetPlans}
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
            <StaggerContainer
              staggerDelay={0.04}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
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
                  <StaggerItem key={plan.id} className="h-full">
                    <motion.div
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={cn(
                        "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-card p-5 shadow-2xs transition-all duration-200 hover:shadow-md",
                        plan.isPopular
                          ? "border-primary/50 bg-linear-to-b from-primary-50/30 via-card to-card ring-1 ring-primary/30 dark:from-primary-950/20"
                          : "border-border/80 hover:border-primary/40",
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
                              <span className="text-[11px] font-medium text-muted-foreground">
                                مدة العقد
                              </span>
                              <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
                                {plan.duration}
                              </h3>
                            </div>
                          </div>

                          {plan.isPopular && <PopularBadge />}
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
                                  {Math.round(plan.amount / plan.durationValue)}{" "}
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
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
