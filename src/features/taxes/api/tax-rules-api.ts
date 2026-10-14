import { http } from "@/lib/api-client";
import type {
  ApiResponse,
  TaxRuleDto,
  TaxRulePayload,
  ToggleTaxActivePayload,
} from "../types";

/**
 * List all tax rules:
 * GET /api/v1/admin/tax-rules
 */
export async function fetchTaxRules(): Promise<TaxRuleDto[]> {
  const response = await http.get<ApiResponse<TaxRuleDto[]>>(
    "/api/v1/admin/tax-rules",
  );
  return response.data ?? [];
}

/**
 * Show a single tax rule:
 * GET /api/v1/admin/tax-rules/{id}
 */
export async function fetchTaxRuleById(
  id: string | number,
): Promise<TaxRuleDto> {
  const response = await http.get<ApiResponse<TaxRuleDto>>(
    `/api/v1/admin/tax-rules/${id}`,
  );
  return response.data;
}

/**
 * Create a new tax rule:
 * POST /api/v1/admin/tax-rules
 */
export async function createTaxRule(
  payload: TaxRulePayload,
): Promise<TaxRuleDto> {
  const response = await http.post<ApiResponse<TaxRuleDto>>(
    "/api/v1/admin/tax-rules",
    payload,
  );
  return response.data;
}

/**
 * Update an existing tax rule:
 * PUT /api/v1/admin/tax-rules/{id}
 */
export async function updateTaxRule(
  id: string | number,
  payload: TaxRulePayload,
): Promise<TaxRuleDto> {
  const response = await http.put<ApiResponse<TaxRuleDto>>(
    `/api/v1/admin/tax-rules/${id}`,
    payload,
  );
  return response.data;
}

/**
 * Toggle tax rule active status:
 * PATCH /api/v1/admin/tax-rules/{id}/active
 */
export async function toggleTaxRuleActive(
  id: string | number,
  isActive: boolean,
): Promise<TaxRuleDto | { id: number | string; isActive: boolean }> {
  const payload: ToggleTaxActivePayload = { is_active: isActive };
  const response = await http.patch<
    ApiResponse<TaxRuleDto | { id: number | string; isActive: boolean }>
  >(`/api/v1/admin/tax-rules/${id}/active`, payload);
  return response.data;
}

/**
 * Delete a tax rule (mandatory rules are blocked with 422):
 * DELETE /api/v1/admin/tax-rules/{id}
 */
export async function deleteTaxRule(id: string | number): Promise<void> {
  await http.delete<ApiResponse<null>>(`/api/v1/admin/tax-rules/${id}`);
}
