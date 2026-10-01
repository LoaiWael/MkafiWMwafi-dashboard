import type { LucideIcon } from "lucide-react";

export type PermissionModule =
  | "contracts"
  | "properties"
  | "customers"
  | "finance"
  | "employees"
  | "reports"
  | "settings";

export interface SystemPermission {
  id: string;
  key: string;
  name: string;
  description: string;
  module: PermissionModule;
  icon?: LucideIcon;
}

export interface PermissionModuleGroup {
  id: PermissionModule;
  label: string;
  description: string;
  icon: LucideIcon;
  permissions: readonly SystemPermission[];
}

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  permissionKeys: readonly string[];
  isSystem?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface RoleInput {
  name: string;
  description: string;
  permissionKeys: readonly string[];
}
