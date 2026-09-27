import { useEffect, useState } from "react";
import { ChevronDown, LogOut, Menu, Settings, UserRound } from "lucide-react";
import { NavLink, useLocation } from "react-router";
import { Bell } from "@/components/animate-ui/icons/bell";
import { PanelRightClose } from "@/components/animate-ui/icons/panel-right-close";
import { PanelRightOpen } from "@/components/animate-ui/icons/panel-right-open";
import { CURRENT_EMPLOYEE, getPageTitle } from "@/components/layout/constants";
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
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimateIcon } from "../animate-ui/icons/icon";

export default function Header() {
  const { pathname } = useLocation();
  const { toggleSidebar, open, openMobile, isMobile } = useSidebar();
  const isSidebarOpen = isMobile ? openMobile : open;
  const sidebarToggleLabel = isSidebarOpen
    ? "إغلاق القائمة الجانبية"
    : "فتح القائمة الجانبية";
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
          aria-label={sidebarToggleLabel}
          className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          onClick={toggleSidebar}
        >
          <AnimateIcon animateOnHover className="flex size-full items-center justify-center">
            {isMobile ? (
              <Menu size={20} />
            ) : isSidebarOpen ? (
              <PanelRightClose size={20} />
            ) : (
              <PanelRightOpen size={20} />
            )}
          </AnimateIcon>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={6}>
          {sidebarToggleLabel}
        </TooltipContent>
      </Tooltip>

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
                className="relative inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
              />
            }
          >
            <AnimateIcon animateOnHover className="flex size-full items-center justify-center">
              <Bell size={20} />
              <span className="absolute top-2 end-2 size-2 rounded-full bg-secondary" />
            </AnimateIcon>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6}>
            الإشعارات
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="الحساب"
            className="inline-flex h-10 items-center gap-1 rounded-full border border-border bg-card ps-1 pe-2 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:max-w-60 sm:gap-2 [&[data-popup-open]_svg]:rotate-180"
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary-50 text-xs text-primary-700">
                {CURRENT_EMPLOYEE.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden min-w-0 flex-1 text-start sm:block">
              <span className="block truncate text-sm font-semibold leading-tight text-foreground">
                {CURRENT_EMPLOYEE.name}
              </span>
              <span className="block truncate text-xs leading-tight text-muted-foreground">
                {CURRENT_EMPLOYEE.role}
              </span>
            </span>
            <ChevronDown
              size={16}
              className="shrink-0 text-muted-foreground transition-transform"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="min-w-48 [&_[data-slot=dropdown-menu-item]:not([data-variant=destructive])_svg]:text-popover-foreground [&_[data-slot=dropdown-menu-item]:not([data-variant=destructive]):focus_svg]:text-popover-foreground"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary-50 text-xs text-primary-700">
                    {CURRENT_EMPLOYEE.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {CURRENT_EMPLOYEE.name}
                  </span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    {CURRENT_EMPLOYEE.role}
                  </span>
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="focus:bg-primary/10 focus:text-foreground"
              render={<NavLink to={ROUTES.settings} viewTransition />}
            >
              <UserRound size={16} />
              الملف الشخصي
            </DropdownMenuItem>
            <DropdownMenuItem
              className="focus:bg-primary/10 focus:text-foreground"
              render={<NavLink to={ROUTES.settings} viewTransition />}
            >
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
