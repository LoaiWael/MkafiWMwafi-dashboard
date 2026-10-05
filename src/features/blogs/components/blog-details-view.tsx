import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  Copy,
  Edit,
  Globe,
  HelpCircle,
  Layers,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { FadeIn } from "@/components/animations";
import WarningDialog from "@/components/warning-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  deleteBlog,
  duplicateBlog,
  formatArabicDate,
  toggleBlogStatus,
} from "../blogs-store";
import type { BlogRecord, BlogStatus } from "../types";

interface BlogDetailsViewProps {
  blog: BlogRecord;
}

export default function BlogDetailsView({ blog }: BlogDetailsViewProps) {
  const navigate = useNavigate();
  const [activeTopicId, setActiveTopicId] = useState<string>(
    blog.topics?.[0]?.id ?? "",
  );
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const isPublished = blog.status === "published";
  const topics = blog.topics || [];
  const faqs = blog.faqs || [];

  function scrollToSection(id: string) {
    setActiveTopicId(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleToggleStatus() {
    const nextStatus: BlogStatus = isPublished ? "draft" : "published";
    toggleBlogStatus(blog.id, nextStatus);
    toast.success(
      nextStatus === "published"
        ? "تم نشر المقال على المنصة بنجاح"
        : "تم تحويل المقال إلى مسودة",
    );
  }

  function handleDuplicate() {
    const dup = duplicateBlog(blog.id);
    if (dup) {
      toast.success("تم تكرار المقال بنجاح وحفظه كمسودة");
      navigate(`/blogs/${dup.id}/edit`);
    }
  }

  function handleDelete() {
    deleteBlog(blog.id);
    toast.success("تم حذف المقال بنجاح");
    navigate("/blogs");
  }

  return (
    <div className="page-shell space-y-6 py-4 sm:py-6 md:py-8">
      {/* Top Breadcrumb & Control Bar */}
      <FadeIn duration={0.3}>
        <div className="flex flex-col gap-4 border-b border-border/80 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground flex-wrap">
              <Link
                to="/blogs"
                className="hover:text-primary transition-colors flex items-center gap-1 shrink-0"
              >
                <ArrowRight className="size-3.5" />
                <span>المدونة والمقالات</span>
              </Link>
              <span>/</span>
              <span className="text-foreground line-clamp-1 max-w-[200px] min-[400px]:max-w-[280px] sm:max-w-md">
                {blog.title}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <h1 className="text-xl font-black text-foreground sm:text-2xl truncate">
                تفاصيل المقال
              </h1>
              <Badge
                variant={isPublished ? "default" : "secondary"}
                className="font-bold text-xs"
              >
                {isPublished ? "منشور على الموقع" : "مسودة"}
              </Badge>
              {blog.featured && (
                <Badge
                  variant="outline"
                  className="border-secondary text-secondary gap-1 font-bold text-xs"
                >
                  <Sparkles className="size-3" />
                  <span>مميز</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 min-[480px]:flex min-[480px]:flex-wrap min-[480px]:items-center">
            <Link
              to={`/blogs/${blog.id}/edit`}
              className={buttonVariants({
                variant: "primary",
                className: "gap-2 shadow-xs justify-center",
              })}
            >
              <Edit className="size-4 shrink-0" />
              <span>تحرير المقال</span>
            </Link>

            <Button
              type="button"
              variant="outline"
              onClick={handleToggleStatus}
              className="gap-1.5 border-border justify-center"
            >
              <Tag className="size-3.5 text-secondary shrink-0" />
              <span>{isPublished ? "تحويل لمسودة" : "نشر المقال"}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleDuplicate}
              className="gap-1.5 border-border justify-center"
              title="تكرار المقال"
            >
              <Copy className="size-3.5 shrink-0" />
              <span>تكرار</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteWarning(true)}
              className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive justify-center"
              title="حذف المقال"
            >
              <Trash2 className="size-3.5 shrink-0" />
              <span>حذف</span>
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Main Blog Details Card */}
      <FadeIn duration={0.3} delay={0.08}>
        <div className="rounded-3xl border border-border/90 bg-card p-4 sm:p-6 lg:p-8 shadow-sm">
          <div className="space-y-6 sm:space-y-8">
            {/* Header section */}
            <header className="space-y-3.5 sm:space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-800">
                  <Tag className="size-3.5 text-secondary shrink-0" />
                  <span>{blog.category}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground break-all">
                  <Globe className="size-3.5 shrink-0" />
                  <span className="font-mono">/blogs/{blog.slug}</span>
                </div>
              </div>

              <h1 className="text-xl font-black tracking-tight text-foreground sm:text-2xl md:text-3xl lg:text-4xl leading-tight break-words">
                {blog.title}
              </h1>

              {blog.description && (
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg break-words">
                  {blog.description}
                </p>
              )}

              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground sm:text-sm border-y border-border/60 py-3">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-primary-600 shrink-0" />
                  <span>
                    آخر تحديث:{" "}
                    <time className="font-semibold text-foreground">
                      {formatArabicDate(blog.updatedAt || blog.publishedAt)}
                    </time>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="size-4 text-secondary shrink-0" />
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
              <div className="relative aspect-16/9 max-h-[480px] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-muted shadow-sm flex items-center justify-center">
                <img
                  src={blog.bannerImage}
                  alt={blog.bannerAlt || blog.title}
                  className="size-full object-cover object-center"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/logo.svg";
                  }}
                />
              </div>
            )}

            {/* Main 2-Column Content Layout */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-10">
              {/* Sidebar: Table of Contents & Quick info */}
              <aside className="space-y-6 lg:col-span-4">
                <div className="sticky top-6 space-y-6">
                  {/* Table of Contents */}
                  <div className="rounded-2xl sm:rounded-3xl border border-border bg-card/95 p-4 sm:p-5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-border/70 pb-3">
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

                    {/* Topics List */}
                    <div className="mt-3.5">
                      <ol className="space-y-1">
                        {topics.map((topic, index) => {
                          const isActive = activeTopicId === topic.id;
                          return (
                            <li key={topic.id}>
                              <button
                                type="button"
                                onClick={() => scrollToSection(topic.id)}
                                className={`group flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-start text-xs leading-relaxed transition-all cursor-pointer ${
                                  isActive
                                    ? "bg-primary-50 font-bold text-primary-950 shadow-xs"
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

                    {/* FAQs Link */}
                    {faqs.length > 0 && (
                      <div className="mt-4 border-t border-border/70 pt-3">
                        <button
                          type="button"
                          onClick={() => scrollToSection("faqs-list")}
                          className="flex items-center gap-1.5 text-xs font-bold text-secondary hover:underline cursor-pointer"
                        >
                          <HelpCircle className="size-3.5" />
                          <span>الأسئلة الشائعة ({faqs.length})</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* SEO & Meta Info Card */}
                  <Card className="rounded-2xl sm:rounded-3xl border border-border/70 bg-muted/40 p-4 sm:p-5 shadow-xs">
                    <CardContent className="p-0 space-y-3 text-xs">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <Layers className="size-4 text-primary" />
                        <span>بيانات محركات البحث (SEO)</span>
                      </div>
                      <div className="space-y-1.5 text-muted-foreground">
                        <p className="break-words">
                          <strong className="text-foreground">عنوان Meta:</strong>{" "}
                          {blog.seo?.metaTitle || blog.title}
                        </p>
                        <p className="break-words">
                          <strong className="text-foreground">وصف Meta:</strong>{" "}
                          {blog.seo?.metaDescription || blog.description}
                        </p>
                        {blog.seo?.keywords && (
                          <p className="break-words">
                            <strong className="text-foreground">الكلمات المفتاحية:</strong>{" "}
                            {blog.seo.keywords}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="space-y-8 sm:space-y-10 lg:col-span-8">
                {topics.map((topic, index) => (
                  <section
                    key={topic.id}
                    id={`section-${topic.id}`}
                    className="scroll-mt-28 border-b border-border/60 pb-7 sm:pb-8 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xs font-bold text-primary-800">
                        {index + 1}
                      </span>
                      <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl break-words">
                        {topic.headline || `المحور ${index + 1}`}
                      </h2>
                    </div>

                    <div
                      className="mt-4 space-y-3.5 text-xs leading-7 sm:text-sm sm:leading-8 md:text-base md:leading-9 text-foreground/90 rich-text-content break-words overflow-hidden [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_table]:w-full [&_table]:overflow-x-auto [&_pre]:overflow-x-auto"
                      dangerouslySetInnerHTML={{
                        __html:
                          topic.content || "<p>لا يوجد محتوى لهذا المحور.</p>",
                      }}
                    />
                  </section>
                ))}

                {/* FAQ Section */}
                {faqs.length > 0 && (
                  <section
                    id="section-faqs-list"
                    className="scroll-mt-28 border-t border-border/80 pt-7 sm:pt-8"
                  >
                    <div className="mb-5 sm:mb-6 flex items-center gap-3">
                      <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-secondary-50 text-secondary shrink-0">
                        <HelpCircle className="size-4 sm:size-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-secondary">
                          إجابات سريعة
                        </span>
                        <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl md:text-2xl">
                          الأسئلة الشائعة حول هذا المقال
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-3.5 sm:space-y-4">
                      {faqs.map((faq) => (
                        <div
                          key={faq.id}
                          className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 md:p-6 shadow-xs transition-colors hover:border-secondary-300"
                        >
                          <h3 className="flex items-start gap-2.5 sm:gap-3 text-sm font-bold text-foreground sm:text-base md:text-lg">
                            <span className="flex size-5 sm:size-6 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-xs font-bold text-secondary">
                              ؟
                            </span>
                            <span className="break-words">{faq.question}</span>
                          </h3>
                          <p className="mt-2.5 sm:mt-3 text-xs leading-6 text-muted-foreground sm:me-8 sm:text-sm sm:leading-7 md:text-base md:leading-8 break-words">
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
        </div>
      </FadeIn>

      {/* Delete Confirmation Warning Dialog */}
      <WarningDialog
        open={showDeleteWarning}
        onOpenChange={setShowDeleteWarning}
        title="هل أنت متأكد من رغبتك في حذف هذا المقال؟"
        description="سيتم حذف المقال وجميع محاوره والأسئلة الشائعة المرتبطة به نهائياً."
        confirmLabel="تأكيد الحذف"
        cancelLabel="إلغاء"
        onConfirm={handleDelete}
      />
    </div>
  );
}

