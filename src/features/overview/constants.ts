import {
  Building2,
  ClipboardList,
  FileText,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

export const OVERVIEW_STATS = [
  {
    id: "residential-contracts",
    label: "العقود السكنية",
    description: "عقود الإيجار الفردي والعائلي المتوافقة مع حساب المواطن والضمان المطور.",
    href: `${ROUTES.contracts}?type=residential`,
    icon: FileText,
  },
  {
    id: "commercial-contracts",
    label: "العقود التجارية",
    description: "عقود المحلات والمكاتب والمستودعات والمنشآت الصناعية.",
    href: `${ROUTES.contracts}?type=commercial`,
    icon: Store,
  },
  {
    id: "requests",
    label: "طلبات التوثيق",
    description: "طلبات قيد المراجعة من استلام المستندات حتى تسليم العقد.",
    href: ROUTES.requests,
    icon: ClipboardList,
  },
  {
    id: "properties",
    label: "العقارات",
    description: "العقارات والوحدات المرتبطة بطلبات التوثيق.",
    href: ROUTES.properties,
    icon: Building2,
  },
  {
    id: "users",
    label: "العملاء",
    description: "المؤجرون والمستأجرون المسجّلون في المنصة.",
    href: ROUTES.users,
    icon: Users,
  },
  {
    id: "payments",
    label: "المدفوعات",
    description: "رسوم التوثيق للعقود السكنية والتجارية.",
    href: ROUTES.payments,
    icon: Wallet,
  },
] as const;
