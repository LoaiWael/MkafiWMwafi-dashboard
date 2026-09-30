import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import EditableText from "@/features/content/components/editable-text";
import PlanCard from "@/features/content/components/plan-card";
import SectionHeading from "@/features/content/components/section-heading";
import { HOME_PLANS, PRICING_COPY } from "@/features/content/constants";

export default function PricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="overflow-hidden bg-background py-8 sm:py-16 lg:py-24"
    >
      <div className="page-shell">
        <FadeIn direction="up" distance={20}>
          <SectionHeading
            id="pricing-title"
            eyebrow={
              <EditableText
                defaultValue={PRICING_COPY.eyebrow}
                label="تعديل التسمية"
              />
            }
            title={
              <EditableText
                defaultValue={PRICING_COPY.title}
                label="تعديل العنوان"
                fullWidth
              />
            }
            description={
              <EditableText
                defaultValue={PRICING_COPY.description}
                label="تعديل الوصف"
                fullWidth
              />
            }
          />
        </FadeIn>

        <StaggerContainer
          staggerDelay={0.15}
          className="mx-auto mt-6 grid max-w-4xl items-stretch gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:mt-12 lg:gap-8"
        >
          {HOME_PLANS.map((plan) => (
            <StaggerItem key={plan.id} className="h-full">
              <PlanCard plan={plan} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
