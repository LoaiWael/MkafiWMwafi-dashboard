import { Skeleton } from "@/components/ui/skeleton";

const OVERVIEW_SKELETON_COUNT = 6;

export default function OverviewSectionSkeleton() {
  return (
    <div className="page-shell py-8" aria-busy="true">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-2/3 max-w-md" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: OVERVIEW_SKELETON_COUNT }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
          >
            <Skeleton className="size-10 rounded-lg" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-2 h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
