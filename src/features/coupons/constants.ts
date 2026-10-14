export type {
  Coupon,
  CouponDiscountType,
  CouponStatus,
  TargetService,
  TargetUserType,
} from "./types";

import type { CouponStatus, TargetService, TargetUserType } from "./types";

export const COUPONS_METADATA = {
  title: "كوبونات الخصم",
  description:
    "إنشاء وإدارة وتتبع أداء كوبونات الخصم لعقود الإيجار السكنية والتجارية المعتمدة",
  note: "يتم التحقق من صلاحية الكوبونات وتطبيقها فوراً في مرحلة سداد رسوم التوثيق",
} as const;

export const TARGET_SERVICES_MAP: Record<
  TargetService,
  { label: string; short: string }
> = {
  all: { label: "جميع العقود (سكني وتجاري)", short: "الكل" },
  residential: { label: "العقود السكنية فقط", short: "سكني" },
  commercial: { label: "العقود التجارية فقط", short: "تجاري" },
};

export const TARGET_USERS_MAP: Record<
  TargetUserType,
  { label: string; short: string }
> = {
  all: { label: "جميع العملاء", short: "الجميع" },
  individual: { label: "الأفراد والمستأجرين", short: "أفراد" },
  broker: { label: "الوسطاء العقاريون (رخصة فال)", short: "وسطاء" },
  company: { label: "الشركات والمؤسسات", short: "شركات" },
};

export const COUPON_STATUS_LABELS: Record<CouponStatus, string> = {
  active: "نشط ومفعل",
  scheduled: "مجدول مستقبلاً",
  inactive: "معطل مؤقتاً",
  expired: "منتهي الصلاحية",
};
