export * from "./api";

/**
 * Clean UI Domain Models for Authenticated Admin User & Session
 */
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  isSuperAdmin: boolean;
  avatarUrl?: string;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export type AuthUser = AdminUser;

export interface AdminAuthSession {
  user: AdminUser;
  accessToken: string;
  tokenType: string;
  accessExpiresIn?: number;
}

export interface PasswordCredentials {
  identifier: string; // Email or identifier
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
}
