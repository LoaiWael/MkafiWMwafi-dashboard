import { DEFAULT_SYSTEM_SETTINGS } from "@/features/settings/constants";
import type { SystemSettings } from "@/features/settings/types";

export function trimSystemSettings(settings: SystemSettings): SystemSettings {
  const seo = settings.seo;
  return {
    name: settings.name.trim(),
    description: settings.description.trim(),
    logo: settings.logo.trim(),
    favicon: settings.favicon.trim(),
    primaryImage: settings.primaryImage.trim(),
    secondaryImage: settings.secondaryImage.trim(),
    email: settings.email.trim(),
    phone: settings.phone.trim(),
    openingHours: settings.openingHours.trim(),
    copyright: settings.copyright.trim(),
    social: {
      linkedin: settings.social.linkedin.trim(),
      x: settings.social.x.trim(),
      youtube: settings.social.youtube.trim(),
      instagram: settings.social.instagram.trim(),
    },
    seo: {
      ...seo,
      title: seo.title.trim(),
      titleTemplate: seo.titleTemplate.trim(),
      description: seo.description.trim(),
      keywords: seo.keywords.trim(),
      siteUrl: seo.siteUrl.trim().replace(/\/$/, ""),
      canonicalPath: seo.canonicalPath.trim(),
      ogTitle: seo.ogTitle.trim(),
      ogDescription: seo.ogDescription.trim(),
      ogImage: seo.ogImage.trim(),
      ogImageAlt: seo.ogImageAlt.trim(),
      twitterTitle: seo.twitterTitle.trim(),
      twitterDescription: seo.twitterDescription.trim(),
      twitterImage: seo.twitterImage.trim(),
    },
    underMaintenance: Boolean(settings.underMaintenance),
  };
}

export function readSystemSettings(): SystemSettings {
  return DEFAULT_SYSTEM_SETTINGS;
}

export function writeSystemSettings(_settings: SystemSettings) {
  // In-memory / API placeholder — does not persist to localStorage
}
