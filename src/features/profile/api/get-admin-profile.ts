import { http } from "@/lib/api-client";
import type { AdminMeApiResponse, AdminProfile } from "../types";
import { mapAdminProfileDto } from "../utils/map-admin-profile";

/**
 * Fetch current admin profile from /api/v1/admin/auth/me
 */
export async function fetchAdminProfile(): Promise<AdminProfile> {
  const response = await http.get<AdminMeApiResponse>("/api/v1/admin/auth/me");
  return mapAdminProfileDto(response.data);
}
