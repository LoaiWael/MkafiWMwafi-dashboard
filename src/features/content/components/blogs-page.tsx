import { ArrowLeft, BookOpen } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { buttonVariants } from "@/components/ui/button";
import PageHero from "@/features/content/components/page-hero";
import SeoBar from "@/features/content/components/seo-bar";
import {
  BLOGS_HERO_COPY,
  BLOGS_HERO_IMAGE,
  CONTENT_PAGES,
} from "@/features/content/constants";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

interface BlogsPageProps {
  onOpenHome: () => void;
}

export default function BlogsPage({ onOpenHome }: BlogsPageProps) {
  return (
    <div className="w-full">
      <SeoBar pageId={CONTENT_PAGES.blogs} />
      <main aria-label="المدونة" className="w-full overflow-hidden">
        <PageHero
          onOpenHome={onOpenHome}
          copy={BLOGS_HERO_COPY}
          image={BLOGS_HERO_IMAGE}
        />

        <section className="page-shell py-10 sm:py-14 lg:py-18">
          <FadeIn direction="up" delay={0.1} distance={20}>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8 md:p-10">
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
                    إدارة وتحديث مقالات المدونة
                  </h2>
                  <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
                    يمكنك إضافة مقالات جديدة، تعديل المحتوى، تنظيم التصنيفات، وتحديث الأسئلة الشائعة وتحسين محركات البحث مباشرة من قسم إدارة المقالات.
                  </p>
                </div>

                <div className="shrink-0">
                  <Link
                    to={ROUTES.blogs}
                    className={cn(
                      buttonVariants({ variant: "primary", size: "lg" }),
                      "w-full sm:w-auto",
                    )}
                    viewTransition
                  >
                    <BookOpen className="size-4" aria-hidden="true" />
                    <span>الانتقال إلى صفحة المدونة</span>
                    <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>
    </div>
  );
}
