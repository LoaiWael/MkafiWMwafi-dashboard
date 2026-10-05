import { useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, Clock, FolderPlus, Plus, Tag, Trash2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import WarningDialog from "@/components/warning-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addCategory, deleteCategory } from "../blogs-store";
import { useBlogCategories } from "../hooks/use-blogs";
import type { BlogCategory, BlogStatus } from "../types";

interface BlogBasicInfoEditorProps {
  title: string;
  onTitleChange: (title: string) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  description: string;
  onDescriptionChange: (description: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  readingTime: string;
  onReadingTimeChange: (readingTime: string) => void;
  status: BlogStatus;
  onStatusChange: (status: BlogStatus) => void;
  featured: boolean;
  onFeaturedChange: (featured: boolean) => void;
  onGenerateSlug: () => void;
  onAutoCalculateReadingTime: () => void;
  errors?: Record<string, string>;
}

export default function BlogBasicInfoEditor({
  title,
  onTitleChange,
  slug,
  onSlugChange,
  description,
  onDescriptionChange,
  category,
  onCategoryChange,
  readingTime,
  onReadingTimeChange,
  status,
  onStatusChange,
  featured,
  onFeaturedChange,
  onGenerateSlug,
  onAutoCalculateReadingTime,
  errors,
}: BlogBasicInfoEditorProps) {
  const categories = useBlogCategories();
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<BlogCategory | null>(null);

  function handleAddNewCategory() {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      toast.error("يرجى كتابة اسم التصنيف أولاً");
      return;
    }

    const isDuplicate = categories.some(
      (cat) => cat.label.toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      toast.error("هذا التصنيف موجود مسبقاً في القائمة");
      return;
    }

    const created = addCategory(trimmed);
    onCategoryChange(created.label);
    setNewCategoryName("");
    toast.success(`تمت إضافة تصنيف "${created.label}" وتحديده بنجاح`);
  }

  function handleCategoryKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddNewCategory();
    }
  }

  function handleConfirmDeleteCategory() {
    if (!categoryToDelete) return;

    const deletedLabel = categoryToDelete.label;
    deleteCategory(categoryToDelete.id);

    // If the deleted category is currently chosen for this blog, switch to remaining or reset
    if (category === deletedLabel) {
      const remaining = categories.filter((c) => c.id !== categoryToDelete.id);
      const nextCategory = remaining.length > 0 ? remaining[0].label : "";
      onCategoryChange(nextCategory);
      toast.info(`تم تحويل التصنيف المحدد إلى: ${nextCategory || "بدون تصنيف"}`);
    }

    toast.success(`تم حذف تصنيف "${deletedLabel}" بنجاح`);
    setCategoryToDelete(null);
  }

  return (
    <TooltipProvider delay={150}>
      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-lg font-bold text-foreground">
            البيانات العامة والمعلومات الأساسية للمقال
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="blog-title" className="text-sm font-bold">
              عنوان المقال الرئيسي *
            </Label>
            <Input
              id="blog-title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="مثال: الفرق بين عقد الإيجار السكني والتجاري: البنود والالتزامات النظامية"
              aria-invalid={Boolean(errors?.title)}
              className={`h-11 text-base font-medium rounded-xl ${
                errors?.title ? "border-destructive focus-visible:ring-destructive/30" : ""
              }`}
            />
            {errors?.title && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.title}
              </p>
            )}
          </div>

          {/* Slug & Auto Generator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="blog-slug" className="text-sm font-bold">
                الرابط الدائم (Slug) *
              </Label>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={onGenerateSlug}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-primary-50 hover:underline cursor-pointer transition-colors"
                      aria-label="توليد تلقائي من العنوان"
                    />
                  }
                >
                  <Wand2 className="size-3.5" />
                  <span>توليد تلقائي من العنوان</span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  تحويل عنوان المقال إلى رابط إلكتروني دائم متوافق مع معايير الويب
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-11 items-center justify-center rounded-xl border border-border bg-muted/60 px-3.5 text-xs font-mono text-muted-foreground shrink-0 select-none dir-ltr">
                /blogs/
              </span>
              <Input
                id="blog-slug"
                value={slug}
                onChange={(e) => onSlugChange(e.target.value)}
                placeholder="commercial-vs-residential-contracts"
                aria-invalid={Boolean(errors?.slug)}
                className={`h-11 font-mono text-sm rounded-xl ${
                  errors?.slug ? "border-destructive focus-visible:ring-destructive/30" : ""
                }`}
              />
            </div>
            {errors?.slug && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.slug}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="blog-desc" className="text-sm font-bold">
              الوصف والملخص التمهيدي للمقال *
            </Label>
            <Textarea
              id="blog-desc"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="اكتب نبذة ومقدمة مختصرة تظهر أعلى المقال وفي بطاقة المقال على الصفحة الرئيسية والمدونة..."
              rows={3}
              aria-invalid={Boolean(errors?.description)}
              className={`rounded-xl leading-relaxed text-sm ${
                errors?.description ? "border-destructive focus-visible:ring-destructive/30" : ""
              }`}
            />
            {errors?.description && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.description}
              </p>
            )}
          </div>

          {/* Category & Reading Time Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Dynamic Category Controller */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold">التصنيف *</Label>
                <span className="text-xs text-muted-foreground">
                  {categories.length} تصنيفات
                </span>
              </div>

              <Popover
                open={isCategoryPopoverOpen}
                onOpenChange={setIsCategoryPopoverOpen}
              >
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      aria-invalid={Boolean(errors?.category)}
                      className={`flex h-11 w-full items-center justify-between gap-2 rounded-xl border bg-background px-3.5 text-sm transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-hidden cursor-pointer ${
                        errors?.category
                          ? "border-destructive focus-visible:ring-destructive/30"
                          : "border-input"
                      }`}
                      aria-label="اختيار تصنيف المقال"
                    />
                  }
                >
                  <div className="flex items-center gap-2 truncate">
                    <Tag className="size-4 shrink-0 text-primary" />
                    <span
                      className={
                        category ? "font-medium text-foreground" : "text-muted-foreground"
                      }
                    >
                      {category || "اختر التصنيف..."}
                    </span>
                  </div>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  className="w-80 rounded-2xl p-3 border border-border shadow-lg"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border/70 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Tag className="size-4 text-primary" />
                        <span className="text-xs font-bold text-foreground">
                          تصنيفات المقالات
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[11px] px-1.5 py-0.5">
                        {categories.length} متاحة
                      </Badge>
                    </div>

                    {/* Category List */}
                    <div className="max-h-52 overflow-y-auto space-y-1 pe-1">
                      {categories.length === 0 ? (
                        <div className="py-4 text-center text-xs text-muted-foreground">
                          لا توجد تصنيفات حالياً. يمكنك إضافة تصنيف جديد أدناه.
                        </div>
                      ) : (
                        categories.map((cat) => {
                          const isSelected = category === cat.label;
                          return (
                            <div
                              key={cat.id}
                              onClick={() => {
                                onCategoryChange(cat.label);
                                setIsCategoryPopoverOpen(false);
                              }}
                              className={`group flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-sm transition-colors cursor-pointer select-none ${
                                isSelected
                                  ? "bg-primary-50 text-primary-950 font-semibold"
                                  : "text-foreground hover:bg-muted/70"
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate flex-1">
                                <span
                                  className={`flex size-4 shrink-0 items-center justify-center rounded-full ${
                                    isSelected
                                      ? "text-primary"
                                      : "opacity-0 group-hover:opacity-30"
                                  }`}
                                >
                                  <Check className="size-3.5" />
                                </span>
                                <span className="truncate">{cat.label}</span>
                              </div>

                              {/* Delete Category Button */}
                              <Tooltip>
                                <TooltipTrigger
                                  render={
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCategoryToDelete(cat);
                                      }}
                                      className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground opacity-60 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer"
                                      aria-label={`حذف تصنيف ${cat.label}`}
                                    />
                                  }
                                >
                                  <Trash2 className="size-3.5" />
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  حذف هذا التصنيف
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Add New Category Section */}
                    <div className="border-t border-border/70 pt-2.5 space-y-2">
                      <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <FolderPlus className="size-3.5 text-primary" />
                        <span>إضافة تصنيف جديد</span>
                      </Label>
                      <div className="flex items-center gap-1.5">
                        <Input
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={handleCategoryKeyDown}
                          placeholder="اسم التصنيف الجديد..."
                          className="h-9 text-xs rounded-xl"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddNewCategory}
                          className="h-9 shrink-0 gap-1 rounded-xl px-3 cursor-pointer"
                        >
                          <Plus className="size-3.5" />
                          <span className="text-xs">إضافة</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {errors?.category && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Reading Time */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="reading-time" className="text-sm font-bold">
                  وقت القراءة التقديري
                </Label>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        onClick={onAutoCalculateReadingTime}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                        aria-label="احتساب تلقائي"
                      />
                    }
                  >
                    <Clock className="size-3.5" />
                    <span>احتساب تلقائي</span>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    حساب وقت القراءة التقديري تلقائياً استناداً لمحتوى محاور المقال
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative flex items-center">
                <Input
                  id="reading-time"
                  value={readingTime}
                  onChange={(e) => onReadingTimeChange(e.target.value)}
                  placeholder="مثال: 6 دقائق قراءة"
                  aria-invalid={Boolean(errors?.readingTime)}
                  className={`h-11 rounded-xl pe-10 ${
                    errors?.readingTime ? "border-destructive focus-visible:ring-destructive/30" : ""
                  }`}
                />
                <Clock className="absolute end-3.5 top-3.5 size-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors?.readingTime && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.readingTime}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-bold">حالة النشر</Label>
              <Select
                value={status}
                onValueChange={(val) => {
                  if (val) onStatusChange(val as BlogStatus);
                }}
              >
                <SelectTrigger className="h-11 w-full rounded-xl bg-background px-3.5 text-sm">
                  <SelectValue placeholder="حالة المقال">
                    {status === "published"
                      ? "منشور (متاح بالموقع)"
                      : "مسودة (غير معلنة)"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">مسودة (غير معلنة)</SelectItem>
                  <SelectItem value="published">
                    منشور (متاح بالموقع)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-muted/40 p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold cursor-pointer">
                تثبيت كمقال مميز في الواجهة (Featured Post)
              </Label>
              <p className="text-xs text-muted-foreground">
                يظهر المقال المميز في أعلى صفحة المدونة وبشكل بارز للزوار.
              </p>
            </div>
            <Switch
              checked={featured}
              onCheckedChange={onFeaturedChange}
              aria-label="تثبيت كمقال مميز"
            />
          </div>
        </CardContent>
      </Card>

      {/* Delete Category Confirmation Dialog */}
      <WarningDialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        title={
          categoryToDelete
            ? `هل أنت متأكد من حذف تصنيف "${categoryToDelete.label}"؟`
            : "حذف التصنيف"
        }
        description="سيتم إزالة هذا التصنيف نهائياً من قائمة التصنيفات المتاحة في المدونة."
        confirmLabel="تأكيد حذف التصنيف"
        cancelLabel="إلغاء"
        onConfirm={handleConfirmDeleteCategory}
      />
    </TooltipProvider>
  );
}
