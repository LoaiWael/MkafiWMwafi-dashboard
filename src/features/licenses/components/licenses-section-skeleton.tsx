import { Skeleton } from "@/components/ui/skeleton";

const LICENSE_SKELETON_COUNT = 3;

export default function LicensesSectionSkeleton() {
  return (
    <div className="page-shell py-8" aria-busy="true">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-2/3 max-w-md" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: LICENSE_SKELETON_COUNT }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
          >
            <Skeleton className="size-10 rounded-lg" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
