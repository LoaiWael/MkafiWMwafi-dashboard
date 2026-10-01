import { Clock } from "lucide-react";
import { motion } from "motion/react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { Badge } from "@/components/ui/badge";
import type { ProfileActivity } from "@/features/profile/types";

interface ProfileActivityLogProps {
  entries: readonly ProfileActivity[];
}

export default function ProfileActivityLog({ entries }: ProfileActivityLogProps) {
  return (
    <FadeIn direction="up" delay={0.15}>
      <section className="rounded-2xl border border-border bg-card p-3.5 shadow-xs sm:rounded-3xl sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 text-start sm:gap-3">
            <motion.span
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:size-10 sm:rounded-xl"
            >
              <Clock className="size-3.5 sm:size-4" />
            </motion.span>
            <div className="space-y-0.5 sm:space-y-1">
              <h3 className="text-sm font-bold text-foreground sm:text-base">سجل النشاط</h3>
              <p className="text-xs text-muted-foreground sm:text-sm">
                آخر العمليات المنفذة من هذا الحساب.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="h-5 px-2 text-[11px] sm:h-6 sm:px-2.5 sm:text-xs">
            {entries.length} عمليات
          </Badge>
        </div>

        {entries.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted-foreground sm:py-8 sm:text-sm">
            لا يوجد نشاط مسجل بعد.
          </p>
        ) : (
          <StaggerContainer
            staggerDelay={0.06}
            className="relative mt-3.5 space-y-3 sm:mt-5 sm:space-y-4"
          >
            <span
              aria-hidden
              className="absolute inset-y-2 start-2.5 w-px bg-border sm:start-3"
            />
            {entries.map((entry) => (
              <StaggerItem key={entry.id} className="relative ps-7 sm:ps-10">
                <span className="absolute start-0 top-1 flex size-5 items-center justify-center rounded-full border border-border bg-card text-primary shadow-2xs sm:size-6">
                  <Clock className="size-3 sm:size-3.5" />
                </span>
                <motion.div
                  whileHover={{ x: -2 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-xl border border-border bg-muted/20 p-2.5 text-start transition-colors hover:border-primary/25 hover:bg-muted/40 sm:rounded-2xl sm:p-3"
                >
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-1">
                    <p className="text-xs font-semibold text-foreground sm:text-sm">
                      {entry.action}
                    </p>
                    <time
                      dir="ltr"
                      className="text-[11px] text-muted-foreground sm:text-xs"
                    >
                      {entry.at}
                    </time>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
                    {entry.detail}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>
    </FadeIn>
  );
}

