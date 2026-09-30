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
import SeoLengthMeter from "@/features/content/components/seo-length-meter";
import { SEO_LIMITS, TWITTER_CARD } from "@/features/content/constants";
import SettingsImageField from "@/features/settings/components/settings-image-field";
import type { SettingsFieldErrors, SiteSeo, TwitterCard } from "@/features/settings/types";

interface SiteShareFieldsProps {
  seo: SiteSeo;
  errors: SettingsFieldErrors;
  onChange: (patch: Partial<SiteSeo>) => void;
}

const SHARE_ACCEPT = "image/png,image/jpeg,image/webp";

export default function SiteShareFields({ seo, errors, onChange }: SiteShareFieldsProps) {
  function onTwitterCard(next: string | null) {
    if (next !== TWITTER_CARD.summary && next !== TWITTER_CARD.summaryLargeImage) return;
    onChange({ twitterCard: next satisfies TwitterCard });
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="settings-og-title" className="text-xs sm:text-sm">عنوان المشاركة</Label>
        <Input
          id="settings-og-title"
          dir="auto"
          value={seo.ogTitle}
          onChange={(event) => onChange({ ogTitle: event.target.value })}
        />
        <SeoLengthMeter value={seo.ogTitle} limit={SEO_LIMITS.ogTitle} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="settings-og-description" className="text-xs sm:text-sm">وصف المشاركة</Label>
        <Textarea
          id="settings-og-description"
          dir="auto"
          value={seo.ogDescription}
          onChange={(event) => onChange({ ogDescription: event.target.value })}
        />
        <SeoLengthMeter value={seo.ogDescription} limit={SEO_LIMITS.ogDescription} />
      </div>
      <SettingsImageField
        id="settings-og-image"
        label="صورة المشاركة"
        value={seo.ogImage}
        accept={SHARE_ACCEPT}
        hint="المقاس الموصى به 1200×630."
        onChange={(ogImage) => onChange({ ogImage })}
      />
      <div className="space-y-1.5">
        <Label htmlFor="settings-og-alt" className="text-xs sm:text-sm">النص البديل لصورة المشاركة</Label>
        <Input
          id="settings-og-alt"
          dir="auto"
          value={seo.ogImageAlt}
          aria-invalid={Boolean(errors.ogImageAlt)}
          onChange={(event) => onChange({ ogImageAlt: event.target.value })}
        />
        {errors.ogImageAlt ? (
          <p className="text-xs text-destructive">{errors.ogImageAlt}</p>
        ) : (
          <p className="text-xs text-muted-foreground">يصف الصورة عند تعذر عرضها.</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="settings-twitter-card" className="text-xs sm:text-sm">نوع بطاقة إكس</Label>
        <Select value={seo.twitterCard} onValueChange={onTwitterCard}>
          <SelectTrigger id="settings-twitter-card" className="w-full">
            <SelectValue>
              {seo.twitterCard === TWITTER_CARD.summary ? "ملخص" : "ملخص مع صورة كبيرة"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value={TWITTER_CARD.summaryLargeImage}>ملخص مع صورة كبيرة</SelectItem>
            <SelectItem value={TWITTER_CARD.summary}>ملخص</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-2.5 sm:p-3">
        <Label htmlFor="settings-mirror" className="cursor-pointer text-xs sm:text-sm">استخدام بيانات المشاركة</Label>
        <Switch
          id="settings-mirror"
          checked={seo.mirrorOpenGraph}
          onCheckedChange={(checked) => onChange({ mirrorOpenGraph: checked })}
        />
      </div>

      {seo.mirrorOpenGraph ? null : (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="settings-twitter-title" className="text-xs sm:text-sm">عنوان البطاقة</Label>
            <Input
              id="settings-twitter-title"
              dir="auto"
              value={seo.twitterTitle}
              aria-invalid={Boolean(errors.twitterTitle)}
              onChange={(event) => onChange({ twitterTitle: event.target.value })}
            />
            {errors.twitterTitle ? (
              <p className="text-xs text-destructive">{errors.twitterTitle}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="settings-twitter-description" className="text-xs sm:text-sm">وصف البطاقة</Label>
            <Textarea
              id="settings-twitter-description"
              dir="auto"
              value={seo.twitterDescription}
              aria-invalid={Boolean(errors.twitterDescription)}
              onChange={(event) => onChange({ twitterDescription: event.target.value })}
            />
            {errors.twitterDescription ? (
              <p className="text-xs text-destructive">{errors.twitterDescription}</p>
            ) : null}
          </div>
          <SettingsImageField
            id="settings-twitter-image"
            label="صورة البطاقة"
            value={seo.twitterImage}
            accept={SHARE_ACCEPT}
            hint="تُستخدم عندما تختلف صورة البطاقة عن صورة المشاركة."
            onChange={(twitterImage) => onChange({ twitterImage })}
          />
        </>
      )}
    </div>
  );
}
