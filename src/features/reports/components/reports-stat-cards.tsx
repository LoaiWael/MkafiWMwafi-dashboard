import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  FileCheck2,
  SaudiRiyal,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ReportsSummaryKPIs } from "../types";

interface ReportsStatCardsProps {
  summary: ReportsSummaryKPIs;
  periodLabel: string;
}

interface StatSubMetric {
  label: string;
  value: string;
  isCurrency?: boolean;
}

interface StatCardItem {
  id: string;
  title: string;
  value: string;
  unit?: string;
  isCurrency?: boolean;
  growth: number;
  growthIsPositiveGood?: boolean;
  icon: typeof FileCheck2;
  description: string;
  subMetrics?: StatSubMetric[];
  colorStyle: {
    card: string;
    iconBg: string;
  };
}

export default function ReportsStatCards({
  summary,
  periodLabel,
}: ReportsStatCardsProps) {
  const cards: StatCardItem[] = [
    {
      id: "contracts",
      title: "إجمالي العقود الموثقة",
      value: summary.totalContracts.toLocaleString(),
      unit: "عقد موثق",
      growth: summary.contractsGrowthRate,
      icon: FileCheck2,
      description: `مقارنة بالفترة السابقة (${periodLabel})`,
      subMetrics: [
        { label: "سكني", value: summary.residentialContracts.toLocaleString() },
        { label: "تجاري", value: summary.commercialContracts.toLocaleString() },
      ],
      colorStyle: {
        card: "bg-primary-50/50 border-primary-100/70 dark:bg-primary-950/20 dark:border-primary-900/40",
        iconBg: "bg-primary-100 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300",
      },
    },
    {
      id: "revenue",
      title: "إجمالي الإيرادات ورسوم التوثيق",
      value: summary.totalRevenue.toLocaleString(),
      isCurrency: true,
      growth: summary.revenueGrowthRate,
      icon: SaudiRiyal,
      description: `رسوم التوثيق والخدمات الإلكترونية المعتمدة`,
      subMetrics: [
        {
          label: "معدل اليوم",
          value: Math.round(summary.totalRevenue / 30).toLocaleString(),
          isCurrency: true,
        },
        {
          label: "متوسط العقد",
          value: Math.round(summary.totalRevenue / (summary.totalContracts || 1)).toLocaleString(),
          isCurrency: true,
        },
      ],
      colorStyle: {
        card: "bg-tertiary-50/50 border-tertiary-100/70 dark:bg-tertiary-950/20 dark:border-tertiary-900/40",
        iconBg: "bg-tertiary-100 text-tertiary-700 dark:bg-tertiary-900/60 dark:text-tertiary-300",
      },
    },
    {
      id: "ejar-sync",
      title: "معدل نجاح الربط مع شبكة إيجار",
      value: `${summary.ejarSyncRate}%`,
      unit: "نجاح فوري",
      growth: 0.8,
      icon: ShieldCheck,
      description: "توثيق رسمي متوافق مع الهيئة العامة للعقار وأبشر",
      subMetrics: [
        { label: "حساب المواطن", value: "متوافق 100%" },
        { label: "الضمان المطور", value: "متوافق 100%" },
      ],
      colorStyle: {
        card: "bg-secondary-50/50 border-secondary-100/70 dark:bg-secondary-950/20 dark:border-secondary-900/40",
        iconBg: "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/60 dark:text-secondary-300",
      },
    },
    {
      id: "processing-time",
      title: "متوسط زمن إتمام التوثيق",
      value: `${summary.avgProcessingMinutes}`,
      unit: "دقائق / عقد",
      growth: -12.5, // Faster is better
      growthIsPositiveGood: false,
      icon: Clock,
      description: "من تقديم الطلب حتى إصدار العقد المعتمد",
      subMetrics: [
        { label: "الطلبات الواردة", value: summary.totalRequests.toLocaleString() },
        { label: "نسبة الإنجاز", value: `${summary.completionRate}%` },
      ],
      colorStyle: {
        card: "bg-muted/40 border-border/80 dark:bg-card dark:border-border/60",
        iconBg: "bg-primary-100 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.growth > 0;
        const isGood =
          card.growthIsPositiveGood === false ? !isPositive : isPositive;

        return (
          <Card
            key={card.id}
            className={cn(
              "relative overflow-hidden border transition-all duration-200 hover:shadow-sm",
              card.colorStyle.card,
            )}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xs font-semibold text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    <bdi>{card.value}</bdi>
                  </span>
                  {card.isCurrency ? (
                    <SaudiRiyal className="size-4 text-muted-foreground" />
                  ) : card.unit ? (
                    <span className="text-xs font-medium text-muted-foreground">
                      {card.unit}
                    </span>
                  ) : null}
                </div>
              </div>

              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  card.colorStyle.iconBg,
                )}
              >
                <Icon className="size-5" />
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs">
                <div
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold",
                    isGood
                      ? "bg-tertiary-100 text-tertiary-700 dark:bg-tertiary-950 dark:text-tertiary-400"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {isPositive ? (
                    <ArrowUpRight className="size-3.5" />
                  ) : (
                    <ArrowDownRight className="size-3.5" />
                  )}
                  <bdi>{Math.abs(card.growth)}%</bdi>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {card.description}
                </span>
              </div>

              {card.subMetrics && card.subMetrics.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2.5">
                  {card.subMetrics.map((sub, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md bg-background/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground shadow-2xs"
                    >
                      <span>{sub.label}:</span>
                      <span className="inline-flex items-center gap-0.5 font-semibold text-foreground">
                        <span>{sub.value}</span>
                        {sub.isCurrency && (
                          <SaudiRiyal className="size-3 text-muted-foreground" />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
