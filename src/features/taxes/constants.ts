export interface TaxSetting {
  id: string;
  nameAr: string;
  category: "vat" | "contract_tax" | "service_fee" | "custom";
  description: string;
  ratePercent: number;
  isExempt: boolean;
  exemptionLabel: string;
  appliesTo: "all" | "residential" | "commercial";
  calculationType: "percentage" | "fixed";
  fixedAmount?: number;
  badgeText?: string;
  isActive: boolean;
  isMandatory?: boolean;
  order: number;
}

export const INITIAL_TAX_SETTINGS: TaxSetting[] = [
  {
    id: "gov_vat",
    nameAr: "ضريبه",
    category: "vat",
    description: "ضريبة القيمة المضافة الحكومية",
    ratePercent: 0,
    isExempt: false,
    exemptionLabel: "0%",
    appliesTo: "all",
    calculationType: "percentage",
    fixedAmount: 0,
    isActive: true,
    isMandatory: true,
    order: 1,
  },
  {
    id: "residential_tax",
    nameAr: "ضريبة العقد السكني",
    category: "contract_tax",
    description: "معفى للوحدات والمنشآت السكنية",
    ratePercent: 0,
    isExempt: true,
    exemptionLabel: "معفى",
    appliesTo: "residential",
    calculationType: "percentage",
    fixedAmount: 0,
    isActive: true,
    isMandatory: false,
    order: 2,
  },
  {
    id: "commercial_tax",
    nameAr: "ضريبة العقد التجاري",
    category: "contract_tax",
    description: "ضريبة القيمة المضافة للأنشطة والوحدات التجارية (15%)",
    ratePercent: 15,
    isExempt: false,
    exemptionLabel: "15%",
    appliesTo: "commercial",
    calculationType: "percentage",
    fixedAmount: 0,
    isActive: true,
    isMandatory: false,
    order: 3,
  },
];

export const TAX_STORAGE_KEYS = {
  taxes: "makfiwamufi.taxes.settings",
} as const;

export const TAXES_METADATA = {
  title: "الضرائب والرسوم",
  subtitle: "إدارة الضرائب وحساب الفاتورة",
  description: "التحكم في نسبة ضريبة القيمة المضافة الحكومية، شروط الإعفاء الضريبي للعقود السكنية والتجارية، ومعاينة الفاتورة الإلكترونية المباشرة",
  note: "جميع الإعدادات الضريبية تتوافق مع لوائح هيئة الزكاة والضريبة والجمارك (ZATCA) وشبكة إيجار",
} as const;
