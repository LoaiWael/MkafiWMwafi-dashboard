import { useState } from "react";
import { Link } from "react-router";
import {
  Bell,
  BellRing,
  CheckCheck,
  ChevronLeft,
  Filter,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { FadeIn } from "@/components/animations";
import FeaturePage from "@/components/layout/feature-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useNotifications } from "../hooks/use-notifications";
import type { NotificationType } from "../types";

function getNotificationDetails(type: NotificationType) {
  switch (type) {
    case "employee":
      return {
        icon: Users,
        bg: "bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300",
        badge: "توجيه إداري",
      };
    case "role":
      return {
        icon: ShieldCheck,
        bg: "bg-tertiary-50 text-tertiary-700 dark:bg-tertiary-950/50 dark:text-tertiary-300",
        badge: "صلاحيات وأدوار",
      };
    case "system":
    default:
      return {
        icon: BellRing,
        bg: "bg-muted text-muted-foreground",
        badge: "إشعار نظام",
      };
  }
}

type FilterTab = "all" | "unread" | "employee" | "role" | "system";

export default function NotificationsSection() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    restoreDefaults,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "unread" && item.read) return false;
    if (activeTab === "employee" && item.type !== "employee") return false;
    if (activeTab === "role" && item.type !== "role") return false;
    if (activeTab === "system" && item.type !== "system") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        Boolean(item.sender?.name.toLowerCase().includes(q)) ||
        Boolean(item.sender?.role.toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <FeaturePage
      title="الإشعارات والتوجيهات"
      description="التوجيهات الإدارية الصادرة بين الأدوار والموظفين، وتحديثات الصلاحيات، وإشعارات النظام."
      icon={Bell}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="gap-1.5 rounded-xl cursor-pointer"
            >
              <CheckCheck className="size-4 text-primary" />
              <span>تحديد الكل كمقروء</span>
            </Button>
          )}
          {notifications.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="gap-1.5 rounded-xl text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="size-4" />
              <span>مسح الكل</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={restoreDefaults}
              className="gap-1.5 rounded-xl cursor-pointer"
            >
              <RotateCcw className="size-4" />
              <span>استعادة التوجيهات التجريبية</span>
            </Button>
          )}
        </div>
      }
      emptyTitle="لا توجد إشعارات"
      emptyDescription="ستظهر هنا التوجيهات الصادرة من الأدوار الإدارية وإشعارات النظام."
    >
      <div className="space-y-4">
        {/* Filter and Search Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-border/80 bg-card p-1">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={cn(
                "cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                activeTab === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              الكل ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("unread")}
              className={cn(
                "cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                activeTab === "unread"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              غير المقروءة ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("employee")}
              className={cn(
                "cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                activeTab === "employee"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              توجيهات الموظفين
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("role")}
              className={cn(
                "cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                activeTab === "role"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              الصلاحيات
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("system")}
              className={cn(
                "cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                activeTab === "system"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              النظام
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="البحث في الإشعارات والتوجيهات..."
              className="ps-9 rounded-xl"
            />
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Filter className="size-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              لا توجد إشعارات مطابقة
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              جرب تغيير خيارات التصفية أو البحث لعرض النتائج.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((item, index) => {
              const {
                icon: Icon,
                bg,
                badge,
              } = getNotificationDetails(item.type);
              return (
                <FadeIn key={item.id} duration={0.25} delay={index * 0.03}>
                  <Card
                    className={cn(
                      "group relative flex flex-col gap-3 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between",
                      !item.read
                        ? "border-primary/30 bg-primary-50/40 hover:bg-primary-50/70 dark:bg-primary-950/20"
                        : "border-border/80 bg-card hover:bg-muted/50",
                    )}
                  >
                    <div className="flex items-start gap-3.5 sm:items-center">
                      <div
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl",
                          bg,
                        )}
                      >
                        <Icon className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4
                            className={cn(
                              "text-sm",
                              !item.read
                                ? "font-bold text-foreground"
                                : "font-medium text-foreground/90",
                            )}
                          >
                            {item.title}
                          </h4>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            {badge}
                          </span>
                          {!item.read && (
                            <span className="size-2 shrink-0 rounded-full bg-secondary" />
                          )}
                        </div>
                        {item.sender && (
                          <p className="mt-0.5 text-xs font-medium text-primary-800 dark:text-primary-300">
                            من: {item.sender.name} ({item.sender.role})
                          </p>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.description}
                        </p>
                        <span className="mt-1.5 block text-[11px] text-muted-foreground/80 sm:hidden">
                          {item.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span className="hidden text-xs text-muted-foreground/80 sm:inline-block whitespace-nowrap">
                        {item.time}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {!item.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(item.id)}
                            className="h-8 rounded-lg px-2.5 text-xs text-primary hover:bg-primary-50 cursor-pointer"
                          >
                            <CheckCheck className="size-3.5" />
                            <span>تحديد كمقروء</span>
                          </Button>
                        )}

                        {item.href && (
                          <Link
                            to={item.href}
                            viewTransition
                            onClick={() => markAsRead(item.id)}
                            className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary-50 px-3 text-xs font-semibold text-primary-800 transition-colors hover:bg-primary hover:text-white dark:bg-primary-950/50 dark:text-primary-200"
                          >
                            <span>عرض الإجراء</span>
                            <ChevronLeft className="size-3.5" />
                          </Link>
                        )}

                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => deleteNotification(item.id)}
                          aria-label="حذف الإشعار"
                          className="size-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        )}
      </div>
    </FeaturePage>
  );
}
