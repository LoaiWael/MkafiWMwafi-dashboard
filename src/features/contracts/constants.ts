import type {
  Contract,
  ContractStatus,
  ContractType,
  PaymentStatus,
} from "./types";

export const CONTRACT_TYPE_PARAM = "type";
export const CONTRACT_PAYMENT_PARAM = "payment";
export const CONTRACT_STATUS_PARAM = "status";

export const CONTRACT_TYPE = {
  all: "all",
  residential: "residential",
  commercial: "commercial",
} as const;

export const CONTRACT_TYPE_TABS = [
  {
    value: CONTRACT_TYPE.all,
    label: "كل العقود",
    emptyTitle: "لا توجد عقود بعد",
    emptyDescription:
      "ستظهر هنا عقود الإيجار السكنية والتجارية بعد بدء التوثيق.",
  },
  {
    value: CONTRACT_TYPE.residential,
    label: "العقود السكنية",
    emptyTitle: "لا توجد عقود سكنية",
    emptyDescription:
      "العقود السكنية مخصصة للشقق والفلل والغرف، ومتوافقة مع حساب المواطن والضمان المطور.",
  },
  {
    value: CONTRACT_TYPE.commercial,
    label: "العقود التجارية",
    emptyDescription:
      "العقود التجارية مخصصة للمحلات والمكاتب والمستودعات والمنشآت الصناعية.",
    emptyTitle: "لا توجد عقود تجارية",
  },
] as const;

export function parseContractType(value: string | null): ContractType | "all" {
  if (
    value === CONTRACT_TYPE.residential ||
    value === CONTRACT_TYPE.commercial
  ) {
    return value;
  }
  return "all";
}

export const CONTRACT_STATUS_OPTIONS: {
  value: ContractStatus;
  label: string;
  badgeClass: string;
  dotClass: string;
  description: string;
}[] = [
  {
    value: "certified",
    label: "موثق مع إيجار",
    badgeClass:
      "bg-tertiary-50 text-tertiary-700 border-tertiary-200 dark:bg-tertiary-950 dark:text-tertiary-300 dark:border-tertiary-800",
    dotClass: "bg-tertiary-500",
    description: "تم توثيق العقد بنجاح واعتماده في منصة إيجار الرسمية.",
  },
  {
    value: "under_review",
    label: "قيد المراجعة والتدقيق",
    badgeClass:
      "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950 dark:text-primary-300 dark:border-primary-800",
    dotClass: "bg-primary-500",
    description: "العقد قيد التدقيق الإداري ومطابقة بيانات الصك والأطراف.",
  },
  {
    value: "pending_approval",
    label: "بانتظار موافقة الأطراف",
    badgeClass:
      "bg-secondary-50 text-secondary-800 border-secondary-200 dark:bg-secondary-950 dark:text-secondary-300 dark:border-secondary-800",
    dotClass: "bg-secondary-500",
    description: "تم إرسال العقد للأطراف وبانتظار قبول المستأجر أو المؤجر عبر نفاذ.",
  },
  {
    value: "pending_payment",
    label: "بانتظار السداد",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    dotClass: "bg-amber-500",
    description: "بانتظار سداد رسوم التوثيق من قبل الطرف المسؤول.",
  },
  {
    value: "rejected",
    label: "مرفوض من إيجار",
    badgeClass:
      "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20",
    dotClass: "bg-destructive",
    description: "تم رفض العقد لعدم تطابق البيانات أو انتهاء مهلة التوثيق.",
  },
  {
    value: "expired",
    label: "منتهي الصلاحية",
    badgeClass:
      "bg-muted text-muted-foreground border-border",
    dotClass: "bg-muted-foreground",
    description: "انتهت فترة العقد الإيجاري المحددة.",
  },
  {
    value: "cancelled",
    label: "ملغي",
    badgeClass:
      "bg-destructive/10 text-destructive border-destructive/20",
    dotClass: "bg-destructive",
    description: "تم إلغاء العقد بناءً على طلب أحد الأطراف أو لخلل نظامي.",
  },
];

export const PAYMENT_STATUS_OPTIONS: {
  value: PaymentStatus;
  label: string;
  badgeClass: string;
  iconName?: string;
}[] = [
  {
    value: "paid",
    label: "مدفوع بالكامل",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
  },
  {
    value: "unpaid",
    label: "غير مدفوع",
    badgeClass:
      "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800",
  },
  {
    value: "partially_paid",
    label: "مدفوع جزئياً",
    badgeClass:
      "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800",
  },
  {
    value: "refunded",
    label: "مسترد",
    badgeClass:
      "bg-muted text-muted-foreground border-border",
  },
];

/** Empty array for clean real-API mode */
export const MOCK_CONTRACTS: Contract[] = [];
