export interface PaymentFrequencyOption {
  id: string;
  nameAr: string;
  installmentCount: number;
  periodAr: string;
  description: string;
  isActive: boolean;
}

export interface ContractDurationOption {
  id: string;
  nameAr: string;
  years: number;
  description?: string;
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

export const INITIAL_CONTRACT_DURATIONS: ContractDurationOption[] = [
  { id: "year_1", nameAr: "سنة واحدة (1)", years: 1, description: "عقد قياسي لمدة سنة ميلادية كاملة", isActive: true },
  { id: "year_2", nameAr: "سنتان (2)", years: 2, description: "عقد إيجار لمدة سنتين", isActive: true },
  { id: "year_3", nameAr: "3 سنوات", years: 3, description: "عقد متوسط الأجل", isActive: true },
  { id: "year_4", nameAr: "4 سنوات", years: 4, description: "عقد متعدد السنوات", isActive: true },
  { id: "year_5", nameAr: "5 سنوات", years: 5, description: "عقد تجاري أو سكني طويل الأجل", isActive: true },
  { id: "year_10", nameAr: "10 سنوات", years: 10, description: "عقد استثماري / تجاري طويل", isActive: true },
];

export const INITIAL_PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: "mada", nameAr: "بطاقة مدى البنكية (Mada)", code: "MADA", description: "الدفع عبر شبكة مدى السعودية", isActive: true },
  { id: "apple_pay", nameAr: "Apple Pay", code: "APPLE_PAY", description: "الدفع السريع عبر أجهزة أبل", isActive: true },
  { id: "credit_card", nameAr: "بطاقة ائتمانية (Visa / MasterCard)", code: "CC", description: "فيزا وماستركارد المحلية والدولية", isActive: true },
  { id: "sadad", nameAr: "سداد للمدفوعات (Sadad)", code: "SADAD", description: "نظام الفواتير وسداد الوطني", isActive: true },
  { id: "bank_transfer", nameAr: "حوالة بنكية مباشرة", code: "TRANSFER", description: "إيداع أو تحويل بنكي على حساب المؤسسة", isActive: true },
];

export const SERVICE_PRICING = [
  {
    id: "residential",
    title: "عقد سكني",
    amount: 249,
    period: "للسنة الواحدة",
    description: "مناسب للإيجار الفردي والعائلي، ومتوافق مع حساب المواطن والضمان المطور.",
  },
  {
    id: "commercial",
    title: "عقد تجاري",
    amount: 349,
    period: "للسنة الواحدة",
    description: "مناسب للمحلات والمكاتب والمصانع، ومتوافق مع وزارة التجارة والمركز السعودي للأعمال.",
  },
] as const;
