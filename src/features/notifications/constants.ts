import type { NotificationItem } from "./types";
import { ROUTES } from "@/lib/constants";

export const NOTIFICATIONS_STORAGE_KEY = "makfiwamufi.notifications.v3";

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-emp-1",
    title: "توجيه إداري: متابعة طلبات التوثيق ذات الأولوية",
    description: "يرجى من مسؤولي التوثيق التركيز على فحص ومراجعة الطلبات المعلقة وتحديث حالتها فوراً.",
    time: "منذ 10 دقائق",
    read: false,
    type: "employee",
    sender: {
      name: "عبدالله الشمري",
      role: "مدير العمليات",
    },
    href: `${ROUTES.employees}`,
  },
  {
    id: "notif-role-1",
    title: "تحديث مصفوفة الصلاحيات والأدوار",
    description: "تم تحديث أذونات الوصول لفريق تدقيق العقود والدعم الفني تماشياً مع متطلبات الرقابة الداخلية.",
    time: "منذ 35 دقيقة",
    read: false,
    type: "role",
    sender: {
      name: "سارة القحطاني",
      role: "مدير النظام",
    },
    href: `${ROUTES.employees}`,
  },
  {
    id: "notif-sys-1",
    title: "إشعار أمني: تفعيل التحقق الثنائي الإلزامي",
    description: "تم تفعيل التحقق بخطوتين لجميع الحسابات الإدارية والموظفين لتعزيز أمان المنصة.",
    time: "منذ 5 ساعات",
    read: true,
    type: "system",
    sender: {
      name: "النظام",
      role: "الأمان والحماية",
    },
    href: `${ROUTES.settings}`,
  },
  {
    id: "notif-sys-2",
    title: "تعميم إداري: مواعيد العمل والدعم الفني",
    description: "اعتماد جدول المناوبات الجديد لفريق الدعم خلال عطلة نهاية الأسبوع.",
    time: "منذ يوم واحد",
    read: true,
    type: "system",
    sender: {
      name: "الإدارة العامة",
      role: "إدارة المنصة",
    },
    href: `${ROUTES.employees}`,
  },
];
