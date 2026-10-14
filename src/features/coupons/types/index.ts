export type CouponDiscountType = "percentage" | "fixed";
export type CouponStatus = "active" | "scheduled" | "expired" | "inactive";
export type TargetService = "all" | "residential" | "commercial";
export type TargetUserType = "all" | "individual" | "broker" | "company";

export interface CouponDto {
  id: number | string;
  code: string;
  name: string;
  description?: string | null;
  discount_type?: CouponDiscountType | string;
  discountType?: CouponDiscountType | string;
  discount_value?: number | string;
  discountValue?: number | string;
  max_discount_amount?: number | string | null;
  maxDiscountAmount?: number | string | null;
  min_order_amount?: number | string;
  minOrderAmount?: number | string;
  target_services?: TargetService[] | string[] | string;
  targetServices?: TargetService[] | string[] | string;
  target_user_type?: TargetUserType | string;
  targetUserType?: TargetUserType | string;
  usage_limit_total?: number | string | null;
  usageLimitTotal?: number | string | null;
  usage_limit_per_user?: number | string;
  usageLimitPerUser?: number | string;
  used_count?: number | string;
  usedCount?: number | string;
  total_discounted_amount?: number | string;
  totalDiscountedAmount?: number | string;
  status: CouponStatus | string;
  start_date?: string;
  startDate?: string;
  end_date?: string;
  endDate?: string;
  is_public?: boolean | number;
  isPublic?: boolean | number;
  created_at?: string;
  createdAt?: string;
  created_by?: string | { name?: string };
  createdBy?: string | { name?: string };
  updated_at?: string;
  updatedAt?: string;
}

export interface CouponPayload {
  code: string;
  name: string;
  description: string | null;
  discount_type: CouponDiscountType;
  discount_value: number;
  max_discount_amount: number | null;
  min_order_amount: number;
  target_services: TargetService[];
  target_user_type?: TargetUserType;
  usage_limit_total: number | null;
  usage_limit_per_user: number;
  status: CouponStatus;
  start_date: string;
  end_date: string;
  is_public: boolean;
}

export interface CouponStatusPayload {
  status: CouponStatus;
}

export interface CouponListParams {
  search?: string;
  status?: CouponStatus | "all";
  service?: TargetService | "all";
  discount_type?: CouponDiscountType | "all";
  per_page?: number;
  page?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
}

export interface Coupon {
  id: string;
  numericId?: number;
  code: string;
  name: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  maxDiscountAmount?: number | null;
  minOrderAmount: number;
  targetServices: TargetService[];
  targetUserType?: TargetUserType;
  usageLimitTotal?: number | null;
  usageLimitPerUser: number;
  usedCount: number;
  status: CouponStatus;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  createdAt?: string;
  createdBy?: string;
  totalDiscountedAmount: number;
}

export function parseTargetServices(raw: unknown): TargetService[] {
  if (Array.isArray(raw)) {
    const valid = raw.filter((s): s is TargetService =>
      ["all", "residential", "commercial"].includes(String(s).toLowerCase().trim())
    );
    return valid.length > 0 ? valid : ["all"];
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter((s): s is TargetService =>
          ["all", "residential", "commercial"].includes(String(s).toLowerCase().trim())
        );
        return valid.length > 0 ? valid : ["all"];
      }
    } catch {
      // not JSON
    }
    const parts = raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s): s is TargetService =>
        ["all", "residential", "commercial"].includes(s)
      );
    return parts.length > 0 ? parts : ["all"];
  }
  return ["all"];
}

export function parseTargetUserType(raw: unknown): TargetUserType {
  if (typeof raw === "string") {
    const s = raw.toLowerCase().trim();
    if (s === "all" || s === "individual" || s === "broker" || s === "company") {
      return s as TargetUserType;
    }
  }
  return "all";
}

export function parseDiscountType(raw: unknown): CouponDiscountType {
  if (typeof raw === "string") {
    const s = raw.toLowerCase().trim();
    if (s === "percentage" || s === "fixed") {
      return s as CouponDiscountType;
    }
  }
  return "percentage";
}

export function parseCouponStatus(raw: unknown): CouponStatus {
  if (typeof raw === "string") {
    const s = raw.toLowerCase().trim();
    if (
      s === "active" ||
      s === "scheduled" ||
      s === "expired" ||
      s === "inactive"
    ) {
      return s as CouponStatus;
    }
  }
  return "active";
}

export function mapCouponDto(dto: CouponDto): Coupon {
  const numericId =
    typeof dto.id === "number"
      ? dto.id
      : Number.isInteger(Number(dto.id))
        ? Number(dto.id)
        : undefined;

  const rawDiscountValue = dto.discountValue ?? dto.discount_value;
  const discountValue =
    typeof rawDiscountValue === "number"
      ? rawDiscountValue
      : parseFloat(String(rawDiscountValue || 0)) || 0;

  const rawMaxDiscount = dto.maxDiscountAmount ?? dto.max_discount_amount;
  const maxDiscountAmount =
    rawMaxDiscount !== null &&
    rawMaxDiscount !== undefined &&
    rawMaxDiscount !== ""
      ? typeof rawMaxDiscount === "number"
        ? rawMaxDiscount
        : parseFloat(String(rawMaxDiscount)) || null
      : null;

  const rawMinOrder = dto.minOrderAmount ?? dto.min_order_amount;
  const minOrderAmount =
    typeof rawMinOrder === "number"
      ? rawMinOrder
      : parseFloat(String(rawMinOrder || 0)) || 0;

  const rawUsageLimitTotal = dto.usageLimitTotal ?? dto.usage_limit_total;
  const usageLimitTotal =
    rawUsageLimitTotal !== null &&
    rawUsageLimitTotal !== undefined &&
    rawUsageLimitTotal !== ""
      ? typeof rawUsageLimitTotal === "number"
        ? rawUsageLimitTotal
        : parseInt(String(rawUsageLimitTotal), 10) || null
      : null;

  const rawUsageLimitPerUser =
    dto.usageLimitPerUser ?? dto.usage_limit_per_user;
  const usageLimitPerUser =
    typeof rawUsageLimitPerUser === "number"
      ? rawUsageLimitPerUser
      : parseInt(String(rawUsageLimitPerUser || 1), 10) || 1;

  const rawUsedCount = dto.usedCount ?? dto.used_count;
  const usedCount =
    typeof rawUsedCount === "number"
      ? rawUsedCount
      : parseInt(String(rawUsedCount || 0), 10) || 0;

  const rawTotalSavings =
    dto.totalDiscountedAmount ?? dto.total_discounted_amount;
  const totalDiscountedAmount =
    typeof rawTotalSavings === "number"
      ? rawTotalSavings
      : parseFloat(String(rawTotalSavings || 0)) || 0;

  const isPublic = Boolean(
    dto.isPublic !== undefined
      ? dto.isPublic
      : dto.is_public !== undefined
        ? dto.is_public
        : true
  );

  const rawStartDate = dto.startDate || dto.start_date || "";
  const startDate = rawStartDate
    ? rawStartDate.split("T")[0].split(" ")[0]
    : "";

  const rawEndDate = dto.endDate || dto.end_date || "";
  const endDate = rawEndDate ? rawEndDate.split("T")[0].split(" ")[0] : "";

  const rawCreatedAt = dto.createdAt || dto.created_at || "";
  const createdAt = rawCreatedAt
    ? rawCreatedAt.split("T")[0].split(" ")[0]
    : "";

  let createdBy = "";
  if (dto.createdBy) {
    createdBy =
      typeof dto.createdBy === "object"
        ? (dto.createdBy as { name?: string }).name || ""
        : String(dto.createdBy);
  } else if (dto.created_by) {
    createdBy =
      typeof dto.created_by === "object"
        ? (dto.created_by as { name?: string }).name || ""
        : String(dto.created_by);
  }

  return {
    id: String(dto.id),
    numericId,
    code: dto.code || "",
    name: dto.name || "",
    description: dto.description || "",
    discountType: parseDiscountType(dto.discountType ?? dto.discount_type),
    discountValue,
    maxDiscountAmount,
    minOrderAmount,
    targetServices: parseTargetServices(
      dto.targetServices ?? dto.target_services
    ),
    targetUserType: parseTargetUserType(
      dto.targetUserType ?? dto.target_user_type
    ),
    usageLimitTotal,
    usageLimitPerUser,
    usedCount,
    status: parseCouponStatus(dto.status),
    startDate,
    endDate,
    isPublic,
    createdAt,
    createdBy,
    totalDiscountedAmount,
  };
}
