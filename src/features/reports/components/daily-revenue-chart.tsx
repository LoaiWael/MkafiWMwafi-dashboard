import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { SaudiRiyal, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { revenueChartConfig } from "../constants";
import type { DailyReportRecord } from "../types";

interface DailyRevenueChartProps {
  data: DailyReportRecord[];
}

export default function DailyRevenueChart({ data }: DailyRevenueChartProps) {
  const chartData = [...data]
    .reverse()
    .map((item) => {
      const parts = item.date.split("-");
      const shortDate = `${parts[1]}/${parts[2]}`;
      return {
        date: item.date,
        displayDate: shortDate,
        dayName: item.dayName,
        totalRevenue: item.totalRevenue,
        requestsCount: item.requestsCount,
      };
    });

  const totalPeriodRevenue = data.reduce((acc, curr) => acc + curr.totalRevenue, 0);

  const maxRevenueDay =
    data.length > 0
      ? [...data].sort((a, b) => b.totalRevenue - a.totalRevenue)[0]
      : null;

  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="flex flex-col gap-3 border-b border-border/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-foreground sm:text-lg">
              الإيرادات اليومية وحركة الطلبات
            </CardTitle>
            <Badge variant="outline" className="gap-1 text-xs border-tertiary/40 text-tertiary-700 dark:text-tertiary-300">
              <SaudiRiyal className="size-3.5" />
              <span>{totalPeriodRevenue.toLocaleString()}</span>
            </Badge>
          </div>
          <CardDescription className="mt-1 text-xs text-muted-foreground">
            إجمالي رسوم التوثيق المحصلة ومقارنتها بعدد الطلبات الواردة يومياً
          </CardDescription>
        </div>

        {maxRevenueDay && (
          <div className="flex items-center gap-2 rounded-lg bg-tertiary-50/70 dark:bg-tertiary-950/40 border border-tertiary-200/60 dark:border-tertiary-900/50 px-3 py-1.5 text-xs">
            <TrendingUp className="size-4 text-tertiary" />
            <div>
              <span className="text-muted-foreground">أعلى يوم: </span>
              <strong className="inline-flex items-center gap-1 font-semibold text-foreground">
                <span>{maxRevenueDay.dayName} ({maxRevenueDay.totalRevenue.toLocaleString()}</span>
                <SaudiRiyal className="size-3 text-muted-foreground" />
                <span>)</span>
              </strong>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-6">
        <div className="h-72 w-full sm:h-80">
          <ChartContainer config={revenueChartConfig} className="h-full w-full">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--tertiary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--tertiary)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
              <XAxis
                dataKey="displayDate"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-[11px] text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                className="text-[11px] text-muted-foreground"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      if (name === "totalRevenue") {
                        return (
                          <div className="flex w-full items-center justify-between gap-2">
                            <span className="text-muted-foreground">الإيراد:</span>
                            <span className="inline-flex items-center gap-0.5 font-bold text-foreground">
                              <span>{Number(value).toLocaleString()}</span>
                              <SaudiRiyal className="size-3 text-muted-foreground" />
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="text-muted-foreground">الطلبات:</span>
                          <span className="font-bold text-foreground">
                            {Number(value)} طلب
                          </span>
                        </div>
                      );
                    }}
                    labelFormatter={(val, payload) => {
                      const item = payload?.[0]?.payload;
                      return item ? `${item.dayName} (${item.date})` : val;
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="totalRevenue"
                name="totalRevenue"
                stroke="var(--tertiary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
