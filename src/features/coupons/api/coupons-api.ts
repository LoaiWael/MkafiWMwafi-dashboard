import { http } from "@/lib/api-client";
import type {
  ApiResponse,
  CouponDto,
  CouponListParams,
  CouponPayload,
  CouponStatus,
  CouponStatusPayload,
} from "../types";

/**
 * List all admin coupons:
 * GET /api/v1/admin/coupons
 */
export async function fetchCoupons(
  params?: CouponListParams
): Promise<CouponDto[]> {
  const queryParams: Record<string, string | number | undefined> = {};

  if (params?.search && params.search.trim() !== "") {
    queryParams.search = params.search.trim();
  }
  if (params?.status && params.status !== "all") {
    queryParams.status = params.status;
  }
  if (params?.service && params.service !== "all") {
    queryParams.service = params.service;
  }
  if (params?.discount_type && params.discount_type !== "all") {
    queryParams.discount_type = params.discount_type;
  }
  if (params?.per_page) {
    queryParams.per_page = params.per_page;
  }
  if (params?.page) {
    queryParams.page = params.page;
  }

  const response = await http.get<
    ApiResponse<CouponDto[] | { data: CouponDto[] }>
  >("/api/v1/admin/coupons", {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  });

  const responseData = response.data;
  if (Array.isArray(responseData)) {
    return responseData;
  }
  if (responseData && typeof responseData === "object" && "data" in responseData) {
    if (Array.isArray(responseData.data)) {
      return responseData.data;
    }
  }

  return [];
}

/**
 * Show a single coupon by ID:
 * GET /api/v1/admin/coupons/{id}
 */
export async function fetchCouponById(
  id: string | number
): Promise<CouponDto> {
  const response = await http.get<ApiResponse<CouponDto>>(
    `/api/v1/admin/coupons/${id}`
  );
  return response.data;
}

/**
 * Create a new coupon:
 * POST /api/v1/admin/coupons
 */
export async function createCoupon(
  payload: CouponPayload
): Promise<CouponDto | { id: number | string; code: string }> {
  const response = await http.post<
    ApiResponse<CouponDto | { id: number | string; code: string }>
  >("/api/v1/admin/coupons", payload);
  return response.data;
}

/**
 * Update an existing coupon:
 * PUT /api/v1/admin/coupons/{id}
 */
export async function updateCoupon(
  id: string | number,
  payload: CouponPayload
): Promise<CouponDto | { id: number | string }> {
  const response = await http.put<
    ApiResponse<CouponDto | { id: number | string }>
  >(`/api/v1/admin/coupons/${id}`, payload);
  return response.data;
}

/**
 * Update coupon status:
 * PATCH /api/v1/admin/coupons/{id}/status
 */
export async function updateCouponStatus(
  id: string | number,
  status: CouponStatus
): Promise<{ id: number | string; status: CouponStatus }> {
  const payload: CouponStatusPayload = { status };
  const response = await http.patch<
    ApiResponse<{ id: number | string; status: CouponStatus }>
  >(`/api/v1/admin/coupons/${id}/status`, payload);
  return response.data;
}

/**
 * Delete a coupon:
 * DELETE /api/v1/admin/coupons/{id}
 */
export async function deleteCoupon(id: string | number): Promise<void> {
  await http.delete<ApiResponse<null>>(`/api/v1/admin/coupons/${id}`);
}
