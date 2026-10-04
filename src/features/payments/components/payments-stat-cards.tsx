import type { ReactNode } from "react";
import {
  CheckCircle2,
  Clock,
  FileText,
  Receipt,
  SaudiRiyal,
  Store,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PaymentRecordStatus, PaymentReportRecord } from "../constants";

interface PaymentsStatCardsProps {
  reports: PaymentReportRecord[];
  activeStatusFilter: "all" | PaymentRecordStatus;
  activeTypeFilter?: string;
  onStatusFilterChange: (status: "all" | PaymentRecordStatus) => void;
  onClearFilters?: () => void;
}

const colorStyles = {
  primary: {
    card: "bg-primary-50/60 border-primary-100/80 dark:bg-primary-950/30 dark:border-primary-900/40",
    iconBg:
      "bg-primary-100 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300",
    borderHover: "hover:border-primary-300 dark:hover:border-primary-700",
  },
  secondary: {
    card: "bg-secondary-50/60 border-secondary-100/80 dark:bg-secondary-950/30 dark:border-secondary-900/40",
    iconBg:
      "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/60 dark:text-secondary-300",
    borderHover: "hover:border-secondary-300 dark:hover:border-secondary-700",
  },
  tertiary: {
    card: "bg-tertiary-50/60 border-tertiary-100/80 dark:bg-tertiary-950/30 dark:border-tertiary-900/40",
    iconBg:
      "bg-tertiary-100 text-tertiary-700 dark:bg-tertiary-900/60 dark:text-tertiary-300",
    borderHover: "hover:border-tertiary-300 dark:hover:border-tertiary-700",
  },
  amber: {
    card: "bg-amber-50/60 border-amber-100/80 dark:bg-amber-950/30 dark:border-amber-900/40",
    iconBg:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    borderHover: "hover:border-amber-300 dark:hover:border-amber-700",
  },
  destructive: {
    card: "bg-destructive/5 border-destructive/20 dark:bg-destructive/10 dark:border-destructive/30",
    iconBg:
      "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive",
    borderHover: "hover:border-destructive/40 dark:hover:border-destructive/60",
  },
};

export default function PaymentsStatCards({
  reports,
  activeStatusFilter,
  onStatusFilterChange,
  onClearFilters,
}: PaymentsStatCardsProps) {
  // Aggregate stats
  const totalCompletedAmount = reports
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + r.totalAmount, 0);

  const completedCount = reports.filter((r) => r.status === "completed").length;
  const pendingCount = reports.filter((r) => r.status === "pending").length;

  const residentialCount = reports.filter(
    (r) => r.contractType === "residential" && r.status === "completed",
  ).length;
  const commercialCount = reports.filter(
    (r) => r.contractType === "commercial" && r.status === "completed",
  ).length;

  const stats: {
    id: string;
    label: string;
    value: string;
    unit: ReactNode;
    icon: typeof Receipt;
    colorScheme: "primary" | "secondary" | "tertiary" | "amber" | "destructive";
    onClick: () => void;
  }[] = [
    {
      id: "total-collected",
      label: "إجمالي المحصل",
      value: totalCompletedAmount.toLocaleString("en-US"),
      unit: <SaudiRiyal className="size-3.5 text-muted-foreground shrink-0" />,
      icon: Receipt,
      colorScheme: "primary",
      onClick: () => {
        if (onClearFilters) {
          onClearFilters();
        } else {
          onStatusFilterChange("all");
        }
      },
    },
    {
      id: "completed",
      label: "العمليات المكتملة",
      value: completedCount.toLocaleString("en-US"),
      unit: "عملية ناجحة",
      icon: CheckCircle2,
      colorScheme: "tertiary",
      onClick: () =>
        onStatusFilterChange(
          activeStatusFilter === "completed" ? "all" : "completed",
        ),
    },
    {
      id: "residential-completed",
      label: "مدفوعات سكنية",
      value: residentialCount.toLocaleString("en-US"),
      unit: "عقد سكني",
      icon: FileText,
      colorScheme: "primary",
      onClick: () => onStatusFilterChange("completed"),
    },
    {
      id: "commercial-completed",
      label: "مدفوعات تجارية",
      value: commercialCount.toLocaleString("en-US"),
      unit: "عقد تجاري",
      icon: Store,
      colorScheme: "secondary",
      onClick: () => onStatusFilterChange("completed"),
    },
    {
      id: "pending",
      label: "قيد المعالجة",
      value: pendingCount.toLocaleString("en-US"),
      unit: "بانتظار التأكيد",
      icon: Clock,
      colorScheme: "amber",
      onClick: () =>
        onStatusFilterChange(
          activeStatusFilter === "pending" ? "all" : "pending",
        ),
    },
  ];

  return (
    <StaggerContainer
      staggerDelay={0.05}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        const style = colorStyles[stat.colorScheme] ?? colorStyles.primary;

        return (
          <StaggerItem key={stat.id}>
            <Card
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-3 sm:p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer active:scale-98",
                style.card,
                style.borderHover,
              )}
              onClick={stat.onClick}
            >
              <CardContent className="p-0 space-y-2">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground line-clamp-1 sm:text-xs">
                    {stat.label}
                  </span>
                  <div
                    className={cn(
                      "flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
                      style.iconBg,
                    )}
                  >
                    <Icon className="size-3.5 sm:size-4" />
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                    {stat.value}
                  </span>
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">
                    {stat.unit}
                  </span>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}
