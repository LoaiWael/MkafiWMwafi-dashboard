import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  ClipboardList,
  FileText,
  Handshake,
  Headset,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

export interface SidebarNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface SidebarNavGroup {
  title: string;
  items: readonly SidebarNavItem[];
}

export const SIDEBAR_NAV_GROUPS: readonly SidebarNavGroup[] = [
  {
    title: "الرئيسي",
    items: [{ href: ROUTES.home, label: "لوحة التحكم", icon: LayoutDashboard }],
  },
  {
    title: "العمليات",
    items: [
      { href: ROUTES.contracts, label: "العقود", icon: FileText },
      { href: ROUTES.requests, label: "طلبات التوثيق", icon: ClipboardList },
      { href: ROUTES.properties, label: "العقارات", icon: Building2 },
    ],
  },
  {
    title: "الأطراف",
    items: [
      { href: ROUTES.users, label: "العملاء", icon: Users },
      { href: ROUTES.brokers, label: "الوسطاء", icon: Handshake },
    ],
  },
  {
    title: "المالية",
    items: [{ href: ROUTES.payments, label: "المدفوعات", icon: Wallet }],
  },
  {
    title: "النظام",
    items: [
      { href: ROUTES.licenses, label: "التراخيص", icon: BadgeCheck },
      { href: ROUTES.reports, label: "التقارير", icon: BarChart3 },
      { href: ROUTES.notifications, label: "الإشعارات", icon: Bell },
      { href: ROUTES.support, label: "الدعم", icon: Headset },
      { href: ROUTES.settings, label: "الإعدادات", icon: Settings },
    ],
  },
];

export function isNavItemActive(pathname: string, href: string) {
  if (href === ROUTES.home) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getPageTitle(pathname: string) {
  for (const group of SIDEBAR_NAV_GROUPS) {
    for (const item of group.items) {
      if (isNavItemActive(pathname, item.href)) {
        return item.label;
      }
    }
  }

  return "الصفحة غير موجودة";
}
