import { FaApple, FaGooglePlay } from "react-icons/fa6";
import { FadeIn } from "@/components/animations";
import EditableText from "@/features/content/components/editable-text";
import PhoneMockup from "@/features/content/components/phone-mockup";
import StoreBadge from "@/features/content/components/store-badge";
import {
  APP_CTA_COPY,
  APP_CTA_PHONES,
  APP_CTA_STORES,
} from "@/features/content/constants";

export default function AppCtaSection() {
  const contractsPhone = APP_CTA_PHONES[0];
  const homePhone = APP_CTA_PHONES[1];

  return (
    <section
      aria-labelledby="app-title"
      className="bg-background py-8 sm:py-16 lg:py-24"
    >
      <div className="page-shell">
        <div className="relative min-h-96 overflow-hidden rounded-2xl bg-primary-950 bg-linear-to-l from-primary-950 via-primary-900 to-primary-800 shadow-2xl sm:min-h-110 sm:rounded-4xl lg:min-h-120">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-e-20 -bottom-20 size-96 animate-pulse rounded-full bg-secondary/20 blur-3xl duration-1000"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-s-16 -top-16 size-72 rounded-full bg-primary-foreground/15 blur-3xl sm:size-80"
          />

          <div className="relative z-10 max-w-xl px-4 py-6 text-start sm:px-10 sm:py-10 lg:px-14 lg:py-14">
            <FadeIn direction="up" delay={0.1} distance={16}>
              <p className="flex items-center gap-2 text-xs font-medium text-primary-foreground/90 sm:gap-2.5 sm:text-sm">
                <span className="h-px w-5 bg-primary sm:w-8" aria-hidden="true" />
                <EditableText
                  defaultValue={APP_CTA_COPY.eyebrow}
                  label="تعديل التسمية"
                />
                <span className="h-px w-5 bg-primary sm:w-8" aria-hidden="true" />
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.2} distance={20}>
              <h2
                id="app-title"
                className="mt-2 text-2xl leading-snug font-extrabold sm:mt-3 sm:text-4xl md:text-5xl"
              >
                <EditableText
                  defaultValue={APP_CTA_COPY.titleLead}
                  label="تعديل بداية العنوان"
                  className="text-secondary"
                />{" "}
                <EditableText
                  defaultValue={APP_CTA_COPY.titleMiddle}
                  label="تعديل وسط العنوان"
                  className="text-primary-foreground"
                />{" "}
                <EditableText
                  defaultValue={APP_CTA_COPY.titleEnd}
                  label="تعديل نهاية العنوان"
                  className="text-primary"
                />
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={0.3} distance={20}>
              <p className="mt-2 max-w-md text-xs leading-6 text-primary-foreground/80 sm:mt-3 sm:text-base sm:leading-8">
                <EditableText
                  defaultValue={APP_CTA_COPY.description}
                  label="تعديل الوصف"
                  fullWidth
                />
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.4} distance={20}>
              <div className="mt-5 flex w-full flex-wrap items-center gap-2.5 sm:mt-6 sm:w-auto sm:gap-3">
                <StoreBadge
                  defaultHref={APP_CTA_STORES.appStore.href}
                  label={APP_CTA_STORES.appStore.label}
                  caption={APP_CTA_STORES.appStore.caption}
                  name={APP_CTA_STORES.appStore.name}
                  captionClassName="text-xs text-primary-foreground/80"
                  icon={<FaApple className="size-5 shrink-0 sm:size-6" />}
                />
                <StoreBadge
                  defaultHref={APP_CTA_STORES.playStore.href}
                  label={APP_CTA_STORES.playStore.label}
                  caption={APP_CTA_STORES.playStore.caption}
                  name={APP_CTA_STORES.playStore.name}
                  captionClassName="text-xs tracking-wider text-primary-foreground/80 uppercase"
                  icon={<FaGooglePlay className="size-5 shrink-0 text-white" />}
                />
              </div>
            </FadeIn>
          </div>

          <div className="relative h-64 sm:h-80 md:h-104 lg:hidden" aria-hidden="true" />

          <div className="pointer-events-none absolute inset-x-0 -bottom-10 z-10 flex items-end justify-center sm:-bottom-20 lg:inset-x-auto lg:inset-e-10 lg:-bottom-24 lg:w-1/2 lg:justify-end xl:-bottom-28">
            <div dir="ltr" className="flex items-end lg:ps-6 xl:ps-12">
              <PhoneMockup
                src={contractsPhone.src}
                alt={contractsPhone.alt}
                label={contractsPhone.label}
                width={contractsPhone.width}
                height={contractsPhone.height}
                className="relative z-10 -me-14 -rotate-12 sm:-me-16"
              />
              <PhoneMockup
                src={homePhone.src}
                alt={homePhone.alt}
                label={homePhone.label}
                width={homePhone.width}
                height={homePhone.height}
                className="relative z-20 rotate-6"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
