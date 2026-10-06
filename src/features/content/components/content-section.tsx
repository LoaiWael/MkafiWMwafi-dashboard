import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import AboutPage from "@/features/content/components/about-page";
import BlogsPage from "@/features/content/components/blogs-page";
import { ContentDraftProvider } from "@/features/content/components/content-draft-provider";
import ContentSaveBar from "@/features/content/components/content-save-bar";
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
    <ContentDraftProvider>
      <div className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-6 md:py-8">
        <FadeIn duration={0.3}>
          <PageHeader
            title="محتوى الموقع"
            description="تخصيص وإدارة بيانات ومحتوى الصفحة الرئيسية وصفحة من نحن وصفحة المدونة."
          />
        </FadeIn>

        <FadeIn duration={0.3} delay={0.06}>
          <div className="overflow-hidden rounded-xl border border-border bg-background sm:rounded-2xl shadow-xs">
            <SiteHeader activePage={activePage} onNavigate={setActivePage} />
            <div className={activePage === CONTENT_PAGES.home ? undefined : "hidden"}>
              <HomePage />
            </div>
            <div className={activePage === CONTENT_PAGES.about ? undefined : "hidden"}>
              <AboutPage onOpenHome={() => setActivePage(CONTENT_PAGES.home)} />
            </div>
            <div className={activePage === CONTENT_PAGES.blogs ? undefined : "hidden"}>
              <BlogsPage onOpenHome={() => setActivePage(CONTENT_PAGES.home)} />
            </div>
          </div>
        </FadeIn>
        <ContentSaveBar />
      </div>
    </ContentDraftProvider>
  );
}

