import { Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AboutValueFeatures from "@/features/content/components/about-value-features";
import AboutValueIconPicker from "@/features/content/components/about-value-icon-picker";
import EditableText from "@/features/content/components/editable-text";
import { cn } from "@/lib/utils";

const VALUE_THEMES = [
  {
    iconBg:
      "bg-secondary-soft text-secondary group-hover:bg-linear-to-br group-hover:from-secondary-600 group-hover:via-secondary group-hover:to-secondary-400 group-hover:text-secondary-foreground group-hover:shadow-lg group-hover:shadow-secondary/30",
    badge: "border-secondary/20 bg-secondary/10 text-secondary-dark",
    gradient: "from-secondary/10 via-secondary/5 to-transparent",
    borderHover: "hover:border-secondary/50",
    glow: "shadow-secondary/10",
    add: "text-secondary hover:bg-secondary-soft",
  },
  {
    iconBg:
      "bg-primary-soft text-primary group-hover:bg-linear-to-br group-hover:from-primary-700 group-hover:via-primary group-hover:to-primary-400 group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30",
    badge: "border-primary/20 bg-primary/10 text-primary-700",
    gradient: "from-primary/10 via-primary/5 to-transparent",
    borderHover: "hover:border-primary/50",
    glow: "shadow-primary/10",
    add: "text-primary hover:bg-primary-soft",
  },
  {
    iconBg:
      "bg-tertiary-soft text-tertiary group-hover:bg-linear-to-br group-hover:from-tertiary-700 group-hover:via-tertiary group-hover:to-tertiary-400 group-hover:text-tertiary-foreground group-hover:shadow-lg group-hover:shadow-tertiary/30",
    badge: "border-tertiary/20 bg-tertiary/10 text-tertiary",
    gradient: "from-tertiary/10 via-tertiary/5 to-transparent",
    borderHover: "hover:border-tertiary/50",
    glow: "shadow-tertiary/10",
    add: "text-tertiary hover:bg-tertiary-soft",
  },
] as const;

interface AboutValueCardProps {
  index: number;
  iconId: string;
  title: string;
  description: string;
  features: readonly string[];
  onTitleCommit: (title: string) => void;
  onIconChange: (iconId: string) => void;
  onRemove: () => void;
}

export default function AboutValueCard({
  index,
  iconId,
  title,
  description,
  features,
  onTitleCommit,
  onIconChange,
  onRemove,
}: AboutValueCardProps) {
  const theme = VALUE_THEMES[index % VALUE_THEMES.length];
  const stepLabel = String(index + 1).padStart(2, "0");

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-3.5 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl sm:rounded-3xl sm:p-6 md:p-8",
        theme.borderHover,
        theme.glow,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 bg-linear-to-br opacity-40 transition-opacity duration-300 group-hover:opacity-100",
          theme.gradient,
        )}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <AboutValueIconPicker
            iconId={iconId}
            className={theme.iconBg}
            onChange={onIconChange}
          />

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger
                type="button"
                aria-label="حذف البطاقة"
                onClick={onRemove}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-background text-destructive shadow-xs transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="size-4" />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
                حذف البطاقة
              </TooltipContent>
            </Tooltip>
            <span className="flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/60 px-2.5 py-0.5 text-xs font-bold text-muted-foreground shadow-2xs sm:px-3 sm:py-1">
              <span className="size-1.5 rounded-full bg-secondary" />
              <bdi>{stepLabel}</bdi>
            </span>
          </div>
        </div>

        <h3 className="mt-3 text-base font-extrabold text-foreground sm:mt-5 sm:text-2xl">
          <EditableText
            defaultValue={title}
            label="تعديل العنوان"
            onCommit={onTitleCommit}
          />
        </h3>
        <p className="mt-1.5 text-xs leading-6 text-muted-foreground sm:mt-3 sm:text-base sm:leading-8">
          <EditableText
            defaultValue={description}
            label="تعديل الوصف"
            fullWidth
          />
        </p>

        <AboutValueFeatures
          features={features}
          badgeClassName={theme.badge}
          addClassName={theme.add}
        />
      </div>
    </div>
  );
}
