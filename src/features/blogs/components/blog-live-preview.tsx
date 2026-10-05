import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  HelpCircle,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatArabicDate } from "../blogs-store";
import type { BlogRecord } from "../types";

interface BlogLivePreviewProps {
  blog: BlogRecord;
  showBackToDashboard?: boolean;
  onBack?: () => void;
}

export default function BlogLivePreview({
  blog,
  showBackToDashboard = false,
  onBack,
}: BlogLivePreviewProps) {
  const [activeTopicId, setActiveTopicId] = useState<string>(
    blog.topics?.[0]?.id ?? "",
  );

  const topics = blog.topics || [];
  const faqs = blog.faqs || [];

  function scrollToSection(id: string) {
    setActiveTopicId(id);
    const element = document.getElementById(`preview-section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl border border-border/80 bg-background text-foreground shadow-lg overflow-hidden">
      {/* Site Header Simulator */}
      <div className="flex items-center justify-between border-b border-border/70 bg-card/90 px-4 py-3 sm:px-6 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary">
            <BookOpen className="size-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-foreground">
              معاينة المقال المباشرة
            </span>
            <span className="ms-2 hidden text-xs text-muted-foreground sm:inline">
              (مطابقة تماماً لشكل المقال على موقع مكفي وموفي)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={blog.status === "published" ? "default" : "secondary"}
            className="text-xs"
          >
            {blog.status === "published"
              ? "منشور على الموقع"
              : "مسودة غير معلنة"}
          </Badge>

          {showBackToDashboard && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <ArrowRight className="size-3.5" />
              <span>العودة للوحة التحكم</span>
            </button>
          )}
        </div>
      </div>

      {/* Actual Article Body matching makfiwamufi.sa */}
      <article className="p-4 sm:p-8 lg:p-10">
        <div className="space-y-6">
          {/* Breadcrumb / Back */}
          <div className="flex items-center justify-between">
            <span className="group inline-flex items-center gap-2 text-xs font-bold text-muted-foreground sm:text-sm">
              <ArrowRight className="size-4 rtl:rotate-0" />
              <span>العودة لجميع المقالات</span>
            </span>

            <span className="text-xs text-muted-foreground">
              الرابط: /blogs/{blog.slug}
            </span>
          </div>

          {/* Article Header */}
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800">
              <Tag className="size-3" />
              <span>{blog.category || "العقود العقارية"}</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl lg:text-4xl leading-tight">
              {blog.title || "عنوان المقال الرئيسي"}
            </h1>

            {blog.description && (
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                {blog.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground sm:text-sm border-y border-border/50 py-3">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="size-4 text-primary-600" />
                <span>
                  آخر تحديث:{" "}
                  <time className="font-semibold text-foreground">
                    {formatArabicDate(blog.updatedAt || blog.publishedAt)}
                  </time>
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="size-4 text-secondary" />
                <span>
                  وقت القراءة:{" "}
                  <span className="font-semibold text-foreground">
                    {blog.readingTime || "5 دقائق قراءة"}
                  </span>
                </span>
              </div>
            </div>
          </header>

          {/* Banner Image */}
          {blog.bannerImage && (
            <div className="relative aspect-16/9 max-h-[460px] w-full overflow-hidden rounded-3xl border border-border bg-muted shadow-sm flex items-center justify-center">
              <img
                src={blog.bannerImage}
                alt={blog.bannerAlt || blog.title}
                className="size-full object-cover object-center"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/logo.svg";
                }}
              />
            </div>
          )}

          {/* Main 2-Column Grid */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Sidebar Table of Contents */}
            <aside className="lg:col-span-4">
              <div className="sticky top-6 rounded-3xl border border-border bg-card/95 p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-border/70 pb-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                      <BookOpen className="size-4" />
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      محتويات المقال
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary-700">
                    {topics.length} محاور
                  </span>
                </div>

                {/* Topics Index */}
                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-bold text-muted-foreground">
                    المحاور ({topics.length})
                  </p>
                  <ol className="space-y-1.5">
                    {topics.map((topic, index) => {
                      const isActive = activeTopicId === topic.id;
                      return (
                        <li key={topic.id}>
                          <button
                            type="button"
                            onClick={() => scrollToSection(topic.id)}
                            className={`group flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-start text-xs leading-relaxed transition-all cursor-pointer ${
                              isActive
                                ? "bg-primary-50 font-bold text-primary-950"
                                : "font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                            }`}
                          >
                            <span
                              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm text-[10px] font-bold transition-colors ${
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground group-hover:bg-primary-50 group-hover:text-primary-700"
                              }`}
                            >
                              {index + 1}
                            </span>
                            <span className="flex-1 line-clamp-2">
                              {topic.headline || `المحور ${index + 1}`}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                {/* FAQs Index Link */}
                {faqs.length > 0 && (
                  <div className="mt-5 border-t border-border/70 pt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => scrollToSection("faqs-list")}
                        className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:underline cursor-pointer"
                      >
                        <HelpCircle className="size-3.5" />
                        <span>الأسئلة الشائعة</span>
                      </button>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {faqs.length} أسئلة
                      </span>
                    </div>

                    <ol className="space-y-1">
                      {faqs.map((faq, idx) => (
                        <li key={faq.id}>
                          <button
                            type="button"
                            onClick={() => scrollToSection("faqs-list")}
                            className="group flex w-full items-start gap-2.5 rounded-xl px-3 py-1.5 text-start text-xs leading-relaxed font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground cursor-pointer"
                          >
                            <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-sm text-[10px] font-bold bg-muted text-muted-foreground group-hover:bg-secondary-50 group-hover:text-secondary-700">
                              س{idx + 1}
                            </span>
                            <span className="flex-1 line-clamp-1">
                              {faq.question}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content Sections */}
            <div className="space-y-10 lg:col-span-8">
              {topics.map((topic, index) => (
                <section
                  key={topic.id}
                  id={`preview-section-${topic.id}`}
                  className="scroll-mt-28 border-b border-border/60 pb-8 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xs font-bold text-primary-800">
                      {index + 1}
                    </span>
                    <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      {topic.headline || `المحور ${index + 1}`}
                    </h2>
                  </div>

                  <div
                    className="mt-4 space-y-4 text-sm leading-8 text-foreground/90 sm:text-base sm:leading-9 rich-text-content"
                    dangerouslySetInnerHTML={{
                      __html: topic.content || "<p>لا يوجد محتوى في هذا المحور بعد.</p>",
                    }}
                  />
                </section>
              ))}

              {/* FAQ Section */}
              {faqs.length > 0 && (
                <section
                  id="preview-section-faqs-list"
                  className="scroll-mt-28 border-t border-border/80 pt-8"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-secondary-50 text-secondary">
                      <HelpCircle className="size-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-secondary">
                        إجابات سريعة
                      </span>
                      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        الأسئلة الشائعة حول هذا المقال
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {faqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="rounded-2xl border border-border/70 bg-card/60 p-5 shadow-xs transition-colors hover:border-secondary-200 sm:p-6"
                      >
                        <h3 className="flex items-start gap-3 text-base font-bold text-foreground sm:text-lg">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-xs font-bold text-secondary">
                            ؟
                          </span>
                          <span>{faq.question}</span>
                        </h3>
                        <p className="mt-3 text-sm leading-8 text-muted-foreground sm:me-9 sm:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
