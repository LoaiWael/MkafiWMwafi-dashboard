import { SITE } from "@/lib/constants";
import { SEO_PUBLIC_ORIGIN } from "@/features/content/constants";
import type { PageSeo } from "@/features/content/types";

export interface SeoFieldErrors {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImageAlt?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

export function formatDocumentTitle(title: string) {
  const trimmed = title.trim();
  if (!trimmed) return SITE.name;
  if (trimmed.includes(SITE.name)) return trimmed;
  return `${trimmed} | ${SITE.name}`;
}

export function formatCanonicalUrl(path: string) {
  const trimmed = path.trim();
  if (!trimmed.startsWith("/")) return SEO_PUBLIC_ORIGIN;
  if (trimmed === "/") return SEO_PUBLIC_ORIGIN;
  return `${SEO_PUBLIC_ORIGIN}${trimmed}`;
}

export function formatRobots(indexable: boolean, followLinks: boolean) {
  return `${indexable ? "index" : "noindex"}, ${followLinks ? "follow" : "nofollow"}`;
}

export function shareTitle(seo: PageSeo) {
  return seo.ogTitle.trim() || seo.title.trim();
}

export function shareDescription(seo: PageSeo) {
  return seo.ogDescription.trim() || seo.description.trim();
}

export function validatePageSeo(seo: PageSeo): SeoFieldErrors {
  const errors: SeoFieldErrors = {};

  if (!seo.title.trim()) errors.title = "أدخل عنوان الصفحة";
  if (!seo.description.trim()) errors.description = "أدخل وصف الصفحة";

  const path = seo.canonicalPath.trim();
  if (!path.startsWith("/") || /\s/.test(path)) {
    errors.canonicalPath = "يبدأ الرابط بـ / ومن دون مسافات";
  }

  if (seo.ogImage.trim() && !seo.ogImageAlt.trim()) {
    errors.ogImageAlt = "أدخل النص البديل للصورة";
  }

  if (!seo.mirrorOpenGraph) {
    if (!seo.twitterTitle.trim()) errors.twitterTitle = "أدخل عنوان البطاقة";
    if (!seo.twitterDescription.trim()) {
      errors.twitterDescription = "أدخل وصف البطاقة";
    }
  }

  return errors;
}

export function hasSeoErrors(errors: SeoFieldErrors) {
  return Object.values(errors).some(Boolean);
}

export function trimPageSeo(seo: PageSeo): PageSeo {
  return {
    ...seo,
    title: seo.title.trim(),
    description: seo.description.trim(),
    keywords: seo.keywords.trim(),
    canonicalPath: seo.canonicalPath.trim(),
    ogTitle: seo.ogTitle.trim(),
    ogDescription: seo.ogDescription.trim(),
    ogImage: seo.ogImage.trim(),
    ogImageAlt: seo.ogImageAlt.trim(),
    twitterTitle: seo.twitterTitle.trim(),
    twitterDescription: seo.twitterDescription.trim(),
    twitterImage: seo.twitterImage.trim(),
  };
}
