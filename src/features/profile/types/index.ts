import type { LucideIcon } from "lucide-react";

export * from "./api";

export interface ProfileIdentity {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface DirectoryPerson extends ProfileIdentity {
  id: string;
  email: string;
  phone: string;
  active: boolean;
  joinedAt: string;
}

export interface AdminProfile extends ProfileIdentity {
  id?: string;
  email: string;
  phone: string;
  joinedAt: string;
  lastLoginAt?: string | null;
  isActive?: boolean;
  isSuperAdmin?: boolean;
  roles?: string[];
  permissions?: string[];
}

export interface ProfilePermission {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

export interface ProfileActivity {
  id: string;
  action: string;
  detail: string;
  at: string;
}

export interface ProfileFact {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  ltr?: boolean;
  copyable?: boolean;
}
