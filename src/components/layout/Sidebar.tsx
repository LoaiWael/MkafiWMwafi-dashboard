import { Link, NavLink, useLocation } from "react-router";
import { SITE, ROUTES } from "@/lib/constants";
import {
  SIDEBAR_NAV_GROUPS,
  isNavItemActive,
} from "@/components/layout/constants";
import { MOCK_CONTRACTS } from "@/features/contracts/constants";
import { MOCK_PROPERTIES } from "@/features/properties/constants";
import {
  Sidebar as SidebarShell,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const NAV_ITEM_COUNTS: Record<string, number> = {
  [ROUTES.contracts]: MOCK_CONTRACTS.length,
  [ROUTES.properties]: MOCK_PROPERTIES.length,
};

export default function Sidebar() {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();

  function handleNavigate() {
    if (isMobile) {
      setOpenMobile(false);
    }
  }

  return (
    <SidebarShell side="right" collapsible="icon">
      <SidebarHeader className="px-3.5 py-4">
        <Link
          to={ROUTES.home}
          viewTransition
          onClick={handleNavigate}
          aria-label={SITE.name}
          className="flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <img
            src={SITE.logo}
            alt=""
            width={44}
            height={44}
            className="size-11 shrink-0 object-contain"
          />
          <span className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-base font-bold text-sidebar-foreground">
              {SITE.name}
            </span>
            <span className="truncate text-sm text-muted-foreground">
              {SITE.tagline}
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <div className="scroll-timeline-wrapper relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          aria-hidden="true"
          className="sidebar-scroll-shadow-top pointer-events-none absolute inset-x-0 top-0 z-10 h-6"
        />

        <SidebarContent className="sidebar-scroll-timeline-y">
          <nav aria-label="القائمة الجانبية">
            {SIDEBAR_NAV_GROUPS.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = isNavItemActive(pathname, item.href);
                      const count = NAV_ITEM_COUNTS[item.href];

                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            isActive={isActive}
                            tooltip={{ children: item.label, side: "left" }}
                            render={<NavLink to={item.href} viewTransition onClick={handleNavigate} />}
                            className="h-10 text-base font-medium"
                          >
                            <Icon size={18} />
                            <span className="truncate">{item.label}</span>
                            {count !== undefined && (
                              <span className="ms-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-secondary-gradient px-1.5 text-xs font-bold text-secondary-foreground shadow-xs group-data-[collapsible=icon]:hidden tabular-nums">
                                {count}
                              </span>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </nav>
        </SidebarContent>

        <div
          aria-hidden="true"
          className="sidebar-scroll-shadow-bottom pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6"
        />
      </div>

      <SidebarFooter className="border-t border-sidebar-border">
        <p className="px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          لوحة التشغيل
        </p>
      </SidebarFooter>

      <SidebarRail />
    </SidebarShell>
  );
}
