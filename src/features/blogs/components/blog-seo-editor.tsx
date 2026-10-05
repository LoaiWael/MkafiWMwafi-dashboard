import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BlogSeoEditorProps {
  metaTitle: string;
  onMetaTitleChange: (title: string) => void;
  metaDescription: string;
  onMetaDescriptionChange: (description: string) => void;
  keywords: string;
  onKeywordsChange: (keywords: string) => void;
  title: string;
  slug: string;
  description: string;
  errors?: Record<string, string>;
}

export default function BlogSeoEditor({
  metaTitle,
  onMetaTitleChange,
  metaDescription,
  onMetaDescriptionChange,
  keywords,
  onKeywordsChange,
  title,
  slug,
  description,
  errors,
}: BlogSeoEditorProps) {
  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="border-b border-border/60 pb-4">
        <CardTitle className="text-lg font-bold text-foreground">
          تحسين محركات البحث والظهور في نتائج البحث (SEO)
        </CardTitle>
        <p className="text-xs text-muted-foreground sm:text-sm">
          تخصيص العناوين والكلمات الدلالية ومحاكاة كيفية ظهور المقال في
          جوجل ومنصات التواصل الاجتماعي.
        </p>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="space-y-2">
          <Label htmlFor="meta-title" className="text-sm font-bold">
            عنوان محركات البحث (Meta Title)
          </Label>
          <Input
            id="meta-title"
            value={metaTitle}
            onChange={(e) => onMetaTitleChange(e.target.value)}
            placeholder={
              title ? `${title} | مكفي وموفي` : "عنوان المقال في جوجل"
            }
            aria-invalid={Boolean(errors?.metaTitle)}
            className={`h-11 rounded-xl ${
              errors?.metaTitle ? "border-destructive focus-visible:ring-destructive/30" : ""
            }`}
          />
          {errors?.metaTitle && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.metaTitle}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta-desc" className="text-sm font-bold">
            وصف محركات البحث (Meta Description)
          </Label>
          <Textarea
            id="meta-desc"
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            placeholder={
              description || "وصف مختصر للمقال يظهر في نتائج البحث"
            }
            rows={3}
            aria-invalid={Boolean(errors?.metaDescription)}
            className={`rounded-xl leading-relaxed text-sm ${
              errors?.metaDescription ? "border-destructive focus-visible:ring-destructive/30" : ""
            }`}
          />
          {errors?.metaDescription && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.metaDescription}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-sm font-bold">
            الكلمات الدلالية والمفتاحية (Keywords)
          </Label>
          <Input
            id="keywords"
            value={keywords}
            onChange={(e) => onKeywordsChange(e.target.value)}
            placeholder="عقد إيجار تجاري, عقد إيجار سكني, إيجار, منصة مكفي وموفي"
            aria-invalid={Boolean(errors?.keywords)}
            className={`h-11 rounded-xl ${
              errors?.keywords ? "border-destructive focus-visible:ring-destructive/30" : ""
            }`}
          />
          {errors?.keywords && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.keywords}
            </p>
          )}
        </div>

        {/* Google Search Snippet Simulation */}
        <div className="space-y-2 border-t border-border/60 pt-5">
          <Label className="text-sm font-bold">
            معاينة نتيجة البحث في جوجل (Google Snippet):
          </Label>
          <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex size-5 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary">
                م
              </div>
              <span className="text-xs text-muted-foreground dir-ltr">
                https://makfiwamufi.sa › blogs › {slug || "contract"}
              </span>
            </div>
            <h4 className="text-base font-bold text-primary hover:underline cursor-pointer">
              {metaTitle || (title ? `${title} | مكفي وموفي` : "عنوان المقال")}
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm line-clamp-2">
              {metaDescription || description || "وصف المقال الذي سيظهر في صفحة نتائج بحث جوجل..."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
