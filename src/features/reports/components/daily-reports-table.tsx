import { useState } from "react";
import {
  Building2,
  Calendar,
  Clock,
  Eye,
  FileSpreadsheet,
  Home,
  SaudiRiyal,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilterConfig,
} from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DailyReportRecord } from "../types";

interface DailyReportsTableProps {
  data: DailyReportRecord[];
}

export default function DailyReportsTable({ data }: DailyReportsTableProps) {
  const [selectedDay, setSelectedDay] = useState<DailyReportRecord | null>(null);

  const handleExportCSV = () => {
    toast.info("ميزة تصدير ملف Excel قيد التطوير", {
      description: "يجري العمل على إتاحة تنزيل سجل العمليات اليومية بصيغة Excel/CSV قريباً.",
    });
  };

  const columns: DataTableColumn<DailyReportRecord>[] = [
    {
      id: "date",
      header: "التاريخ واليوم",
      accessorKey: "date",
      sortable: true,
      minWidth: "160px",
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">
            {item.dayName}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {item.date}
          </span>
        </div>
      ),
    },
    {
      id: "totalContracts",
      header: "العقود الموثقة",
      accessorKey: "totalContracts",
      sortable: true,
      minWidth: "120px",
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-foreground">
            {item.totalContracts}
          </span>
          <span className="text-xs text-muted-foreground">عقد</span>
        </div>
      ),
    },
    {
      id: "breakdown",
      header: "تفصيل العقود",
      minWidth: "150px",
      cell: (item) => (
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 font-medium text-primary">
            <Home className="size-3.5" />
            <span>{item.residentialContracts} سكني</span>
          </span>
          <span className="text-muted-foreground">/</span>
          <span className="inline-flex items-center gap-1 font-medium text-secondary">
            <Building2 className="size-3.5" />
            <span>{item.commercialContracts} تجاري</span>
          </span>
        </div>
      ),
    },
    {
      id: "totalRevenue",
      header: "الإيرادات المحصلة",
      accessorKey: "totalRevenue",
      sortable: true,
      align: "end",
      minWidth: "140px",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1 text-sm font-bold text-foreground sm:text-base">
          <span>{item.totalRevenue.toLocaleString()}</span>
          <SaudiRiyal className="size-3.5 text-muted-foreground" />
        </div>
      ),
    },
    {
      id: "ejarSuccessRate",
      header: "ربط إيجار",
      accessorKey: "ejarSuccessRate",
      sortable: true,
      align: "center",
      minWidth: "120px",
      cell: (item) => {
        const isHigh = item.ejarSuccessRate >= 99.0;
        return (
          <Badge
            variant={isHigh ? "secondary" : "outline"}
            className="gap-1 font-mono text-xs px-2 py-0.5"
          >
            <ShieldCheck className="size-3.5 text-tertiary" />
            <span>{item.ejarSuccessRate}%</span>
          </Badge>
        );
      },
    },
    {
      id: "avgProcessingTimeMin",
      header: "متوسط الزمن",
      accessorKey: "avgProcessingTimeMin",
      sortable: true,
      minWidth: "120px",
      cell: (item) => (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          <span>{item.avgProcessingTimeMin} دقيقة</span>
        </div>
      ),
    },
    {
      id: "status",
      header: "حالة اليوم",
      align: "center",
      minWidth: "100px",
      cell: (item) => {
        const isHighPerforming = item.ejarSuccessRate >= 99.0;
        const isNormal = item.ejarSuccessRate >= 98.0 && !isHighPerforming;

        if (isHighPerforming) {
          return (
            <Badge className="border-0 bg-tertiary-100 text-xs font-medium text-tertiary-700 hover:bg-tertiary-100 dark:bg-tertiary-950 dark:text-tertiary-300">
              ممتاز
            </Badge>
          );
        }
        if (isNormal) {
          return (
            <Badge variant="outline" className="text-xs font-medium text-foreground">
              مستقر
            </Badge>
          );
        }
        return (
          <Badge variant="destructive" className="text-xs font-medium">
            تنبيه
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "التفاصيل",
      align: "center",
      minWidth: "90px",
      cell: (item) => (
        <div className="flex items-center justify-center">
          <TooltipProvider delay={100}>
            <Tooltip>
              <TooltipTrigger
                type="button"
                onClick={() => setSelectedDay(item)}
                className="inline-flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label={`عرض تفاصيل يوم ${item.dayName} ${item.date}`}
              >
                <Eye className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6} className="text-xs">
                معاينة تفاصيل اليوم
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  const filterConfigs: DataTableFilterConfig<DailyReportRecord>[] = [
    {
      id: "dayName",
      title: "يوم الأسبوع",
      accessorKey: "dayName",
      options: [
        { value: "الأحد", label: "الأحد" },
        { value: "الاثنين", label: "الاثنين" },
        { value: "الثلاثاء", label: "الثلاثاء" },
        { value: "الأربعاء", label: "الأربعاء" },
        { value: "الخميس", label: "الخميس" },
        { value: "السبت", label: "السبت" },
        { value: "الجمعة", label: "الجمعة" },
      ],
    },
    {
      id: "performance",
      title: "مستوى الأداء",
      filterFn: (item, value) => {
        if (value === "excellent") return item.ejarSuccessRate >= 99.0;
        if (value === "stable") return item.ejarSuccessRate >= 98.0 && item.ejarSuccessRate < 99.0;
        if (value === "alert") return item.ejarSuccessRate < 98.0;
        return true;
      },
      options: [
        { value: "excellent", label: "ممتاز (≥99%)" },
        { value: "stable", label: "مستقر (98-99%)" },
        { value: "alert", label: "تنبيه (<98%)" },
      ],
    },
  ];

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        title="سجل التقارير ومؤشرات العمليات اليومية"
        subtitle="جدول تفصيلي يوضح كل يوم تشغيلي، نسب التوثيق، الإيرادات المحصلة، وزمن المعالجة"
        searchPlaceholder="بحث بالتاريخ، اليوم، أو رقم السجل..."
        searchKeys={["date", "dayName"]}
        filters={filterConfigs}
        pageSize={8}
        pageSizeOptions={[8, 15, 30]}
        toolbarActions={
          <TooltipProvider delay={100}>
            <Tooltip>
              <TooltipTrigger
                type="button"
                onClick={handleExportCSV}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-3.5 text-xs font-semibold text-foreground transition-all hover:bg-muted active:scale-98"
                aria-label="تصدير ملف التقارير Excel"
              >
                <FileSpreadsheet className="size-3.5 text-tertiary" />
                <span>تصدير Excel</span>
                <span className="rounded-full bg-muted/90 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  قيد التطوير
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6} className="text-xs">
                تنزيل السجلات اليومية بصيغة Excel — قيد التطوير
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
      />

      {/* Day Details Modal */}
      <Dialog open={!!selectedDay} onOpenChange={(open) => !open && setSelectedDay(null)}>
        {selectedDay && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                <DialogTitle className="text-lg">
                  تفاصيل تقرير يوم {selectedDay.dayName} ({selectedDay.date})
                </DialogTitle>
              </div>
              <DialogDescription>
                موجز المؤشرات التشغيلية والمالية المسجلة خلال اليوم
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                  <span className="text-xs text-muted-foreground">إجمالي العقود</span>
                  <div className="mt-1 text-xl font-bold text-foreground">
                    {selectedDay.totalContracts} عقد
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="font-medium text-primary">
                      سكني: {selectedDay.residentialContracts}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-secondary">
                      تجاري: {selectedDay.commercialContracts}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                  <span className="text-xs text-muted-foreground">إيرادات التوثيق</span>
                  <div className="mt-1 flex items-center gap-1 text-xl font-bold text-foreground">
                    <span>{selectedDay.totalRevenue.toLocaleString()}</span>
                    <SaudiRiyal className="size-4 text-muted-foreground" />
                  </div>
                  <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <span>المعدل: {Math.round(selectedDay.totalRevenue / (selectedDay.totalContracts || 1))}</span>
                    <SaudiRiyal className="size-3 text-muted-foreground" />
                    <span>/ عقد</span>
                  </span>
                </div>
              </div>

              {/* Performance breakdown */}
              <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3.5">
                <h4 className="text-xs font-semibold text-foreground">مؤشرات الأداء والجودة</h4>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-background p-2">
                    <span className="block text-[11px] text-muted-foreground">معدل إيجار</span>
                    <strong className="font-mono text-sm text-tertiary-700 dark:text-tertiary-400">
                      {selectedDay.ejarSuccessRate}%
                    </strong>
                  </div>
                  <div className="rounded-lg bg-background p-2">
                    <span className="block text-[11px] text-muted-foreground">زمن المعالجة</span>
                    <strong className="font-mono text-sm text-foreground">
                      {selectedDay.avgProcessingTimeMin} دقيقة
                    </strong>
                  </div>
                  <div className="rounded-lg bg-background p-2">
                    <span className="block text-[11px] text-muted-foreground">الطلبات الواردة</span>
                    <strong className="font-mono text-sm text-foreground">
                      {selectedDay.requestsCount}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Payment channels breakdown */}
              <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3.5">
                <h4 className="text-xs font-semibold text-foreground">عمليات السداد باليوم</h4>
                <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  <div className="rounded-lg bg-background p-2 text-center">
                    <span className="block text-[10px] text-muted-foreground">مدى</span>
                    <strong className="text-foreground">{selectedDay.paymentChannels.mada}</strong>
                  </div>
                  <div className="rounded-lg bg-background p-2 text-center">
                    <span className="block text-[10px] text-muted-foreground">Apple Pay</span>
                    <strong className="text-foreground">{selectedDay.paymentChannels.applePay}</strong>
                  </div>
                  <div className="rounded-lg bg-background p-2 text-center">
                    <span className="block text-[10px] text-muted-foreground">سداد SADAD</span>
                    <strong className="text-foreground">{selectedDay.paymentChannels.sadad}</strong>
                  </div>
                  <div className="rounded-lg bg-background p-2 text-center">
                    <span className="block text-[10px] text-muted-foreground">بطاقات</span>
                    <strong className="text-foreground">{selectedDay.paymentChannels.creditCard}</strong>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
