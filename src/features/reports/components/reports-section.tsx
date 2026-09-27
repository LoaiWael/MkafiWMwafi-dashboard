import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DailyContractsChart from "./daily-contracts-chart";
import DailyPerformanceChart from "./daily-performance-chart";
import DailyReportsTable from "./daily-reports-table";
import DailyRevenueChart from "./daily-revenue-chart";
import ReportsDistributionCharts from "./reports-distribution-charts";
import ReportsStatCards from "./reports-stat-cards";
import { DAILY_REPORTS_DATA } from "../constants";
import type { ReportPeriod, ReportsSummaryKPIs } from "../types";

export default function ReportsSection() {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Slice data based on selected period
  const currentPeriodData =
    selectedPeriod === "7d"
      ? DAILY_REPORTS_DATA.slice(0, 7)
      : selectedPeriod === "14d"
        ? DAILY_REPORTS_DATA.slice(0, 14)
        : DAILY_REPORTS_DATA;

  const periodLabel =
    selectedPeriod === "7d"
      ? "آخر 7 أيام"
      : selectedPeriod === "14d"
        ? "آخر 14 يوم"
        : selectedPeriod === "30d"
          ? "آخر 30 يوم"
          : "الفترة المحددة";

  // Compute summary statistics for selected period
  const totalContracts = currentPeriodData.reduce(
    (acc, c) => acc + c.totalContracts,
    0,
  );
  const residentialContracts = currentPeriodData.reduce(
    (acc, c) => acc + c.residentialContracts,
    0,
  );
  const commercialContracts = currentPeriodData.reduce(
    (acc, c) => acc + c.commercialContracts,
    0,
  );
  const totalRevenue = currentPeriodData.reduce(
    (acc, c) => acc + c.totalRevenue,
    0,
  );
  const totalRequests = currentPeriodData.reduce(
    (acc, c) => acc + c.requestsCount,
    0,
  );
  const completedCount = currentPeriodData.reduce(
    (acc, c) => acc + c.completedCount,
    0,
  );

  const ejarTotal = currentPeriodData.reduce(
    (acc, c) => acc + c.ejarSuccessRate,
    0,
  );
  const ejarSyncRate = Number(
    (ejarTotal / (currentPeriodData.length || 1)).toFixed(1),
  );

  const timeTotal = currentPeriodData.reduce(
    (acc, c) => acc + c.avgProcessingTimeMin,
    0,
  );
  const avgProcessingMinutes = Number(
    (timeTotal / (currentPeriodData.length || 1)).toFixed(1),
  );

  const completionRate = Number(
    ((completedCount / (totalRequests || 1)) * 100).toFixed(1),
  );

  const summaryKPIs: ReportsSummaryKPIs = {
    totalContracts,
    contractsGrowthRate: 14.6,
    totalRevenue,
    revenueGrowthRate: 18.2,
    residentialContracts,
    commercialContracts,
    ejarSyncRate,
    avgProcessingMinutes,
    totalRequests,
    completionRate,
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("تم تحديث بيانات ومؤشرات التقارير اليومية", {
        description:
          "تمت مزامنة أحدث السجلات التشغيلية مع شبكة إيجار وأنظمة المدفوعات.",
      });
    }, 600);
  };

  const handleExportFullReport = () => {
    toast.info("ميزة تصدير التقرير قيد التطوير", {
      description: `يجري العمل على إتاحة تصدير التقارير الشاملة بصيغتي Excel و PDF قريباً (${periodLabel}).`,
    });
  };

  return (
    <div className="page-shell space-y-6 sm:space-y-8 py-4 sm:py-8">
      {/* Header Section */}
      <PageHeader
        title="التقارير اليومية والتشغيلية"
        description="متابعة دقيقة لحجم توثيق العقود السكنية والتجارية، الإيرادات والرسوم المحصلة، وسرعة الربط مع شبكة إيجار والهيئة العامة للعقار."
        showRefresh
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        refreshTooltip="مزامنة وتحديث البيانات"
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Period selector */}
            <div className="inline-flex rounded-full border border-border/80 bg-muted/40 p-1">
              <Button
                variant={selectedPeriod === "7d" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod("7d")}
                className="h-8 rounded-full px-3 text-xs font-semibold"
              >
                7 أيام
              </Button>
              <Button
                variant={selectedPeriod === "14d" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod("14d")}
                className="h-8 rounded-full px-3 text-xs font-semibold"
              >
                14 يوم
              </Button>
              <Button
                variant={selectedPeriod === "30d" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedPeriod("30d")}
                className="h-8 rounded-full px-3 text-xs font-semibold"
              >
                30 يوم
              </Button>
            </div>

            {/* Export Report Action (Under Development) */}
            <TooltipProvider delay={100}>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={handleExportFullReport}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3.5 text-xs font-semibold text-foreground transition-all hover:bg-muted active:scale-98"
                  aria-label="تصدير التقرير الشامل"
                >
                  <Download className="size-3.5 text-primary" />
                  <span>تصدير التقرير</span>
                  <span className="rounded-full bg-muted/90 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    قيد التطوير
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6} className="text-xs">
                  تصدير التقرير الشامل ({periodLabel}) — قيد التطوير
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
      />

      {/* KPI Overview Summary Cards */}
      <section aria-label="مؤشرات الأداء الرئيسية">
        <FadeIn direction="up" duration={0.4}>
          <ReportsStatCards summary={summaryKPIs} periodLabel={periodLabel} />
        </FadeIn>
      </section>

      {/* Main Charts: Daily Volume & Revenue */}
      <section aria-label="الرسوم البيانية اليومية">
        <StaggerContainer
          staggerDelay={0.08}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <StaggerItem>
            <DailyContractsChart data={currentPeriodData} />
          </StaggerItem>

          <StaggerItem>
            <DailyRevenueChart data={currentPeriodData} />
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Secondary Charts: Operational Performance & Categorical Breakdown */}
      <section aria-label="تحليلات الكفاءة والتوزيعات">
        <StaggerContainer
          staggerDelay={0.08}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <StaggerItem>
            <DailyPerformanceChart data={currentPeriodData} />
          </StaggerItem>

          <StaggerItem>
            <ReportsDistributionCharts />
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Daily Records & Operations Breakdown Table */}
      <section aria-label="سجل العمليات اليومية">
        <FadeIn direction="up" delay={0.15} duration={0.4}>
          <DailyReportsTable data={currentPeriodData} />
        </FadeIn>
      </section>
    </div>
  );
}
