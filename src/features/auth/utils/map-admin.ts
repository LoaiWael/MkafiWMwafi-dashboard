import type { AdminDto } from "../types/api";
import type { AdminUser } from "../types";

export function formatAdminRoleLabel(roles?: string[], isSuperAdmin?: boolean): string {
  if (isSuperAdmin || roles?.includes("super-admin")) {
    return "مدير النظام العام";
  }
  if (roles?.includes("admin")) {
    return "مدير النظام";
  }
  if (roles?.length) {
    return roles[0];
  }
  return "مسؤول";
}

export function mapAdminDto(dto: AdminDto): AdminUser {
  return {
    id: String(dto.id),
    name: dto.name || "مدير النظام",
    email: dto.email,
    role: formatAdminRoleLabel(dto.roles, dto.isSuperAdmin),
    roles: dto.roles || [],
    permissions: dto.permissions || [],
    isActive: dto.isActive !== undefined ? Boolean(dto.isActive) : true,
    isSuperAdmin: Boolean(dto.isSuperAdmin),
    lastLoginAt: dto.lastLoginAt ?? null,
    createdAt: dto.createdAt,
  };
}
