export const CONTRACT_TYPES = [
  {
    id: "residential",
    label: "عقود سكنية",
    description: "وثائق ومستندات العقود السكنية للأفراد والعائلات",
  },
  {
    id: "commercial",
    label: "عقود تجارية",
    description: "وثائق ومستندات العقود التجارية للشركات والمؤسسات والمحلات",
  },
] as const;

export type ContractType = (typeof CONTRACT_TYPES)[number]["id"];

export interface DocumentTypeItem {
  id: string;
  name: string;
  category: "deed" | "identity" | "power_of_attorney" | "cr" | "other";
  categoryLabel: string;
  contractTypes: readonly ContractType[];
  description: string;
  isRequired: boolean;
}

export const TITLE_DEED_TYPES = [
  { id: "electronic", label: "صك إلكتروني", code: "DEED_ELEC" },
  { id: "paper", label: "صك ورقي", code: "DEED_PAPER" },
  { id: "ownership", label: "صك ملكية", code: "DEED_OWNER" },
  { id: "istihkam", label: "حجة استحكام", code: "DEED_ISTIHKAM" },
] as const;

export const DOCUMENT_DEFINITIONS: readonly DocumentTypeItem[] = [
  {
    id: "electronic-deed",
    name: "صك إلكتروني",
    category: "deed",
    categoryLabel: "وثيقة الملكية",
    contractTypes: ["residential", "commercial"],
    description: "صك الملكية الإلكتروني المعتمد والمربوط مع وزارة العدل.",
    isRequired: true,
  },
  {
    id: "paper-deed",
    name: "صك ورقي",
    category: "deed",
    categoryLabel: "وثيقة الملكية",
    contractTypes: ["residential", "commercial"],
    description: "الصكوك الورقية القديمة الصادرة قبل النظام الإلكتروني.",
    isRequired: false,
  },
  {
    id: "ownership-deed",
    name: "صك ملكية",
    category: "deed",
    categoryLabel: "وثيقة الملكية",
    contractTypes: ["residential", "commercial"],
    description: "وثائق إثبات الملكية وتحديد الحدود والمساحات.",
    isRequired: false,
  },
  {
    id: "istihkam",
    name: "حجة استحكام",
    category: "deed",
    categoryLabel: "وثيقة الملكية",
    contractTypes: ["residential", "commercial"],
    description: "حجج الاستحكام والوثائق القضائية المعتمدة.",
    isRequired: false,
  },
  {
    id: "cr",
    name: "السجل التجاري",
    category: "cr",
    categoryLabel: "بيانات المنشأة",
    contractTypes: ["commercial"],
    description: "السجل التجاري الساري الصادر عن وزارة التجارة أو المركز السعودي للأعمال.",
    isRequired: true,
  },
  {
    id: "poa",
    name: "الوكالة الشرعية",
    category: "power_of_attorney",
    categoryLabel: "التفويض والوكالات",
    contractTypes: ["residential", "commercial"],
    description: "وكالة شرعية سارية المفعول في حال كان مقدم الطلب وكيلاً عن المالك.",
    isRequired: false,
  },
] as const;
