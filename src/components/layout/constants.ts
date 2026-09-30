import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  FileText,
  Layers,
  LayoutDashboard,
  MapPin,
  Pencil,
  Percent,
  Scale,
  Settings2,
  Shield,
  Tag,
  TicketPercent,
  User,
  UserCog,
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
    items: [
      { href: ROUTES.home, label: "لوحة التحكم", icon: LayoutDashboard },
      { href: ROUTES.reports, label: "التقارير", icon: BarChart3 },
    ],
  },
  {
    title: "العمليات",
    items: [
      { href: ROUTES.contracts, label: "العقود", icon: FileText },
      { href: ROUTES.properties, label: "العقارات", icon: Building2 },
    ],
  },
  {
    title: "المالية",
    items: [
      { href: ROUTES.payments, label: "المدفوعات", icon: Wallet },
      { href: ROUTES.pricing, label: "تسعير الخدمات", icon: Tag },
      { href: ROUTES.coupons, label: "كوبونات الخصم", icon: TicketPercent },
      { href: ROUTES.taxes, label: "الضرائب والرسوم", icon: Percent },
    ],
  },
  {
    title: "المستخدمين",
    items: [
      { href: ROUTES.users, label: "العملاء", icon: Users },
      { href: ROUTES.employees, label: "الموظفين", icon: UserCog },
    ],
  },
  {
    title: "النظام",
    items: [
      { href: ROUTES.regions, label: "المناطق والمدن", icon: MapPin },
      { href: ROUTES.unitOptions, label: "خيارات الوحدات", icon: Layers },
      {
        href: ROUTES.partyOptions,
        label: "صفة المستأجر والمؤجر",
        icon: User,
      },
      { href: ROUTES.content, label: "محتوى الموقع", icon: Pencil },
      { href: ROUTES.terms, label: "الشروط والأحكام", icon: Scale },
      { href: ROUTES.privacy, label: "سياسة الخصوصية", icon: Shield },
      { href: ROUTES.settings, label: "إعدادات النظام", icon: Settings2 },
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
  if (pathname === ROUTES.profile) return "الملف الشخصي";
  if (pathname.startsWith(`${ROUTES.users}/`)) return "ملف العميل";
  if (pathname.startsWith(`${ROUTES.employees}/`)) return "ملف الموظف";

  for (const group of SIDEBAR_NAV_GROUPS) {
    for (const item of group.items) {
      if (isNavItemActive(pathname, item.href)) {
        return item.label;
      }
    }
  }

  return "الصفحة غير موجودة";
}
