export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl?: string;
  lastLoginAt?: string;
}

export type LoginMode = "password" | "otp";

export interface PasswordCredentials {
  identifier: string; // email or username
  password: string;
  rememberMe: boolean;
}

export interface OtpCredentials {
  phone: string;
  code: string;
  rememberMe: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
}
