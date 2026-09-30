import type {
  AdminProfile,
  ProfileActivity,
  ProfilePermission,
} from "@/features/profile/types";

export const MAX_AVATAR_BYTES = 1_048_576;

export const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  name: "عوض",
  role: "مدير النظام",
  avatarUrl: "",
  email: "awad@makfiwamufi.sa",
  phone: "0504111307",
  joinedAt: "12 يناير 2024",
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

export const ADMIN_ACTIVITY: readonly ProfileActivity[] = [
  {
    id: "act-1",
    action: "تسجيل الدخول",
    detail: "تم فتح لوحة التحكم من هذا الحساب.",
    at: "30 سبتمبر 2026، 09:12 ص",
  },
  {
    id: "act-2",
    action: "مراجعة عقد",
    detail: "الاطلاع على تفاصيل عقد إيجار سكني وتحديث حالته.",
    at: "29 سبتمبر 2026، 04:40 م",
  },
  {
    id: "act-3",
    action: "تحديث إعدادات المنصة",
    detail: "حفظ بيانات التواصل والهوية البصرية في إعدادات النظام.",
    at: "28 سبتمبر 2026، 11:05 ص",
  },
  {
    id: "act-4",
    action: "عرض تقرير يومي",
    detail: "مراجعة تقرير العقود والمدفوعات لليوم السابق.",
    at: "27 سبتمبر 2026، 08:30 ص",
  },
];
