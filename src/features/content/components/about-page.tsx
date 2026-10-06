import AboutReasonsSection from "@/features/content/components/about-reasons-section";
import AboutStorySection from "@/features/content/components/about-story-section";
import AboutValuesSection from "@/features/content/components/about-values-section";
import AppCtaSection from "@/features/content/components/app-cta-section";
import AuthoritiesSection from "@/features/content/components/authorities-section";
import PageHero from "@/features/content/components/page-hero";
import SeoBar from "@/features/content/components/seo-bar";
import {
  ABOUT_HERO_COPY,
  ABOUT_HERO_IMAGE,
  CONTENT_PAGES,
} from "@/features/content/constants";

interface AboutPageProps {
  onOpenHome: () => void;
}

export default function AboutPage({ onOpenHome }: AboutPageProps) {
  return (
    <div className="w-full">
      <SeoBar pageId={CONTENT_PAGES.about} />
      <main aria-label="من نحن" className="w-full overflow-hidden">
        <PageHero
          onOpenHome={onOpenHome}
          copy={ABOUT_HERO_COPY}
          image={ABOUT_HERO_IMAGE}
        />
        <AboutStorySection />
        <AuthoritiesSection />
        <AboutValuesSection />
        <AboutReasonsSection />
        <AppCtaSection />
      </main>
    </div>
  );
}
