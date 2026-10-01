import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export default function UsersPageSkeleton() {
  return (
    <div
      className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-8"
      aria-busy="true"
    >
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl sm:h-32" />
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="space-y-2 border-b border-border p-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-full max-w-lg" />
        </div>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row">
          <Skeleton className="h-10 w-full sm:max-w-sm" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="space-y-px p-2">
          {Array.from({ length: DEFAULT_PAGE_SIZE }, (_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
