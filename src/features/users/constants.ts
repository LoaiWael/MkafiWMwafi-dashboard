import type { DirectoryPerson } from "@/features/profile/types";

export interface CustomerRecord extends DirectoryPerson {
  /** ISO date used only to sort the directory; `joinedAt` stays the display label. */
  joinedAtIso: string;
  residentialContracts: number;
  commercialContracts: number;
  properties: number;
  units: number;
  /** Amount spent on the platform, in riyals. */
  amountSpent: number;
}

export const USER_STATUS_PARAM = "status";
export const USER_ROLE_PARAM = "role";
export const USER_DETAIL_TAB_PARAM = "tab";

export const USER_DETAIL_TAB = {
  facts: "facts",
  contracts: "contracts",
  properties: "properties",
} as const;

export type UserDetailTab =
  (typeof USER_DETAIL_TAB)[keyof typeof USER_DETAIL_TAB];

export const USER_DETAIL_TABS = [
  USER_DETAIL_TAB.facts,
  USER_DETAIL_TAB.contracts,
  USER_DETAIL_TAB.properties,
] as const;

export const USER_STATUS = {
  all: "all",
  unblocked: "unblocked",
  blocked: "blocked",
} as const;

export const USER_ROLE = "مستخدم";

export const MOCK_CUSTOMERS: readonly CustomerRecord[] = [
  {
    id: "usr-creator-default",
    name: "محمد عبد الله القحطاني",
    role: USER_ROLE,
    avatarUrl: "",
    email: "m.qahtani@example.com",
    phone: "0504111307",
    active: true,
    joinedAt: "2 فبراير 2025",
    joinedAtIso: "2025-02-02",
    residentialContracts: 8,
    commercialContracts: 5,
    properties: 3,
    units: 14,
    amountSpent: 12500,
  },
  {
    id: "usr-002",
    name: "سارة الدوسري",
    role: USER_ROLE,
    avatarUrl: "",
    email: "sara.dosari@example.com",
    phone: "0567788990",
    active: true,
    joinedAt: "21 أبريل 2026",
    joinedAtIso: "2026-04-21",
    residentialContracts: 2,
    commercialContracts: 0,
    properties: 0,
    units: 0,
    amountSpent: 850,
  },
  {
    id: "usr-003",
    name: "شركة أفق العقارية",
    role: USER_ROLE,
    avatarUrl: "",
    email: "hello@ofuq.sa",
    phone: "0112345678",
    active: true,
    joinedAt: "14 أغسطس 2024",
    joinedAtIso: "2024-08-14",
    residentialContracts: 4,
    commercialContracts: 11,
    properties: 6,
    units: 42,
    amountSpent: 28400,
  },
  {
    id: "usr-004",
    name: "عبدالرحمن الغامدي",
    role: USER_ROLE,
    avatarUrl: "",
    email: "a.alghamdi@example.com",
    phone: "0556677123",
    active: false,
    joinedAt: "9 نوفمبر 2024",
    joinedAtIso: "2024-11-09",
    residentialContracts: 1,
    commercialContracts: 0,
    properties: 0,
    units: 0,
    amountSpent: 350,
  },
  {
    id: "usr-005",
    name: "نورة العتيبي",
    role: USER_ROLE,
    avatarUrl: "",
    email: "noura.otaibi@example.com",
    phone: "0532211098",
    active: true,
    joinedAt: "18 يونيو 2025",
    joinedAtIso: "2025-06-18",
    residentialContracts: 6,
    commercialContracts: 2,
    properties: 2,
    units: 9,
    amountSpent: 6200,
  },
  {
    id: "usr-006",
    name: "مكتب أفق للوساطة",
    role: USER_ROLE,
    avatarUrl: "",
    email: "broker@ofuq.sa",
    phone: "0114455667",
    active: false,
    joinedAt: "27 ديسمبر 2024",
    joinedAtIso: "2024-12-27",
    residentialContracts: 3,
    commercialContracts: 4,
    properties: 1,
    units: 7,
    amountSpent: 4100,
  },
];

export function findCustomer(id: string | undefined) {
  if (!id) return undefined;
  return MOCK_CUSTOMERS.find((customer) => customer.id === id);
}
