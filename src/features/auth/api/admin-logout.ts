import { http } from "@/lib/api-client";
import { COOKIE_KEYS } from "@/lib/constants";
import { getCookie } from "@/lib/cookies";
import type { AdminLogoutApiResponse } from "../types";

export async function logoutAdminApi(): Promise<void> {
  const token = getCookie(COOKIE_KEYS.authToken);
  if (!token) {
    return;
  }
  await http.post<AdminLogoutApiResponse>("/api/v1/admin/auth/logout", undefined, {
    skipAuthErrorEvent: true,
  });
}

