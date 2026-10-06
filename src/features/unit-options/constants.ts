export interface OptionItem {
  id: string;
  nameAr: string;
  category?: string;
  description?: string;
  isActive: boolean;
}

export const INITIAL_UNIT_TYPES: OptionItem[] = [
  { id: "apartment", nameAr: "شقة", category: "سكني", description: "وحدة سكنية مستقلة داخل عمارة أو مجمع", isActive: true },
  { id: "villa", nameAr: "فيلا", category: "سكني", description: "مبنى سكني مستقل بالكامل", isActive: true },
  { id: "floor", nameAr: "دور", category: "سكني", description: "طابق سكني مستقل", isActive: true },
  { id: "duplex", nameAr: "دوبلكس", category: "سكني", description: "وحدة سكنية من طابقين متصلين", isActive: true },
  { id: "studio", nameAr: "استوديو", category: "سكني", description: "وحدة سكنية مفتوحة صغيرة", isActive: true },
  { id: "annex", nameAr: "ملحق سكن / روف", category: "سكني", description: "ملحق علوي أو أرضي", isActive: true },
  { id: "shop", nameAr: "محل تجاري", category: "تجاري", description: "محل للأنشطة التجارية والتجزئة", isActive: true },
  { id: "office", nameAr: "مكتب", category: "تجاري", description: "مكتب إداري أو مهني", isActive: true },
  { id: "showroom", nameAr: "صالة عرض / معرض", category: "تجاري", description: "معرض بمساحة مفتوحة للأنشطة والوكالات", isActive: true },
  { id: "warehouse", nameAr: "مستودع / هنجر", category: "تجاري", description: "مستودع تخزين أو مستودع صناعي", isActive: true },
  { id: "kiosk", nameAr: "كشك تجاري", category: "تجاري", description: "موقع أو كشك داخل مول أو مجمع", isActive: true },
  { id: "whole_building", nameAr: "مبنى بالكامل", category: "تجاري", description: "مبنى تجاري أو سكني كامل", isActive: true },
];

export const INITIAL_PROPERTY_TYPES: OptionItem[] = [
  { id: "commercial_mall", nameAr: "مركز تجاري / مول", category: "تجاري", description: "مجمع تجاري للتسوق والترفيه", isActive: true },
  { id: "residential_building", nameAr: "عمارة سكنية", category: "سكني", description: "مبنى يضم عدة وحدات وشقق سكنية", isActive: true },
  { id: "commercial_tower", nameAr: "برج تجاري ومكتبي", category: "تجاري", description: "برج مخصص للمكاتب والشركات", isActive: true },
  { id: "residential_compound", nameAr: "مجمع سكني (كمباوند)", category: "سكني", description: "مجمع مغلق يضم وحدات سكنية وخدمات", isActive: true },
  { id: "commercial_strip", nameAr: "مجمع تجاري / ستريب مول", category: "تجاري", description: "محلات ومطاعم على شارع رئيسي", isActive: true },
  { id: "logistics_park", nameAr: "مجمع مستودعات وهناجر", category: "صناعي/لوجستي", description: "منطقة مستودعات وتخزين", isActive: true },
  { id: "residential_villa", nameAr: "فيلا سكنية", category: "سكني", description: "عقار سكني مستقل", isActive: true },
  { id: "commercial_building", nameAr: "عمارة تجارية / سكنية مختلطة", category: "مختلط", description: "محلات بالأسفل وشقق أو مكاتب بالأعلى", isActive: true },
];

export const INITIAL_FLOOR_OPTIONS: OptionItem[] = [
  { id: "basement_2", nameAr: "القبو الثاني (B2)", description: "تحت الأرض", isActive: true },
  { id: "basement_1", nameAr: "القبو الأول (B1)", description: "تحت الأرض", isActive: true },
  { id: "ground", nameAr: "الدور الأرضي", description: "الطابق الأرضي مع مدخل مباشر", isActive: true },
  { id: "mezzanine", nameAr: "الميزانين (سندرة)", description: "طابق نصفي بين الأرضي والأول", isActive: true },
  { id: "floor_1", nameAr: "الدور الأول", description: "الطابق الأول فوق الأرضي", isActive: true },
  { id: "floor_2", nameAr: "الدور الثاني", description: "الطابق الثاني", isActive: true },
  { id: "floor_3", nameAr: "الدور الثالث", description: "الطابق الثالث", isActive: true },
  { id: "floor_4", nameAr: "الدور الرابع", description: "الطابق الرابع", isActive: true },
  { id: "floor_5_plus", nameAr: "الدور الخامس فأعلى", description: "الأدوار المتكررة العلوية", isActive: true },
  { id: "roof", nameAr: "السطح / الروف", description: "الطابق الأخير بالسطح", isActive: true },
];

