export type ContractType = "residential" | "commercial";
export type DurationUnit = "months" | "years";

export interface PricingPlanDto {
  id: number | string;
  contract_type?: ContractType | string;
  contractType?: string;
  duration: string;
  duration_unit?: DurationUnit | string;
  durationUnit?: string;
  duration_value?: number;
  durationValue?: number;
  amount: string | number;
  is_popular?: boolean;
  isPopular?: boolean;
  notes?: string | null;
  sort_order?: number;
  sortOrder?: number;
  is_active?: boolean;
  isActive?: boolean;
  yearly_average?: string | number | null;
  yearlyAverage?: string | number | null;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface PricingPlanPayload {
  contract_type: ContractType;
  duration: string;
  duration_unit: DurationUnit;
  duration_value: number;
  amount: string | number;
  is_popular?: boolean;
  notes?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface PricingPlanItem {
  id: string;
  numericId?: number;
  contractType: ContractType;
  contractTypeLabel: string;
  duration: string;
  durationUnit: DurationUnit;
  durationValue: number;
  amount: number;
  isPopular: boolean;
  notes?: string;
  sortOrder: number;
  isActive: boolean;
  yearlyAverage?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function parseContractType(raw?: string): ContractType {
  if (!raw) return "residential";
  const normalized = raw.toLowerCase().trim();
  if (normalized === "commercial" || normalized === "تجاري") {
    return "commercial";
  }
  return "residential";
}

export function parseDurationUnit(raw?: string): DurationUnit {
  if (!raw) return "years";
  const normalized = raw.toLowerCase().trim();
  if (
    normalized === "months" ||
    normalized === "month" ||
    normalized === "شهور" ||
    normalized === "أشهر" ||
    normalized === "شهر"
  ) {
    return "months";
  }
  return "years";
}

export function mapPricingPlanDto(dto: PricingPlanDto): PricingPlanItem {
  const contractType = parseContractType(dto.contract_type ?? dto.contractType);
  const durationUnit = parseDurationUnit(dto.duration_unit ?? dto.durationUnit);
  const durationValue = Number(dto.durationValue ?? dto.duration_value ?? 1);
  const amount = typeof dto.amount === "number" ? dto.amount : parseFloat(dto.amount) || 0;
  const isPopular = Boolean(dto.isPopular ?? dto.is_popular);
  const isActive = Boolean(dto.isActive ?? dto.is_active ?? true);
  const sortOrder = Number(dto.sortOrder ?? dto.sort_order ?? 0);
  const numericId = typeof dto.id === "number" ? dto.id : parseInt(String(dto.id), 10) || undefined;

  const rawYearly = dto.yearlyAverage ?? dto.yearly_average;
  const yearlyAverage =
    rawYearly !== null && rawYearly !== undefined
      ? Number(rawYearly)
      : durationUnit === "years" && durationValue > 1
        ? Math.round(amount / durationValue)
        : null;

  return {
    id: String(dto.id),
    numericId,
    contractType,
    contractTypeLabel: contractType === "commercial" ? "تجاري" : "سكني",
    duration: dto.duration || (durationUnit === "months" ? `${durationValue} شهور` : `${durationValue} سنة`),
    durationUnit,
    durationValue,
    amount,
    isPopular,
    notes: dto.notes ?? undefined,
    sortOrder,
    isActive,
    yearlyAverage,
    createdAt: dto.createdAt ?? dto.created_at,
    updatedAt: dto.updatedAt ?? dto.updated_at,
  };
}
