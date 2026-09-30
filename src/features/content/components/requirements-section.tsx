import { FadeIn, ScaleIn } from "@/components/animations";
import EditableImage from "@/features/content/components/editable-image";
import EditableText from "@/features/content/components/editable-text";
import RequirementCard from "@/features/content/components/requirement-card";
import RequirementsSideConnectors from "@/features/content/components/requirements-side-connectors";
import SectionHeading from "@/features/content/components/section-heading";
import {
  REQUIREMENTS,
  REQUIREMENTS_COPY,
} from "@/features/content/constants";

export default function RequirementsSection() {
  const startColumn = REQUIREMENTS.slice(0, 3);
  const endColumn = REQUIREMENTS.slice(3);

  return (
    <section
      id="contracts"
      aria-labelledby="requirements-title"
      className="overflow-hidden bg-background py-6 sm:py-10 lg:py-16"
    >
      <div className="page-shell">
        <FadeIn direction="up" distance={20}>
          <SectionHeading
            id="requirements-title"
            eyebrow={
              <EditableText
                defaultValue={REQUIREMENTS_COPY.eyebrow}
                label="تعديل التسمية"
              />
            }
            title={
              <EditableText
                defaultValue={REQUIREMENTS_COPY.title}
                label="تعديل العنوان"
                fullWidth
              />
            }
            description={
              <EditableText
                defaultValue={REQUIREMENTS_COPY.description}
                label="تعديل الوصف"
                fullWidth
              />
            }
          />
        </FadeIn>

        <div className="mt-8 flex flex-col gap-4 sm:mt-12 sm:gap-5 lg:mt-16 lg:flex-row lg:items-stretch lg:gap-0">
          <ol className="grid flex-1 gap-3 sm:gap-5 lg:gap-6">
            {startColumn.map((item, index) => (
              <RequirementCard
                key={item.step}
                step={item.step}
                title={item.title}
                description={item.description}
                icon={item.icon}
                index={index}
              />
            ))}
          </ol>

          <div className="relative z-0 hidden w-20 shrink-0 self-stretch lg:block xl:w-28">
            <RequirementsSideConnectors side="start" />
          </div>

          <div className="relative z-10 order-first flex shrink-0 justify-center self-center py-1 sm:py-2 lg:order-0 lg:px-1">
            <ScaleIn delay={0.2} duration={0.6}>
              <div className="relative flex size-48 items-center justify-center rounded-squircle border border-primary-200 bg-primary-50 p-2.5 shadow-sm transition-transform duration-300 hover:scale-105 sm:size-64 sm:rounded-squircle-lg sm:p-4">
                <div className="relative flex size-full flex-col items-center justify-center rounded-squircle-inner border-2 border-primary-700/55 bg-card p-3 text-center shadow-md shadow-primary-700/5 sm:rounded-squircle-inner-lg sm:p-5">
                  <EditableImage
                    defaultSrc={REQUIREMENTS_COPY.centerIcon}
                    label="تعديل أيقونة المنتصف"
                    width={32}
                    height={32}
                    imageClassName="size-6 sm:size-8"
                    frameClassName="flex size-10 items-center justify-center rounded-xl bg-primary-100 transition-transform duration-300 hover:rotate-6 sm:size-14 sm:rounded-2xl"
                  />
                  <p className="mt-2 text-sm font-bold text-foreground sm:mt-3.5 sm:text-lg">
                    <EditableText
                      defaultValue={REQUIREMENTS_COPY.centerTitle}
                      label="تعديل عنوان المنتصف"
                    />
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground sm:mt-1 sm:text-sm">
                    <EditableText
                      defaultValue={REQUIREMENTS_COPY.centerDescription}
                      label="تعديل وصف المنتصف"
                    />
                  </p>
                </div>
              </div>
            </ScaleIn>
          </div>

          <div className="relative z-0 hidden w-20 shrink-0 self-stretch lg:block xl:w-28">
            <RequirementsSideConnectors side="end" />
          </div>

          <ol start={4} className="grid flex-1 gap-3 sm:gap-5 lg:gap-6">
            {endColumn.map((item, index) => (
              <RequirementCard
                key={item.step}
                step={item.step}
                title={item.title}
                description={item.description}
                icon={item.icon}
                index={index}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
