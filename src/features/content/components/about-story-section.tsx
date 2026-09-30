import { Check, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useTrackedState } from "@/features/content/components/content-draft-provider";
import { AnimatePresence, motion } from "motion/react";
import {
  FadeIn,
  Float,
  ScaleIn,
} from "@/components/animations";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditableImage from "@/features/content/components/editable-image";
import EditableText from "@/features/content/components/editable-text";
import SectionHeading from "@/features/content/components/section-heading";
import {
  ABOUT_HIGHLIGHTS,
  ABOUT_STORY_COPY,
  ABOUT_STORY_IMAGE,
} from "@/features/content/constants";

interface AboutHighlight {
  id: string;
  text: string;
}

export default function AboutStorySection() {
  const [highlights, setHighlights, markDirty] = useTrackedState<AboutHighlight[]>(() =>
    ABOUT_HIGHLIGHTS.map((item) => ({ ...item })),
  );

  function addHighlight() {
    setHighlights((current) => [
      ...current,
      { id: crypto.randomUUID(), text: "نقطة جديدة" },
    ]);
    markDirty();
  }

  function removeHighlight(id: string) {
    setHighlights((current) => current.filter((item) => item.id !== id));
    markDirty();
  }

  return (
    <section
      aria-labelledby="story-title"
      className="overflow-hidden bg-background py-8 sm:py-16 lg:py-24"
    >
      <div className="page-shell">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <FadeIn direction="right" distance={24} duration={0.6}>
              <SectionHeading
                id="story-title"
                align="start"
                eyebrow={
                  <EditableText
                    defaultValue={ABOUT_STORY_COPY.eyebrow}
                    label="تعديل التسمية"
                  />
                }
                title={
                  <EditableText
                    defaultValue={ABOUT_STORY_COPY.title}
                    label="تعديل العنوان"
                    fullWidth
                  />
                }
                description={
                  <EditableText
                    defaultValue={ABOUT_STORY_COPY.description}
                    label="تعديل الوصف"
                    fullWidth
                  />
                }
              />
            </FadeIn>

            <FadeIn direction="up" delay={0.2} distance={16} duration={0.5}>
              <p className="mt-3 text-xs leading-6 text-muted-foreground sm:mt-4 sm:text-sm sm:leading-7">
                <EditableText
                  defaultValue={ABOUT_STORY_COPY.body}
                  label="تعديل الفقرة"
                  fullWidth
                />
              </p>
            </FadeIn>

            <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
              <AnimatePresence initial={false}>
                {highlights.map((highlight, index) => (
                  <motion.div
                    key={highlight.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="group flex items-center gap-2.5 text-xs font-medium text-foreground sm:gap-3 sm:text-sm"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary-soft text-secondary shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-secondary group-hover:text-secondary-foreground sm:size-6">
                      <Check
                        size={14}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:rotate-12"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <EditableText
                        defaultValue={highlight.text}
                        label={`تعديل النقطة ${index + 1}`}
                        fullWidth
                      />
                    </span>
                    <Tooltip>
                      <TooltipTrigger
                        type="button"
                        aria-label="حذف النقطة"
                        onClick={() => removeHighlight(highlight.id)}
                        className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-destructive shadow-xs transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="size-3.5" />
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
                        حذف النقطة
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Tooltip>
              <TooltipTrigger
                type="button"
                aria-label="إضافة نقطة"
                onClick={addHighlight}
                className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-border px-3 text-xs font-semibold text-secondary transition-colors hover:bg-secondary-soft sm:mt-4"
              >
                <Plus className="size-4" />
                إضافة نقطة
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
                إضافة نقطة
              </TooltipContent>
            </Tooltip>

            <FadeIn direction="up" delay={0.45} distance={16}>
              <Button
                size="lg"
                className="mt-6 cursor-pointer shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 sm:mt-8"
              >
                {ABOUT_STORY_COPY.cta}
              </Button>
            </FadeIn>
          </div>

          <div className="relative pb-6">
            <FadeIn direction="left" distance={28} duration={0.6}>
              <div className="group relative">
                <EditableImage
                  defaultSrc={ABOUT_STORY_IMAGE.src}
                  alt={ABOUT_STORY_IMAGE.alt}
                  label="تعديل صورة القصة"
                  width={ABOUT_STORY_IMAGE.width}
                  height={ABOUT_STORY_IMAGE.height}
                  className="block w-full"
                  frameClassName="relative block aspect-4/3 w-full overflow-hidden rounded-2xl bg-muted shadow-xl shadow-secondary/10 ring-1 ring-border/50 sm:rounded-3xl"
                  imageClassName="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:rounded-3xl" />
              </div>
            </FadeIn>

            <ScaleIn
              delay={0.4}
              duration={0.5}
              className="absolute inset-s-3 bottom-0 z-10 sm:inset-s-8"
            >
              <Float distance={6} duration={4}>
                <div className="flex items-center gap-2.5 rounded-xl border border-border/80 bg-card/95 p-2.5 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl sm:gap-3 sm:rounded-2xl sm:p-4">
                  <span className="relative flex size-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground shadow-sm sm:size-11 sm:rounded-xl">
                    <span className="absolute -top-1 -inset-s-1 flex size-2.5 sm:size-3">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary opacity-75" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-secondary sm:size-3" />
                    </span>
                    <ShieldCheck className="size-4 sm:size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground sm:text-sm">
                      <EditableText
                        defaultValue={ABOUT_STORY_COPY.badgeTitle}
                        label="تعديل عنوان البطاقة"
                      />
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <EditableText
                        defaultValue={ABOUT_STORY_COPY.badgeDescription}
                        label="تعديل وصف البطاقة"
                      />
                    </p>
                  </div>
                </div>
              </Float>
            </ScaleIn>
          </div>
        </div>
      </div>
    </section>
  );
}
