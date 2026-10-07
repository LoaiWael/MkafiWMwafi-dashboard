import type { AdminMeDto } from "../types/api";
import type { AdminProfile } from "../types";

export function formatProfileDate(dateStr?: string | null): string {
  if (!dateStr) {
    return "—";
  }
  try {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      return dateStr;
    }
    return new Intl.DateTimeFormat("ar-SA", {
      dateStyle: "medium",
    }).format(parsed);
  } catch {
    return dateStr;
  }
}

export function formatRoleLabel(roles?: string[], isSuperAdmin?: boolean): string {
  if (isSuperAdmin || roles?.includes("super-admin")) {
    return "مدير النظام العام";
  }
  if (roles?.includes("admin")) {
    return "مدير النظام";
  }
  if (roles?.length) {
    return roles[0];
  }
  return "مدير النظام";
}

export function mapAdminProfileDto(dto: AdminMeDto): AdminProfile {
  return {
    id: String(dto.id),
    name: dto.name || "",
    email: dto.email || "",
    phone: "",
    role: formatRoleLabel(dto.roles, dto.isSuperAdmin),
    roles: dto.roles || [],
    permissions: dto.permissions || [],
    isActive: dto.isActive !== undefined ? Boolean(dto.isActive) : true,
    isSuperAdmin: Boolean(dto.isSuperAdmin),
    avatarUrl: "",
    lastLoginAt: dto.lastLoginAt ?? null,
    joinedAt: formatProfileDate(dto.createdAt),
  };
}
