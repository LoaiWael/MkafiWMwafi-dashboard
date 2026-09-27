import { FileCheck2, Plus } from "lucide-react";
import { Link } from "react-router";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import OverviewContractsTable from "@/features/overview/components/overview-contracts-table";
import OverviewStatCard from "@/features/overview/components/overview-stat-card";
import { OVERVIEW_STATS } from "@/features/overview/constants";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function OverviewSection() {
  return (
    <div className="page-shell space-y-8 py-8">
      {/* Header section */}
      <PageHeader
        title="لوحة التحكم والتشغيل"
        description="متابعة وإدارة توثيق عقود الإيجار السكنية والتجارية، والعقارات المسجلة، والطلبات الجارية، والمدفوعات اللحظية."
        actions={
          <>
            <Link
              to={ROUTES.requests}
              viewTransition
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-9 gap-1.5 rounded-lg px-3.5 text-xs font-semibold",
              )}
            >
              <FileCheck2 className="size-4 text-primary" />
              <span>متابعة الطلبات</span>
            </Link>

            <Link
              to={ROUTES.contracts}
              viewTransition
              className={cn(
                buttonVariants({ variant: "primary", size: "sm" }),
                "h-9 gap-1.5 rounded-lg px-3.5 text-xs font-semibold",
              )}
            >
              <Plus className="size-4" />
              <span>توثيق عقد جديد</span>
            </Link>
          </>
        }
      />

      {/* Status Cards Grid with Numbers */}
      <section aria-label="إحصائيات وحالة المنصة">
        <StaggerContainer
          staggerDelay={0.06}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {OVERVIEW_STATS.map((stat) => (
            <StaggerItem key={stat.id}>
              <OverviewStatCard stat={stat} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Overview Contracts & Real Estate Data Table */}
      <section aria-label="جدول العقود والعقارات الأخيرة">
        <FadeIn direction="up" delay={0.2} duration={0.4}>
          <OverviewContractsTable />
        </FadeIn>
      </section>
    </div>
  );
}
