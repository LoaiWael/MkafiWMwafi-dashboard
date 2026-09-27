import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock,
  FileCheck2,
  Plus,
  SaudiRiyal,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
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
              to={ROUTES.requests}
              viewTransition
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-8.5 sm:h-9 flex-1 sm:flex-initial gap-1.5 rounded-xl px-3 text-[11px] sm:text-xs font-semibold active:scale-98",
              )}
            >
              <FileCheck2 className="size-4 text-primary shrink-0" />
              <span>متابعة الطلبات</span>
            </Link>

            <Link
              to={ROUTES.contracts}
              viewTransition
              className={cn(
                buttonVariants({ variant: "primary", size: "sm" }),
                "h-8.5 sm:h-9 flex-1 sm:flex-initial gap-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-3 text-[11px] sm:text-xs font-semibold shadow-xs active:scale-98",
              )}
            >
              <Plus className="size-4 shrink-0" />
              <span>توثيق عقد جديد</span>
            </Link>
          </div>
        }
      />

      {/* 2. Official Regulatory Gateway Integration Live Status Strip */}
      <FadeIn duration={0.3} delay={0.05}>
        <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-xs">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Live Integrations Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span>حالة الربط المباشر:</span>
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50/80 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>شبكة إيجار (نشط ومزامن)</span>
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-primary-200 bg-primary-50/80 px-2.5 py-1 text-[11px] font-semibold text-primary-800 dark:border-primary-800 dark:bg-primary-950/60 dark:text-primary-300">
                <BadgeCheck className="size-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
                <span>نفاذ الوطني (موثق)</span>
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-secondary-200 bg-secondary-50/80 px-2.5 py-1 text-[11px] font-semibold text-secondary-800 dark:border-secondary-800 dark:bg-secondary-950/60 dark:text-secondary-300">
                <CheckCircle2 className="size-3.5 text-secondary-600 dark:text-secondary-400 shrink-0" />
                <span>رخصة فال (REGA)</span>
              </div>
            </div>

            {/* Quick System Metric */}
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground border-t border-border/40 pt-2 lg:border-t-0 lg:pt-0">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                متوسط وقت التوثيق: <strong className="text-foreground">12 دقيقة</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Zap className="size-3.5 text-amber-500" />
                المطابقة الفورية للصكوك: <strong className="text-emerald-600">99.8%</strong>
              </span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* 3. Status Cards Grid with Numbers */}
      <section aria-label="إحصائيات وحالة المنصة">
        <StaggerContainer
          staggerDelay={0.06}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {OVERVIEW_STATS.map((stat) => (
            <StaggerItem key={stat.id}>
              <OverviewStatCard stat={stat} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 4. Quick Operational Insights Strip */}
      <FadeIn duration={0.3} delay={0.15}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Contracts Mix Ratio */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs space-y-3">
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

          {/* Card 2: Ejar Network Live Sync Efficiency */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                  <ShieldCheck className="size-4" />
                </div>
                <h4 className="text-xs font-bold text-foreground">
                  كفاءة المزامنة التلقائية
                </h4>
              </div>
              <Badge
                variant="outline"
                className="border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold"
              >
                99.4% نجاح
              </Badge>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              إصدار العقود ومطابقة الصكوك العقارية وسجلات المنشآت اللحظية عبر
              بوابات الربط المعتمدة دون أي تأخير يدوي.
            </p>
          </div>

          {/* Card 3: Financial Summary Callout */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-2xs space-y-3 sm:col-span-2 lg:col-span-1">
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

      {/* 5. Overview Contracts & Real Estate Data Table */}
      <section aria-label="جدول العقود والعقارات الأخيرة">
        <FadeIn direction="up" delay={0.2} duration={0.4}>
          <OverviewContractsTable />
        </FadeIn>
      </section>
    </div>
  );
}
