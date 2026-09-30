import { Check, Plus, Trash2 } from "lucide-react";
import { useTrackedState } from "@/features/content/components/content-draft-provider";
import EditableText from "@/features/content/components/editable-text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PlanFeature {
  id: string;
  text: string;
}

interface PlanFeaturesProps {
  features: readonly string[];
  tone: "primary" | "secondary";
}

export default function PlanFeatures({ features, tone }: PlanFeaturesProps) {
  const [items, setItems, markDirty] = useTrackedState<PlanFeature[]>(() =>
    features.map((text, index) => ({ id: `feature-${index}`, text })),
  );
  const isSecondary = tone === "secondary";

  function addFeature() {
    setItems((current) => [
      ...current,
      { id: crypto.randomUUID(), text: "ميزة جديدة" },
    ]);
    markDirty();
  }

  function removeFeature(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    markDirty();
  }

  return (
    <div className="px-3.5 py-3 sm:px-8 sm:py-7">
      <ul className="space-y-2 sm:space-y-3.5">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-2 text-xs font-semibold text-foreground sm:gap-3 sm:text-sm"
          >
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 sm:size-5",
                isSecondary
                  ? "bg-secondary-soft text-secondary"
                  : "bg-primary-soft text-primary",
              )}
            >
              <Check className="size-2.5 shrink-0 sm:size-3.5" strokeWidth={3} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <EditableText
                defaultValue={item.text}
                label="تعديل الميزة"
                fullWidth
              />
            </span>
            <Tooltip>
              <TooltipTrigger
                type="button"
                aria-label="حذف الميزة"
                onClick={() => removeFeature(item.id)}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-destructive shadow-xs transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
                حذف الميزة
              </TooltipContent>
            </Tooltip>
          </li>
        ))}
      </ul>

      <Tooltip>
        <TooltipTrigger
          type="button"
          aria-label="إضافة ميزة"
          onClick={addFeature}
          className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-border px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary-soft sm:mt-4"
        >
          <Plus className="size-4" />
          إضافة ميزة
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
          إضافة ميزة
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
