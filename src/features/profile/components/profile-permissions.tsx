import { motion } from "motion/react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
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
    <FadeIn direction="up" delay={0.1}>
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
          <StaggerContainer
            staggerDelay={0.03}
            className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2"
          >
            {permissions.map((permission, index) => {
              const key =
                typeof permission === "string"
                  ? `${permission}-${index}`
                  : permission.id || `${permission.label}-${index}`;
              const label =
                typeof permission === "string" ? permission : permission.label;

              return (
                <StaggerItem key={key}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Badge
                      variant="secondary"
                      className="h-6.5 cursor-default rounded-md px-2.5 text-[11px] font-medium transition-colors hover:bg-secondary/80 sm:h-7 sm:rounded-lg sm:px-3 sm:text-xs"
                    >
                      {label}
                    </Badge>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </section>
    </FadeIn>
  );
}


