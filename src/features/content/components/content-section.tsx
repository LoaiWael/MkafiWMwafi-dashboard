import PageHeader from "@/components/layout/page-header";
import AboutPage from "@/features/content/components/about-page";
import HomePage from "@/features/content/components/home-page";
import SiteHeader from "@/features/content/components/site-header";
import {
  CONTENT_PAGE_IDS,
  CONTENT_PAGES,
  type ContentPageId,
} from "@/features/content/constants";
import { useUrlTab } from "@/hooks/use-url-tab";

export default function ContentSection() {
  const [activePage, setActivePage] = useUrlTab<ContentPageId>({
    paramKey: "page",
    defaultValue: CONTENT_PAGES.home,
    validValues: CONTENT_PAGE_IDS,
    clearDefaultFromUrl: true,
  });

  return (
    <div className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-6 md:py-8">
      <PageHeader
        title="محتوى الموقع"
        description="تخصيص وإدارة بيانات ومحتوى الصفحة الرئيسية وصفحة من نحن."
      />

      <div className="overflow-hidden rounded-xl border border-border bg-background sm:rounded-2xl">
        <SiteHeader activePage={activePage} onNavigate={setActivePage} />
        {activePage === CONTENT_PAGES.home ? <HomePage /> : <AboutPage />}
      </div>
    </div>
  );
}
