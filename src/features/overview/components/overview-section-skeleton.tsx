import { Skeleton } from "@/components/ui/skeleton";

const OVERVIEW_SKELETON_COUNT = 6;
const TABLE_SKELETON_ROWS = 5;

export default function OverviewSectionSkeleton() {
  return (
    <div className="page-shell space-y-8 py-8" aria-busy="true">
      {/* Header Skeleton */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-full max-w-xl rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: OVERVIEW_SKELETON_COUNT }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between">
              <Skeleton className="size-11 rounded-xl" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-8 w-36 rounded-md" />
            </div>
            <Skeleton className="h-4 w-full rounded-md" />
            <div className="flex gap-2 border-t border-border pt-3">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-56 rounded-md" />
            <Skeleton className="h-3.5 w-80 rounded-md" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-48 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-10 w-full rounded-lg" />
          {Array.from({ length: TABLE_SKELETON_ROWS }).map((_, rIndex) => (
            <Skeleton key={rIndex} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
