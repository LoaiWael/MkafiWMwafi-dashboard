import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  BellRing,
  CheckCheck,
  ChevronLeft,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Bell } from "@/components/animate-ui/icons/bell";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useNotifications } from "../hooks/use-notifications";
import type { NotificationType } from "../types";

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "employee":
      return {
        icon: Users,
        bg: "bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300",
      };
    case "role":
      return {
        icon: ShieldCheck,
        bg: "bg-tertiary-50 text-tertiary-700 dark:bg-tertiary-950/50 dark:text-tertiary-300",
      };
    case "system":
    default:
      return {
        icon: BellRing,
        bg: "bg-muted text-muted-foreground",
      };
  }
}

export default function NotificationsPopover() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              aria-label="الإشعارات"
              className="relative inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            />
          }
        >
          <AnimateIcon
            animateOnHover
            className="flex size-full items-center justify-center"
          >
            <Bell className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 end-2 size-2 rounded-full bg-secondary" />
            )}
          </AnimateIcon>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={6}>
          الإشعارات
        </TooltipContent>
      </Tooltip>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 gap-0 rounded-2xl border border-border/80 bg-background/95 p-0 shadow-xl ring-0 backdrop-blur-md"
      >
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">الإشعارات</span>
            {unreadCount > 0 ? (
              <span className="inline-flex items-center rounded-full bg-secondary-50 px-2 py-0.5 text-xs font-semibold text-secondary-800 dark:bg-secondary-950/60 dark:text-secondary-300">
                {unreadCount} جديدة
              </span>
            ) : null}
          </div>
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary-700"
            >
              <CheckCheck className="size-3.5" />
              <span>تحديد الكل كمقروء</span>
            </button>
          ) : null}
        </div>

        <div className="max-h-[340px] space-y-1 overflow-y-auto p-1.5">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
              <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <BellRing className="size-5" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                لا توجد إشعارات حالياً
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                ستظهر هنا التوجيهات الإدارية وتنبيهات الأدوار وإشعارات النظام.
              </p>
            </div>
          ) : (
            notifications.slice(0, 5).map((item) => {
              const { icon: Icon, bg } = getNotificationIcon(item.type);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!item.read) markAsRead(item.id);
                  }}
                  className={cn(
                    "group relative flex items-start gap-3 rounded-xl p-2.5 text-start transition-all",
                    item.read
                      ? "text-muted-foreground hover:bg-muted/70"
                      : "bg-primary-50/50 text-foreground hover:bg-primary-50 dark:bg-primary-950/20 dark:hover:bg-primary-950/30"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                      bg
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={cn(
                          "truncate text-xs leading-snug",
                          !item.read
                            ? "font-bold text-foreground"
                            : "font-medium text-foreground/80"
                        )}
                      >
                        {item.title}
                      </p>
                      {!item.read && (
                        <span className="size-2 shrink-0 rounded-full bg-secondary" />
                      )}
                    </div>
                    {item.sender && (
                      <p className="mt-0.5 text-[10px] font-medium text-primary-800 dark:text-primary-300">
                        من: {item.sender.name} ({item.sender.role})
                      </p>
                    )}
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <span className="mt-1 block text-[10px] text-muted-foreground/80">
                      {item.time}
                    </span>
                  </div>
                  {item.href && (
                    <Link
                      to={item.href}
                      viewTransition
                      onClick={() => {
                        markAsRead(item.id);
                        setOpen(false);
                      }}
                      className="absolute inset-0 z-10"
                      aria-label={item.title}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-border/70 p-2">
          <Link
            to={ROUTES.notifications}
            viewTransition
            onClick={() => setOpen(false)}
            className="group flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary-50/80 py-2 text-center text-xs font-bold text-primary-800 transition-all hover:bg-primary hover:text-white dark:bg-primary-950/40 dark:text-primary-200 dark:hover:bg-primary dark:hover:text-white"
          >
            <span>عرض جميع الإشعارات</span>
            <ChevronLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
