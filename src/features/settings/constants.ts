import { SEO_PUBLIC_ORIGIN, TWITTER_CARD } from "@/features/content/constants";
import { SITE } from "@/lib/constants";
import {
  SETTINGS_TABS,
  SOCIAL_NETWORKS,
  type SettingsTab,
  type SocialNetwork,
  type SystemSettings,
} from "@/features/settings/types";

export const SETTINGS_TAB_IDS = [
  SETTINGS_TABS.brand,
  SETTINGS_TABS.contacts,
  SETTINGS_TABS.social,
  SETTINGS_TABS.seo,
] as const satisfies readonly SettingsTab[];

export const MAX_SETTINGS_IMAGE_BYTES = 800 * 1024;

export const SOCIAL_FIELDS = [
  {
    key: SOCIAL_NETWORKS.linkedin,
    label: "لينكد إن",
    placeholder: "https://www.linkedin.com/company/...",
  },
  {
    key: SOCIAL_NETWORKS.x,
    label: "إكس",
    placeholder: "https://x.com/...",
  },
  {
    key: SOCIAL_NETWORKS.youtube,
    label: "يوتيوب",
    placeholder: "https://www.youtube.com/...",
  },
  {
    key: SOCIAL_NETWORKS.instagram,
    label: "إنستغرام",
    placeholder: "https://www.instagram.com/...",
  },
] as const satisfies readonly {
  key: SocialNetwork;
  label: string;
  placeholder: string;
}[];

const SITE_DESCRIPTION =
  "منصة إلكترونية لتوثيق وإدارة عقود الإيجار السكنية والتجارية بسهولة وأمان.";

const SEO_DESCRIPTION =
  "أنشئ عقد إيجار سكني أو تجاري إلكترونياً وبكل سهولة، خلال دقائق ومن دون زيارة مكتب.";

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  name: SITE.name,
  description: SITE_DESCRIPTION,
  logo: SITE.logo,
  favicon: "/favicon.svg",
  primaryImage: "",
  secondaryImage: "",
  email: SITE.email,
  phone: SITE.phoneDisplay,
  openingHours: SITE.workingHours,
  copyright: `جميع الحقوق محفوظة لـ ${SITE.name} © 2026`,
  social: {
    linkedin: "",
    x: "",
    youtube: "",
    instagram: "",
  },
  seo: {
    title: "عقد إيجار إلكتروني موثق",
    titleTemplate: `%s | ${SITE.name}`,
    description: SEO_DESCRIPTION,
    keywords: "عقد إيجار، توثيق عقد، إيجار سكني، إيجار تجاري، مكفي وموفي",
    siteUrl: SEO_PUBLIC_ORIGIN,
    canonicalPath: "/",
    indexable: true,
    followLinks: true,
    ogTitle: "عقد إيجار إلكتروني موثق، بلا تعقيد",
    ogDescription: SEO_DESCRIPTION,
    ogImage: "",
    ogImageAlt: SITE.name,
    twitterCard: TWITTER_CARD.summaryLargeImage,
    mirrorOpenGraph: true,
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
  },
  underMaintenance: false,
};
