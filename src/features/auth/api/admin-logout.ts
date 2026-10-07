import { http } from "@/lib/api-client";
import type { AdminLogoutApiResponse } from "../types";

export async function logoutAdminApi(): Promise<void> {
  await http.post<AdminLogoutApiResponse>("/api/v1/admin/auth/logout");
}
