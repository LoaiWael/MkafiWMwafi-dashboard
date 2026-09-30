import type { DirectoryPerson } from "@/features/profile/types";

export const MOCK_CUSTOMERS: readonly DirectoryPerson[] = [
  {
    id: "usr-creator-default",
    name: "محمد عبد الله القحطاني",
    role: "وسيط عقاري",
    avatarUrl: "",
    email: "m.qahtani@example.com",
    phone: "0504111307",
    active: true,
    joinedAt: "2 فبراير 2025",
  },
  {
    id: "usr-002",
    name: "سارة الدوسري",
    role: "مستأجر",
    avatarUrl: "",
    email: "sara.dosari@example.com",
    phone: "0567788990",
    active: true,
    joinedAt: "21 أبريل 2026",
  },
  {
    id: "usr-003",
    name: "شركة أفق العقارية",
    role: "مؤجر",
    avatarUrl: "",
    email: "hello@ofuq.sa",
    phone: "0112345678",
    active: true,
    joinedAt: "14 أغسطس 2024",
  },
];

export function findCustomer(id: string | undefined) {
  if (!id) return undefined;
  return MOCK_CUSTOMERS.find((customer) => customer.id === id);
}
