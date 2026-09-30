import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsSectionSkeleton() {
  return (
    <div className="page-shell space-y-4 sm:space-y-6 py-4 sm:py-6 md:py-8" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-7 sm:h-8 w-40 sm:w-48" />
        <Skeleton className="h-3.5 sm:h-4 w-full max-w-xl" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-1 sm:p-1.5">
        <div className="flex overflow-x-auto no-scrollbar gap-1 sm:grid sm:grid-cols-4 sm:gap-1.5">
          <Skeleton className="h-9 sm:h-10 min-w-24 sm:min-w-0 flex-1 rounded-xl" />
          <Skeleton className="h-9 sm:h-10 min-w-24 sm:min-w-0 flex-1 rounded-xl" />
          <Skeleton className="h-9 sm:h-10 min-w-24 sm:min-w-0 flex-1 rounded-xl" />
          <Skeleton className="h-9 sm:h-10 min-w-24 sm:min-w-0 flex-1 rounded-xl" />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6 rounded-xl sm:rounded-2xl border border-border bg-card p-3.5 sm:p-6 shadow-xs">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
          <Skeleton className="aspect-square max-w-32 sm:max-w-40 rounded-xl" />
          <Skeleton className="aspect-square max-w-32 sm:max-w-40 rounded-xl" />
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="aspect-video w-full rounded-xl" />
        </div>
      </div>

      <div className="flex justify-end pt-1 sm:pt-0">
        <Skeleton className="h-9 sm:h-10 w-full sm:w-32 rounded-lg sm:rounded-xl" />
      </div>
    </div>
  );
}
