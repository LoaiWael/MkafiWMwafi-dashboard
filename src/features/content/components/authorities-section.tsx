import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import AuthorityCard from "@/features/content/components/authority-card";
import EditableText from "@/features/content/components/editable-text";
import SectionHeading from "@/features/content/components/section-heading";
import { AUTHORITIES, AUTHORITIES_COPY } from "@/features/content/constants";

export default function AuthoritiesSection() {
  return (
    <section
      id="authorities"
      aria-labelledby="authorities-title"
      className="bg-muted py-16 lg:py-20"
    >
      <div className="page-shell">
        <FadeIn direction="up" distance={20}>
          <SectionHeading
            id="authorities-title"
            eyebrow={
              <EditableText
                defaultValue={AUTHORITIES_COPY.eyebrow}
                label="تعديل التسمية"
              />
            }
            title={
              <EditableText
                defaultValue={AUTHORITIES_COPY.title}
                label="تعديل العنوان"
                fullWidth
              />
            }
            description={
              <EditableText
                defaultValue={AUTHORITIES_COPY.description}
                label="تعديل الوصف"
                fullWidth
              />
            }
          />
        </FadeIn>
        <StaggerContainer
          staggerDelay={0.12}
          className="mt-10 grid gap-4 sm:grid-cols-3 lg:mt-12 lg:gap-6"
        >
          {AUTHORITIES.map((authority) => (
            <StaggerItem key={authority.id}>
              <AuthorityCard
                src={authority.src}
                alt={authority.alt}
                width={authority.width}
                height={authority.height}
                certificate={authority.certificate}
                certificateLabel={authority.certificateLabel}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
