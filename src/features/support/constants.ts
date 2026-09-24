import { SITE } from "@/lib/constants";

export const SUPPORT_CHANNELS = [
  {
    id: "email",
    label: "البريد الإلكتروني",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    id: "phone",
    label: "الجوال",
    value: SITE.phoneDisplay,
    href: SITE.phoneHref,
  },
  {
    id: "hours",
    label: "ساعات العمل",
    value: SITE.workingHours,
    href: undefined,
  },
] as const;
