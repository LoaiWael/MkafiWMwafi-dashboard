import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FileImage, ImageUp, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BlogBannerEditorProps {
  bannerImage: string;
  onBannerImageChange: (image: string) => void;
  bannerAlt: string;
  onBannerAltChange: (alt: string) => void;
  fallbackTitle?: string;
  errors?: Record<string, string>;
}

const MAX_BANNER_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BlogBannerEditor({
  bannerImage,
  onBannerImageChange,
  bannerAlt,
  onBannerAltChange,
  fallbackTitle = "",
  errors,
}: BlogBannerEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadedFileSize, setUploadedFileSize] = useState<string>("");

  function handleFileSelect(file: File) {
    if (
      !ALLOWED_IMAGE_TYPES.includes(file.type) &&
      !file.type.startsWith("image/")
    ) {
      toast.error(
        "صيغة الملف غير مدعومة. يرجى اختيار صورة بصيغة (PNG, JPG, WEBP, SVG, GIF)",
      );
      return;
    }
    if (file.size > MAX_BANNER_SIZE_BYTES) {
      toast.error(
        "حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 10 ميجابايت",
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onBannerImageChange(reader.result);
        setUploadedFileName(file.name);
        setUploadedFileSize(formatBytes(file.size));
        if (!bannerAlt && fallbackTitle) {
          onBannerAltChange(fallbackTitle);
        }
        toast.success(`تم رفع صورة الغلاف بنجاح: ${file.name}`);
      }
    };
    reader.onerror = () => {
      toast.error("حدث خطأ أثناء قراءة ملف الصورة من الجهاز");
    };
    reader.readAsDataURL(file);
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = "";
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }

  function handleClearBanner() {
    onBannerImageChange("");
    setUploadedFileName("");
    setUploadedFileSize("");
    toast.info("تمت إزالة صورة الغلاف");
  }

  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="border-b border-border/60 pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-bold text-foreground">
            صورة الغلاف والبانر الرئيسي
          </CardTitle>
          {bannerImage ? (
            <Badge
              variant="default"
              className="w-fit gap-1 text-xs font-semibold"
            >
              <Upload className="size-3" />
              <span>مرفوعة من الجهاز</span>
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={handleFileInputChange}
        />

        {/* Upload Area (Shown when no image is uploaded) */}
        {!bannerImage ? (
          <div className="space-y-3">
            <Label className="text-sm font-bold text-foreground flex items-center justify-between">
              <span>رفع الصورة من جهازك:</span>
              <span className="text-xs font-normal text-muted-foreground">
                PNG, JPG, WebP, SVG (حتى 10MB)
              </span>
            </Label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary-50/70 dark:bg-primary-950/40 ring-4 ring-primary/20 scale-[1.01]"
                  : "border-border hover:border-primary/60 hover:bg-muted/50 bg-muted/20"
              }`}
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Upload className="size-7" />
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-sm font-bold text-foreground">
                  انقر لاختيار صورة من جهازك، أو اسحب الصورة وأفلتها هنا
                </p>
                <p className="text-xs text-muted-foreground">
                  النسبة الموصى بها 16:9 (مثلاً 1200×675 بكسل) لعرض مثالي بالصفحة والواجهة
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl border-border bg-card pointer-events-none"
                >
                  <ImageUp className="size-4 text-primary" />
                  <span>تصفح ملفات الجهاز</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Banner Preview & Actions */
          <div className="space-y-3 rounded-2xl border border-border/80 bg-muted/30 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileImage className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground line-clamp-1">
                    {uploadedFileName || "صورة الغلاف الحالية"}
                  </p>
                  {uploadedFileSize && (
                    <p className="text-[11px] text-muted-foreground">
                      الحجم: {uploadedFileSize}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-1.5 text-xs h-8 rounded-xl cursor-pointer"
                >
                  <ImageUp className="size-3.5 text-primary" />
                  <span>استبدال</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearBanner}
                  className="gap-1.5 text-xs h-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  <span>إزالة</span>
                </Button>
              </div>
            </div>

            <div className="relative aspect-16/9 max-h-[340px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-xs flex items-center justify-center">
              <img
                src={bannerImage}
                alt={bannerAlt || fallbackTitle || "معاينة صورة الغلاف"}
                className="size-full object-cover object-center"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/logo.svg";
                }}
              />
            </div>
          </div>
        )}

        {errors?.bannerImage && (
          <p className="text-[11px] font-medium text-destructive">
            {errors.bannerImage}
          </p>
        )}

        {/* Alt Text */}
        <div className="space-y-2 border-t border-border/60 pt-5">
          <Label htmlFor="banner-alt" className="text-sm font-bold">
            النص البديل لصورة الغلاف (Alt Text)
          </Label>
          <Input
            id="banner-alt"
            value={bannerAlt}
            onChange={(e) => onBannerAltChange(e.target.value)}
            placeholder="وصف دقيق لمحتوى الصورة لتعزيز إمكانية الوصول ونتائج محركات البحث"
            aria-invalid={Boolean(errors?.bannerAlt)}
            className={`h-11 rounded-xl ${
              errors?.bannerAlt ? "border-destructive focus-visible:ring-destructive/30" : ""
            }`}
          />
          {errors?.bannerAlt ? (
            <p className="text-[11px] font-medium text-destructive">
              {errors.bannerAlt}
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              يُستخدم النص البديل لوصف محتوى الصورة لمحركات البحث وقارئات الشاشة.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
