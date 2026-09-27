import { ArrowLeft, TrendingUp } from "lucide-react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OverviewStatItem } from "@/features/overview/constants";

interface OverviewStatCardProps {
  stat: OverviewStatItem;
  className?: string;
}

const colorStyles = {
  primary: {
    card: "bg-primary-50/60 border-primary-100/80 dark:bg-primary-950/30 dark:border-primary-900/40",
    iconBg:
      "bg-primary-100 text-primary-700 dark:bg-primary-900/60 dark:text-primary-300",
    borderHover: "hover:border-primary-300 dark:hover:border-primary-700",
    actionColor:
      "text-primary hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300",
  },
  secondary: {
    card: "bg-secondary-50/60 border-secondary-100/80 dark:bg-secondary-950/30 dark:border-secondary-900/40",
    iconBg:
      "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/60 dark:text-secondary-300",
    borderHover: "hover:border-secondary-300 dark:hover:border-secondary-700",
    actionColor:
      "text-secondary hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300",
  },
  tertiary: {
    card: "bg-tertiary-50/60 border-tertiary-100/80 dark:bg-tertiary-950/30 dark:border-tertiary-900/40",
    iconBg:
      "bg-tertiary-100 text-tertiary-700 dark:bg-tertiary-900/60 dark:text-tertiary-300",
    borderHover: "hover:border-tertiary-300 dark:hover:border-tertiary-700",
    actionColor:
      "text-tertiary hover:text-tertiary-700 dark:text-tertiary-400 dark:hover:text-tertiary-300",
  },
};

export default function OverviewStatCard({
  stat,
  className,
}: OverviewStatCardProps) {
  const Icon = stat.icon;
  const style = colorStyles[stat.colorScheme] ?? colorStyles.primary;

  return (
    <Link
      to={stat.href}
      viewTransition
      className={cn(
        "group block rounded-xl outline-none transition-transform duration-200 focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Card
        className={cn(
          "relative flex h-full flex-col justify-between overflow-hidden border transition-all duration-200 hover:shadow-md",
          style.card,
          style.borderHover,
        )}
      >
        <CardHeader className="space-y-3 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div
              className={cn(
                "flex size-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
                style.iconBg,
              )}
            >
              <Icon className="size-5" />
            </div>

            {stat.trend ? (
              <div className="inline-flex items-center gap-1 text-xs font-medium text-tertiary-600 dark:text-tertiary-400">
                <TrendingUp className="size-3.5" />
                <span>{stat.trend}</span>
              </div>
            ) : null}
          </div>

          <div>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              {stat.label}
            </CardTitle>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {stat.value}
              </span>
              {stat.unit ? (
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.unit}
                </span>
              ) : null}
            </div>
          </div>

          <CardDescription className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {stat.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {stat.subMetrics && stat.subMetrics.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 border-t border-border/80 pt-3">
              {stat.subMetrics.map((sub, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-foreground"
                >
                  <span className="text-muted-foreground">{sub.label}:</span>
                  <span className="font-semibold text-foreground">
                    {sub.value}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex items-center justify-between border-t border-border/60 pt-2.5 text-xs font-medium">
            <span className={cn("transition-colors", style.actionColor)}>
              الانتقال إلى التفاصيل
            </span>
            <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
