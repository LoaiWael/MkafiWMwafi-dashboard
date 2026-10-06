import { ChevronRight } from "lucide-react";
import { FadeIn, ScaleBackground } from "@/components/animations";
import EditableImage from "@/features/content/components/editable-image";
import EditableText from "@/features/content/components/editable-text";
import {
  ABOUT_HERO_COPY,
  ABOUT_HERO_IMAGE,
} from "@/features/content/constants";

export interface PageHeroCopy {
  label: string;
  eyebrow: string;
  heading: string;
  description: string;
}

export interface PageHeroImage {
  src: string;
  width: number;
  height: number;
  alt?: string;
}

interface PageHeroProps {
  onOpenHome: () => void;
  copy?: PageHeroCopy;
  image?: PageHeroImage;
}

export default function PageHero({
  onOpenHome,
  copy = ABOUT_HERO_COPY,
  image = ABOUT_HERO_IMAGE,
}: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-title"
      className="relative isolate bg-primary-950"
    >
      <EditableImage
        defaultSrc={image.src}
        alt={image.alt ?? ""}
        label="تعديل صورة الغلاف"
        width={image.width}
        height={image.height}
        className="block w-full min-w-0"
        frameClassName="absolute inset-0"
        imageClassName="absolute inset-0 size-full object-cover object-center"
        controlClassName="top-3 end-3"
        wrapImage={(renderedImage) => (
          <ScaleBackground
            initialScale={1.14}
            targetScale={1}
            duration={1.8}
            className="-z-20 size-full"
          >
            {renderedImage}
          </ScaleBackground>
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-primary-950/85 via-primary-950/70 to-primary-950/65"
        />

        <div className="page-shell relative z-10 min-w-0 py-8 sm:py-14 lg:py-20">
          <div className="min-w-0 pe-8">
            <FadeIn direction="down" delay={0.05} distance={12}>
              <nav aria-label="مسار التنقل">
                <ol className="flex items-center gap-2 text-xs text-primary-foreground/70">
                  <li>
                    <button
                      type="button"
                      onClick={onOpenHome}
                      className="transition-colors duration-200 hover:text-accent"
                    >
                      الرئيسية
                    </button>
                  </li>
                  <li aria-hidden="true">
                    <ChevronRight size={14} className="rtl:rotate-180" />
                  </li>
                  <li aria-current="page" className="font-medium text-accent">
                    {copy.label}
                  </li>
                </ol>
              </nav>
            </FadeIn>

            <FadeIn direction="up" delay={0.15} distance={16}>
              <p className="mt-3 flex items-center gap-2 text-xs font-medium text-primary-foreground sm:mt-6">
                <span className="h-px w-6 bg-secondary" aria-hidden="true" />
                <EditableText
                  defaultValue={copy.eyebrow}
                  label="تعديل التسمية"
                />
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.25} distance={20}>
              <h1
                id="page-title"
                className="mt-2 max-w-3xl text-2xl leading-tight font-bold break-words text-primary-foreground sm:mt-3 sm:text-4xl lg:text-5xl"
              >
                <EditableText
                  defaultValue={copy.heading}
                  label="تعديل العنوان"
                  fullWidth
                />
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.35} distance={20}>
              <p className="mt-2.5 max-w-2xl text-xs leading-6 break-words text-primary-foreground/80 sm:mt-4 sm:text-base sm:leading-7">
                <EditableText
                  defaultValue={copy.description}
                  label="تعديل الوصف"
                  fullWidth
                />
              </p>
            </FadeIn>
          </div>
        </div>
      </EditableImage>
    </section>
  );
}
