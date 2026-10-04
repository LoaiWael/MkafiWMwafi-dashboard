export interface OptionItem {
  id: string;
  nameAr: string;
  category?: string;
  description?: string;
  isActive: boolean;
}

export const PARTY_OPTIONS_METADATA = {
  title: "صفة المستأجر والمؤجر",
  description:
    "خيارات تحديد صفة الطرف: فرد، مؤسسة أو شركة، جهة حكومية، وجهة غير ربحية.",
} as const;

export const PARTY_OPTION_CATEGORIES = [
  "أفراد",
  "قطاع أعمال",
  "قطاع عام",
  "قطاع غير ربحي",
  "عام",
] as const;

export const INITIAL_PARTY_CAPACITIES: OptionItem[] = [
  {
    id: "individual",
    nameAr: "فرد (مواطن / مقيم)",
    category: "أفراد",
    description: "مستأجر أو مؤجر بصفته الشخصية",
    isActive: true,
  },
  {
    id: "establishment_company",
    nameAr: "مؤسسة / شركة",
    category: "قطاع أعمال",
    description: "منشأة تجارية تحمل سجلاً تجارياً موحداً (الرقم 700)",
    isActive: true,
  },
  {
    id: "government_entity",
    nameAr: "جهة حكومية / شبه حكومية",
    category: "قطاع عام",
    description: "وزارة، هيئة، أو مؤسسة عامة",
    isActive: true,
  },
  {
    id: "non_profit",
    nameAr: "جمعية خيرية / غير ربحية",
    category: "قطاع غير ربحي",
    description: "جمعية أو مؤسسة أهلية مرخصة",
    isActive: true,
  },
];
