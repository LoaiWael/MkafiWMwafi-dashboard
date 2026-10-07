import { http } from "@/lib/api-client";
import type { ApiResponse, UnitOptionDto, UnitOptionPayload } from "../types";

export async function fetchFloors(): Promise<UnitOptionDto[]> {
  const response = await http.get<ApiResponse<UnitOptionDto[]>>("/api/v1/admin/floors");
  return response.data ?? [];
}

export async function fetchFloorById(id: number): Promise<UnitOptionDto> {
  const response = await http.get<ApiResponse<UnitOptionDto>>(`/api/v1/admin/floors/${id}`);
  return response.data;
}

export async function createFloor(payload: UnitOptionPayload): Promise<UnitOptionDto> {
  const response = await http.post<ApiResponse<UnitOptionDto>>("/api/v1/admin/floors", payload);
  return response.data;
}

export async function updateFloor(id: number, payload: UnitOptionPayload): Promise<UnitOptionDto> {
  const response = await http.put<ApiResponse<UnitOptionDto>>(`/api/v1/admin/floors/${id}`, payload);
  return response.data;
}

export async function deleteFloor(id: number): Promise<void> {
  await http.delete<ApiResponse<null>>(`/api/v1/admin/floors/${id}`);
}
