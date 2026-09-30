import { SaudiRiyal } from "lucide-react";
import { useTrackedState } from "@/features/content/components/content-draft-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HOME_PLAN_DEFAULT_ID,
  PRICING_COPY,
} from "@/features/content/constants";
import {
  CONTRACT_PRICING_PLANS,
  type PricingPlan,
} from "@/features/pricing/constants";
import { cn } from "@/lib/utils";

interface PlanPriceFieldProps {
  tone: "primary" | "secondary";
}

function findPlan(planId: string) {
  return (
    CONTRACT_PRICING_PLANS.find((plan) => plan.id === planId) ??
    CONTRACT_PRICING_PLANS[0]
  );
}

function planPriceNote(plan: PricingPlan) {
  if (plan.durationUnit === "years" && plan.durationValue === 1) {
    return PRICING_COPY.yearPriceNote;
  }

  return plan.duration;
}

export default function PlanPriceField({ tone }: PlanPriceFieldProps) {
  const [planId, setPlanId, markDirty] = useTrackedState(HOME_PLAN_DEFAULT_ID);
  const selectedPlan = findPlan(planId);
  const isSecondary = tone === "secondary";

  function handlePlanChange(value: string | null) {
    if (!value || value === planId) return;
    setPlanId(value);
    markDirty();
  }

  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1 font-extrabold text-foreground sm:gap-1.5">
        <span className="text-2xl leading-none tracking-tight sm:text-5xl">
          <bdi>{selectedPlan.amount.toLocaleString("en-US")}</bdi>
        </span>
        <SaudiRiyal
          className={cn(
            "size-5 shrink-0 transition-transform duration-300 group-hover:scale-110 sm:size-7",
            isSecondary ? "text-secondary" : "text-primary",
          )}
          aria-label={PRICING_COPY.currencyLabel}
        />
      </div>

      <Select value={planId} onValueChange={handlePlanChange}>
        <SelectTrigger
          aria-label="تعديل السعر"
          className={cn(
            "mt-1 h-8 w-auto max-w-full border-0 bg-transparent px-0 text-xs font-semibold shadow-none hover:bg-transparent sm:mt-1.5",
            isSecondary
              ? "text-secondary [&_svg]:text-secondary"
              : "text-primary [&_svg]:text-primary",
          )}
        >
          <SelectValue>
            {(value: string | null) => planPriceNote(findPlan(value ?? planId))}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="start" className="min-w-64">
          {CONTRACT_PRICING_PLANS.map((plan) => (
            <SelectItem key={plan.id} value={plan.id} className="text-xs">
              <span className="flex w-full items-center justify-between gap-4">
                <span className="font-bold">{plan.duration}</span>
                <span className="flex items-center gap-1 font-bold text-primary">
                  <bdi>{plan.amount.toLocaleString("en-US")}</bdi>
                  <SaudiRiyal className="size-3 shrink-0" aria-hidden="true" />
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
