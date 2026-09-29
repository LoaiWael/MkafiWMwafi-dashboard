import { FadeIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import EditableText from "@/features/content/components/editable-text";
import HeroStats from "@/features/content/components/hero-stats";
import HeroVideo from "@/features/content/components/hero-video";
import { HERO_COPY } from "@/features/content/constants";

export default function HeroSection() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[460px] overflow-hidden bg-background sm:min-h-145 md:min-h-0 md:h-hero lg:h-hero-lg"
    >
      <HeroVideo />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-primary-950/75 via-primary-950/50 to-primary-950/40"
      />

      <div className="page-shell relative flex w-full flex-1 flex-col justify-center py-8 sm:py-12 md:pt-28 md:pb-12 lg:pb-16">
        <div className="relative z-10 flex w-full flex-col gap-5 sm:gap-8">
          <div className="max-w-2xl text-start">
            <FadeIn direction="up" delay={0.15} distance={30}>
              <h1
                id="hero-title"
                className="space-y-1.5 text-xl leading-snug font-extrabold text-primary-foreground sm:space-y-2 sm:text-3xl md:text-4xl lg:text-5xl"
              >
                <div>
                  <EditableText
                    defaultValue={HERO_COPY.title}
                    label="تعديل العنوان"
                    fullWidth
                    inputClassName="font-extrabold"
                  />
                </div>
                <div>
                  <EditableText
                    defaultValue={HERO_COPY.highlight}
                    label="تعديل العنوان الفرعي"
                    fullWidth
                    className="text-primary"
                    inputClassName="font-extrabold"
                  />
                </div>
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.25} distance={20}>
              <p className="mt-2.5 max-w-2xl text-xs leading-relaxed font-medium text-primary-foreground/95 sm:mt-4 sm:text-base sm:leading-7 md:text-lg lg:text-xl">
                <EditableText
                  defaultValue={HERO_COPY.description}
                  label="تعديل الوصف"
                  fullWidth
                />
              </p>
            </FadeIn>
          </div>

          <div className="flex w-full flex-col items-stretch gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <FadeIn
              direction="up"
              delay={0.4}
              distance={20}
              className="w-full sm:w-auto"
            >
              <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="h-10 w-full justify-center rounded-xl px-4 text-sm font-semibold shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 sm:h-11 sm:w-auto sm:rounded-2xl sm:px-7 sm:text-base"
                >
                  إنشاء عقد إيجار سكني
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-10 w-full justify-center rounded-xl px-4 text-sm font-semibold shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 sm:h-11 sm:w-auto sm:rounded-2xl sm:px-7 sm:text-base"
                >
                  إنشاء عقد تجاري
                </Button>
              </div>
            </FadeIn>

            <HeroStats />
          </div>
        </div>
      </div>
    </section>
  );
}
