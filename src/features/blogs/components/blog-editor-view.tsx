import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  Eye,
  FileEdit,
  Globe,
  HelpCircle,
  ImageIcon,
  Layers,
  Save,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedPanel, FadeIn } from "@/components/animations";
import WarningDialog from "@/components/warning-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  createBlog,
  estimateReadingTimeFromHtml,
  getCategories,
  updateBlog,
} from "../blogs-store";
import { blogFormSchema } from "../schemas/blog-schema";
import type { BlogFaq, BlogInput, BlogRecord, BlogStatus, BlogTopic } from "../types";
import BlogBannerEditor from "./blog-banner-editor";
import BlogBasicInfoEditor from "./blog-basic-info-editor";
import BlogFaqsEditor from "./blog-faqs-editor";
import BlogLivePreview from "./blog-live-preview";
import BlogSeoEditor from "./blog-seo-editor";
import BlogTopicsEditor from "./blog-topics-editor";

interface BlogEditorViewProps {
  initialBlog?: BlogRecord;
  isNew?: boolean;
}

export default function BlogEditorView({
  initialBlog,
  isNew = false,
}: BlogEditorViewProps) {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialBlog?.title ?? "");
  const [slug, setSlug] = useState(initialBlog?.slug ?? "");
  const [description, setDescription] = useState(
    initialBlog?.description ?? "",
  );
  const [category, setCategory] = useState(
    initialBlog?.category ?? (getCategories()[0]?.label || ""),
  );
  const [bannerImage, setBannerImage] = useState(
    initialBlog?.bannerImage ?? "",
  );
  const [bannerAlt, setBannerAlt] = useState(initialBlog?.bannerAlt ?? "");
  const [readingTime, setReadingTime] = useState(
    initialBlog?.readingTime ?? "5 دقائق قراءة",
  );
  const [status, setStatus] = useState<BlogStatus>(
    initialBlog?.status ?? "draft",
  );
  const [featured, setFeatured] = useState(initialBlog?.featured ?? false);
  const [metaTitle, setMetaTitle] = useState(
    initialBlog?.seo?.metaTitle ?? "",
  );
  const [metaDescription, setMetaDescription] = useState(
    initialBlog?.seo?.metaDescription ?? "",
  );
  const [keywords, setKeywords] = useState(
    initialBlog?.seo?.keywords ?? "",
  );

  const [topics, setTopics] = useState<BlogTopic[]>(
    initialBlog?.topics && initialBlog.topics.length > 0
      ? initialBlog.topics
      : [
        {
          id: `topic-${Date.now()}`,
          headline: "المحور الأول",
          content: "<p>اكتب محتوى هذا المحور بتنسيق غني هنا...</p>",
        },
      ],
  );

  const [faqs, setFaqs] = useState<BlogFaq[]>(
    initialBlog?.faqs && initialBlog.faqs.length > 0
      ? initialBlog.faqs
      : [
        {
          id: `faq-${Date.now()}`,
          question: "سؤال شائع حول هذا الموضوع؟",
          answer: "إجابة توضيحية شاملة تساعد القارئ على الفهم المباشر.",
        },
      ],
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [isLivePreview, setIsLivePreview] = useState(false);

  function clearFieldError(fieldPrefix: string) {
    setErrors((prev) => {
      const next = { ...prev };
      let hasChange = false;
      for (const key of Object.keys(next)) {
        if (key === fieldPrefix || key.startsWith(`${fieldPrefix}.`) || key.startsWith(`${fieldPrefix}`)) {
          delete next[key];
          hasChange = true;
        }
      }
      return hasChange ? next : prev;
    });
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    clearFieldError("title");
  }

  function handleSlugChange(val: string) {
    setSlug(val);
    clearFieldError("slug");
  }

  function handleDescriptionChange(val: string) {
    setDescription(val);
    clearFieldError("description");
  }

  function handleCategoryChange(val: string) {
    setCategory(val);
    clearFieldError("category");
  }

  function handleReadingTimeChange(val: string) {
    setReadingTime(val);
    clearFieldError("readingTime");
  }

  function handleStatusChange(val: BlogStatus) {
    setStatus(val);
    clearFieldError("status");
  }

  function handleFeaturedChange(val: boolean) {
    setFeatured(val);
    clearFieldError("featured");
  }

  function handleBannerImageChange(val: string) {
    setBannerImage(val);
    clearFieldError("bannerImage");
  }

  function handleBannerAltChange(val: string) {
    setBannerAlt(val);
    clearFieldError("bannerAlt");
  }

  function handleTopicsChange(val: BlogTopic[]) {
    setTopics(val);
    clearFieldError("topics");
  }

  function handleFaqsChange(val: BlogFaq[]) {
    setFaqs(val);
    clearFieldError("faqs");
  }

  function handleMetaTitleChange(val: string) {
    setMetaTitle(val);
    clearFieldError("seo.metaTitle");
    clearFieldError("metaTitle");
  }

  function handleMetaDescriptionChange(val: string) {
    setMetaDescription(val);
    clearFieldError("seo.metaDescription");
    clearFieldError("metaDescription");
  }

  function handleKeywordsChange(val: string) {
    setKeywords(val);
    clearFieldError("seo.keywords");
    clearFieldError("keywords");
  }

  function generateSlugFromTitle() {
    if (!title) return;
    const generated = title
      .trim()
      .toLowerCase()
      .replace(/[^\u0621-\u064A0-9a-zA-Z\s-]/g, "")
      .replace(/\s+/g, "-");
    setSlug(generated);
    clearFieldError("slug");
    toast.success("تم توليد الرابط الدائم من عنوان المقال");
  }

  function handleAutoCalculateReadingTime() {
    const res = estimateReadingTimeFromHtml(topics);
    setReadingTime(res.label);
    clearFieldError("readingTime");
    toast.info(`تم تقدير وقت القراءة: ${res.label}`);
  }

  // Count errors per tab
  const basicErrorsCount = Object.keys(errors).filter(
    (k) =>
      k === "title" ||
      k === "slug" ||
      k === "description" ||
      k === "category" ||
      k === "readingTime" ||
      k === "status" ||
      k === "featured",
  ).length;

  const topicsErrorsCount = Object.keys(errors).filter((k) =>
    k.startsWith("topics"),
  ).length;

  const bannerErrorsCount = Object.keys(errors).filter((k) =>
    k.startsWith("banner") || k === "bannerImage" || k === "bannerAlt",
  ).length;

  const faqsErrorsCount = Object.keys(errors).filter((k) =>
    k.startsWith("faqs"),
  ).length;

  const seoErrorsCount = Object.keys(errors).filter(
    (k) =>
      k.startsWith("seo") ||
      k === "metaTitle" ||
      k === "metaDescription" ||
      k === "keywords",
  ).length;

  // Construct current preview record
  const currentBlogRecord: BlogRecord = {
    id: initialBlog?.id ?? "BLG-PREVIEW",
    slug: slug || "blog-preview",
    title: title || "عنوان المقال التوضيحي",
    description,
    category,
    bannerImage,
    bannerAlt: bannerAlt || title,
    readingTime,
    readingTimeMinutes: parseInt(readingTime) || 5,
    status,
    featured,
    publishedAt: initialBlog?.publishedAt ?? new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
    viewsCount: initialBlog?.viewsCount ?? 0,
    topics,
    faqs,
    seo: {
      metaTitle: metaTitle || `${title} | مكفي وموفي`,
      metaDescription: metaDescription || description,
      keywords,
      ogImage: bannerImage,
    },
  };

  function handleSave(saveStatus?: BlogStatus) {
    const nextStatus = saveStatus ?? status;

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      category: category.trim(),
      readingTime: readingTime.trim(),
      status: nextStatus,
      featured,
      bannerImage,
      bannerAlt: bannerAlt.trim(),
      topics,
      faqs,
      seo: {
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        keywords: keywords.trim(),
      },
    };

    const validationResult = blogFormSchema.safeParse(payload);

    if (!validationResult.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of validationResult.error.issues) {
        const path = issue.path.join(".");
        if (!nextErrors[path]) {
          nextErrors[path] = issue.message;
        }
        // Normalize seo paths
        if (path.startsWith("seo.")) {
          const field = path.replace("seo.", "");
          if (!nextErrors[field]) nextErrors[field] = issue.message;
        }
      }
      setErrors(nextErrors);

      // Determine the first tab with an error and switch to it
      const firstIssuePath = validationResult.error.issues[0]?.path[0];
      if (
        firstIssuePath === "title" ||
        firstIssuePath === "slug" ||
        firstIssuePath === "description" ||
        firstIssuePath === "category" ||
        firstIssuePath === "readingTime" ||
        firstIssuePath === "status" ||
        firstIssuePath === "featured"
      ) {
        setActiveTab("basic");
      } else if (firstIssuePath === "topics") {
        setActiveTab("topics");
      } else if (
        firstIssuePath === "bannerImage" ||
        firstIssuePath === "bannerAlt"
      ) {
        setActiveTab("banner");
      } else if (firstIssuePath === "faqs") {
        setActiveTab("faqs");
      } else if (firstIssuePath === "seo") {
        setActiveTab("seo");
      }

      const firstErrorMsg =
        validationResult.error.issues[0]?.message ||
        "يرجى تصحيح الحقول المطلوبة قبل الحفظ";
      toast.error(firstErrorMsg);
      return;
    }

    setErrors({});

    const input: BlogInput = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      category: category.trim(),
      bannerImage,
      bannerAlt: bannerAlt.trim() || title.trim(),
      readingTime: readingTime.trim(),
      readingTimeMinutes: parseInt(readingTime) || 5,
      status: nextStatus,
      featured,
      topics,
      faqs,
      seo: {
        metaTitle: metaTitle.trim() || `${title.trim()} | مكفي وموفي`,
        metaDescription: metaDescription.trim() || description.trim(),
        keywords: keywords.trim(),
        ogImage: bannerImage,
      },
    };

    if (isNew || !initialBlog?.id) {
      const created = createBlog(input);
      toast.success(
        nextStatus === "published"
          ? "تم نشر المقال بنجاح وإضافته إلى الموقع"
          : "تم حفظ المسودة بنجاح",
      );
      navigate(`/blogs/${created.id}`);
    } else {
      updateBlog(initialBlog.id, input);
      setStatus(nextStatus);
      toast.success(
        nextStatus === "published"
          ? "تم تحديث ونشر المقال على الموقع بنجاح"
          : "تم حفظ التعديلات بنجاح",
      );
      navigate(`/blogs/${initialBlog.id}`);
    }
  }

  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [targetNavigateUrl, setTargetNavigateUrl] = useState<string | null>(null);

  function handleRequestNavigation(toUrl: string) {
    setTargetNavigateUrl(toUrl);
    setShowCancelWarning(true);
  }

  function handleConfirmCancel() {
    const fallbackUrl = initialBlog?.id ? `/blogs/${initialBlog.id}` : "/blogs";
    navigate(targetNavigateUrl ?? fallbackUrl);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleSave();
  }

  return (
    <TooltipProvider delay={150}>
      <div className="page-shell space-y-6 py-4 sm:py-6 md:py-8">
        {/* Top Header Bar */}
        <FadeIn duration={0.3}>
          <div className="flex flex-col gap-4 border-b border-border/80 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground flex-wrap">
                <button
                  type="button"
                  onClick={() => handleRequestNavigation("/blogs")}
                  className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <ArrowRight className="size-3.5" />
                  <span>المدونة والمقالات</span>
                </button>
                <span>/</span>
                {isNew || !initialBlog?.id ? (
                  <span className="text-foreground">إضافة مقال جديد</span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleRequestNavigation(`/blogs/${initialBlog.id}`)}
                      className="hover:text-primary transition-colors line-clamp-1 max-w-[180px] sm:max-w-xs text-start cursor-pointer"
                    >
                      {initialBlog.title}
                    </button>
                    <span>/</span>
                    <span className="text-foreground">تحرير</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                <h1 className="text-xl font-black text-foreground sm:text-2xl truncate">
                  {isNew ? "إنشاء مقال جديد" : "تحرير محتوى المقال"}
                </h1>
                <Badge
                  variant={status === "published" ? "default" : "secondary"}
                  className="font-bold text-xs"
                >
                  {status === "published" ? "منشور على الموقع" : "مسودة"}
                </Badge>
                {featured && (
                  <Badge variant="outline" className="border-secondary text-secondary gap-1 font-bold text-xs">
                    <Sparkles className="size-3" />
                    <span>مميز</span>
                  </Badge>
                )}
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="grid grid-cols-2 gap-2 min-[480px]:flex min-[480px]:flex-wrap min-[480px]:items-center">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant={isLivePreview ? "primary" : "outline"}
                      onClick={() => setIsLivePreview(!isLivePreview)}
                      className="gap-2 cursor-pointer justify-center"
                      aria-label="معاينة سريعة"
                    />
                  }
                >
                  <Eye className="size-4 shrink-0" />
                  <span>{isLivePreview ? "العودة للتحرير" : "معاينة سريعة"}</span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {isLivePreview ? "العودة إلى شاشة التحرير والتعديل" : "معاينة شكل المقال النهائي مباشرة"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSave("draft")}
                      className="gap-2 border-border cursor-pointer justify-center"
                      aria-label="حفظ كمسودة"
                    />
                  }
                >
                  <Save className="size-4 shrink-0" />
                  <span>حفظ كمسودة</span>
                </TooltipTrigger>
                <TooltipContent side="bottom">حفظ التغييرات كمسودة غير معلنة بالموقع</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => handleSave("published")}
                      className="gap-2 cursor-pointer col-span-2 min-[480px]:col-span-1 justify-center shadow-sm"
                      aria-label="نشر المقال على الموقع"
                    />
                  }
                >
                  <Send className="size-4 shrink-0" />
                  <span>نشر المقال</span>
                </TooltipTrigger>
                <TooltipContent side="bottom">حفظ ونشر المقال فوراً على الموقع والمدونة</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </FadeIn>

        {/* Live Preview View vs Edit Mode (Smooth Toggle Transition) */}
        <AnimatePresence mode="wait">
          {isLivePreview ? (
            <motion.div
              key="live-preview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="space-y-4"
            >
              <div className="flex flex-col gap-3 rounded-2xl bg-muted/60 p-4 border border-border sm:flex-row sm:items-center sm:justify-between shadow-xs">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground">
                  <Sparkles className="size-4 text-primary shrink-0 animate-pulse" />
                  <span>أنت الآن في وضع المعاينة الحية المباشرة لشكل المقال كما يظهر للزوار</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsLivePreview(false)}
                  className="gap-1.5 cursor-pointer self-start sm:self-auto transition-transform active:scale-95"
                >
                  <FileEdit className="size-4" />
                  <span>العودة للتحرير</span>
                </Button>
              </div>

              <BlogLivePreview
                blog={currentBlogRecord}
                showBackToDashboard={false}
              />
            </motion.div>
          ) : (
            /* Edit Mode Tabs */
            <motion.form
              key="edit-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
              onSubmit={handleSubmit}
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                {/* Modern Responsive Tabs List */}
                <div className="overflow-x-auto pb-1 scrollbar-none">
                  <TabsList className="h-auto min-h-12 w-full min-w-max justify-start gap-1.5 rounded-2xl bg-muted/80 p-1.5 border border-border/70 backdrop-blur-xs">
                    <TabsTrigger
                      value="basic"
                      className="gap-2 rounded-xl px-3.5 py-2 text-xs font-bold sm:px-4 sm:py-2.5 sm:text-sm data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-xs transition-all cursor-pointer relative"
                    >
                      <FileEdit className="size-4 text-primary shrink-0" />
                      <span>البيانات الأساسية</span>
                      {basicErrorsCount > 0 && (
                        <span className="ms-1 inline-flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-bounce">
                          {basicErrorsCount}
                        </span>
                      )}
                    </TabsTrigger>

                    <TabsTrigger
                      value="topics"
                      className="gap-2 rounded-xl px-3.5 py-2 text-xs font-bold sm:px-4 sm:py-2.5 sm:text-sm data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-xs transition-all cursor-pointer relative"
                    >
                      <Layers className="size-4 text-primary shrink-0" />
                      <span>المحاور والمحتوى</span>
                      {topicsErrorsCount > 0 ? (
                        <span className="ms-1 inline-flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-bounce">
                          {topicsErrorsCount}
                        </span>
                      ) : (
                        <span className="ms-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-bold text-primary">
                          {topics.length}
                        </span>
                      )}
                    </TabsTrigger>

                    <TabsTrigger
                      value="banner"
                      className="gap-2 rounded-xl px-3.5 py-2 text-xs font-bold sm:px-4 sm:py-2.5 sm:text-sm data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-xs transition-all cursor-pointer relative"
                    >
                      <ImageIcon className="size-4 text-primary shrink-0" />
                      <span>صورة الغلاف</span>
                      {bannerErrorsCount > 0 && (
                        <span className="ms-1 inline-flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-bounce">
                          {bannerErrorsCount}
                        </span>
                      )}
                    </TabsTrigger>

                    <TabsTrigger
                      value="faqs"
                      className="gap-2 rounded-xl px-3.5 py-2 text-xs font-bold sm:px-4 sm:py-2.5 sm:text-sm data-[state=active]:bg-card data-[state=active]:text-secondary data-[state=active]:shadow-xs transition-all cursor-pointer relative"
                    >
                      <HelpCircle className="size-4 text-secondary shrink-0" />
                      <span>الأسئلة الشائعة</span>
                      {faqsErrorsCount > 0 ? (
                        <span className="ms-1 inline-flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-bounce">
                          {faqsErrorsCount}
                        </span>
                      ) : (
                        <span className="ms-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary/15 px-1.5 text-[11px] font-bold text-secondary">
                          {faqs.length}
                        </span>
                      )}
                    </TabsTrigger>

                    <TabsTrigger
                      value="seo"
                      className="gap-2 rounded-xl px-3.5 py-2 text-xs font-bold sm:px-4 sm:py-2.5 sm:text-sm data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-xs transition-all cursor-pointer relative"
                    >
                      <Globe className="size-4 text-primary shrink-0" />
                      <span>تحسين محركات البحث SEO</span>
                      {seoErrorsCount > 0 && (
                        <span className="ms-1 inline-flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-bounce">
                          {seoErrorsCount}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab 1: Basic Information */}
                <TabsContent value="basic">
                  <AnimatedPanel className="space-y-6">
                    <BlogBasicInfoEditor
                      title={title}
                      onTitleChange={handleTitleChange}
                      slug={slug}
                      onSlugChange={handleSlugChange}
                      description={description}
                      onDescriptionChange={handleDescriptionChange}
                      category={category}
                      onCategoryChange={handleCategoryChange}
                      readingTime={readingTime}
                      onReadingTimeChange={handleReadingTimeChange}
                      status={status}
                      onStatusChange={handleStatusChange}
                      featured={featured}
                      onFeaturedChange={handleFeaturedChange}
                      onGenerateSlug={generateSlugFromTitle}
                      onAutoCalculateReadingTime={handleAutoCalculateReadingTime}
                      errors={errors}
                    />
                  </AnimatedPanel>
                </TabsContent>

                {/* Tab 2: Topics & Rich Text Body */}
                <TabsContent value="topics">
                  <AnimatedPanel className="space-y-6">
                    <Card className="rounded-3xl border-border/80 bg-card shadow-xs">
                      <CardContent className="pt-6">
                        <BlogTopicsEditor
                          topics={topics}
                          onChange={handleTopicsChange}
                          errors={errors}
                        />
                      </CardContent>
                    </Card>
                  </AnimatedPanel>
                </TabsContent>

                {/* Tab 3: Banner Image */}
                <TabsContent value="banner">
                  <AnimatedPanel className="space-y-6">
                    <BlogBannerEditor
                      bannerImage={bannerImage}
                      onBannerImageChange={handleBannerImageChange}
                      bannerAlt={bannerAlt}
                      onBannerAltChange={handleBannerAltChange}
                      fallbackTitle={title}
                      errors={errors}
                    />
                  </AnimatedPanel>
                </TabsContent>

                {/* Tab 4: FAQ Items */}
                <TabsContent value="faqs">
                  <AnimatedPanel className="space-y-6">
                    <Card className="rounded-3xl border-border/80 bg-card shadow-xs">
                      <CardContent className="pt-6">
                        <BlogFaqsEditor
                          faqs={faqs}
                          onChange={handleFaqsChange}
                          errors={errors}
                        />
                      </CardContent>
                    </Card>
                  </AnimatedPanel>
                </TabsContent>

                {/* Tab 5: SEO & Social */}
                <TabsContent value="seo">
                  <AnimatedPanel className="space-y-6">
                    <BlogSeoEditor
                      metaTitle={metaTitle}
                      onMetaTitleChange={handleMetaTitleChange}
                      metaDescription={metaDescription}
                      onMetaDescriptionChange={handleMetaDescriptionChange}
                      keywords={keywords}
                      onKeywordsChange={handleKeywordsChange}
                      title={title}
                      slug={slug}
                      description={description}
                      errors={errors}
                    />
                  </AnimatedPanel>
                </TabsContent>
              </Tabs>

              {/* Bottom Sticky Action Bar */}
              <FadeIn direction="up" duration={0.35} delay={0.06}>
                <div className="sticky bottom-4 z-20 mt-8 flex flex-col gap-3.5 rounded-3xl border border-border/90 bg-card/90 p-4 shadow-xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between transition-all">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs font-semibold">
                      {topics.length} محاور
                    </Badge>
                    <Badge variant="outline" className="text-xs font-semibold">
                      {faqs.length} أسئلة
                    </Badge>
                    {category && (
                      <Badge variant="secondary" className="text-xs font-medium">
                        {category}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground hidden md:inline">
                      وقت القراءة: {readingTime}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        handleRequestNavigation(
                          initialBlog?.id ? `/blogs/${initialBlog.id}` : "/blogs",
                        )
                      }
                      className="h-10 gap-1.5 cursor-pointer justify-center text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-transform active:scale-95"
                    >
                      <X className="size-4 shrink-0 sm:hidden" />
                      <span>إلغاء</span>
                    </Button>

                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleSave("draft")}
                            className="h-10 gap-1.5 border-border cursor-pointer justify-center text-xs sm:text-sm font-semibold transition-transform active:scale-95"
                            aria-label="حفظ مسودة"
                          />
                        }
                      >
                        <Save className="size-4 shrink-0" />
                        <span>مسودة</span>
                      </TooltipTrigger>
                      <TooltipContent side="top">حفظ التغييرات دون نشر</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            type="button"
                            variant="primary"
                            onClick={() => handleSave("published")}
                            className="h-10 gap-1.5 cursor-pointer justify-center text-xs sm:text-sm font-bold shadow-xs transition-transform active:scale-95"
                            aria-label="نشر المقال"
                          />
                        }
                      >
                        <Send className="size-4 shrink-0" />
                        <span>نشر</span>
                      </TooltipTrigger>
                      <TooltipContent side="top">حفظ وتحديث نشر المقال بالموقع</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </FadeIn>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Cancel / Discard Changes Warning Dialog */}
        <WarningDialog
          open={showCancelWarning}
          onOpenChange={setShowCancelWarning}
          title="هل أنت متأكد من مغادرة شاشة التحرير؟"
          description="سيتم إلغاء أي تعديلات أو بيانات غير محفوظة تم إدخالها على هذا المقال والرجوع إلى الشاشة السابقة."
          confirmLabel="مغادرة وتجاهل التعديلات"
          cancelLabel="البقاء ومتابعة التحرير"
          onConfirm={handleConfirmCancel}
        />
      </div>
    </TooltipProvider>
  );
}

