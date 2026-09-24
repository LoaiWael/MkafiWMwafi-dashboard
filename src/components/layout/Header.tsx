import { useEffect, useState } from "react";
import { Bell, LogOut, Menu, Settings, UserRound } from "lucide-react";
import { NavLink, useLocation } from "react-router";
import { getPageTitle } from "@/components/layout/constants";
import { ROUTES } from "@/lib/constants";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Header() {
  const { pathname } = useLocation();
  const { toggleSidebar } = useSidebar();
  const pageTitle = getPageTitle(pathname);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function checkScroll() {
      const scrollY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setIsScrolled(scrollY > 2);
    }

    checkScroll();
    window.addEventListener("scroll", checkScroll, {
      passive: true,
      capture: true,
    });
    return () => {
      window.removeEventListener("scroll", checkScroll, { capture: true });
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <Tooltip>
        <TooltipTrigger
          type="button"
          aria-label="فتح القائمة الجانبية"
          className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={6}>
          القائمة الجانبية
        </TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="h-6" />

      <h1 className="truncate text-base font-bold text-foreground sm:text-lg">
        {pageTitle}
      </h1>

      <div className="ms-auto flex items-center gap-1.5 sm:gap-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <NavLink
                to={ROUTES.notifications}
                viewTransition
                aria-label="الإشعارات"
                className="relative inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
              />
            }
          >
            <Bell size={20} />
            <span className="absolute top-1.5 inset-e-1.5 size-2 rounded-full bg-secondary" />
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6}>
            الإشعارات
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="الحساب"
            className="inline-flex size-10 items-center justify-center rounded-lg outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary-50 text-sm text-primary-700">
                م
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="min-w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <span className="block text-sm font-semibold text-foreground">
                  مدير النظام
                </span>
                <span className="block text-xs font-normal text-muted-foreground">
                  لوحة التشغيل
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<NavLink to={ROUTES.settings} viewTransition />}>
              <UserRound size={16} />
              الملف الشخصي
            </DropdownMenuItem>
            <DropdownMenuItem render={<NavLink to={ROUTES.settings} viewTransition />}>
              <Settings size={16} />
              الإعدادات
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut size={16} />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        aria-hidden="true"
        data-scrolled={isScrolled}
        className="header-scroll-shadow absolute inset-x-0 top-full h-8"
      />
    </header>
  );
}
