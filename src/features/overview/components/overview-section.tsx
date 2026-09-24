import OverviewStatCard from "@/features/overview/components/overview-stat-card";
import { OVERVIEW_STATS } from "@/features/overview/constants";

export default function OverviewSection() {
  return (
    <div className="page-shell py-8">
      <div className="mb-8 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          نظرة عامة على التشغيل
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          متابعة توثيق عقود الإيجار السكنية والتجارية، والطلبات، والعقارات،
          والمدفوعات من مكان واحد.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {OVERVIEW_STATS.map((stat) => (
          <OverviewStatCard
            key={stat.id}
            label={stat.label}
            description={stat.description}
            href={stat.href}
            icon={stat.icon}
          />
        ))}
      </div>
    </div>
  );
}
