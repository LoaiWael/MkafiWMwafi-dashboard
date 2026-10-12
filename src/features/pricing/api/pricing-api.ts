import { http } from "@/lib/api-client";
import type {
  ApiResponse,
  PricingPlanDto,
  PricingPlanPayload,
} from "../types";

export interface FetchPricingPlansParams {
  tab?: "all" | "short" | "medium" | "long" | string;
  contract_type?: "residential" | "commercial" | string;
}

/**
 * List all pricing plans from admin endpoint:
 * GET /api/v1/admin/pricing-plans
 */
export async function fetchPricingPlans(
  params?: FetchPricingPlansParams,
): Promise<PricingPlanDto[]> {
  const queryParams: Record<string, string | undefined> = {};
  if (params?.tab && params.tab !== "all") {
    queryParams.tab = params.tab;
  }
  if (params?.contract_type) {
    queryParams.contract_type = params.contract_type;
  }

  const response = await http.get<ApiResponse<PricingPlanDto[]>>(
    "/api/v1/admin/pricing-plans",
    { params: queryParams },
  );

  return response.data ?? [];
}

/**
 * Show a single pricing plan:
 * GET /api/v1/admin/pricing-plans/{id}
 */
export async function fetchPricingPlanById(
  id: string | number,
): Promise<PricingPlanDto> {
  const response = await http.get<ApiResponse<PricingPlanDto>>(
    `/api/v1/admin/pricing-plans/${id}`,
  );
  return response.data;
}

/**
 * Create a new pricing plan:
 * POST /api/v1/admin/pricing-plans
 */
export async function createPricingPlan(
  payload: PricingPlanPayload,
): Promise<PricingPlanDto> {
  const response = await http.post<ApiResponse<PricingPlanDto>>(
    "/api/v1/admin/pricing-plans",
    payload,
  );
  return response.data;
}

/**
 * Update an existing pricing plan:
 * PUT /api/v1/admin/pricing-plans/{id}
 */
export async function updatePricingPlan(
  id: string | number,
  payload: PricingPlanPayload,
): Promise<PricingPlanDto> {
  const response = await http.put<ApiResponse<PricingPlanDto>>(
    `/api/v1/admin/pricing-plans/${id}`,
    payload,
  );
  return response.data;
}

/**
 * Delete a pricing plan:
 * DELETE /api/v1/admin/pricing-plans/{id}
 */
export async function deletePricingPlan(
  id: string | number,
): Promise<void> {
  await http.delete<ApiResponse<null>>(
    `/api/v1/admin/pricing-plans/${id}`,
  );
}
