import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { SaudiRiyal, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const chartData = [...data].reverse().map((item) => {
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

  const maxRevenueDay =
    data.length > 0
      ? [...data].sort((a, b) => b.totalRevenue - a.totalRevenue)[0]
      : null;

  const maxRevenueDayDisplayDate = maxRevenueDay
    ? maxRevenueDay.date.split("-").slice(1).join("/")
    : "";

  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="flex flex-col gap-3 border-b border-border/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-bold text-foreground sm:text-lg">
            الإيرادات اليومية وحركة الطلبات
          </CardTitle>
        </div>

        {maxRevenueDay && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-tertiary-200/60 bg-tertiary-50/60 px-3 py-1.5 text-xs dark:border-tertiary-900/50 dark:bg-tertiary-950/40 sm:gap-2.5">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="size-3.5 text-tertiary" />
              <span className="text-muted-foreground">أعلى يوم:</span>
              <strong className="font-semibold text-foreground">
                {maxRevenueDay.dayName} ({maxRevenueDayDisplayDate})
              </strong>
            </div>
            <div className="inline-flex items-center gap-1 rounded-md bg-tertiary/15 px-2 py-0.5 font-bold text-tertiary dark:bg-tertiary-500/20">
              <span>{maxRevenueDay.totalRevenue.toLocaleString()}</span>
              <SaudiRiyal className="size-3.5" />
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
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--tertiary)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--tertiary)"
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-border/40"
              />
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
                            <span className="text-muted-foreground">
                              الإيراد:
                            </span>
                            <span className="inline-flex items-center gap-0.5 font-bold text-foreground">
                              <span>{Number(value).toLocaleString()}</span>
                              <SaudiRiyal className="size-3 text-muted-foreground" />
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="text-muted-foreground">
                            الطلبات:
                          </span>
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
