import type {
  AdminProfile,
  ProfileActivity,
  ProfilePermission,
} from "@/features/profile/types";

export const MAX_AVATAR_BYTES = 1_048_576;

export const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  name: "",
  role: "",
  avatarUrl: "",
  email: "",
  phone: "",
  joinedAt: "",
  permissions: [],
};

export const ADMIN_PERMISSIONS: readonly ProfilePermission[] = [
  { id: "contracts", label: "العقود" },
  { id: "properties", label: "العقارات" },
  { id: "customers", label: "العملاء" },
  { id: "employees", label: "الموظفين" },
  { id: "finance", label: "المالية" },
  { id: "reports", label: "التقارير" },
  { id: "notifications", label: "الإشعارات" },
  { id: "settings", label: "إعدادات النظام" },
  { id: "access", label: "الصلاحيات" },
];

export const ADMIN_ACTIVITY: readonly ProfileActivity[] = [];
