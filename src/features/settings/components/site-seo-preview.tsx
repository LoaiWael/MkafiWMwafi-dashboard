import { ImageIcon } from "lucide-react";
import {
  formatSiteCanonical,
  formatSiteTitle,
  shareDescription,
  shareTitle,
} from "@/features/settings/seo";
import type { SiteSeo } from "@/features/settings/types";

interface SiteSeoPreviewProps {
  siteName: string;
  seo: SiteSeo;
}

export default function SiteSeoPreview({ siteName, seo }: SiteSeoPreviewProps) {
  const canonical = formatSiteCanonical(seo.siteUrl, seo.canonicalPath);
  const originLabel = canonical.replace(/^https?:\/\//, "");
  const title = shareTitle(seo, seo.title);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <article className="space-y-1.5 sm:space-y-2 rounded-xl border border-border bg-muted/40 p-2.5 sm:p-3 min-w-0">
        <p className="text-[11px] sm:text-xs font-medium text-muted-foreground">نتيجة البحث</p>
        <p className="truncate text-xs text-muted-foreground" dir="ltr">
          {originLabel || "mkafi.sa"}
        </p>
        <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-primary break-words">
          {formatSiteTitle(seo.title, siteName)}
        </h3>
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground break-words">
          {seo.description.trim() || "وصف الموقع يظهر هنا."}
        </p>
      </article>

      <article className="space-y-1.5 sm:space-y-2 min-w-0">
        <p className="text-[11px] sm:text-xs font-medium text-muted-foreground">مشاركة الشبكات</p>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex aspect-video items-center justify-center bg-muted">
            {seo.ogImage ? (
              <img src={seo.ogImage} alt="" className="size-full object-cover" />
            ) : (
              <ImageIcon className="size-5 sm:size-6 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-1 p-2.5 sm:p-3">
            <p className="truncate text-xs text-muted-foreground" dir="ltr">
              {originLabel || "mkafi.sa"}
            </p>
            <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-foreground break-words">
              {title || "عنوان المشاركة"}
            </h3>
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground break-words">
              {shareDescription(seo) || "وصف المشاركة يظهر هنا."}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
