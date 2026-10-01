import { MOCK_CONTRACTS } from "@/features/contracts/constants";
import { MOCK_PROPERTIES } from "@/features/properties/constants";
import type { ProfileActivity } from "@/features/profile/types";
import type { Contract } from "@/features/contracts/types";
import type { Property } from "@/features/properties/types";

const CUSTOMER_CONTRACT_IDS: Record<string, readonly string[]> = {
  "usr-creator-default": ["cnt-001", "cnt-002", "cnt-004"],
  "usr-002": ["cnt-003", "cnt-005"],
  "usr-003": ["cnt-007"],
  "usr-004": ["cnt-006"],
  "usr-005": ["cnt-008"],
  "usr-006": [],
};

const CUSTOMER_PROPERTY_IDS: Record<string, readonly string[]> = {
  "usr-creator-default": [
    "re-residential-narjis",
    "re-residential-aqeeq-villa",
  ],
  "usr-002": [],
  "usr-003": ["re-commercial-yasmin-plaza", "re-commercial-olaya-tower"],
  "usr-004": [],
  "usr-005": ["re-residential-malqa-apartments"],
  "usr-006": ["re-commercial-remal-warehouses"],
};

const CUSTOMER_ACTIVITY: Record<string, readonly ProfileActivity[]> = {
  "usr-creator-default": [
    {
      id: "usr-creator-default-act-1",
      action: "إنشاء عقد",
      detail: "بدء توثيق عقد إيجار سكني وربطه بشبكة إيجار.",
      at: "30 سبتمبر 2026، 11:20 ص",
    },
    {
      id: "usr-creator-default-act-2",
      action: "إضافة عقار",
      detail: "تسجيل عمارة النرجس السكنية وبيانات الصك الإلكتروني.",
      at: "28 سبتمبر 2026، 04:10 م",
    },
  ],
  "usr-002": [
    {
      id: "usr-002-act-1",
      action: "موافقة على عقد",
      detail: "اعتماد عقد إيجار سكني عبر نفاذ.",
      at: "21 أبريل 2026، 03:40 م",
    },
  ],
  "usr-003": [
    {
      id: "usr-003-act-1",
      action: "تحديث عقار",
      detail: "تعديل بيانات مجمع الياسمين التجاري ووحدات الإشغال.",
      at: "12 سبتمبر 2026، 09:55 ص",
    },
    {
      id: "usr-003-act-2",
      action: "سداد رسوم",
      detail: "إتمام سداد رسوم توثيق عقد تجاري.",
      at: "2 سبتمبر 2026، 01:15 م",
    },
  ],
  "usr-004": [],
  "usr-005": [
    {
      id: "usr-005-act-1",
      action: "إضافة عقار",
      detail: "تسجيل شقق الملقا وربط صك الملكية.",
      at: "18 يونيو 2025، 10:05 ص",
    },
  ],
  "usr-006": [
    {
      id: "usr-006-act-1",
      action: "إيقاف الحساب",
      detail: "إيقاف حساب الوسيط بعد مراجعة بيانات الترخيص.",
      at: "15 يناير 2025، 12:30 م",
    },
  ],
};

export function contractsForCustomer(customerId: string): Contract[] {
  const ids = new Set(CUSTOMER_CONTRACT_IDS[customerId] ?? []);
  return MOCK_CONTRACTS.filter((contract) => ids.has(contract.id));
}

export function propertiesForCustomer(customer: {
  id: string;
  email: string;
}): Property[] {
  const ids = new Set(CUSTOMER_PROPERTY_IDS[customer.id] ?? []);
  return MOCK_PROPERTIES.filter(
    (property) =>
      ids.has(property.id) ||
      property.createdBy?.id === customer.id ||
      property.createdBy?.email === customer.email,
  );
}

export function activityForCustomer(
  customerId: string,
): readonly ProfileActivity[] {
  return CUSTOMER_ACTIVITY[customerId] ?? [];
}
