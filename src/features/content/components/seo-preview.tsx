import { ImageIcon } from "lucide-react";
import { SEO_PUBLIC_ORIGIN } from "@/features/content/constants";
import {
  formatCanonicalUrl,
  formatDocumentTitle,
  shareDescription,
  shareTitle,
} from "@/features/content/seo";
import type { PageSeo } from "@/features/content/types";

interface SeoPreviewProps {
  seo: PageSeo;
}

export default function SeoPreview({ seo }: SeoPreviewProps) {
  const originLabel = SEO_PUBLIC_ORIGIN.replace(/^https?:\/\//, "");

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <article className="space-y-2 rounded-xl border border-border bg-card p-3">
        <p className="text-xs font-medium text-muted-foreground">نتيجة البحث</p>
        <p className="truncate text-xs text-muted-foreground" dir="ltr">
          {formatCanonicalUrl(seo.canonicalPath).replace(/^https?:\/\//, "")}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold text-primary">
          {formatDocumentTitle(seo.title)}
        </h3>
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {seo.description.trim() || "وصف الصفحة يظهر هنا."}
        </p>
      </article>

      <article className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">مشاركة الشبكات</p>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex aspect-video items-center justify-center bg-muted">
            {seo.ogImage ? (
              <img src={seo.ogImage} alt="" className="size-full object-cover" />
            ) : (
              <ImageIcon className="size-6 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-1 p-3">
            <p className="text-xs text-muted-foreground">{originLabel}</p>
            <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
              {shareTitle(seo) || "عنوان المشاركة"}
            </h3>
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {shareDescription(seo) || "وصف المشاركة يظهر هنا."}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
