import { http } from "@/lib/api-client";
import type { AdminLoginApiResponse, AdminLoginRequest, AdminAuthSession } from "../types";
import { mapAdminDto } from "../utils/map-admin";

export async function loginAdmin(payload: AdminLoginRequest): Promise<AdminAuthSession> {
  const response = await http.post<AdminLoginApiResponse>(
    "/api/v1/admin/auth/login",
    payload
  );

  return {
    user: mapAdminDto(response.data.admin),
    accessToken: response.data.accessToken,
    tokenType: response.data.tokenType || "Bearer",
    accessExpiresIn: response.data.accessExpiresIn,
  };
}
