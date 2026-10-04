import { useEffect } from "react";
import { Navigate, Outlet, ScrollRestoration, useLocation } from "react-router";
import { DirectionProvider } from "@/components/ui/direction";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ROUTES } from "@/lib/constants";

export default function AuthLayout() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return (
    <DirectionProvider direction="rtl">
      <TooltipProvider delay={100}>
        <ScrollRestoration getKey={(location) => location.pathname} />
        <main className="min-h-screen w-full bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary-900">
          <Outlet />
        </main>
      </TooltipProvider>
    </DirectionProvider>
  );
}