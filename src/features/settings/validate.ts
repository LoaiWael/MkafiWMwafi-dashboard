import { SETTINGS_TABS, type SettingsFieldErrors, type SettingsTab, type SystemSettings } from "@/features/settings/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTTP_URL_PATTERN = /^https?:\/\/\S+$/i;

function optionalHttpUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!HTTP_URL_PATTERN.test(trimmed)) return "يبدأ الرابط بـ https://";
  return undefined;
}

export function validateSystemSettings(settings: SystemSettings): SettingsFieldErrors {
  const errors: SettingsFieldErrors = {};

  if (!settings.name.trim()) errors.name = "أدخل اسم المنصة";
  if (!settings.description.trim()) errors.description = "أدخل الوصف المختصر";
  if (!settings.logo.trim()) errors.logo = "أدخل الشعار";
  if (!settings.favicon.trim()) errors.favicon = "أدخل أيقونة الموقع";

  if (!EMAIL_PATTERN.test(settings.email.trim())) {
    errors.email = "أدخل بريداً إلكترونياً صالحاً";
  }

  if (settings.phone.replace(/\D/g, "").length < 8) {
    errors.phone = "أدخل رقم التواصل";
  }

  if (!settings.openingHours.trim()) errors.openingHours = "أدخل أوقات العمل كنص";
  if (!settings.copyright.trim()) errors.copyright = "أدخل نص حقوق النشر";

  errors.linkedin = optionalHttpUrl(settings.social.linkedin);
  errors.x = optionalHttpUrl(settings.social.x);
  errors.youtube = optionalHttpUrl(settings.social.youtube);
  errors.instagram = optionalHttpUrl(settings.social.instagram);

  const seo = settings.seo;
  if (!seo.title.trim()) errors.seoTitle = "أدخل العنوان الافتراضي";
  if (!seo.titleTemplate.includes("%s")) {
    errors.titleTemplate = "أدرج %s مكان عنوان الصفحة";
  }
  if (!seo.description.trim()) errors.seoDescription = "أدخل وصف الموقع";

  if (!HTTP_URL_PATTERN.test(seo.siteUrl.trim())) {
    errors.siteUrl = "أدخل رابط الموقع، مثل https://mkafi.sa";
  }

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

const TAB_FIELDS: Record<SettingsTab, (keyof SettingsFieldErrors)[]> = {
  [SETTINGS_TABS.brand]: ["name", "description", "logo", "favicon"],
  [SETTINGS_TABS.contacts]: ["email", "phone", "openingHours", "copyright"],
  [SETTINGS_TABS.social]: ["linkedin", "x", "youtube", "instagram"],
  [SETTINGS_TABS.seo]: [
    "seoTitle",
    "titleTemplate",
    "seoDescription",
    "siteUrl",
    "canonicalPath",
    "ogImageAlt",
    "twitterTitle",
    "twitterDescription",
  ],
};

export function hasSettingsErrors(errors: SettingsFieldErrors) {
  return Object.values(errors).some(Boolean);
}

export function firstSettingsErrorTab(errors: SettingsFieldErrors): SettingsTab | null {
  for (const tab of Object.keys(TAB_FIELDS) as SettingsTab[]) {
    if (TAB_FIELDS[tab].some((field) => errors[field])) return tab;
  }
  return null;
}
