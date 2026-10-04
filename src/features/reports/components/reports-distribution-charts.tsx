import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Building2,
  MapPin,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import {
  PAYMENT_FREQUENCY_DISTRIBUTION,
  REGIONAL_DISTRIBUTION,
  UNIT_TYPES_DISTRIBUTION,
  regionalChartConfig,
} from "../constants";

function RegionYAxisTick({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) {
  if (!payload || x === undefined || y === undefined) return null;
  return (
    <text
      x={x - 12}
      y={y}
      dy={4}
      textAnchor="start"
      className="fill-foreground text-[11px] font-semibold"
    >
      {payload.value}
    </text>
  );
}

export default function ReportsDistributionCharts() {
  const [activeTab, setActiveTab] = useState<"regions" | "units" | "payments">(
    "regions",
  );

  return (
    <Card className="border-border/70 shadow-xs">
      <CardHeader className="flex flex-col gap-4 border-b border-border/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-bold text-foreground sm:text-lg">
            توزيع وتحليل بيانات العقود والعمليات
          </CardTitle>
        </div>

        {/* Tab switchers - horizontally scrollable on mobile */}
        <div className="flex max-w-full overflow-x-auto no-scrollbar rounded-full border border-border/80 bg-muted/50 p-0.5 whitespace-nowrap shrink-0">
          <Button
            variant={activeTab === "regions" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("regions")}
            className="h-7 gap-1.5 rounded-full px-2.5 text-xs font-medium shrink-0"
          >
            <MapPin className="size-3.5 text-primary" />
            <span>المناطق والمدن</span>
          </Button>
          <Button
            variant={activeTab === "units" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("units")}
            className="h-7 gap-1.5 rounded-full px-2.5 text-xs font-medium shrink-0"
          >
            <Building2 className="size-3.5 text-secondary" />
            <span>أنواع الوحدات</span>
          </Button>
          <Button
            variant={activeTab === "payments" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("payments")}
            className="h-7 gap-1.5 rounded-full px-2.5 text-xs font-medium shrink-0"
          >
            <Wallet className="size-3.5 text-tertiary" />
            <span>تكرار دفعات الإيجار</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Tab 1: Regional Distribution */}
        {activeTab === "regions" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h4 className="mb-3 text-xs font-semibold text-muted-foreground">
                كثافة التوثيق حسب مناطق المملكة (عقد)
              </h4>
              <div className="h-64 w-full">
                <ChartContainer
                  config={regionalChartConfig}
                  className="h-full w-full"
                >
                  <BarChart
                    data={REGIONAL_DISTRIBUTION}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      className="stroke-border/40"
                    />
                    <XAxis
                      type="number"
                      className="text-[11px] text-muted-foreground"
                    />
                    <YAxis
                      dataKey="region"
                      type="category"
                      width={110}
                      tickLine={false}
                      axisLine={false}
                      tick={<RegionYAxisTick />}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(val) => (
                            <span className="font-bold text-foreground">
                              {Number(val).toLocaleString()} عقد
                            </span>
                          )}
                        />
                      }
                    />
                    <Bar
                      dataKey="contractsCount"
                      fill="var(--primary)"
                      radius={[0, 4, 4, 0]}
                    >
                      {REGIONAL_DISTRIBUTION.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index === 0
                              ? "var(--primary)"
                              : index === 1
                                ? "var(--primary-600)"
                                : "var(--primary-400)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

            <div className="space-y-3 lg:col-span-5 lg:border-s lg:border-border/60 lg:ps-6">
              <h4 className="text-xs font-semibold text-muted-foreground">
                الحصص والنسب المئوية للمناطق
              </h4>
              <div className="space-y-3">
                {REGIONAL_DISTRIBUTION.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">
                        {item.region}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {item.contractsCount} عقد
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {item.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={item.percentage}
                      className="h-1.5 bg-muted"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Unit Types Distribution */}
        {activeTab === "units" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-3.5 lg:col-span-7">
              <h4 className="text-xs font-semibold text-muted-foreground">
                توزيع العقود الموثقة حسب نوع الوحدة العقارية
              </h4>
              <div className="space-y-3">
                {UNIT_TYPES_DISTRIBUTION.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-2.5 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {item.name}
                        </span>
                        <Badge
                          variant={
                            item.category === "residential"
                              ? "default"
                              : "secondary"
                          }
                          className="text-[10px] px-1.5 py-0"
                        >
                          {item.category === "residential" ? "سكني" : "تجاري"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">
                          {item.count} عقد
                        </span>
                        <span className="text-muted-foreground">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={item.percentage * 2}
                      className="h-1.5 bg-muted"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-xl bg-muted/30 p-5 lg:col-span-5">
              <h4 className="mb-4 text-xs font-semibold text-muted-foreground text-center">
                نسبة السكني مقابل التجاري
              </h4>
              <div className="relative mx-auto flex size-44 items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "عقود سكنية",
                          value: 72.3,
                          fill: "var(--primary)",
                        },
                        {
                          name: "عقود تجارية",
                          value: 27.7,
                          fill: "var(--secondary)",
                        },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      <Cell fill="var(--primary)" />
                      <Cell fill="var(--secondary)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute text-center">
                  <span className="text-xl font-bold text-foreground">
                    72.3%
                  </span>
                  <p className="text-[10px] text-muted-foreground">سكني</p>
                </div>
              </div>

              <div className="mt-4 flex justify-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-primary" />
                  <span>سكني (72.3%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-secondary" />
                  <span>تجاري (27.7%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Payment Frequency */}
        {activeTab === "payments" && (
          <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-2">
              <Wallet className="size-4 text-secondary" />
              <h4 className="text-xs font-bold text-foreground">
                تكرار دفعات الإيجار في العقود
              </h4>
            </div>
            <div className="space-y-3">
              {PAYMENT_FREQUENCY_DISTRIBUTION.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {item.frequency}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {item.count} عقد
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {item.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={item.percentage}
                    className="h-1.5 bg-muted"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
