import {
  Building2,
  Home,
  Store,
  KeyRound,
  DoorOpen,
  Coins,
  SaudiRiyal,
} from "lucide-react";
import type { ReactNode } from "react";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Property } from "../types";

interface PropertiesStatCardsProps {
  properties: Property[];
  activeTypeFilter: string;
  activeStatusFilter: string;
  onFilterChange: (filterKey: "type" | "status", value: string) => void;
  onClearFilters?: () => void;
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

export default function PropertiesStatCards({
  properties,
  activeTypeFilter,
  activeStatusFilter,
  onFilterChange,
  onClearFilters,
}: PropertiesStatCardsProps) {
  // Aggregate stats
  const totalProperties = properties.length;
  const residentialProperties = properties.filter((p) => p.type === "residential");
  const commercialProperties = properties.filter((p) => p.type === "commercial");

  const totalUnits = properties.reduce((acc, p) => acc + p.totalUnitsCount, 0);
  const rentedUnits = properties.reduce((acc, p) => acc + p.rentedUnitsCount, 0);
  const vacantUnits = properties.reduce((acc, p) => acc + p.vacantUnitsCount, 0);
  const occupancyRate = totalUnits > 0 ? Math.round((rentedUnits / totalUnits) * 100) : 0;

  const totalAnnualRevenue = properties.reduce(
    (acc, p) => acc + (p.totalAnnualRevenue || 0),
    0,
  );

  const stats: {
    id: string;
    label: string;
    value: string;
    unit: ReactNode;
    subText: ReactNode;
    icon: typeof Building2;
    colorScheme: "primary" | "secondary" | "tertiary" | "amber";
    isActive?: boolean;
    onClick: () => void;
  }[] = [
    {
      id: "all",
      label: "إجمالي العقارات",
      value: totalProperties.toLocaleString("en-US"),
      unit: "عقار مسجل",
      subText: `${totalUnits} وحدة عقارية بالموقع`,
      icon: Building2,
      colorScheme: "primary",
      isActive: activeTypeFilter === "all" && activeStatusFilter === "all",
      onClick: () => {
        if (onClearFilters) {
          onClearFilters();
        } else {
          onFilterChange("type", "all");
          onFilterChange("status", "all");
        }
      },
    },
    {
      id: "residential",
      label: "عقارات سكنية",
      value: residentialProperties.length.toLocaleString("en-US"),
      unit: "عقار سكني",
      subText: `${residentialProperties.reduce((acc, p) => acc + p.totalUnitsCount, 0)} وحدة سكنية (شقق وفلل)`,
      icon: Home,
      colorScheme: "tertiary",
      isActive: activeTypeFilter === "residential",
      onClick: () =>
        onFilterChange("type", activeTypeFilter === "residential" ? "all" : "residential"),
    },
    {
      id: "commercial",
      label: "عقارات تجارية",
      value: commercialProperties.length.toLocaleString("en-US"),
      unit: "عقار تجاري",
      subText: `${commercialProperties.reduce((acc, p) => acc + p.totalUnitsCount, 0)} وحدة (مكاتب ومعارض)`,
      icon: Store,
      colorScheme: "secondary",
      isActive: activeTypeFilter === "commercial",
      onClick: () =>
        onFilterChange("type", activeTypeFilter === "commercial" ? "all" : "commercial"),
    },
    {
      id: "rented-units",
      label: "الوحدات المؤجرة",
      value: rentedUnits.toLocaleString("en-US"),
      unit: `(${occupancyRate}% إشغال)`,
      subText: "عقود إيجار نشطة وسارية",
      icon: KeyRound,
      colorScheme: "tertiary",
      isActive: activeStatusFilter === "rented",
      onClick: () => onFilterChange("status", activeStatusFilter === "rented" ? "all" : "rented"),
    },
    {
      id: "vacant-units",
      label: "الوحدات الشاغرة",
      value: vacantUnits.toLocaleString("en-US"),
      unit: "وحدة متاحة",
      subText: "جاهزة للتأجير والتوثيق",
      icon: DoorOpen,
      colorScheme: "amber",
      isActive: activeStatusFilter === "vacant",
      onClick: () => onFilterChange("status", activeStatusFilter === "vacant" ? "all" : "vacant"),
    },
    {
      id: "revenue",
      label: "العوائد السنوية",
      value: totalAnnualRevenue.toLocaleString("en-US"),
      unit: <SaudiRiyal className="size-3.5 text-muted-foreground" />,
      subText: "إجمالي القيمة التقديرية",
      icon: Coins,
      colorScheme: "primary",
      onClick: () => {
        if (onClearFilters) {
          onClearFilters();
        } else {
          onFilterChange("type", "all");
          onFilterChange("status", "all");
        }
      },
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
