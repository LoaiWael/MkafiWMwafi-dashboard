import { getEmployees } from "@/features/employees/employees-store";
import { MOCK_ROLES } from "./constants";
import type { RoleInput, RoleRecord } from "./types";

let roles: readonly RoleRecord[] = MOCK_ROLES;

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function getRoles(): readonly RoleRecord[] {
  return roles;
}

export function subscribeRoles(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getRoleById(id: string): RoleRecord | undefined {
  return roles.find((role) => role.id === id);
}

export function getRoleEmployeesCount(roleName: string): number {
  const employees = getEmployees();
  return employees.filter((emp) => emp.role === roleName).length;
}

export function getRoleEmployees(roleName: string) {
  const employees = getEmployees();
  return employees.filter((emp) => emp.role === roleName);
}

function roleNameTaken(name: string, exceptId?: string) {
  const normalized = name.trim().toLowerCase();
  return roles.some(
    (role) =>
      role.id !== exceptId && role.name.trim().toLowerCase() === normalized,
  );
}

function nextRoleId() {
  const max = roles.reduce((highest, role) => {
    const value = Number(role.id.replace(/^role-/, ""));
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 0);
  return `role-${String(max + 1).padStart(3, "0")}`;
}

function formatTodayArabic() {
  return new Intl.DateTimeFormat("ar", {
    numberingSystem: "latn",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export function createRole(input: RoleInput): { error?: string; role?: RoleRecord } {
  const trimmedName = input.name.trim();
  if (trimmedName.length < 2) {
    return { error: "اسم الدور يجب أن يتكون من حرفين على الأقل." };
  }
  if (roleNameTaken(trimmedName)) {
    return { error: "يوجد دور وظيفي مسجل بهذا الاسم بالفعل." };
  }
  if (!input.permissionKeys || input.permissionKeys.length === 0) {
    return { error: "يجب تحديد صلاحية واحدة على الأقل لهذا الدور." };
  }

  const id = nextRoleId();
  const newRole: RoleRecord = {
    id,
    name: trimmedName,
    description: input.description.trim(),
    permissionKeys: input.permissionKeys,
    isSystem: false,
    createdAt: formatTodayArabic(),
  };

  roles = [newRole, ...roles];
  emit();
  return { role: newRole };
}

export function updateRole(
  id: string,
  input: RoleInput,
): { error?: string; role?: RoleRecord } {
  const current = roles.find((role) => role.id === id);
  if (!current) {
    return { error: "الدور غير موجود في النظام." };
  }

  const trimmedName = input.name.trim();
  if (trimmedName.length < 2) {
    return { error: "اسم الدور يجب أن يتكون من حرفين على الأقل." };
  }
  if (roleNameTaken(trimmedName, id)) {
    return { error: "يوجد دور وظيفي آخر مسجل بهذا الاسم." };
  }
  if (!input.permissionKeys || input.permissionKeys.length === 0) {
    return { error: "يجب تحديد صلاحية واحدة على الأقل لهذا الدور." };
  }

  const updatedRole: RoleRecord = {
    ...current,
    name: trimmedName,
    description: input.description.trim(),
    permissionKeys: input.permissionKeys,
    updatedAt: formatTodayArabic(),
  };

  roles = roles.map((r) => (r.id === id ? updatedRole : r));
  emit();
  return { role: updatedRole };
}

export function deleteRole(id: string): { error?: string; success?: boolean } {
  const current = roles.find((role) => role.id === id);
  if (!current) {
    return { error: "الدور غير موجود في النظام." };
  }
  if (current.isSystem) {
    return { error: "لا يمكن حذف الأدوار الأساسية للنظام." };
  }

  const assignedCount = getRoleEmployeesCount(current.name);
  if (assignedCount > 0) {
    return {
      error: `لا يمكن حذف هذا الدور لوجود (${assignedCount}) موظف مرتبطين به حالياً. قم بنقل الموظفين لدور آخر أولاً.`,
    };
  }

  roles = roles.filter((role) => role.id !== id);
  emit();
  return { success: true };
}
