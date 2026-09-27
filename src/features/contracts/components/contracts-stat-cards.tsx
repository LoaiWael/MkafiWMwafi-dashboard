import {
  CheckCircle2,
  Clock,
  Coins,
  FileCheck,
  FileText,
  SaudiRiyal,
  Store,
} from "lucide-react";
import type { ReactNode } from "react";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Contract } from "../types";

interface ContractsStatCardsProps {
  contracts: Contract[];
  activeTypeFilter?: string;
  activePaymentFilter?: string;
  onFilterChange?: (filterType: "type" | "payment" | "status", value: string) => void;
}

const colorStyles = {
  primary: {
    card: "bg-primary-50/60 border-primary-100/80 dark:bg-primary-950/30 dark:border-primary-900/40",
    iconBg: "bg-primary-100 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300",
    borderHover: "hover:border-primary-300 dark:hover:border-primary-700",
  },
  secondary: {
    card: "bg-secondary-50/60 border-secondary-100/80 dark:bg-secondary-950/30 dark:border-secondary-900/40",
    iconBg: "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/60 dark:text-secondary-300",
    borderHover: "hover:border-secondary-300 dark:hover:border-secondary-700",
  },
  tertiary: {
    card: "bg-tertiary-50/60 border-tertiary-100/80 dark:bg-tertiary-950/30 dark:border-tertiary-900/40",
    iconBg: "bg-tertiary-100 text-tertiary-700 dark:bg-tertiary-900/60 dark:text-tertiary-300",
    borderHover: "hover:border-tertiary-300 dark:hover:border-tertiary-700",
  },
  amber: {
    card: "bg-amber-50/60 border-amber-100/80 dark:bg-amber-950/30 dark:border-amber-900/40",
    iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    borderHover: "hover:border-amber-300 dark:hover:border-amber-700",
  },
};

export default function ContractsStatCards({
  contracts,
  onFilterChange,
}: ContractsStatCardsProps) {
  const totalCount = contracts.length;
  const residentialCount = contracts.filter((c) => c.type === "residential").length;
  const commercialCount = contracts.filter((c) => c.type === "commercial").length;
  const certifiedCount = contracts.filter((c) => c.status === "certified").length;
  const paidCount = contracts.filter((c) => c.financials.paymentStatus === "paid").length;
  const pendingPaymentCount = contracts.filter(
    (c) => c.financials.paymentStatus === "unpaid" || c.status === "pending_payment",
  ).length;

  const totalRentValue = contracts.reduce(
    (acc, c) => acc + c.financials.rentalAmount,
    0,
  );

  const stats: {
    id: string;
    label: string;
    value: string;
    unit: string;
    subText: ReactNode;
    icon: typeof FileText;
    colorScheme: "primary" | "secondary" | "tertiary" | "amber";
    onClick: () => void;
  }[] = [
    {
      id: "total",
      label: "إجمالي العقود",
      value: totalCount.toLocaleString("en-US"),
      unit: "عقد إيجار",
      subText: (
        <span className="inline-flex items-center gap-1">
          <span>إجمالي:</span>
          <span className="font-semibold">{totalRentValue.toLocaleString("en-US")}</span>
          <SaudiRiyal className="size-3 text-muted-foreground" />
        </span>
      ),
      icon: FileText,
      colorScheme: "primary",
      onClick: () => onFilterChange?.("type", "all"),
    },
    {
      id: "certified",
      label: "موثقة في إيجار",
      value: certifiedCount.toLocaleString("en-US"),
      unit: "عقد نشط",
      subText: "معتمدة لدى هيئة العقار",
      icon: CheckCircle2,
      colorScheme: "tertiary",
      onClick: () => onFilterChange?.("status", "certified"),
    },
    {
      id: "residential",
      label: "عقود سكنية",
      value: residentialCount.toLocaleString("en-US"),
      unit: "عقد سكني",
      subText: "متوافقة مع حساب المواطن",
      icon: FileCheck,
      colorScheme: "primary",
      onClick: () => onFilterChange?.("type", "residential"),
    },
    {
      id: "commercial",
      label: "عقود تجارية",
      value: commercialCount.toLocaleString("en-US"),
      unit: "عقد تجاري",
      subText: "محلات ومكاتب ومستودعات",
      icon: Store,
      colorScheme: "secondary",
      onClick: () => onFilterChange?.("type", "commercial"),
    },
    {
      id: "paid",
      label: "رسوم مسددة",
      value: paidCount.toLocaleString("en-US"),
      unit: "عملية مكتملة",
      subText: "سداد عبر مدى وأبل باي",
      icon: Coins,
      colorScheme: "tertiary",
      onClick: () => onFilterChange?.("payment", "paid"),
    },
    {
      id: "pending-payment",
      label: "بانتظار السداد",
      value: pendingPaymentCount.toLocaleString("en-US"),
      unit: "قيد السداد",
      subText: "بانتظار سداد رسوم التوثيق",
      icon: Clock,
      colorScheme: "amber",
      onClick: () => onFilterChange?.("payment", "unpaid"),
    },
  ];

  return (
    <StaggerContainer
      staggerDelay={0.05}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4"
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

                <div className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">
                  {stat.subText}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}
