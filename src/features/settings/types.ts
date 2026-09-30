import type { TwitterCard } from "@/features/content/types";

export type { TwitterCard };

export const SETTINGS_TABS = {
  brand: "brand",
  contacts: "contacts",
  social: "social",
  seo: "seo",
} as const;

export type SettingsTab = (typeof SETTINGS_TABS)[keyof typeof SETTINGS_TABS];

export const SOCIAL_NETWORKS = {
  linkedin: "linkedin",
  x: "x",
  youtube: "youtube",
  instagram: "instagram",
} as const;

export type SocialNetwork = (typeof SOCIAL_NETWORKS)[keyof typeof SOCIAL_NETWORKS];

export interface SiteSeo {
  title: string;
  titleTemplate: string;
  description: string;
  keywords: string;
  siteUrl: string;
  canonicalPath: string;
  indexable: boolean;
  followLinks: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  twitterCard: TwitterCard;
  mirrorOpenGraph: boolean;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export interface SystemSettings {
  name: string;
  description: string;
  logo: string;
  favicon: string;
  primaryImage: string;
  secondaryImage: string;
  email: string;
  phone: string;
  openingHours: string;
  copyright: string;
  social: Record<SocialNetwork, string>;
  seo: SiteSeo;
  underMaintenance: boolean;
}

export interface SettingsFieldErrors {
  name?: string;
  description?: string;
  logo?: string;
  favicon?: string;
  email?: string;
  phone?: string;
  openingHours?: string;
  copyright?: string;
  linkedin?: string;
  x?: string;
  youtube?: string;
  instagram?: string;
  seoTitle?: string;
  titleTemplate?: string;
  seoDescription?: string;
  siteUrl?: string;
  canonicalPath?: string;
  ogImageAlt?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}
