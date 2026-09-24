import { Outlet } from "react-router";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { DirectionProvider } from "@/components/ui/direction";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout() {
  return (
    <DirectionProvider direction="rtl">
      <TooltipProvider delay={100}>
        <SidebarProvider>
          <Sidebar />
          <SidebarInset>
            <Header />
            <div className="flex-1">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </DirectionProvider>
  );
}
