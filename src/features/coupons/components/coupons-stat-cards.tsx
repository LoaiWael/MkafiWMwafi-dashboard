import {
  CheckCircle2,
  Home,
  SaudiRiyal,
  Store,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Coupon } from "../constants";

interface CouponsStatCardsProps {
  coupons: Coupon[];
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

export default function CouponsStatCards({ coupons }: CouponsStatCardsProps) {
  const totalCount = coupons.length;
  const activeCount = coupons.filter((c) => c.status === "active").length;
  const residentialCount = coupons.filter(
    (c) => c.targetServices.includes("all") || c.targetServices.includes("residential"),
  ).length;
  const commercialCount = coupons.filter(
    (c) => c.targetServices.includes("all") || c.targetServices.includes("commercial"),
  ).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  const totalSavings = coupons.reduce((sum, c) => sum + c.totalDiscountedAmount, 0);

  const percentageCoupons = coupons.filter((c) => c.discountType === "percentage");
  const avgDiscount =
    percentageCoupons.length > 0
      ? Math.round(
          percentageCoupons.reduce((sum, c) => sum + c.discountValue, 0) /
            percentageCoupons.length,
        )
      : 0;

  const stats: {
    id: string;
    label: string;
    value: string;
    unit: ReactNode;
    subText: ReactNode;
    icon: typeof Tag;
    colorScheme: "primary" | "secondary" | "tertiary" | "amber";
  }[] = [
    {
      id: "total",
      label: "إجمالي الكوبونات",
      value: totalCount.toLocaleString("en-US"),
      unit: "كوبون خصم",
      subText: "مفعلة ومجدولة بالنظام",
      icon: Tag,
      colorScheme: "primary",
    },
    {
      id: "active",
      label: "الكوبونات النشطة",
      value: activeCount.toLocaleString("en-US"),
      unit: "كوبون مفعّل",
      subText: "جاهزة للاستخدام الفوري",
      icon: CheckCircle2,
      colorScheme: "tertiary",
    },
    {
      id: "residential",
      label: "عقود سكنية مشمولة",
      value: residentialCount.toLocaleString("en-US"),
      unit: "كوبون متاح",
      subText: "متوافقة مع حساب المواطن",
      icon: Home,
      colorScheme: "primary",
    },
    {
      id: "commercial",
      label: "عقود تجارية مشمولة",
      value: commercialCount.toLocaleString("en-US"),
      unit: "كوبون متاح",
      subText: "محلات ومكاتب ومعارض",
      icon: Store,
      colorScheme: "secondary",
    },
    {
      id: "redemptions",
      label: "مرات الاستخدام",
      value: totalRedemptions.toLocaleString("en-US"),
      unit: "عقد مستفيد",
      subText: "تم تطبيق الخصم بنجاح",
      icon: Users,
      colorScheme: "tertiary",
    },
    {
      id: "savings",
      label: "إجمالي الوفورات",
      value: totalSavings.toLocaleString("en-US"),
      unit: <SaudiRiyal className="size-3.5 text-muted-foreground" />,
      subText: (
        <span className="inline-flex items-center gap-1">
          <span>متوسط الخصم:</span>
          <span className="font-semibold">{avgDiscount}%</span>
          <span>على الرسوم</span>
        </span>
      ),
      icon: TrendingUp,
      colorScheme: "amber",
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
                "group relative overflow-hidden rounded-2xl border p-3 sm:p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-default select-none",
                style.card,
                style.borderHover,
              )}
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
