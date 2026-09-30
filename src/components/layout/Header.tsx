import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router";
import { Bell } from "@/components/animate-ui/icons/bell";
import { PanelRightClose } from "@/components/animate-ui/icons/panel-right-close";
import { PanelRightOpen } from "@/components/animate-ui/icons/panel-right-open";
import { getPageTitle } from "@/components/layout/constants";
import UserAccountMenu from "@/components/layout/user-account-menu";
import { ROUTES } from "@/lib/constants";
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
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 sm:gap-3 border-b border-border bg-background px-3 sm:px-4">
      <Tooltip>
        <TooltipTrigger
          type="button"
          aria-label={sidebarToggleLabel}
          className="inline-flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
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

      <h1 className="min-w-0 truncate text-sm font-bold text-foreground sm:text-base md:text-lg">
        {pageTitle}
      </h1>

      <div className="ms-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
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

        <UserAccountMenu />
      </div>

      <div
        aria-hidden="true"
        data-scrolled={isScrolled}
        className="header-scroll-shadow absolute inset-x-0 top-full h-8"
      />
    </header>
  );
}
