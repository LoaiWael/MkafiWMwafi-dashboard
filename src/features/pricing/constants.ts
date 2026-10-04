export interface PricingPlan {
  id: string;
  duration: string;
  durationUnit: "months" | "years";
  durationValue: number;
  amount: number;
  isPopular?: boolean;
  notes?: string;
}

export const CONTRACT_PRICING_PLANS: readonly PricingPlan[] = [
  {
    id: "3-months",
    duration: "3 شهور",
    durationUnit: "months",
    durationValue: 3,
    amount: 249,
  },
  {
    id: "6-months",
    duration: "6 شهور",
    durationUnit: "months",
    durationValue: 6,
    amount: 249,
  },
  {
    id: "1-year",
    duration: "سنة",
    durationUnit: "years",
    durationValue: 1,
    amount: 249,
    isPopular: true,
  },
  {
    id: "2-years",
    duration: "سنتين",
    durationUnit: "years",
    durationValue: 2,
    amount: 399,
  },
  {
    id: "3-years",
    duration: "3 سنوات",
    durationUnit: "years",
    durationValue: 3,
    amount: 599,
  },
  {
    id: "4-years",
    duration: "4 سنوات",
    durationUnit: "years",
    durationValue: 4,
    amount: 799,
  },
  {
    id: "5-years",
    duration: "5 سنوات",
    durationUnit: "years",
    durationValue: 5,
    amount: 950,
  },
  {
    id: "6-years",
    duration: "6 سنوات",
    durationUnit: "years",
    durationValue: 6,
    amount: 1199,
  },
  {
    id: "7-years",
    duration: "7 سنوات",
    durationUnit: "years",
    durationValue: 7,
    amount: 1499,
  },
  {
    id: "8-years",
    duration: "8 سنوات",
    durationUnit: "years",
    durationValue: 8,
    amount: 1599,
  },
  {
    id: "9-years",
    duration: "9 سنوات",
    durationUnit: "years",
    durationValue: 9,
    amount: 1699,
  },
  {
    id: "10-years",
    duration: "10 سنوات",
    durationUnit: "years",
    durationValue: 10,
    amount: 1999,
  },
] as const;

export const PRICING_METADATA = {
  title: "تسعير الخدمات",
  description: "رسوم توثيق وتسجيل عقود الإيجار المعتمدة رسمياً عبر شبكة إيجار",
  taxNote: "جميع الرسوم تشمل رسوم منصة إيجار والضرائب المحددة في النظام",
} as const;
