import { Building2, FileCheck2, SaudiRiyal, TrendingUp } from "lucide-react";
import { Link } from "react-router";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import OverviewContractsTable from "@/features/overview/components/overview-contracts-table";
import OverviewStatCard from "@/features/overview/components/overview-stat-card";
import { OVERVIEW_STATS } from "@/features/overview/constants";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function OverviewSection() {
  return (
    <div className="page-shell space-y-6 sm:space-y-8 py-4 sm:py-8">
      {/* 1. Header section with Action Buttons */}
      <PageHeader
        title="لوحة التحكم والتشغيل"
        description="متابعة وإدارة توثيق عقود الإيجار السكنية والتجارية، والعقارات المسجلة، والطلبات الجارية، والمدفوعات اللحظية."
        actions={
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Link
              to={ROUTES.properties}
              viewTransition
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-8.5 sm:h-9 flex-1 sm:flex-initial gap-1.5 rounded-xl px-3 text-[11px] sm:text-xs font-semibold active:scale-98",
              )}
            >
              <Building2 className="size-4 text-primary shrink-0" />
              <span>عرض العقارات</span>
            </Link>

            <Link
              to={ROUTES.contracts}
              viewTransition
              className={cn(
                buttonVariants({ variant: "primary", size: "sm" }),
                "h-8.5 sm:h-9 flex-1 sm:flex-initial gap-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-[11px] sm:text-xs font-semibold shadow-xs active:scale-98",
              )}
            >
              <FileCheck2 className="size-4 shrink-0" />
              <span>عرض العقود</span>
            </Link>
          </div>
        }
      />

      {/* 2. Status Cards Grid with Numbers */}
      <section aria-label="إحصائيات وحالة المنصة">
        <StaggerContainer
          staggerDelay={0.06}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-stretch"
        >
          {OVERVIEW_STATS.map((stat) => (
            <StaggerItem key={stat.id} className="flex h-full">
              <OverviewStatCard stat={stat} className="w-full flex-1" />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 3. Quick Operational Insights Strip */}
      <FadeIn duration={0.3} delay={0.15}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-stretch">
          {/* Card 1: Contracts Mix Ratio */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950">
                  <Building2 className="size-4" />
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  توزيع العقود الموثقة
                </h4>
              </div>
              <Badge variant="outline" className="text-[10px] font-bold">
                1,742 إجمالي
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="bg-primary transition-all"
                  style={{ width: "73.7%" }}
                  title="عقود سكنية 73.7%"
                />
                <div
                  className="bg-secondary transition-all"
                  style={{ width: "26.3%" }}
                  title="عقود تجارية 26.3%"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-primary" />
                  <span>سكني (73.7%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-secondary" />
                  <span>تجاري (26.3%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Financial Summary Callout */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-tertiary-50 text-tertiary-600 dark:bg-tertiary-950">
                  <TrendingUp className="size-4" />
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  المدفوعات والتحصيل
                </h4>
              </div>
              <span className="text-[11px] font-bold text-emerald-600">
                +19.4% نمو
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="text-[10px] text-muted-foreground block">
                  إجمالي التحصيل اليوم
                </span>
                <div className="flex items-center gap-1 font-bold text-foreground text-sm">
                  <span>38,450</span>
                  <SaudiRiyal className="size-3 text-muted-foreground" />
                </div>
              </div>

              <Link
                to={ROUTES.payments}
                viewTransition
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                تقرير المدفوعات ←
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* 4. Overview Contracts & Real Estate Data Table */}
      <section aria-label="جدول العقود والعقارات الأخيرة">
        <FadeIn direction="none" delay={0.2} duration={0.4}>
          <OverviewContractsTable />
        </FadeIn>
      </section>
    </div>
  );
}
