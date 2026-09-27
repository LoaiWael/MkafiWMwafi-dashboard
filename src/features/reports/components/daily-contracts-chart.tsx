import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart2,
  Building2,
  FileCheck2,
  Home,
  LineChart as LineChartIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { contractsChartConfig } from "../constants";
import type { DailyReportRecord } from "../types";

interface DailyContractsChartProps {
  data: DailyReportRecord[];
}

export default function DailyContractsChart({ data }: DailyContractsChartProps) {
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [activeFilter, setActiveFilter] = useState<"all" | "residential" | "commercial">("all");

  // Format data for chart (sorted chronological for the x-axis)
  const chartData = [...data]
    .reverse()
    .map((item) => {
      const parts = item.date.split("-");
      const shortDate = `${parts[1]}/${parts[2]}`; // MM/DD
      return {
        date: item.date,
        displayDate: shortDate,
        dayName: item.dayName,
        totalContracts: item.totalContracts,
        residentialContracts: item.residentialContracts,
        commercialContracts: item.commercialContracts,
      };
    });

  const totalContractsInPeriod = data.reduce((acc, curr) => acc + curr.totalContracts, 0);
  const totalResidential = data.reduce((acc, curr) => acc + curr.residentialContracts, 0);
  const totalCommercial = data.reduce((acc, curr) => acc + curr.commercialContracts, 0);

  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="flex flex-col gap-4 border-b border-border/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-foreground sm:text-lg">
              حجم توثيق العقود اليومي (سكني وتجاري)
            </CardTitle>
            <Badge variant="secondary" className="gap-1 text-xs">
              <FileCheck2 className="size-3 text-primary" />
              <span>{totalContractsInPeriod} عقد</span>
            </Badge>
          </div>
          <CardDescription className="mt-1 text-xs text-muted-foreground">
            تطور أعداد العقود المعتمدة رسمياً بشبكة إيجار يومياً حسب نوع النشاط
          </CardDescription>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart visual type toggle */}
          <div className="inline-flex rounded-full border border-border/80 bg-muted/50 p-0.5">
            <Button
              variant={chartType === "area" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setChartType("area")}
              className="h-7 gap-1.5 rounded-full px-2.5 text-xs font-medium"
            >
              <LineChartIcon className="size-3.5" />
              <span>مساحي</span>
            </Button>
            <Button
              variant={chartType === "bar" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setChartType("bar")}
              className="h-7 gap-1.5 rounded-full px-2.5 text-xs font-medium"
            >
              <BarChart2 className="size-3.5" />
              <span>أعمدة</span>
            </Button>
          </div>

          {/* Series toggle filter */}
          <div className="inline-flex rounded-full border border-border/80 bg-muted/50 p-0.5">
            <Button
              variant={activeFilter === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter("all")}
              className="h-7 rounded-full px-2 text-xs font-medium"
            >
              الكل
            </Button>
            <Button
              variant={activeFilter === "residential" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter("residential")}
              className="h-7 gap-1 rounded-full px-2 text-xs font-medium"
            >
              <Home className="size-3 text-primary" />
              <span>سكني</span>
            </Button>
            <Button
              variant={activeFilter === "commercial" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter("commercial")}
              className="h-7 gap-1 rounded-full px-2 text-xs font-medium"
            >
              <Building2 className="size-3 text-secondary" />
              <span>تجاري</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Quick summary badges bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/40 p-2.5 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">عقود سكنية:</span>
              <span className="font-bold text-foreground">
                {totalResidential.toLocaleString()} ({Math.round((totalResidential / (totalContractsInPeriod || 1)) * 100)}%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-secondary" />
              <span className="text-muted-foreground">عقود تجارية:</span>
              <span className="font-bold text-foreground">
                {totalCommercial.toLocaleString()} ({Math.round((totalCommercial / (totalContractsInPeriod || 1)) * 100)}%)
              </span>
            </div>
          </div>
          <div className="text-muted-foreground">
            المتوسط اليومي: <strong className="text-foreground">{Math.round(totalContractsInPeriod / (chartData.length || 1))} عقد/يوم</strong>
          </div>
        </div>

        {/* Chart Viewport */}
        <div className="h-72 w-full sm:h-80">
          <ChartContainer config={contractsChartConfig} className="h-full w-full">
            {chartType === "area" ? (
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="residentialGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="commercialGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0.0} />
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
                  className="text-[11px] text-muted-foreground"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(val, payload) => {
                        const item = payload?.[0]?.payload;
                        return item ? `${item.dayName} (${item.date})` : val;
                      }}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                {(activeFilter === "all" || activeFilter === "residential") && (
                  <Area
                    type="monotone"
                    dataKey="residentialContracts"
                    name="residentialContracts"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#residentialGradient)"
                  />
                )}
                {(activeFilter === "all" || activeFilter === "commercial") && (
                  <Area
                    type="monotone"
                    dataKey="commercialContracts"
                    name="commercialContracts"
                    stroke="var(--secondary)"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#commercialGradient)"
                  />
                )}
              </AreaChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
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
                  className="text-[11px] text-muted-foreground"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(val, payload) => {
                        const item = payload?.[0]?.payload;
                        return item ? `${item.dayName} (${item.date})` : val;
                      }}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                {(activeFilter === "all" || activeFilter === "residential") && (
                  <Bar
                    dataKey="residentialContracts"
                    name="residentialContracts"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                )}
                {(activeFilter === "all" || activeFilter === "commercial") && (
                  <Bar
                    dataKey="commercialContracts"
                    name="commercialContracts"
                    fill="var(--secondary)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                )}
              </BarChart>
            )}
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
