import { useSyncExternalStore } from "react";
import {
  getAuthState,
  loginWithPassword,
  logoutAdmin,
  subscribeAuthState,
} from "../auth-store";
import type { PasswordCredentials } from "../types";

export function useAuth() {
  const auth = useSyncExternalStore(subscribeAuthState, getAuthState, getAuthState);

  return {
    ...auth,
    loginWithPassword: (creds: PasswordCredentials) => loginWithPassword(creds),
    logout: () => logoutAdmin(),
  };
}
