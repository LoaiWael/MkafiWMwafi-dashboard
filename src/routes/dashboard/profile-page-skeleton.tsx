import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePageSkeleton() {
  return (
    <div className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-8" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card sm:rounded-3xl">
        <Skeleton className="h-28 rounded-none sm:h-40 md:h-44" />
        <div className="flex flex-col items-center px-4 pb-5 pt-0 text-center sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pb-6 sm:text-start">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-4">
            <Skeleton className="-mt-10 mb-3 size-20 rounded-full sm:-mt-14 sm:mb-0 sm:size-28" />
            <div className="flex flex-col items-center space-y-1.5 pb-1 sm:items-start">
              <Skeleton className="h-6 w-32 sm:h-7 sm:w-40" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </div>
          <div className="mt-4 flex w-full justify-center sm:mt-0 sm:w-auto sm:justify-end">
            <Skeleton className="h-9 w-full rounded-xl sm:h-10 sm:w-32" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-3.5 sm:rounded-3xl sm:p-6">
        <Skeleton className="h-5 w-28" />
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:mt-4 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-14 rounded-xl sm:h-16 sm:rounded-2xl" />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-3.5 sm:rounded-3xl sm:p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16 rounded-full sm:h-6 sm:w-20" />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
          {Array.from({ length: 9 }, (_, index) => (
            <Skeleton key={index} className="h-6.5 w-16 rounded-md sm:h-7 sm:w-20 sm:rounded-lg" />
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-card p-3.5 sm:rounded-3xl sm:p-6">
        <Skeleton className="h-5 w-28" />
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-14 rounded-xl sm:h-16 sm:rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
