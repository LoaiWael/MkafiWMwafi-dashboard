import { UserCheck, UserX, Users, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EMPLOYEE_STATUS } from "../constants";
import type { EmployeeRecord } from "../constants";

interface EmployeesStatCardsProps {
  employees: readonly EmployeeRecord[];
  activeStatusFilter: string;
  activeRoleFilter: string;
  onFilterChange: (filterKey: "status" | "role", value: string) => void;
  onClearFilters?: () => void;
}

type ColorScheme = "primary" | "tertiary" | "amber";

const colorStyles: Record<
  ColorScheme,
  { card: string; iconBg: string; borderHover: string }
> = {
  primary: {
    card: "bg-primary-50/60 border-primary-100/80 dark:bg-primary-950/30 dark:border-primary-900/40",
    iconBg:
      "bg-primary-100 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300",
    borderHover: "hover:border-primary-300 dark:hover:border-primary-700",
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
};

interface StatCardModel {
  id: string;
  label: string;
  value: string;
  unit: ReactNode;
  subText: ReactNode;
  icon: LucideIcon;
  colorScheme: ColorScheme;
  isActive?: boolean;
  onClick: () => void;
}

export default function EmployeesStatCards({
  employees,
  activeStatusFilter,
  activeRoleFilter,
  onFilterChange,
  onClearFilters,
}: EmployeesStatCardsProps) {
  const total = employees.length;
  const activeCount = employees.filter((employee) => employee.active).length;
  const inactiveCount = total - activeCount;
  const roles = [...new Set(employees.map((employee) => employee.role))];

  function clearFilters() {
    if (onClearFilters) {
      onClearFilters();
      return;
    }
    onFilterChange("status", EMPLOYEE_STATUS.all);
    onFilterChange("role", EMPLOYEE_STATUS.all);
  }

  const stats: StatCardModel[] = [
    {
      id: "all",
      label: "إجمالي الموظفين",
      value: total.toLocaleString("en-US"),
      unit: "حساب",
      subText: `${roles.length} أدوار في الفريق`,
      icon: Users,
      colorScheme: "primary",
      isActive:
        activeStatusFilter === EMPLOYEE_STATUS.all &&
        activeRoleFilter === EMPLOYEE_STATUS.all,
      onClick: clearFilters,
    },
    {
      id: "active",
      label: "حسابات نشطة",
      value: activeCount.toLocaleString("en-US"),
      unit: "نشط",
      subText: "يمكنهم الدخول إلى اللوحة",
      icon: UserCheck,
      colorScheme: "tertiary",
      isActive: activeStatusFilter === EMPLOYEE_STATUS.active,
      onClick: () =>
        onFilterChange(
          "status",
          activeStatusFilter === EMPLOYEE_STATUS.active
            ? EMPLOYEE_STATUS.all
            : EMPLOYEE_STATUS.active,
        ),
    },
    {
      id: "inactive",
      label: "حسابات موقوفة",
      value: inactiveCount.toLocaleString("en-US"),
      unit: "موقوف",
      subText: "الدخول إلى اللوحة متوقف",
      icon: UserX,
      colorScheme: "amber",
      isActive: activeStatusFilter === EMPLOYEE_STATUS.inactive,
      onClick: () =>
        onFilterChange(
          "status",
          activeStatusFilter === EMPLOYEE_STATUS.inactive
            ? EMPLOYEE_STATUS.all
            : EMPLOYEE_STATUS.inactive,
        ),
    },
  ];

  return (
    <StaggerContainer
      staggerDelay={0.05}
      className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        const style = colorStyles[stat.colorScheme];

        return (
          <StaggerItem key={stat.id}>
            <Card
              role="button"
              tabIndex={0}
              aria-pressed={stat.isActive}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-2xl border p-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-98 sm:p-4",
                style.card,
                style.borderHover,
              )}
              onClick={stat.onClick}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  stat.onClick();
                }
              }}
            >
              <CardContent className="space-y-2 p-0">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="line-clamp-1 text-xs font-semibold text-muted-foreground">
                    {stat.label}
                  </span>
                  <div
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 sm:size-8",
                      style.iconBg,
                    )}
                  >
                    <Icon className="size-3.5 sm:size-4" />
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                    <bdi>{stat.value}</bdi>
                  </span>
                  <span className="truncate text-xs font-medium text-muted-foreground">
                    {stat.unit}
                  </span>
                </div>

                <div className="line-clamp-1 text-xs text-muted-foreground">
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
