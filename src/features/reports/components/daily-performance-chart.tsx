import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Clock, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { performanceChartConfig } from "../constants";
import type { DailyReportRecord } from "../types";

interface DailyPerformanceChartProps {
  data: DailyReportRecord[];
}

export default function DailyPerformanceChart({
  data,
}: DailyPerformanceChartProps) {
  const chartData = [...data].reverse().map((item) => {
    const parts = item.date.split("-");
    const shortDate = `${parts[1]}/${parts[2]}`;
    return {
      date: item.date,
      displayDate: shortDate,
      dayName: item.dayName,
      ejarSuccessRate: item.ejarSuccessRate,
      avgProcessingTimeMin: item.avgProcessingTimeMin,
    };
  });

  const avgSuccessRate = data.length
    ? (
        data.reduce((acc, curr) => acc + curr.ejarSuccessRate, 0) / data.length
      ).toFixed(1)
    : "0";

  const avgTime = data.length
    ? (
        data.reduce((acc, curr) => acc + curr.avgProcessingTimeMin, 0) /
        data.length
      ).toFixed(1)
    : "0";

  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="flex flex-col gap-3 border-b border-border/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-bold text-foreground sm:text-lg">
            كفاءة التشغيل وسرعة الربط مع إيجار
          </CardTitle>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 rounded-md bg-tertiary-50 dark:bg-tertiary-950/40 px-2.5 py-1 text-tertiary-700 dark:text-tertiary-300 font-medium">
            <ShieldCheck className="size-3.5" />
            <span>نجاح إيجار: {avgSuccessRate}%</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-secondary-50 dark:bg-secondary-950/40 px-2.5 py-1 text-secondary-700 dark:text-secondary-300 font-medium">
            <Clock className="size-3.5" />
            <span>متوسط الزمن: {avgTime} دقيقة</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="h-72 w-full sm:h-80">
          <ChartContainer
            config={performanceChartConfig}
            className="h-full w-full"
          >
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
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
                yAxisId="rate"
                domain={[95, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(val) => `${val}%`}
                className="text-[11px] text-muted-foreground"
              />
              <YAxis
                yAxisId="time"
                orientation="right"
                domain={[0, 15]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(val) => `${val}د`}
                className="text-[11px] text-muted-foreground"
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      if (name === "ejarSuccessRate") {
                        return (
                          <div className="flex w-full items-center justify-between gap-2">
                            <span className="text-muted-foreground">
                              نجاح إيجار:
                            </span>
                            <span className="font-bold text-foreground">
                              {Number(value)}%
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div className="flex w-full items-center justify-between gap-2">
                          <span className="text-muted-foreground">
                            زمن المعالجة:
                          </span>
                          <span className="font-bold text-foreground">
                            {Number(value)} دقيقة
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
              <Line
                yAxisId="rate"
                type="monotone"
                dataKey="ejarSuccessRate"
                name="ejarSuccessRate"
                stroke="var(--tertiary)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "var(--tertiary)" }}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="time"
                type="monotone"
                dataKey="avgProcessingTimeMin"
                name="avgProcessingTimeMin"
                stroke="var(--secondary)"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: "var(--secondary)" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
