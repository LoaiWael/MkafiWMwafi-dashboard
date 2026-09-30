import AboutStorySection from "@/features/content/components/about-story-section";
import AppCtaSection from "@/features/content/components/app-cta-section";
import AuthoritiesSection from "@/features/content/components/authorities-section";
import FaqSection from "@/features/content/components/faq-section";
import HeroSection from "@/features/content/components/hero-section";
import PricingSection from "@/features/content/components/pricing-section";
import RequirementsSection from "@/features/content/components/requirements-section";
import SeoBar from "@/features/content/components/seo-bar";
import { CONTENT_PAGES } from "@/features/content/constants";

export default function HomePage() {
  return (
    <div className="w-full">
      <SeoBar pageId={CONTENT_PAGES.home} />
      <main aria-label="الصفحة الرئيسية" className="w-full overflow-hidden">
        <HeroSection />
        <RequirementsSection />
        <AuthoritiesSection />
        <AboutStorySection />
        <PricingSection />
        <FaqSection />
        <AppCtaSection />
      </main>
    </div>
  );
}
