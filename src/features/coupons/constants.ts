export type CouponDiscountType = "percentage" | "fixed";
export type CouponStatus = "active" | "scheduled" | "expired" | "inactive";
export type TargetService = "all" | "residential" | "commercial";
export type TargetUserType = "all" | "individual" | "broker" | "company";

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscountAmount?: number; // Only for percentage
  minOrderAmount: number;
  targetServices: TargetService[];
  targetUserType: TargetUserType;
  usageLimitTotal?: number;
  usageLimitPerUser: number;
  usedCount: number;
  status: CouponStatus;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  createdAt: string;
  createdBy: string;
  totalDiscountedAmount: number;
}

export const COUPONS_STORAGE_KEYS = {
  coupons: "makfiwamufi.coupons.list",
} as const;

export const COUPONS_METADATA = {
  title: "كوبونات الخصم",
  subtitle: "إدارة العروض الترويجية",
  description: "إنشاء وإدارة وتتبع أداء كوبونات الخصم لعقود الإيجار السكنية والتجارية المعتمدة",
  note: "يتم التحقق من صلاحية الكوبونات وتطبيقها فوراً في مرحلة سداد رسوم التوثيق",
} as const;

export const TARGET_SERVICES_MAP: Record<TargetService, { label: string; short: string }> = {
  all: { label: "جميع العقود (سكني وتجاري)", short: "الكل" },
  residential: { label: "العقود السكنية فقط", short: "سكني" },
  commercial: { label: "العقود التجارية فقط", short: "تجاري" },
};

export const TARGET_USERS_MAP: Record<TargetUserType, { label: string; short: string }> = {
  all: { label: "جميع العملاء", short: "الجميع" },
  individual: { label: "الأفراد والمستأجرين", short: "أفراد" },
  broker: { label: "الوسطاء العقاريون (فال)", short: "وسطاء" },
  company: { label: "الشركات والمؤسسات", short: "شركات" },
};

export const INITIAL_COUPONS: readonly Coupon[] = [
  {
    id: "CPN-101",
    code: "RAMADAN2026",
    name: "عرض شهر الخير والبركة",
    description: "خصم 25% على توثيق كافة عقود الإيجار السكنية والتجارية بمناسبة شهر رمضان المبارك",
    discountType: "percentage",
    discountValue: 25,
    maxDiscountAmount: 100,
    minOrderAmount: 200,
    targetServices: ["residential", "commercial"],
    targetUserType: "all",
    usageLimitTotal: 500,
    usageLimitPerUser: 2,
    usedCount: 384,
    status: "active",
    startDate: "2026-03-01",
    endDate: "2026-04-15",
    isPublic: true,
    createdAt: "2026-02-25",
    createdBy: "مدير التسويق",
    totalDiscountedAmount: 28800,
  },
  {
    id: "CPN-102",
    code: "WELCOME10",
    name: "خصم الترحيب للعملاء الجدد",
    description: "خصم 10% تلقائي لأول عقد إيجار يتم توثيقه عبر منصة مكفي وموفي",
    discountType: "percentage",
    discountValue: 10,
    maxDiscountAmount: 50,
    minOrderAmount: 150,
    targetServices: ["residential"],
    targetUserType: "individual",
    usageLimitTotal: 2000,
    usageLimitPerUser: 1,
    usedCount: 1420,
    status: "active",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    isPublic: true,
    createdAt: "2026-01-01",
    createdBy: "مدير النظام",
    totalDiscountedAmount: 35500,
  },
  {
    id: "CPN-103",
    code: "BROKER50",
    name: "حافز الوسطاء العقاريين المعتمدين",
    description: "خصم ثابت 50 ريال للوسطاء الحاملين لرخصة فال العقارية لتوثيق العقود",
    discountType: "fixed",
    discountValue: 50,
    minOrderAmount: 249,
    targetServices: ["residential", "commercial"],
    targetUserType: "broker",
    usageLimitTotal: 1000,
    usageLimitPerUser: 10,
    usedCount: 612,
    status: "active",
    startDate: "2026-01-15",
    endDate: "2026-11-30",
    isPublic: false,
    createdAt: "2026-01-10",
    createdBy: "مدير العمليات",
    totalDiscountedAmount: 30600,
  },
  {
    id: "CPN-104",
    code: "COMMERCIAL20",
    name: "باقة العقود والمجمعات التجارية",
    description: "خصم 20% لتوثيق المكاتب والمعارض والمستودعات للشركات",
    discountType: "percentage",
    discountValue: 20,
    maxDiscountAmount: 250,
    minOrderAmount: 400,
    targetServices: ["commercial"],
    targetUserType: "company",
    usageLimitTotal: 300,
    usageLimitPerUser: 5,
    usedCount: 189,
    status: "active",
    startDate: "2026-02-01",
    endDate: "2026-08-31",
    isPublic: true,
    createdAt: "2026-01-28",
    createdBy: "مدير الحسابات",
    totalDiscountedAmount: 23625,
  },
  {
    id: "CPN-105",
    code: "SUMMER2026",
    name: "موسم الإجازات الصيفية",
    description: "خصم خاص 15% على تجديد العقود السكنية للعائلات والمقيمين",
    discountType: "percentage",
    discountValue: 15,
    maxDiscountAmount: 75,
    minOrderAmount: 200,
    targetServices: ["residential"],
    targetUserType: "all",
    usageLimitTotal: 800,
    usageLimitPerUser: 2,
    usedCount: 0,
    status: "scheduled",
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    isPublic: true,
    createdAt: "2026-03-15",
    createdBy: "فريق التسويق",
    totalDiscountedAmount: 0,
  },
  {
    id: "CPN-106",
    code: "VIP100",
    name: "كوبون كبار العملاء الحصري",
    description: "خصم مباشر بقيمة 100 ريال مخصص لشركاء النجاح والجهات الحكومية",
    discountType: "fixed",
    discountValue: 100,
    minOrderAmount: 500,
    targetServices: ["residential", "commercial"],
    targetUserType: "company",
    usageLimitTotal: 100,
    usageLimitPerUser: 1,
    usedCount: 43,
    status: "active",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    isPublic: false,
    createdAt: "2026-01-01",
    createdBy: "الإدارة التنفيذية",
    totalDiscountedAmount: 4300,
  },
  {
    id: "CPN-107",
    code: "FOUNDING2026",
    name: "عرض يوم التأسيس السعودي",
    description: "خصم وطني 22 ريال على توثيق كافة العقود السكنية والتجارية",
    discountType: "fixed",
    discountValue: 22,
    minOrderAmount: 200,
    targetServices: ["residential", "commercial"],
    targetUserType: "all",
    usageLimitTotal: 1000,
    usageLimitPerUser: 1,
    usedCount: 1000,
    status: "expired",
    startDate: "2026-02-20",
    endDate: "2026-02-25",
    isPublic: true,
    createdAt: "2026-02-15",
    createdBy: "مدير التسويق",
    totalDiscountedAmount: 22000,
  },
  {
    id: "CPN-108",
    code: "FLASH30",
    name: "خصم الفلاش السريع",
    description: "كوبون خصم 30% لفترة محدودة تم إيقافه مؤقتاً لمراجعة الميزانية",
    discountType: "percentage",
    discountValue: 30,
    maxDiscountAmount: 150,
    minOrderAmount: 300,
    targetServices: ["residential"],
    targetUserType: "individual",
    usageLimitTotal: 250,
    usageLimitPerUser: 1,
    usedCount: 95,
    status: "inactive",
    startDate: "2026-02-01",
    endDate: "2026-03-01",
    isPublic: false,
    createdAt: "2026-02-01",
    createdBy: "مدير النظام",
    totalDiscountedAmount: 7125,
  },
] as const;
