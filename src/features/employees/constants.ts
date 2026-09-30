import {
  Building2,
  FileText,
  Users,
  Wallet,
} from "lucide-react";
import type { DirectoryPerson, ProfilePermission } from "@/features/profile/types";

export interface EmployeeRecord extends DirectoryPerson {
  permissions: ProfilePermission[];
}

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

export const MOCK_EMPLOYEES: readonly EmployeeRecord[] = [
  {
    id: "emp-001",
    name: "نورة السالم",
    role: "مسؤول العقود",
    avatarUrl: "",
    email: "noura.salem@makfiwamufi.sa",
    phone: "0551234567",
    active: true,
    joinedAt: "3 مارس 2025",
    permissions: [CONTRACTS, PROPERTIES, CUSTOMERS],
  },
  {
    id: "emp-002",
    name: "خالد العتيبي",
    role: "مراجع مالي",
    avatarUrl: "",
    email: "khaled.otaibi@makfiwamufi.sa",
    phone: "0539876543",
    active: true,
    joinedAt: "18 يونيو 2025",
    permissions: [FINANCE, CONTRACTS],
  },
  {
    id: "emp-003",
    name: "لمى الحربي",
    role: "دعم العملاء",
    avatarUrl: "",
    email: "lama.harbi@makfiwamufi.sa",
    phone: "0541122334",
    active: false,
    joinedAt: "9 نوفمبر 2024",
    permissions: [CUSTOMERS],
  },
];

export function findEmployee(id: string | undefined) {
  if (!id) return undefined;
  return MOCK_EMPLOYEES.find((employee) => employee.id === id);
}
