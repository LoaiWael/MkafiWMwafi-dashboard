export interface PaymentFrequencyOption {
  id: string;
  nameAr: string;
  installmentCount: number;
  periodAr: string;
  description: string;
  isActive: boolean;
}

export interface PaymentMethodOption {
  id: string;
  nameAr: string;
  code: string;
  description: string;
  isActive: boolean;
}

export const INITIAL_PAYMENT_FREQUENCIES: PaymentFrequencyOption[] = [
  {
    id: "annual_1",
    nameAr: "دفعة واحدة (سنوي)",
    installmentCount: 1,
    periodAr: "سنوي",
    description: "سداد قيمة الإيجار بالكامل في دفعة واحدة سنوياً",
    isActive: true,
  },
  {
    id: "semi_annual_2",
    nameAr: "دفعتان (نصف سنوي)",
    installmentCount: 2,
    periodAr: "كل 6 أشهر",
    description: "سداد الإيجار على دفعتين متساويتين كل 6 أشهر",
    isActive: true,
  },
  {
    id: "quarterly_4",
    nameAr: "4 دفعات (ربع سنوي)",
    installmentCount: 4,
    periodAr: "كل 3 أشهر",
    description: "سداد الإيجار على 4 دفعات ربع سنوية",
    isActive: true,
  },
  {
    id: "monthly_12",
    nameAr: "12 دفعة (شهري)",
    installmentCount: 12,
    periodAr: "شهرياً",
    description: "سداد الإيجار شهرياً على 12 دفعة طوال السنة",
    isActive: true,
  },
];

export const INITIAL_PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "mada",
    nameAr: "بطاقة مدى البنكية (Mada)",
    code: "MADA",
    description: "الدفع عبر شبكة مدى السعودية",
    isActive: true,
  },
  {
    id: "apple_pay",
    nameAr: "Apple Pay",
    code: "APPLE_PAY",
    description: "الدفع السريع عبر أجهزة أبل",
    isActive: true,
  },
  {
    id: "credit_card",
    nameAr: "بطاقة ائتمانية (Visa / MasterCard)",
    code: "CC",
    description: "فيزا وماستركارد المحلية والدولية",
    isActive: true,
  },
  {
    id: "sadad",
    nameAr: "سداد للمدفوعات (Sadad)",
    code: "SADAD",
    description: "نظام الفواتير وسداد الوطني",
    isActive: true,
  },
  {
    id: "bank_transfer",
    nameAr: "حوالة بنكية مباشرة",
    code: "TRANSFER",
    description: "إيداع أو تحويل بنكي على حساب المؤسسة",
    isActive: true,
  },
];

export const PAYMENTS_STORAGE_KEYS = {
  frequencies: "makfiwamufi.payments.frequencies",
  methods: "makfiwamufi.payments.methods",
} as const;

export const PAYMENTS_METADATA = {
  title: "المدفوعات والبيانات المالية",
  description:
    "إدارة خيارات وطرق سداد الإيجار وقنوات الدفع الإلكتروني المعتمدة في منصة مكفي وموفي.",
} as const;
