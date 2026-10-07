import { http } from "@/lib/api-client";
import type { ApiResponse, UnitOptionDto, UnitOptionPayload } from "../types";

export async function fetchUnitTypes(): Promise<UnitOptionDto[]> {
  const response = await http.get<ApiResponse<UnitOptionDto[]>>("/api/v1/admin/unit-types");
  return response.data ?? [];
}

export async function fetchUnitTypeById(id: number): Promise<UnitOptionDto> {
  const response = await http.get<ApiResponse<UnitOptionDto>>(`/api/v1/admin/unit-types/${id}`);
  return response.data;
}

export async function createUnitType(payload: UnitOptionPayload): Promise<UnitOptionDto> {
  const response = await http.post<ApiResponse<UnitOptionDto>>("/api/v1/admin/unit-types", payload);
  return response.data;
}

export async function updateUnitType(id: number, payload: UnitOptionPayload): Promise<UnitOptionDto> {
  const response = await http.put<ApiResponse<UnitOptionDto>>(`/api/v1/admin/unit-types/${id}`, payload);
  return response.data;
}

export async function deleteUnitType(id: number): Promise<void> {
  await http.delete<ApiResponse<null>>(`/api/v1/admin/unit-types/${id}`);
}
