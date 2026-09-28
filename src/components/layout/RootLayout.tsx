import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { DirectionProvider } from "@/components/ui/direction";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <DirectionProvider direction="rtl">
      <TooltipProvider delay={100}>
        <SidebarProvider>
          <ScrollRestoration getKey={(location) => location.pathname} />
          <Sidebar />
          <SidebarInset>
            <Header />
            <div className="flex-1 min-w-0 w-full">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </DirectionProvider>
  );
}

