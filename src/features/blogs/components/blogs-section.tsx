import { useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  BookOpen,
  Grid,
  List as ListIcon,
  Plus,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import WarningDialog from "@/components/warning-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteBlog,
  duplicateBlog,
  toggleBlogStatus,
} from "../blogs-store";
import { useBlogCategories, useBlogs } from "../hooks/use-blogs";
import type { BlogRecord, BlogStatus } from "../types";
import BlogCard from "./blog-card";
import BlogsTable from "./blogs-table";

const STATUS_LABELS: Record<string, string> = {
  all: "جميع الحالات",
  published: "منشور فقط",
  draft: "مسودات فقط",
};

export default function BlogsSection() {
  const blogs = useBlogs();
  const categories = useBlogCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal States
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  const isFiltered =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== "all" ||
    selectedStatus !== "all";

  // Filter Logic
  const filteredBlogs = blogs.filter((blog) => {
    // Search query matching
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      blog.title.toLowerCase().includes(query) ||
      blog.description.toLowerCase().includes(query) ||
      blog.category.toLowerCase().includes(query) ||
      blog.topics.some((t) => t.headline.toLowerCase().includes(query));

    // Category matching
    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory;

    // Status matching
    const matchesStatus =
      selectedStatus === "all" || blog.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  function handleResetFilters() {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
  }

  function handleDuplicate(id: string) {
    const duplicated = duplicateBlog(id);
    if (duplicated) {
      toast.success("تم تكرار المقال بنجاح وحفظه كمسودة");
    }
  }

  function handleToggleStatus(blog: BlogRecord) {
    const nextStatus: BlogStatus =
      blog.status === "published" ? "draft" : "published";
    toggleBlogStatus(blog.id, nextStatus);
    toast.success(
      nextStatus === "published"
        ? "تم نشر المقال على الموقع"
        : "تم تحويل المقال إلى مسودة",
    );
  }

  function confirmDelete() {
    if (blogToDelete) {
      deleteBlog(blogToDelete);
      setBlogToDelete(null);
      toast.success("تم حذف المقال بنجاح");
    }
  }

  return (
    <div className="page-shell space-y-6 py-4 sm:py-6 md:py-8">
      {/* Top Page Header */}
      <FadeIn direction="down" duration={0.4}>
        <PageHeader
          title="المدونة والمقالات"
          description="إدارة ونشر المقالات العقارية، المحاور الغنية، صور الغلاف والبانر، والأسئلة الشائعة الخاصة بكل مقال."
          actions={
            <Link
              to="/blogs/new"
              className={buttonVariants({
                variant: "primary",
                className: "w-full sm:w-auto gap-2 shadow-sm font-semibold transition-transform duration-200 active:scale-95",
              })}
            >
              <Plus className="size-4" />
              <span>إضافة مقال جديد</span>
            </Link>
          }
        />
      </FadeIn>

      {/* Filter & Search Bar */}
      <FadeIn direction="up" duration={0.35} delay={0.06}>
        <div className="flex flex-col gap-3.5 rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:flex-1">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1 sm:min-w-[220px] lg:max-w-xs xl:max-w-sm">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالعنوان، المحاور، أو الكلمات..."
                className="h-10 w-full rounded-xl ps-9 pe-8 bg-background text-xs sm:text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label="مسح البحث"
                  >
                    <X className="size-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Selects Row */}
            <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:gap-3">
              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={(val) => {
                  if (val) setSelectedCategory(val);
                }}
              >
                <SelectTrigger className="h-10 w-full sm:w-[150px] md:w-[160px] rounded-xl bg-background text-xs sm:text-sm transition-all">
                  <SelectValue placeholder="التصنيف">
                    {() => (
                      <span>
                        {selectedCategory === "all"
                          ? "جميع التصنيفات"
                          : selectedCategory}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التصنيفات</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.label}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={selectedStatus}
                onValueChange={(val) => {
                  if (val) setSelectedStatus(val);
                }}
              >
                <SelectTrigger className="h-10 w-full sm:w-[130px] md:w-[140px] rounded-xl bg-background text-xs sm:text-sm transition-all">
                  <SelectValue placeholder="الحالة">
                    {() => (
                      <span>
                        {STATUS_LABELS[selectedStatus] || "جميع الحالات"}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="published">منشور فقط</SelectItem>
                  <SelectItem value="draft">مسودات فقط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters (if active) */}
            <AnimatePresence>
              {isFiltered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 10 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="h-10 gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium sm:w-auto self-start sm:self-auto"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>إعادة ضبط</span>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Mode Toggle & Count */}
          <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3 lg:border-t-0 lg:pt-0 lg:ms-auto">
            <motion.span
              key={filteredBlogs.length}
              initial={{ scale: 0.9, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center rounded-lg bg-muted/60 px-2.5 py-1 text-xs font-semibold text-muted-foreground"
            >
              {filteredBlogs.length} مقال
            </motion.span>

            <div className="flex items-center rounded-xl border border-border bg-muted/60 p-1">
              <Button
                type="button"
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                title="عرض بطاقات شبكية"
                className="size-7 rounded-lg cursor-pointer transition-all duration-200"
              >
                <Grid className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant={viewMode === "table" ? "primary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("table")}
                title="عرض جدول تفصيلي"
                className="size-7 rounded-lg cursor-pointer transition-all duration-200"
              >
                <ListIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Main Listing View with AnimatePresence transitions */}
      <AnimatePresence mode="wait">
        {filteredBlogs.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="rounded-3xl border-2 border-dashed border-border bg-card/60 p-8 sm:p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -6 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="mx-auto flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary mb-4"
            >
              <BookOpen className="size-6 sm:size-7" />
            </motion.div>
            <h3 className="text-base font-bold text-foreground sm:text-lg">
              لا توجد مقالات مطابقة لمعايير البحث
            </h3>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              جرب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية
            </p>
            <Button
              type="button"
              onClick={handleResetFilters}
              variant="outline"
              className="mt-4 gap-1.5 transition-transform duration-150 active:scale-95"
            >
              <RotateCcw className="size-3.5" />
              <span>إعادة ضبط التصفية</span>
            </Button>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.22,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  }}
                  className="h-full"
                >
                  <BlogCard
                    blog={blog}
                    onDuplicate={handleDuplicate}
                    onDelete={(id) => setBlogToDelete(id)}
                    onToggleStatus={handleToggleStatus}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <BlogsTable
              blogs={filteredBlogs}
              onDuplicate={handleDuplicate}
              onDelete={(id) => setBlogToDelete(id)}
              onToggleStatus={handleToggleStatus}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Warning Dialog */}
      <WarningDialog
        open={Boolean(blogToDelete)}
        onOpenChange={(open) => !open && setBlogToDelete(null)}
        title="هل أنت متأكد من رغبتك في حذف هذا المقال؟"
        description="سيتم حذف المقال وجميع محاوره والأسئلة الشائعة المرتبطة به ولن يظهر بعد ذلك على موقع المنصة."
        confirmLabel="تأكيد الحذف"
        cancelLabel="إلغاء"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

