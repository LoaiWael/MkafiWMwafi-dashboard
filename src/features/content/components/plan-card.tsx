import { Button } from "@/components/ui/button";
import { useTrackedState } from "@/features/content/components/content-draft-provider";
import { Slider } from "@/components/ui/slider";
import PlanFeatures from "@/features/content/components/plan-features";
import PlanPriceField from "@/features/content/components/plan-price-field";
import { PRICING_COPY, type HomePlan } from "@/features/content/constants";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  plan: HomePlan;
}

export default function PlanCard({ plan }: PlanCardProps) {
  const isSecondary = plan.tone === "secondary";
  const [progress, setProgress, markDirty] = useTrackedState<number>(plan.progress);

  function handleProgressChange(value: number | readonly number[]) {
    const next = typeof value === "number" ? value : value[0];
    if (next === undefined || next === progress) return;
    setProgress(next);
    markDirty();
  }

  return (
    <article
      aria-labelledby={`plan-${plan.id}`}
      className={cn(
        "group relative flex h-full flex-col rounded-2xl p-1 shadow-xl transition-shadow duration-300 hover:shadow-2xl sm:rounded-4xl sm:p-1.5",
        isSecondary ? "bg-deep-secondary-gradient" : "bg-primary-gradient",
      )}
    >
      {plan.featured ? (
        <div className="py-1 text-center text-xs font-bold tracking-wide text-primary-foreground sm:py-2.5 sm:text-base">
          <span className="inline-block animate-pulse">{PRICING_COPY.featuredLabel}</span>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col justify-between overflow-hidden rounded-xl bg-card sm:rounded-3xl">
        <div
          className={cn(
            "rounded-xl border bg-card p-3.5 shadow-lg sm:rounded-3xl sm:p-6",
            isSecondary ? "border-secondary" : "border-primary",
          )}
        >
          <h3 id={`plan-${plan.id}`} className="text-base font-bold text-foreground sm:text-2xl">
            {plan.title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
            {plan.subtitle}
          </p>

          <div className="mt-3 flex items-center justify-between gap-2.5 sm:mt-6 sm:gap-4">
            <PlanPriceField tone={plan.tone} />
            <Button
              variant={isSecondary ? "secondary" : "primary"}
              size="md"
              className="rounded-xl px-4 text-xs sm:px-6 sm:text-sm"
            >
              {PRICING_COPY.orderCta}
            </Button>
          </div>

          <div className="mt-3 sm:mt-6">
            <Slider
              value={[progress]}
              min={0}
              max={100}
              step={1}
              aria-label={plan.progressLabel}
              onValueChange={handleProgressChange}
              className={cn(
                isSecondary &&
                  "**:data-[slot=slider-range]:bg-secondary **:data-[slot=slider-thumb]:border-secondary",
              )}
            />
            <div className="mt-1.5 flex items-center justify-between text-xs font-semibold sm:mt-2.5">
              <span className="text-muted-foreground">{plan.progressLabel}</span>
              <span className={cn("font-bold", isSecondary ? "text-secondary" : "text-primary")}>
                <bdi>{progress}%</bdi>
              </span>
            </div>
          </div>
        </div>

        <PlanFeatures features={plan.features} tone={plan.tone} />
      </div>
    </article>
  );
}
