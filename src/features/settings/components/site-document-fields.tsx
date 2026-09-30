import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import SeoLengthMeter from "@/features/content/components/seo-length-meter";
import { SEO_LIMITS } from "@/features/content/constants";
import { formatRobots } from "@/features/content/seo";
import SettingsTextField from "@/features/settings/components/settings-text-field";
import { formatSiteTitle } from "@/features/settings/seo";
import type { SettingsFieldErrors, SiteSeo } from "@/features/settings/types";

interface SiteDocumentFieldsProps {
  siteName: string;
  seo: SiteSeo;
  errors: SettingsFieldErrors;
  onChange: (patch: Partial<SiteSeo>) => void;
}

export default function SiteDocumentFields({
  siteName,
  seo,
  errors,
  onChange,
}: SiteDocumentFieldsProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1.5">
        <SettingsTextField
          id="settings-seo-title"
          label="العنوان الافتراضي"
          value={seo.title}
          error={errors.seoTitle}
          hint={`يظهر في المتصفح: ${formatSiteTitle(seo.title, siteName)}`}
          onChange={(title) => onChange({ title })}
        />
        <SeoLengthMeter value={seo.title} limit={SEO_LIMITS.title} />
      </div>

      <SettingsTextField
        id="settings-seo-template"
        label="قالب العنوان"
        value={seo.titleTemplate}
        error={errors.titleTemplate}
        dir="ltr"
        hint="استخدم %s مكان عنوان الصفحة الداخلية."
        onChange={(titleTemplate) => onChange({ titleTemplate })}
      />

      <div className="space-y-1.5">
        <Label htmlFor="settings-seo-description" className="text-xs sm:text-sm">وصف الموقع</Label>
        <Textarea
          id="settings-seo-description"
          dir="auto"
          value={seo.description}
          aria-invalid={Boolean(errors.seoDescription)}
          onChange={(event) => onChange({ description: event.target.value })}
        />
        {errors.seoDescription ? (
          <p className="text-xs text-destructive">{errors.seoDescription}</p>
        ) : null}
        <SeoLengthMeter value={seo.description} limit={SEO_LIMITS.description} />
      </div>

      <SettingsTextField
        id="settings-seo-keywords"
        label="الكلمات المفتاحية"
        value={seo.keywords}
        hint="افصل الكلمات بفاصلة."
        placeholder="عقد إيجار، توثيق عقد"
        onChange={(keywords) => onChange({ keywords })}
      />

      <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
        <SettingsTextField
          id="settings-site-url"
          label="رابط الموقع"
          value={seo.siteUrl}
          error={errors.siteUrl}
          dir="ltr"
          placeholder="https://mkafi.sa"
          onChange={(siteUrl) => onChange({ siteUrl })}
        />
        <div className="space-y-1.5">
          <Label htmlFor="settings-canonical" className="text-xs sm:text-sm">الرابط الأساسي</Label>
          <Input
            id="settings-canonical"
            dir="ltr"
            value={seo.canonicalPath}
            aria-invalid={Boolean(errors.canonicalPath)}
            onChange={(event) => onChange({ canonicalPath: event.target.value })}
          />
          {errors.canonicalPath ? (
            <p className="text-xs text-destructive">{errors.canonicalPath}</p>
          ) : (
            <p className="text-xs text-muted-foreground">مسار الصفحة الرئيسية داخل الموقع.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-2.5 sm:p-3">
          <Label htmlFor="settings-indexable" className="cursor-pointer text-xs sm:text-sm">السماح بالفهرسة</Label>
          <Switch
            id="settings-indexable"
            checked={seo.indexable}
            onCheckedChange={(checked) => onChange({ indexable: checked })}
          />
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-2.5 sm:p-3">
          <Label htmlFor="settings-follow" className="cursor-pointer text-xs sm:text-sm">متابعة الروابط</Label>
          <Switch
            id="settings-follow"
            checked={seo.followLinks}
            onCheckedChange={(checked) => onChange({ followLinks: checked })}
          />
        </div>
      </div>
      <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
        وسم الروبوتات: <bdi dir="ltr">{formatRobots(seo.indexable, seo.followLinks)}</bdi>
        . اللغة ar_SA، ونوع المشاركة موقع، واسم الموقع يُؤخذ من الهوية.
      </p>
    </div>
  );
}
