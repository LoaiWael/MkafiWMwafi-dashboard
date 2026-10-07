import { http } from "@/lib/api-client";
import type { AdminMeApiResponse, AdminUser } from "../types";
import { mapAdminDto } from "../utils/map-admin";

export async function fetchAdminMe(): Promise<AdminUser> {
  const response = await http.get<AdminMeApiResponse>(
    "/api/v1/admin/auth/me"
  );
  return mapAdminDto(response.data);
}
