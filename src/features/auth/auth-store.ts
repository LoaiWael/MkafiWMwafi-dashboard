import { STORAGE_KEYS } from "@/lib/constants";
import { DEFAULT_ADMIN_PROFILE } from "@/features/profile/constants";
import type { AuthState, AuthUser, OtpCredentials, PasswordCredentials } from "@/features/auth/types";

export const DEMO_CREDENTIALS = {
  identifier: DEFAULT_ADMIN_PROFILE.email,
  password: "password123",
  phone: DEFAULT_ADMIN_PROFILE.phone,
  otpCode: "1234",
} as const;

function readStoredAuth(): { user: AuthUser | null; token: string | null } {
  if (typeof localStorage === "undefined") {
    return { user: null, token: null };
  }

  try {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    const rawUser = localStorage.getItem(STORAGE_KEYS.authUser);
    if (!token || !rawUser) {
      return { user: null, token: null };
    }
    const user = JSON.parse(rawUser) as AuthUser;
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

function createDefaultUser(name?: string, email?: string): AuthUser {
  return {
    id: "admin-01",
    name: name || DEFAULT_ADMIN_PROFILE.name,
    email: email || DEFAULT_ADMIN_PROFILE.email,
    phone: DEFAULT_ADMIN_PROFILE.phone,
    role: DEFAULT_ADMIN_PROFILE.role,
    avatarUrl: DEFAULT_ADMIN_PROFILE.avatarUrl,
    lastLoginAt: new Intl.DateTimeFormat("ar-SA", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date()),
  };
}

export async function loginWithPassword(credentials: PasswordCredentials): Promise<AuthUser> {
  state = { ...state, isLoading: true };
  emit();

  await new Promise((resolve) => setTimeout(resolve, 600));

  const trimmedIdentifier = credentials.identifier.trim().toLowerCase();
  const trimmedPassword = credentials.password.trim();

  if (!trimmedIdentifier || !trimmedPassword) {
    state = { ...state, isLoading: false };
    emit();
    throw new Error("يرجى إدخال البريد الإلكتروني أو رقم الجوال وكلمة المرور.");
  }

  if (trimmedPassword.length < 6) {
    state = { ...state, isLoading: false };
    emit();
    throw new Error("كلمة المرور يجب ألا تقل عن 6 خانات.");
  }

  const isPhone = /^(\+966|05|\d{8,})/.test(trimmedIdentifier.replace(/\s+/g, ""));
  const user = createDefaultUser(
    isPhone ? DEFAULT_ADMIN_PROFILE.name : trimmedIdentifier.includes("@") ? trimmedIdentifier.split("@")[0] : trimmedIdentifier,
    isPhone ? DEFAULT_ADMIN_PROFILE.email : trimmedIdentifier.includes("@") ? trimmedIdentifier : DEFAULT_ADMIN_PROFILE.email,
  );
  if (isPhone) {
    user.phone = trimmedIdentifier;
  }
  const token = `token-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  state = {
    isAuthenticated: true,
    user,
    token,
    isLoading: false,
  };

  if (credentials.rememberMe && typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.authToken, token);
    localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
  } else if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(STORAGE_KEYS.authToken, token);
    sessionStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
  }

  emit();
  return user;
}

export async function loginWithOtp(credentials: OtpCredentials): Promise<AuthUser> {
  state = { ...state, isLoading: true };
  emit();

  await new Promise((resolve) => setTimeout(resolve, 600));

  const cleanPhone = credentials.phone.replace(/\D/g, "");
  const cleanCode = credentials.code.trim();

  if (!cleanPhone || cleanPhone.length < 9) {
    state = { ...state, isLoading: false };
    emit();
    throw new Error("يرجى إدخال رقم جوال سعودي صحيح (مثال: 0501234567).");
  }

  if (cleanCode.length !== 4) {
    state = { ...state, isLoading: false };
    emit();
    throw new Error("رمز التحقق غير مكتمل. يرجى إدخال الرمز المكون من 4 أرقام.");
  }

  const user = createDefaultUser();
  const token = `otp-token-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  state = {
    isAuthenticated: true,
    user,
    token,
    isLoading: false,
  };

  if (credentials.rememberMe && typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.authToken, token);
    localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
  }

  emit();
  return user;
}

export function logoutAdmin(): void {
  state = {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
  };

  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.authUser);
  }
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEYS.authToken);
    sessionStorage.removeItem(STORAGE_KEYS.authUser);
  }

  emit();
}
