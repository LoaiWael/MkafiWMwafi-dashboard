import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetailsPageSkeleton() {
  return (
    <div className="page-shell space-y-6 py-6 sm:py-8" aria-busy="true">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl">
        <Skeleton className="h-28 rounded-none sm:h-40 md:h-44" />
        <div className="flex flex-col items-center px-4 pb-5 sm:flex-row sm:items-end sm:gap-4 sm:px-6 sm:pb-6">
          <Skeleton className="-mt-10 size-20 rounded-full sm:-mt-14 sm:size-28" />
          <div className="mt-3 space-y-2 sm:mb-1 sm:mt-0">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1 rounded-2xl border border-border bg-card p-1.5 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-10 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-16 rounded-2xl" />
        ))}
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-64" />
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
