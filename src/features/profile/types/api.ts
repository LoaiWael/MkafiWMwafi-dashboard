/**
 * Admin Me API DTO for Profile feature
 * Matches GET /api/v1/admin/auth/me response
 */

export interface AdminMeDto {
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

export interface AdminMeApiResponse {
  success: boolean;
  message: string;
  data: AdminMeDto;
}
