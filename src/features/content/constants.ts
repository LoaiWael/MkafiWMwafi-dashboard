export const CONTENT_PAGES = {
  home: "home",
  about: "about",
} as const;

export type ContentPageId = (typeof CONTENT_PAGES)[keyof typeof CONTENT_PAGES];

export const CONTENT_PAGE_IDS = [
  CONTENT_PAGES.home,
  CONTENT_PAGES.about,
] as const;

export const SITE_PREVIEW_NAV = [
  { id: CONTENT_PAGES.home, label: "الرئيسية" },
  { id: CONTENT_PAGES.about, label: "من نحن" },
] as const;

export const HERO_VIDEO_SRC = "/home/hero.mp4";

export const HERO_COPY = {
  title: "بدون مكتب عقاري وخلال 25 دقيقة",
  highlight: "استلم عقد إيجارك الموثق.",
  description:
    "إذا كنت مالك عقار أو مستأجر أو وسيط عقاري تستطيع هنا إنشاء عقد إيجار موثق ومعتمد من إيجار.",
} as const;

export const HERO_STATS = [
  { id: "commercial", value: 0, label: "عقد تجاري" },
  { id: "residential", value: 0, label: "عقد سكني" },
  { id: "clients", value: 0, label: "عميل راضٍ" },
] as const;
