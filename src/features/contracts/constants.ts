export const CONTRACT_TYPE_PARAM = "type";

export const CONTRACT_TYPE = {
  all: "all",
  residential: "residential",
  commercial: "commercial",
} as const;

export type ContractType = (typeof CONTRACT_TYPE)[keyof typeof CONTRACT_TYPE];

export const CONTRACT_TYPE_TABS = [
  {
    value: CONTRACT_TYPE.all,
    label: "الكل",
    emptyTitle: "لا توجد عقود بعد",
    emptyDescription:
      "ستظهر هنا عقود الإيجار السكنية والتجارية بعد بدء التوثيق.",
  },
  {
    value: CONTRACT_TYPE.residential,
    label: "سكني",
    emptyTitle: "لا توجد عقود سكنية",
    emptyDescription:
      "العقود السكنية مخصصة للشقق والفلل والغرف، ومتوافقة مع حساب المواطن والضمان المطور.",
  },
  {
    value: CONTRACT_TYPE.commercial,
    label: "تجاري",
    emptyDescription:
      "العقود التجارية مخصصة للمحلات والمكاتب والمستودعات والمنشآت الصناعية.",
    emptyTitle: "لا توجد عقود تجارية",
  },
] as const;

export function parseContractType(value: string | null): ContractType {
  if (
    value === CONTRACT_TYPE.residential ||
    value === CONTRACT_TYPE.commercial
  ) {
    return value;
  }

  return CONTRACT_TYPE.all;
}
