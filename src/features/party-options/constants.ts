export interface OptionItem {
  id: string;
  nameAr: string;
  category?: string;
  description?: string;
  isActive: boolean;
}

export const INITIAL_AUTHORIZATION_TYPES: OptionItem[] = [
  {
    id: "facility_manager",
    nameAr: "مدير المنشأة",
    category: "تجاري / شركات",
    description: "المدير المسجل رسمياً في السجل التجاري أو عقد التأسيس",
    isActive: true,
  },
  {
    id: "authorized_delegate",
    nameAr: "مفوض",
    category: "تجاري / عام",
    description: "مفوض بموجب خطاب تفويض رسمي مصدق من الغرفة التجارية",
    isActive: true,
  },
  {
    id: "legal_attorney",
    nameAr: "وكيل شرعي",
    category: "عام",
    description: "وكيل بموجب وكالة شرعية إلكترونية سارية وموثقة من وزارة العدل (ناجز)",
    isActive: true,
  },
  {
    id: "board_chairman",
    nameAr: "رئيس مجلس الإدارة",
    category: "شركات",
    description: "رئيس مجلس الإدارة المخول بالتوقيع والتعاقد وفق النظام الأساسي",
    isActive: true,
  },
  {
    id: "establishment_owner",
    nameAr: "صاحب المؤسسة / مالك المنشأة",
    category: "مؤسسات فردية",
    description: "المالك الفردي للمؤسسة المسجل ببيانات السجل التجاري",
    isActive: true,
  },
  {
    id: "ceo",
    nameAr: "الرئيس التنفيذي",
    category: "شركات",
    description: "الرئيس التنفيذي الممنوح صلاحيات الإدارة والتوقيع",
    isActive: true,
  },
];

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

export const INITIAL_IDENTITY_TYPES: OptionItem[] = [
  {
    id: "national_id",
    nameAr: "الهوية الوطنية (للسعوديين)",
    category: "أفراد",
    description: "بطاقة الهوية الوطنية للمواطنين السعوديين",
    isActive: true,
  },
  {
    id: "iqama",
    nameAr: "هوية مقيم (الإقامة)",
    category: "أفراد",
    description: "إقامة نظامية سارية للمقيمين داخل المملكة",
    isActive: true,
  },
  {
    id: "unified_cr_700",
    nameAr: "الرقم الموحد للمنشأة (700)",
    category: "منشآت",
    description: "الرقم المبتدئ بالرقم 7 المعتمد بالسعودية للشركات والمؤسسات",
    isActive: true,
  },
  {
    id: "commercial_registration",
    nameAr: "السجل التجاري المحلي (CR)",
    category: "منشآت",
    description: "رقم السجل التجاري للمنشأة الصادر من وزارة التجارة",
    isActive: true,
  },
  {
    id: "gcc_id",
    nameAr: "الهوية الخليجية",
    category: "أفراد",
    description: "هوية مواطني دول مجلس التعاون الخليجي",
    isActive: true,
  },
  {
    id: "passport",
    nameAr: "جواز السفر",
    category: "أفراد / زوار",
    description: "للمستثمرين أو الدبلوماسيين والزوار",
    isActive: true,
  },
];
