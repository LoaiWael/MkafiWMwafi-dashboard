export type TaxAppliesTo = "all" | "residential" | "commercial";

export type TaxCalculationType = "percentage" | "fixed";

export interface TaxRuleDto {
  id: number | string;
  name_ar?: string;
  nameAr?: string;
  applies_to?: TaxAppliesTo | string;
  appliesTo?: TaxAppliesTo | string;
  description?: string | null;
  calculation_type?: TaxCalculationType | string;
  calculationType?: TaxCalculationType | string;
  rate_percent?: number | string | null;
  ratePercent?: number | string | null;
  fixed_amount?: number | string | null;
  fixedAmount?: number | string | null;
  is_exempt?: boolean | number;
  isExempt?: boolean | number;
  exemption_label?: string | null;
  exemptionLabel?: string | null;
  is_active?: boolean | number;
  isActive?: boolean | number;
  is_mandatory?: boolean | number;
  isMandatory?: boolean | number;
  order?: number | string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface TaxRulePayload {
  name_ar: string;
  applies_to: TaxAppliesTo;
  description?: string | null;
  calculation_type: TaxCalculationType;
  rate_percent?: number;
  fixed_amount?: number;
  is_exempt?: boolean;
  exemption_label?: string | null;
  is_active?: boolean;
  is_mandatory?: boolean;
  order?: number;
}

export interface ToggleTaxActivePayload {
  is_active: boolean;
}

export interface TaxSetting {
  id: string;
  numericId?: number;
  nameAr: string;
  description: string;
  ratePercent: number;
  isExempt: boolean;
  exemptionLabel: string;
  appliesTo: TaxAppliesTo;
  calculationType: TaxCalculationType;
  fixedAmount?: number;
  badgeText?: string;
  isActive: boolean;
  isMandatory?: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function parseTaxAppliesTo(raw?: string): TaxAppliesTo {
  if (!raw) return "all";
  const normalized = raw.toLowerCase().trim();
  if (
    normalized === "all" ||
    normalized === "residential" ||
    normalized === "commercial"
  ) {
    return normalized as TaxAppliesTo;
  }
  return "all";
}

export function parseTaxCalculationType(raw?: string): TaxCalculationType {
  if (!raw) return "percentage";
  const normalized = raw.toLowerCase().trim();
  if (normalized === "fixed" || normalized === "percentage") {
    return normalized as TaxCalculationType;
  }
  return "percentage";
}

export function mapTaxRuleDto(dto: TaxRuleDto): TaxSetting {
  const numericId =
    typeof dto.id === "number"
      ? dto.id
      : Number.isInteger(Number(dto.id))
        ? Number(dto.id)
        : undefined;

  const rawRate = dto.ratePercent ?? dto.rate_percent;
  const ratePercent =
    typeof rawRate === "number"
      ? rawRate
      : rawRate !== undefined && rawRate !== null
        ? parseFloat(String(rawRate)) || 0
        : 0;

  const rawFixed = dto.fixedAmount ?? dto.fixed_amount;
  const fixedAmount =
    typeof rawFixed === "number"
      ? rawFixed
      : rawFixed !== undefined && rawFixed !== null
        ? parseFloat(String(rawFixed)) || 0
        : 0;

  const isExempt = Boolean(dto.isExempt ?? dto.is_exempt);
  const isActive = Boolean(
    dto.isActive !== undefined
      ? dto.isActive
      : dto.is_active !== undefined
        ? dto.is_active
        : true,
  );
  const isMandatory = Boolean(dto.isMandatory ?? dto.is_mandatory);

  const rawOrder = dto.order;
  const order =
    typeof rawOrder === "number"
      ? rawOrder
      : rawOrder !== undefined && rawOrder !== null
        ? parseInt(String(rawOrder), 10) || 1
        : 1;

  const nameAr = dto.nameAr || dto.name_ar || "بند ضريبي";
  const description = dto.description || "";
  const exemptionLabel =
    dto.exemptionLabel || dto.exemption_label || (isExempt ? "معفى" : "");

  return {
    id: String(dto.id),
    numericId,
    nameAr,
    description,
    ratePercent,
    isExempt,
    exemptionLabel,
    appliesTo: parseTaxAppliesTo(dto.appliesTo ?? dto.applies_to),
    calculationType: parseTaxCalculationType(
      dto.calculationType ?? dto.calculation_type,
    ),
    fixedAmount,
    isActive,
    isMandatory,
    order,
    createdAt: dto.createdAt ?? dto.created_at,
    updatedAt: dto.updatedAt ?? dto.updated_at,
  };
}
