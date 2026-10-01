import {
  Building2,
  FileText,
  Users,
  Wallet,
} from "lucide-react";
import type {
  DirectoryPerson,
  ProfileActivity,
  ProfilePermission,
} from "@/features/profile/types";

export interface EmployeeRecord extends DirectoryPerson {
  password: string;
  permissions: ProfilePermission[];
  activity: readonly ProfileActivity[];
  /** ISO date used only to sort the directory; `joinedAt` stays the display label. */
  joinedAtIso: string;
}

export const EMPLOYEE_STATUS_PARAM = "status";
export const EMPLOYEE_ROLE_PARAM = "role";

export const EMPLOYEE_STATUS = {
  all: "all",
  active: "active",
  inactive: "inactive",
} as const;

export const MIN_EMPLOYEE_PASSWORD_LENGTH = 8;

const CONTRACTS: ProfilePermission = {
  id: "contracts",
  label: "العقود",
  description: "متابعة العقود وتحديث حالات التوثيق.",
  icon: FileText,
};

const PROPERTIES: ProfilePermission = {
  id: "properties",
  label: "العقارات",
  description: "مراجعة العقارات والوحدات المرتبطة.",
  icon: Building2,
};

const CUSTOMERS: ProfilePermission = {
  id: "customers",
  label: "العملاء",
  description: "الاطلاع على بيانات أطراف العقد.",
  icon: Users,
};

const FINANCE: ProfilePermission = {
  id: "finance",
  label: "المدفوعات",
  description: "متابعة حالة السداد دون تعديل التسعير.",
  icon: Wallet,
};

export const EMPLOYEE_ROLES = [
  "مدير النظام",
  "مدير العمليات",
  "مسؤول توثيق",
  "مدقق عقود",
  "دعم فني",
  "مسؤول العقود",
  "مراجع مالي",
  "دعم العملاء",
] as const;

const EMPLOYEE_ROLE_PERMISSIONS: Record<string, readonly ProfilePermission[]> = {
  "مدير النظام": [CONTRACTS, PROPERTIES, CUSTOMERS, FINANCE],
  "مدير العمليات": [CONTRACTS, PROPERTIES, CUSTOMERS],
  "مسؤول توثيق": [CONTRACTS, PROPERTIES],
  "مدقق عقود": [CONTRACTS],
  "دعم فني": [CUSTOMERS],
  "مسؤول العقود": [CONTRACTS, PROPERTIES, CUSTOMERS],
  "مراجع مالي": [FINANCE, CONTRACTS],
  "دعم العملاء": [CUSTOMERS],
};

export function permissionsForRole(role: string) {
  return EMPLOYEE_ROLE_PERMISSIONS[role] ?? [];
}

export const MOCK_EMPLOYEES: readonly EmployeeRecord[] = [
  {
    id: "emp-001",
    name: "نورة السالم",
    role: "مسؤول العقود",
    avatarUrl: "",
    email: "noura.salem@makfiwamufi.sa",
    phone: "0551234567",
    password: "Mkfi@001",
    active: true,
    joinedAt: "3 مارس 2025",
    joinedAtIso: "2025-03-03",
    permissions: [CONTRACTS, PROPERTIES, CUSTOMERS],
    activity: [
      {
        id: "emp-001-act-1",
        action: "مراجعة عقد",
        detail: "الاطلاع على عقد إيجار سكني وتحديث حالة التوثيق.",
        at: "30 سبتمبر 2026، 10:20 ص",
      },
      {
        id: "emp-001-act-2",
        action: "تسجيل الدخول",
        detail: "تم فتح لوحة التحكم من هذا الحساب.",
        at: "30 سبتمبر 2026، 09:05 ص",
      },
    ],
  },
  {
    id: "emp-002",
    name: "خالد العتيبي",
    role: "مراجع مالي",
    avatarUrl: "",
    email: "khaled.otaibi@makfiwamufi.sa",
    phone: "0539876543",
    password: "Mkfi@002",
    active: true,
    joinedAt: "18 يونيو 2025",
    joinedAtIso: "2025-06-18",
    permissions: [FINANCE, CONTRACTS],
    activity: [
      {
        id: "emp-002-act-1",
        action: "مراجعة دفعة",
        detail: "متابعة حالة سداد عقد تجاري دون تعديل التسعير.",
        at: "29 سبتمبر 2026، 02:15 م",
      },
      {
        id: "emp-002-act-2",
        action: "تسجيل الدخول",
        detail: "تم فتح لوحة التحكم من هذا الحساب.",
        at: "29 سبتمبر 2026، 08:40 ص",
      },
    ],
  },
  {
    id: "emp-003",
    name: "لمى الحربي",
    role: "دعم العملاء",
    avatarUrl: "",
    email: "lama.harbi@makfiwamufi.sa",
    phone: "0541122334",
    password: "Mkfi@003",
    active: false,
    joinedAt: "9 نوفمبر 2024",
    joinedAtIso: "2024-11-09",
    permissions: [CUSTOMERS],
    activity: [
      {
        id: "emp-003-act-1",
        action: "متابعة عميل",
        detail: "الاطلاع على بيانات طرف في عقد إيجار.",
        at: "12 نوفمبر 2024، 11:30 ص",
      },
    ],
  },
  {
    id: "emp-004",
    name: "فهد الدوسري",
    role: "مسؤول العقود",
    avatarUrl: "",
    email: "fahad.dosari@makfiwamufi.sa",
    phone: "0556677889",
    password: "Mkfi@004",
    active: true,
    joinedAt: "12 يناير 2026",
    joinedAtIso: "2026-01-12",
    permissions: [CONTRACTS, PROPERTIES],
    activity: [
      {
        id: "emp-004-act-1",
        action: "مراجعة عقار",
        detail: "الاطلاع على وحدات عقار سكني مرتبطة بعقد قيد التوثيق.",
        at: "28 سبتمبر 2026، 04:10 م",
      },
      {
        id: "emp-004-act-2",
        action: "تحديث حالة عقد",
        detail: "تسجيل تقدم توثيق عقد إيجار تجاري.",
        at: "28 سبتمبر 2026، 01:25 م",
      },
    ],
  },
  {
    id: "emp-005",
    name: "سارة القحطاني",
    role: "مراجع مالي",
    avatarUrl: "",
    email: "sarah.qahtani@makfiwamufi.sa",
    phone: "0567788990",
    password: "Mkfi@005",
    active: true,
    joinedAt: "4 أبريل 2025",
    joinedAtIso: "2025-04-04",
    permissions: [FINANCE],
    activity: [
      {
        id: "emp-005-act-1",
        action: "مراجعة تقرير مدفوعات",
        detail: "الاطلاع على حالة السداد لعقود اليوم السابق.",
        at: "27 سبتمبر 2026، 09:50 ص",
      },
    ],
  },
  {
    id: "emp-006",
    name: "عبدالله الشهري",
    role: "دعم العملاء",
    avatarUrl: "",
    email: "abdullah.shehri@makfiwamufi.sa",
    phone: "0503344556",
    password: "Mkfi@006",
    active: false,
    joinedAt: "27 ديسمبر 2024",
    joinedAtIso: "2024-12-27",
    permissions: [CUSTOMERS, CONTRACTS],
    activity: [
      {
        id: "emp-006-act-1",
        action: "تسجيل الدخول",
        detail: "آخر دخول مسجل قبل إيقاف الحساب.",
        at: "20 ديسمبر 2024، 03:05 م",
      },
    ],
  },
  {
    id: "emp-007",
    name: "سعد الشمري",
    role: "مسؤول العقود",
    avatarUrl: "",
    email: "saad.shammari@makfiwamufi.sa",
    phone: "0550001111",
    password: "Mkfi@007",
    active: true,
    joinedAt: "1 يناير 2026",
    joinedAtIso: "2026-01-01",
    permissions: [CONTRACTS, PROPERTIES],
    activity: [],
  },
  {
    id: "emp-008",
    name: "رغد الزهراني",
    role: "مسؤول العقود",
    avatarUrl: "",
    email: "raghad.zahrani@makfiwamufi.sa",
    phone: "0550002222",
    password: "Mkfi@008",
    active: true,
    joinedAt: "2 يناير 2026",
    joinedAtIso: "2026-01-02",
    permissions: [CONTRACTS, PROPERTIES],
    activity: [],
  },
  {
    id: "emp-009",
    name: "أحمد المطيري",
    role: "مسؤول العقود",
    avatarUrl: "",
    email: "ahmad.mutairi@makfiwamufi.sa",
    phone: "0550003333",
    password: "Mkfi@009",
    active: true,
    joinedAt: "3 يناير 2026",
    joinedAtIso: "2026-01-03",
    permissions: [CONTRACTS, PROPERTIES],
    activity: [],
  },
];

