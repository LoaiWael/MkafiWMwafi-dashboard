import { Check, Plus, Trash2 } from "lucide-react";
import { useTrackedState } from "@/features/content/components/content-draft-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditableText from "@/features/content/components/editable-text";
import { ABOUT_VALUE_NEW_CARD } from "@/features/content/constants";
import { cn } from "@/lib/utils";

interface ValueFeature {
  id: string;
  text: string;
}

interface AboutValueFeaturesProps {
  features: readonly string[];
  badgeClassName: string;
  addClassName: string;
}

export default function AboutValueFeatures({
  features,
  badgeClassName,
  addClassName,
}: AboutValueFeaturesProps) {
  const [items, setItems, markDirty] = useTrackedState<ValueFeature[]>(() =>
    features.map((text, featureIndex) => ({
      id: `feature-${featureIndex}`,
      text,
    })),
  );

  function addFeature() {
    setItems((current) => [
      ...current,
      { id: crypto.randomUUID(), text: ABOUT_VALUE_NEW_CARD.feature },
    ]);
    markDirty();
  }

  function removeFeature(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    markDirty();
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2 sm:mt-6 sm:gap-2">
      {items.map((item, featureIndex) => (
        <span
          key={item.id}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-medium sm:rounded-xl sm:px-3 sm:py-1.5",
            badgeClassName,
          )}
        >
          <Check className="size-3 shrink-0" aria-hidden="true" />
          <EditableText
            defaultValue={item.text}
            label={`تعديل الميزة ${featureIndex + 1}`}
          />
          <Tooltip>
            <TooltipTrigger
              type="button"
              aria-label="حذف الميزة"
              onClick={() => removeFeature(item.id)}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="size-3" />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
              حذف الميزة
            </TooltipContent>
          </Tooltip>
        </span>
      ))}
      <Tooltip>
        <TooltipTrigger
          type="button"
          aria-label="إضافة ميزة"
          onClick={addFeature}
          className={cn(
            "inline-flex h-10 items-center gap-1.5 rounded-xl border border-dashed border-border px-3 text-xs font-semibold transition-colors",
            addClassName,
          )}
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
