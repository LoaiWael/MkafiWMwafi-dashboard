import { Plus } from "lucide-react";
import { useTrackedState } from "@/features/content/components/content-draft-provider";
import { FadeIn, ScaleIn } from "@/components/animations";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AboutValueCard from "@/features/content/components/about-value-card";
import EditableText from "@/features/content/components/editable-text";
import SectionHeading from "@/features/content/components/section-heading";
import {
  ABOUT_VALUE_CARD_LIMIT,
  ABOUT_VALUE_ICON_IDS,
  ABOUT_VALUE_NEW_CARD,
  ABOUT_VALUES,
  ABOUT_VALUES_COPY,
} from "@/features/content/constants";
import { cn } from "@/lib/utils";

const VALUE_STICKY_TOP = [
  "top-20 sm:top-28",
  "top-24 sm:top-36",
  "top-28 sm:top-44",
] as const;

interface AboutValueItem {
  id: string;
  iconId: string;
  title: string;
  description: string;
  features: readonly string[];
}

function createAboutValueItem(index: number): AboutValueItem {
  return {
    id: crypto.randomUUID(),
    iconId: ABOUT_VALUE_ICON_IDS[index % ABOUT_VALUE_ICON_IDS.length],
    title: ABOUT_VALUE_NEW_CARD.title,
    description: ABOUT_VALUE_NEW_CARD.description,
    features: [ABOUT_VALUE_NEW_CARD.feature],
  };
}

export default function AboutValuesSection() {
  const [items, setItems, markDirty] = useTrackedState<AboutValueItem[]>(() =>
    ABOUT_VALUES.map((value) => ({
      id: value.id,
      iconId: value.id,
      title: value.title,
      description: value.description,
      features: [...value.features],
    })),
  );
  const canAdd = items.length < ABOUT_VALUE_CARD_LIMIT;

  function addCard() {
    setItems((current) => {
      if (current.length >= ABOUT_VALUE_CARD_LIMIT) return current;
      return [...current, createAboutValueItem(current.length)];
    });
    if (canAdd) markDirty();
  }

  function removeCard(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    markDirty();
  }

  function updateItem(id: string, patch: Partial<AboutValueItem>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
    markDirty();
  }

  return (
    <section
      aria-labelledby="values-title"
      className="bg-background py-8 sm:py-16 lg:py-24"
    >
      <div className="page-shell">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <FadeIn direction="right" distance={24} duration={0.6}>
              <SectionHeading
                id="values-title"
                align="start"
                eyebrow={
                  <EditableText
                    defaultValue={ABOUT_VALUES_COPY.eyebrow}
                    label="تعديل التسمية"
                  />
                }
                title={
                  <EditableText
                    defaultValue={ABOUT_VALUES_COPY.title}
                    label="تعديل العنوان"
                    fullWidth
                  />
                }
                description={
                  <EditableText
                    defaultValue={ABOUT_VALUES_COPY.description}
                    label="تعديل الوصف"
                    fullWidth
                  />
                }
              />

              <div className="mt-8 hidden space-y-3 lg:block">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 p-3 text-sm font-semibold text-foreground/80 backdrop-blur-xs transition-all duration-200 hover:border-secondary/40 hover:bg-card hover:text-foreground"
                  >
                    <span className="flex size-7 items-center justify-center rounded-lg bg-secondary-soft text-xs font-bold text-secondary">
                      <bdi>{String(index + 1).padStart(2, "0")}</bdi>
                    </span>
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-6">
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    aria-label="إضافة بطاقة"
                    aria-disabled={!canAdd}
                    onClick={addCard}
                    className={cn(
                      "inline-flex h-10 items-center gap-2 rounded-xl border border-dashed px-3 text-xs font-semibold transition-colors",
                      canAdd
                        ? "border-border text-secondary hover:bg-secondary-soft"
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
                        الحد الأقصى <bdi>{ABOUT_VALUE_CARD_LIMIT}</bdi> بطاقات
                      </>
                    )}
                  </TooltipContent>
                </Tooltip>
                <p className="text-xs font-medium text-muted-foreground">
                  <bdi>{items.length}</bdi>
                  <span className="px-1">/</span>
                  <bdi>{ABOUT_VALUE_CARD_LIMIT}</bdi>
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-border bg-muted/50 p-3 text-xs leading-5 text-muted-foreground sm:mt-8 sm:rounded-2xl sm:p-4 sm:leading-6">
                <EditableText
                  defaultValue={ABOUT_VALUES_COPY.callout}
                  label="تعديل الملاحظة"
                  fullWidth
                />
              </div>
            </FadeIn>
          </div>

          <div className="relative isolate space-y-4 sm:space-y-8 lg:col-span-7 lg:space-y-12">
            {items.map((item, index) => {
              const topOffset =
                VALUE_STICKY_TOP[index] ??
                VALUE_STICKY_TOP[VALUE_STICKY_TOP.length - 1];

              return (
                <div
                  key={item.id}
                  style={{ zIndex: index + 1 }}
                  className={`sticky ${topOffset} transition-all duration-300`}
                >
                  <ScaleIn delay={index * 0.1} duration={0.5}>
                    <AboutValueCard
                      index={index}
                      iconId={item.iconId}
                      title={item.title}
                      description={item.description}
                      features={item.features}
                      onTitleCommit={(title) => updateItem(item.id, { title })}
                      onIconChange={(iconId) => updateItem(item.id, { iconId })}
                      onRemove={() => removeCard(item.id)}
                    />
                  </ScaleIn>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
