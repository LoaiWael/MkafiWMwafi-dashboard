/**
 * Admin Auth API Data Transfer Objects (DTOs)
 * Matches backend contracts in MakfiwaMufi-Backend.postman_collection.json
 */

export interface AdminDto {
  id: number | string;
  name: string;
  email: string;
  isActive?: boolean;
  isSuperAdmin?: boolean;
  lastLoginAt?: string | null;
  roles?: string[];
  permissions?: string[];
  createdAt?: string;
}

export interface AdminLoginDataDto {
  admin: AdminDto;
  accessToken: string;
  tokenType: string;
  accessExpiresIn?: number;
}

export interface AdminLoginApiResponse {
  success: boolean;
  message: string;
  data: AdminLoginDataDto;
}

export interface AdminMeApiResponse {
  success: boolean;
  message: string;
  data: AdminDto;
}

export interface AdminLogoutApiResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}
