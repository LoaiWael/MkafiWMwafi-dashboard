import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturePageSkeleton() {
  return (
    <div className="page-shell py-8" aria-busy="true">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-2/3 max-w-md" />
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16">
        <Skeleton className="mb-4 size-8 rounded-lg" />
        <Skeleton className="mb-2 h-4 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}
