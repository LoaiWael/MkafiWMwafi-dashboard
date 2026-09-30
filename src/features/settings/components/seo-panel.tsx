import SiteDocumentFields from "@/features/settings/components/site-document-fields";
import SiteSeoPreview from "@/features/settings/components/site-seo-preview";
import SiteShareFields from "@/features/settings/components/site-share-fields";
import type { SettingsFieldErrors, SiteSeo } from "@/features/settings/types";

interface SeoPanelProps {
  siteName: string;
  seo: SiteSeo;
  errors: SettingsFieldErrors;
  onChange: (patch: Partial<SiteSeo>) => void;
}

export default function SeoPanel({ siteName, seo, errors, onChange }: SeoPanelProps) {
  return (
    <div className="space-y-5 sm:space-y-8">
      <SiteSeoPreview siteName={siteName} seo={seo} />
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-sm sm:text-base font-semibold text-foreground">بيانات الصفحة الرئيسية</h2>
        <SiteDocumentFields siteName={siteName} seo={seo} errors={errors} onChange={onChange} />
      </section>
      <section className="space-y-3 sm:space-y-4">
        <h2 className="text-sm sm:text-base font-semibold text-foreground">المشاركة</h2>
        <SiteShareFields seo={seo} errors={errors} onChange={onChange} />
      </section>
    </div>
  );
}
