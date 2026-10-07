import { http } from "@/lib/api-client";
import type { ApiResponse, UnitOptionDto, UnitOptionPayload } from "../types";

export async function fetchUnitAmenities(): Promise<UnitOptionDto[]> {
  const response = await http.get<ApiResponse<UnitOptionDto[]>>("/api/v1/admin/unit-amenities");
  return response.data ?? [];
}

export async function fetchUnitAmenityById(id: number): Promise<UnitOptionDto> {
  const response = await http.get<ApiResponse<UnitOptionDto>>(`/api/v1/admin/unit-amenities/${id}`);
  return response.data;
}

export async function createUnitAmenity(payload: UnitOptionPayload): Promise<UnitOptionDto> {
  const response = await http.post<ApiResponse<UnitOptionDto>>("/api/v1/admin/unit-amenities", payload);
  return response.data;
}

export async function updateUnitAmenity(id: number, payload: UnitOptionPayload): Promise<UnitOptionDto> {
  const response = await http.put<ApiResponse<UnitOptionDto>>(`/api/v1/admin/unit-amenities/${id}`, payload);
  return response.data;
}

export async function deleteUnitAmenity(id: number): Promise<void> {
  await http.delete<ApiResponse<null>>(`/api/v1/admin/unit-amenities/${id}`);
}
