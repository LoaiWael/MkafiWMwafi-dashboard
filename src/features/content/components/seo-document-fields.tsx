import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import SeoLengthMeter from "@/features/content/components/seo-length-meter";
import { SEO_LIMITS } from "@/features/content/constants";
import { formatDocumentTitle, formatRobots, type SeoFieldErrors } from "@/features/content/seo";
import type { PageSeo } from "@/features/content/types";

interface SeoDocumentFieldsProps {
  draft: PageSeo;
  errors: SeoFieldErrors;
  onChange: <K extends keyof PageSeo>(key: K, value: PageSeo[K]) => void;
}

export default function SeoDocumentFields({
  draft,
  errors,
  onChange,
}: SeoDocumentFieldsProps) {
  return (
    <>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">العنوان والوصف</h3>
        <div className="space-y-1.5">
          <Label htmlFor="seo-title">عنوان الصفحة</Label>
          <Input
            id="seo-title"
            dir="auto"
            value={draft.title}
            aria-invalid={Boolean(errors.title)}
            onChange={(event) => onChange("title", event.target.value)}
          />
          {errors.title ? (
            <p className="text-xs text-destructive">{errors.title}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              يظهر في المتصفح: {formatDocumentTitle(draft.title)}
            </p>
          )}
          <SeoLengthMeter value={draft.title} limit={SEO_LIMITS.title} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="seo-description">وصف الصفحة</Label>
          <Textarea
            id="seo-description"
            dir="auto"
            value={draft.description}
            aria-invalid={Boolean(errors.description)}
            onChange={(event) => onChange("description", event.target.value)}
          />
          {errors.description ? (
            <p className="text-xs text-destructive">{errors.description}</p>
          ) : null}
          <SeoLengthMeter value={draft.description} limit={SEO_LIMITS.description} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="seo-keywords">الكلمات المفتاحية</Label>
          <Input
            id="seo-keywords"
            dir="auto"
            value={draft.keywords}
            placeholder="عقد إيجار، توثيق عقد"
            onChange={(event) => onChange("keywords", event.target.value)}
          />
          <p className="text-xs text-muted-foreground">افصل الكلمات بفاصلة.</p>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">الرابط والفهرسة</h3>
        <div className="space-y-1.5">
          <Label htmlFor="seo-canonical">الرابط الأساسي</Label>
          <Input
            id="seo-canonical"
            dir="ltr"
            value={draft.canonicalPath}
            aria-invalid={Boolean(errors.canonicalPath)}
            onChange={(event) => onChange("canonicalPath", event.target.value)}
          />
          {errors.canonicalPath ? (
            <p className="text-xs text-destructive">{errors.canonicalPath}</p>
          ) : null}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
            <Label htmlFor="seo-indexable">السماح بالفهرسة</Label>
            <Switch
              id="seo-indexable"
              checked={draft.indexable}
              onCheckedChange={(checked) => onChange("indexable", checked)}
            />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
            <Label htmlFor="seo-follow">متابعة الروابط</Label>
            <Switch
              id="seo-follow"
              checked={draft.followLinks}
              onCheckedChange={(checked) => onChange("followLinks", checked)}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          وسم الروبوتات:{" "}
          <bdi dir="ltr">{formatRobots(draft.indexable, draft.followLinks)}</bdi>
        </p>
      </section>
    </>
  );
}
