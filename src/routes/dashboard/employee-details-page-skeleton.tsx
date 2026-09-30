import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeeDetailsPageSkeleton() {
  return (
    <div className="page-shell space-y-6 py-6 sm:py-8" aria-busy="true">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <Skeleton className="h-28 rounded-none sm:h-32" />
        <div className="flex items-end gap-3 px-4 pb-5 sm:px-6 sm:pb-6">
          <Skeleton className="-mt-12 size-24 rounded-full sm:size-28" />
          <div className="space-y-2 pb-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-40" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-16 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
