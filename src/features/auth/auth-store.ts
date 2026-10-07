import { COOKIE_KEYS, STORAGE_KEYS } from "@/lib/constants";
import { getCookie, removeCookie, setCookie } from "@/lib/cookies";
import { loginAdmin } from "./api/admin-login";
import { logoutAdminApi } from "./api/admin-logout";
import type { AdminUser, AuthState, PasswordCredentials } from "./types";

/**
 * Clean up any legacy or lingering auth data from localStorage and sessionStorage
 */
export function purgeLocalStorageAuth(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.authUser);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  } catch {
    // Ignore storage access errors
  }

  try {
    sessionStorage.removeItem(STORAGE_KEYS.authToken);
    sessionStorage.removeItem(STORAGE_KEYS.authUser);
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("authUser");
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
  } catch {
    // Ignore storage access errors
  }
}

// Proactively purge local storage auth on script load
purgeLocalStorageAuth();

function readStoredAuth(): { user: AdminUser | null; token: string | null } {
  if (typeof document === "undefined") {
    return { user: null, token: null };
  }

  try {
    const token = getCookie(COOKIE_KEYS.authToken);
    const rawUser = getCookie(COOKIE_KEYS.authUser);

    if (!token || !rawUser) {
      return { user: null, token: null };
    }
    const user = JSON.parse(rawUser) as AdminUser;
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
}

const initial = readStoredAuth();

let state: AuthState = {
  isAuthenticated: Boolean(initial.token && initial.user),
  user: initial.user,
  token: initial.token,
  isLoading: false,
};

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function getAuthState(): AuthState {
  return state;
}

export function subscribeAuthState(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setAuthUser(user: AdminUser): void {
  state = {
    ...state,
    user,
  };

  try {
    setCookie(COOKIE_KEYS.authUser, JSON.stringify(user), {
      days: 30,
      path: "/",
    });
  } catch {
    // Ignore cookie errors
  }

  purgeLocalStorageAuth();
  emit();
}

export async function loginWithPassword(credentials: PasswordCredentials): Promise<AdminUser> {
  state = { ...state, isLoading: true };
  emit();

  try {
    const trimmedIdentifier = credentials.identifier.trim();
    const trimmedPassword = credentials.password;

    if (!trimmedIdentifier || !trimmedPassword) {
      throw new Error("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
    }

    const session = await loginAdmin({
      email: trimmedIdentifier,
      password: trimmedPassword,
    });

    state = {
      isAuthenticated: true,
      user: session.user,
      token: session.accessToken,
      isLoading: false,
    };

    const remember = credentials.rememberMe !== false;
    const cookieOptions = {
      path: "/",
      days: remember ? 30 : undefined,
    };

    setCookie(COOKIE_KEYS.authToken, session.accessToken, cookieOptions);
    setCookie(COOKIE_KEYS.authUser, JSON.stringify(session.user), cookieOptions);

    // Make sure local storage has no auth data
    purgeLocalStorageAuth();

    emit();
    return session.user;
  } catch (error) {
    state = { ...state, isLoading: false };
    emit();
    throw error;
  }
}

export function logoutAdmin(): void {
  // Fire-and-forget backend revocation so local logout is never blocked
  logoutAdminApi().catch(() => {
    // Ignore revocation network failures
  });

  state = {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
  };

  removeCookie(COOKIE_KEYS.authToken, "/");
  removeCookie(COOKIE_KEYS.authUser, "/");

  purgeLocalStorageAuth();

  emit();
}

if (typeof window !== "undefined") {
  window.addEventListener("unauthorized-api-error", () => {
    logoutAdmin();
  });
}
