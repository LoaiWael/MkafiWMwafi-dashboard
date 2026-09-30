import { Plus } from "lucide-react";
import { useTrackedState } from "@/features/content/components/content-draft-provider";
import { FadeIn, ScaleIn } from "@/components/animations";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AboutReasonCard, {
  type AboutReasonItem,
} from "@/features/content/components/about-reason-card";
import EditableText from "@/features/content/components/editable-text";
import SectionHeading from "@/features/content/components/section-heading";
import {
  ABOUT_REASON_CARD_LIMIT,
  ABOUT_REASON_ICON_IDS,
  ABOUT_REASON_NEW_CARD,
  ABOUT_REASONS,
  ABOUT_REASONS_COPY,
} from "@/features/content/constants";
import { cn } from "@/lib/utils";

const REASON_STICKY_TOP = [
  "top-20 sm:top-28",
  "top-24 sm:top-36",
  "top-28 sm:top-44",
  "top-32 sm:top-52",
] as const;

function createAboutReasonItem(index: number): AboutReasonItem {
  return {
    id: crypto.randomUUID(),
    iconId: ABOUT_REASON_ICON_IDS[index % ABOUT_REASON_ICON_IDS.length],
    badge: ABOUT_REASON_NEW_CARD.badge,
    title: ABOUT_REASON_NEW_CARD.title,
    description: ABOUT_REASON_NEW_CARD.description,
    highlight: ABOUT_REASON_NEW_CARD.highlight,
    statLabel: ABOUT_REASON_NEW_CARD.statLabel,
    stat: ABOUT_REASON_NEW_CARD.stat,
  };
}

export default function AboutReasonsSection() {
  const [items, setItems, markDirty] = useTrackedState<AboutReasonItem[]>(() =>
    ABOUT_REASONS.map((reason) => ({ ...reason })),
  );
  const canAdd = items.length < ABOUT_REASON_CARD_LIMIT;

  function addCard() {
    setItems((current) => {
      if (current.length >= ABOUT_REASON_CARD_LIMIT) return current;
      return [...current, createAboutReasonItem(current.length)];
    });
    if (canAdd) markDirty();
  }

  function removeCard(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    markDirty();
  }

  return (
    <section
      aria-labelledby="reasons-title"
      className="bg-muted/60 py-8 sm:py-16 lg:py-24"
    >
      <div className="page-shell">
        <FadeIn
          direction="up"
          distance={24}
          duration={0.6}
          className="mx-auto max-w-3xl text-center"
        >
          <SectionHeading
            id="reasons-title"
            eyebrow={
              <EditableText
                defaultValue={ABOUT_REASONS_COPY.eyebrow}
                label="تعديل التسمية"
              />
            }
            title={
              <EditableText
                defaultValue={ABOUT_REASONS_COPY.title}
                label="تعديل العنوان"
                fullWidth
              />
            }
            description={
              <EditableText
                defaultValue={ABOUT_REASONS_COPY.description}
                label="تعديل الوصف"
                fullWidth
              />
            }
          />
        </FadeIn>

        <div className="relative isolate mx-auto mt-6 max-w-4xl space-y-4 sm:mt-12 sm:space-y-6 lg:mt-16 lg:space-y-8">
          {items.map((item, index) => {
            const topOffset =
              REASON_STICKY_TOP[index] ??
              REASON_STICKY_TOP[REASON_STICKY_TOP.length - 1];

            return (
              <div
                key={item.id}
                style={{ zIndex: index + 1 }}
                className={`sticky ${topOffset} transition-all duration-300`}
              >
                <ScaleIn delay={index * 0.08} duration={0.5}>
                  <AboutReasonCard
                    index={index}
                    item={item}
                    onRemove={() => removeCard(item.id)}
                  />
                </ScaleIn>
              </div>
            );
          })}

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
            <Tooltip>
              <TooltipTrigger
                type="button"
                aria-label="إضافة بطاقة"
                aria-disabled={!canAdd}
                onClick={addCard}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-xl border border-dashed px-3 text-xs font-semibold transition-colors",
                  canAdd
                    ? "border-border bg-card text-secondary hover:bg-secondary-soft"
                    : "cursor-not-allowed border-border bg-muted text-muted-foreground",
                )}
              >
                <Plus className="size-4" />
                إضافة بطاقة
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
                {canAdd ? (
                  "إضافة بطاقة"
                ) : (
                  <>
                    الحد الأقصى <bdi>{ABOUT_REASON_CARD_LIMIT}</bdi> بطاقات
                  </>
                )}
              </TooltipContent>
            </Tooltip>
            <p className="text-xs font-medium text-muted-foreground">
              <bdi>{items.length}</bdi>
              <span className="px-1">/</span>
              <bdi>{ABOUT_REASON_CARD_LIMIT}</bdi>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
