import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import SeoImageField from "@/features/content/components/seo-image-field";
import SeoLengthMeter from "@/features/content/components/seo-length-meter";
import { SEO_LIMITS, TWITTER_CARD } from "@/features/content/constants";
import type { SeoFieldErrors } from "@/features/content/seo";
import type { PageSeo, TwitterCard } from "@/features/content/types";

interface SeoShareFieldsProps {
  draft: PageSeo;
  errors: SeoFieldErrors;
  onChange: <K extends keyof PageSeo>(key: K, value: PageSeo[K]) => void;
  onImage: (key: "ogImage" | "twitterImage", src: string) => void;
}

export default function SeoShareFields({
  draft,
  errors,
  onChange,
  onImage,
}: SeoShareFieldsProps) {
  function onTwitterCard(next: string | null) {
    if (next !== TWITTER_CARD.summary && next !== TWITTER_CARD.summaryLargeImage) {
      return;
    }
    onChange("twitterCard", next satisfies TwitterCard);
  }

  return (
    <>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">مشاركة الشبكات</h3>
        <p className="text-xs text-muted-foreground">
          اللغة ar_SA، ونوع المشاركة موقع. عند ترك العنوان أو الوصف فارغاً تُستخدم بيانات الصفحة.
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="seo-og-title">عنوان المشاركة</Label>
          <Input
            id="seo-og-title"
            dir="auto"
            value={draft.ogTitle}
            onChange={(event) => onChange("ogTitle", event.target.value)}
          />
          <SeoLengthMeter value={draft.ogTitle} limit={SEO_LIMITS.ogTitle} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="seo-og-description">وصف المشاركة</Label>
          <Textarea
            id="seo-og-description"
            dir="auto"
            value={draft.ogDescription}
            onChange={(event) => onChange("ogDescription", event.target.value)}
          />
          <SeoLengthMeter value={draft.ogDescription} limit={SEO_LIMITS.ogDescription} />
        </div>
        <SeoImageField
          altId="seo-og-alt"
          label="صورة المشاركة"
          value={draft.ogImage}
          alt={draft.ogImageAlt}
          altError={errors.ogImageAlt}
          onChange={(src) => onImage("ogImage", src)}
          onAltChange={(alt) => onChange("ogImageAlt", alt)}
        />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">بطاقة تويتر</h3>
        <div className="space-y-1.5">
          <Label htmlFor="seo-twitter-card">نوع البطاقة</Label>
          <Select value={draft.twitterCard} onValueChange={onTwitterCard}>
            <SelectTrigger id="seo-twitter-card" className="w-full">
              <SelectValue>
                {draft.twitterCard === TWITTER_CARD.summary
                  ? "ملخص"
                  : "ملخص مع صورة كبيرة"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value={TWITTER_CARD.summaryLargeImage}>
                ملخص مع صورة كبيرة
              </SelectItem>
              <SelectItem value={TWITTER_CARD.summary}>ملخص</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
          <Label htmlFor="seo-mirror">استخدام بيانات المشاركة</Label>
          <Switch
            id="seo-mirror"
            checked={draft.mirrorOpenGraph}
            onCheckedChange={(checked) => onChange("mirrorOpenGraph", checked)}
          />
        </div>
        {draft.mirrorOpenGraph ? null : (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="seo-twitter-title">عنوان البطاقة</Label>
              <Input
                id="seo-twitter-title"
                dir="auto"
                value={draft.twitterTitle}
                aria-invalid={Boolean(errors.twitterTitle)}
                onChange={(event) => onChange("twitterTitle", event.target.value)}
              />
              {errors.twitterTitle ? (
                <p className="text-xs text-destructive">{errors.twitterTitle}</p>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="seo-twitter-description">وصف البطاقة</Label>
              <Textarea
                id="seo-twitter-description"
                dir="auto"
                value={draft.twitterDescription}
                aria-invalid={Boolean(errors.twitterDescription)}
                onChange={(event) => onChange("twitterDescription", event.target.value)}
              />
              {errors.twitterDescription ? (
                <p className="text-xs text-destructive">
                  {errors.twitterDescription}
                </p>
              ) : null}
            </div>
            <SeoImageField
              label="صورة البطاقة"
              value={draft.twitterImage}
              onChange={(src) => onImage("twitterImage", src)}
            />
          </>
        )}
      </section>
    </>
  );
}
