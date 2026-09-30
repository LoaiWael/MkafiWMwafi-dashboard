import { STORAGE_KEYS } from "@/lib/constants";
import { TWITTER_CARD } from "@/features/content/constants";
import { DEFAULT_SYSTEM_SETTINGS } from "@/features/settings/constants";
import {
  SOCIAL_NETWORKS,
  type SiteSeo,
  type SocialNetwork,
  type SystemSettings,
  type TwitterCard,
} from "@/features/settings/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function readBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function readTwitterCard(value: unknown): TwitterCard {
  if (value === TWITTER_CARD.summary || value === TWITTER_CARD.summaryLargeImage) {
    return value;
  }
  return DEFAULT_SYSTEM_SETTINGS.seo.twitterCard;
}

function readSeo(value: unknown): SiteSeo {
  const fallback = DEFAULT_SYSTEM_SETTINGS.seo;
  if (!isRecord(value)) return fallback;

  return {
    title: readString(value.title, fallback.title),
    titleTemplate: readString(value.titleTemplate, fallback.titleTemplate),
    description: readString(value.description, fallback.description),
    keywords: readString(value.keywords, fallback.keywords),
    siteUrl: readString(value.siteUrl, fallback.siteUrl),
    canonicalPath: readString(value.canonicalPath, fallback.canonicalPath),
    indexable: readBoolean(value.indexable, fallback.indexable),
    followLinks: readBoolean(value.followLinks, fallback.followLinks),
    ogTitle: readString(value.ogTitle, fallback.ogTitle),
    ogDescription: readString(value.ogDescription, fallback.ogDescription),
    ogImage: readString(value.ogImage, fallback.ogImage),
    ogImageAlt: readString(value.ogImageAlt, fallback.ogImageAlt),
    twitterCard: readTwitterCard(value.twitterCard),
    mirrorOpenGraph: readBoolean(value.mirrorOpenGraph, fallback.mirrorOpenGraph),
    twitterTitle: readString(value.twitterTitle, fallback.twitterTitle),
    twitterDescription: readString(value.twitterDescription, fallback.twitterDescription),
    twitterImage: readString(value.twitterImage, fallback.twitterImage),
  };
}

function readSocial(value: unknown): Record<SocialNetwork, string> {
  const fallback = DEFAULT_SYSTEM_SETTINGS.social;
  if (!isRecord(value)) return fallback;

  return {
    linkedin: readString(value[SOCIAL_NETWORKS.linkedin], fallback.linkedin),
    x: readString(value[SOCIAL_NETWORKS.x], fallback.x),
    youtube: readString(value[SOCIAL_NETWORKS.youtube], fallback.youtube),
    instagram: readString(value[SOCIAL_NETWORKS.instagram], fallback.instagram),
  };
}

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
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.systemSettings);
    if (!raw) return DEFAULT_SYSTEM_SETTINGS;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return DEFAULT_SYSTEM_SETTINGS;

    const fallback = DEFAULT_SYSTEM_SETTINGS;
    return {
      name: readString(parsed.name, fallback.name),
      description: readString(parsed.description, fallback.description),
      logo: readString(parsed.logo, fallback.logo),
      favicon: readString(parsed.favicon, fallback.favicon),
      primaryImage: readString(parsed.primaryImage, fallback.primaryImage),
      secondaryImage: readString(parsed.secondaryImage, fallback.secondaryImage),
      email: readString(parsed.email, fallback.email),
      phone: readString(parsed.phone, fallback.phone),
      openingHours: readString(parsed.openingHours, fallback.openingHours),
      copyright: readString(parsed.copyright, fallback.copyright),
      social: readSocial(parsed.social),
      seo: readSeo(parsed.seo),
      underMaintenance: readBoolean(parsed.underMaintenance, fallback.underMaintenance),
    };
  } catch {
    return DEFAULT_SYSTEM_SETTINGS;
  }
}

export function writeSystemSettings(settings: SystemSettings) {
  localStorage.setItem(STORAGE_KEYS.systemSettings, JSON.stringify(settings));
}
