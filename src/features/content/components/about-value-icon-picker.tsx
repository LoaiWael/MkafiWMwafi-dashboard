import { useState } from "react";
import {
  BadgeCheck,
  Building2,
  Eye,
  Headset,
  HeartHandshake,
  Lock,
  ReceiptText,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  type LucideIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ABOUT_VALUE_ICONS } from "@/features/content/constants";
import { cn } from "@/lib/utils";

const VALUE_ICONS: Record<string, LucideIcon> = {
  mission: Target,
  vision: Eye,
  values: HeartHandshake,
  shield: ShieldCheck,
  timer: Timer,
  receipt: ReceiptText,
  headset: Headset,
  badge: BadgeCheck,
  scale: Scale,
  sparkles: Sparkles,
  building: Building2,
  lock: Lock,
};

export function getAboutValueIcon(iconId: string) {
  return VALUE_ICONS[iconId] ?? Target;
}

interface AboutValueIconPickerProps {
  iconId: string;
  className: string;
  onChange: (iconId: string) => void;
}

export default function AboutValueIconPicker({
  iconId,
  className,
  onChange,
}: AboutValueIconPickerProps) {
  const [open, setOpen] = useState(false);
  const Icon = getAboutValueIcon(iconId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <PopoverTrigger
          render={
            <TooltipTrigger
              aria-label="تغيير الأيقونة"
              className={cn(
                "flex size-10 cursor-pointer items-center justify-center rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 sm:size-14 sm:rounded-2xl",
                className,
              )}
            />
          }
        >
          <Icon className="size-5 sm:size-6" aria-hidden="true" />
        </PopoverTrigger>
        <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
          تغيير الأيقونة
        </TooltipContent>
      </Tooltip>
      <PopoverContent align="start" side="bottom" sideOffset={8} className="w-64">
        <p className="px-1 text-xs font-semibold text-foreground">اختيار الأيقونة</p>
        <div className="grid grid-cols-4 gap-2">
          {ABOUT_VALUE_ICONS.map((option) => {
            const OptionIcon = getAboutValueIcon(option.id);
            const selected = option.id === iconId;

            return (
              <Tooltip key={option.id}>
                <TooltipTrigger
                  type="button"
                  aria-label={option.label}
                  aria-pressed={selected}
                  onClick={() => {
                    onChange(option.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-xl border transition-colors",
                    selected
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-background text-foreground hover:bg-muted",
                  )}
                >
                  <OptionIcon className="size-5" />
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
                  {option.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
