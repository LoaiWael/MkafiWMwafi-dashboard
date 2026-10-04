import { useSyncExternalStore } from "react";
import {
  getAuthState,
  loginWithOtp,
  loginWithPassword,
  logoutAdmin,
  subscribeAuthState,
} from "@/features/auth/auth-store";
import type { OtpCredentials, PasswordCredentials } from "@/features/auth/types";

export function useAuth() {
  const auth = useSyncExternalStore(subscribeAuthState, getAuthState, getAuthState);

  return {
    ...auth,
    loginWithPassword: (creds: PasswordCredentials) => loginWithPassword(creds),
    loginWithOtp: (creds: OtpCredentials) => loginWithOtp(creds),
    logout: () => logoutAdmin(),
  };
}
