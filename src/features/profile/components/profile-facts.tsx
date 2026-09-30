import { CopyButton } from "@/components/ui/copy-button";
import type { ProfileFact } from "@/features/profile/types";

interface ProfileFactsProps {
  title: string;
  facts: readonly ProfileFact[];
}

export default function ProfileFacts({ title, facts }: ProfileFactsProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-3.5 shadow-xs sm:rounded-3xl sm:p-6">
      <h3 className="text-sm font-bold text-foreground sm:text-base">{title}</h3>
      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:mt-4 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
        {facts.map((fact) => {
          const Icon = fact.icon;
          return (
            <div
              key={fact.id}
              className="flex items-center justify-between gap-2.5 rounded-xl border border-border bg-muted/30 p-2.5 sm:rounded-2xl sm:p-3"
            >
              <div className="min-w-0 space-y-0.5 text-start sm:space-y-1">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="size-3.5 shrink-0" />
                  <span>{fact.label}</span>
                </p>
                <p
                  dir={fact.ltr ? "ltr" : undefined}
                  className="truncate text-xs font-semibold text-foreground sm:text-sm"
                >
                  {fact.ltr ? <bdi>{fact.value}</bdi> : fact.value}
                </p>
              </div>
              {fact.copyable ? (
                <CopyButton
                  value={fact.value}
                  itemId={fact.id}
                  label={`نسخ ${fact.label}`}
                  className="size-7.5 shrink-0 sm:size-8"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
