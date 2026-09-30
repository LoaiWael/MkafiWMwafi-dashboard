import type { SiteSeo } from "@/features/settings/types";

export function formatSiteTitle(title: string, siteName: string) {
  const trimmed = title.trim();
  if (!trimmed) return siteName.trim();
  if (siteName.trim() && trimmed.includes(siteName.trim())) return trimmed;
  return `${trimmed} | ${siteName.trim()}`;
}

export function formatSiteCanonical(siteUrl: string, path: string) {
  const base = siteUrl.trim().replace(/\/$/, "");
  const trimmed = path.trim();
  if (!base) return trimmed;
  if (!trimmed.startsWith("/")) return base;
  if (trimmed === "/") return base;
  return `${base}${trimmed}`;
}

export function shareTitle(seo: SiteSeo, fallbackTitle: string) {
  return seo.ogTitle.trim() || fallbackTitle.trim();
}

export function shareDescription(seo: SiteSeo) {
  return seo.ogDescription.trim() || seo.description.trim();
}
