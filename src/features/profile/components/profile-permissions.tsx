import { Badge } from "@/components/ui/badge";
import type { ProfilePermission } from "@/features/profile/types";

interface ProfilePermissionsProps {
  permissions: readonly (ProfilePermission | string)[];
  description?: string;
  title?: string;
  emptyText?: string;
}

export default function ProfilePermissions({
  permissions,
  title = "الصلاحيات",
  description = "الصلاحيات المتاحة لهذا الحساب داخل لوحة التحكم.",
  emptyText = "لا توجد صلاحيات محددة حالياً.",
}: ProfilePermissionsProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-3.5 shadow-xs sm:rounded-3xl sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        <div className="space-y-0.5 text-start sm:space-y-1">
          <h3 className="text-sm font-bold text-foreground sm:text-base">{title}</h3>
          <p className="text-xs text-muted-foreground sm:text-sm">{description}</p>
        </div>
        <Badge variant="outline" className="h-5 px-2 text-[11px] sm:h-6 sm:px-2.5 sm:text-xs">
          {permissions.length} صلاحيات
        </Badge>
      </div>

      {permissions.length === 0 ? (
        <p className="mt-3 text-xs text-muted-foreground sm:mt-4 sm:text-sm">{emptyText}</p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
          {permissions.map((permission, index) => {
            const key =
              typeof permission === "string"
                ? `${permission}-${index}`
                : permission.id || `${permission.label}-${index}`;
            const label =
              typeof permission === "string" ? permission : permission.label;

            return (
              <Badge
                key={key}
                variant="secondary"
                className="h-6.5 rounded-md px-2.5 text-[11px] font-medium sm:h-7 sm:rounded-lg sm:px-3 sm:text-xs"
              >
                {label}
              </Badge>
            );
          })}
        </div>
      )}
    </section>
  );
}

