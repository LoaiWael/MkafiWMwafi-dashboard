import { Trash2 } from "lucide-react";
import { useTrackedState } from "@/features/content/components/content-draft-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AboutValueIconPicker from "@/features/content/components/about-value-icon-picker";
import EditableText from "@/features/content/components/editable-text";
import { cn } from "@/lib/utils";

const REASON_THEMES = [
  {
    iconBg:
      "bg-accent-soft text-accent-dark group-hover:bg-linear-to-br group-hover:from-accent-dark group-hover:via-accent group-hover:to-secondary-300 group-hover:text-accent-foreground group-hover:shadow-lg group-hover:shadow-accent/30",
    borderHover: "hover:border-accent/40 hover:shadow-accent/10",
    gradient: "from-accent-soft/60 via-card to-card",
  },
  {
    iconBg:
      "bg-secondary-soft text-secondary group-hover:bg-linear-to-br group-hover:from-secondary-600 group-hover:via-secondary group-hover:to-secondary-400 group-hover:text-secondary-foreground group-hover:shadow-lg group-hover:shadow-secondary/30",
    borderHover: "hover:border-secondary/40 hover:shadow-secondary/10",
    gradient: "from-secondary/10 via-card to-card",
  },
  {
    iconBg:
      "bg-primary-soft text-primary group-hover:bg-linear-to-br group-hover:from-primary-700 group-hover:via-primary group-hover:to-primary-400 group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30",
    borderHover: "hover:border-primary/40 hover:shadow-primary/10",
    gradient: "from-primary/10 via-card to-card",
  },
  {
    iconBg:
      "bg-tertiary-soft text-tertiary group-hover:bg-linear-to-br group-hover:from-tertiary-700 group-hover:via-tertiary group-hover:to-tertiary-400 group-hover:text-tertiary-foreground group-hover:shadow-lg group-hover:shadow-tertiary/30",
    borderHover: "hover:border-tertiary/40 hover:shadow-tertiary/10",
    gradient: "from-tertiary-soft via-card to-card",
  },
] as const;

export interface AboutReasonItem {
  id: string;
  iconId: string;
  badge: string;
  title: string;
  description: string;
  highlight: string;
  statLabel: string;
  stat: string;
}

interface AboutReasonCardProps {
  index: number;
  item: AboutReasonItem;
  onRemove: () => void;
}

export default function AboutReasonCard({
  index,
  item,
  onRemove,
}: AboutReasonCardProps) {
  const [iconId, setIconId, markDirty] = useTrackedState(item.iconId);
  const theme = REASON_THEMES[index % REASON_THEMES.length];
  const stepLabel = String(index + 1).padStart(2, "0");

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-3.5 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl sm:rounded-3xl sm:p-8 lg:p-10",
        theme.borderHover,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 bg-linear-to-r opacity-50 transition-opacity duration-300 group-hover:opacity-100",
          theme.gradient,
        )}
      />

      <div className="relative z-10 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex flex-1 items-start gap-3 sm:gap-5">
          <AboutValueIconPicker
            iconId={iconId}
            className={cn("sm:size-16", theme.iconBg)}
            onChange={(next) => {
              setIconId(next);
              markDirty();
            }}
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="rounded-lg border border-border/80 bg-muted/70 px-2 py-0.5 text-xs font-bold text-foreground sm:px-2.5">
                <bdi>{stepLabel}</bdi>
              </span>
              <span className="rounded-lg border border-accent/20 bg-accent-soft/40 px-2 py-0.5 text-xs font-semibold text-accent-dark sm:px-2.5">
                <EditableText defaultValue={item.badge} label="تعديل الشارة" />
              </span>
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
            </div>

            <h3 className="mt-1.5 text-base font-extrabold text-foreground sm:mt-2 sm:text-2xl">
              <EditableText defaultValue={item.title} label="تعديل العنوان" />
            </h3>
            <p className="mt-1 text-xs leading-6 text-muted-foreground sm:mt-2 sm:text-base sm:leading-7">
              <EditableText
                defaultValue={item.description}
                label="تعديل الوصف"
                fullWidth
              />
            </p>
            <p className="mt-1 text-xs leading-5 font-medium text-foreground/75 sm:mt-2 sm:text-sm sm:leading-6">
              <EditableText
                defaultValue={item.highlight}
                label="تعديل التوضيح"
                fullWidth
              />
            </p>
          </div>
        </div>

        <div className="shrink-0 self-start border-t border-border/60 pt-2 sm:self-center sm:border-s sm:border-t-0 sm:ps-6 sm:pt-0">
          <div className="text-start sm:text-center">
            <span className="block text-xs font-semibold text-muted-foreground">
              <EditableText defaultValue={item.statLabel} label="تعديل تسمية الميزة" />
            </span>
            <span className="text-xs font-bold text-primary sm:text-base">
              <EditableText defaultValue={item.stat} label="تعديل الميزة" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
