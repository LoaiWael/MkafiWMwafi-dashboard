import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  CheckCircle2,
  FileCheck2,
  Percent,
  Sparkles,
  Tag,
} from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/lib/constants";
import {
  CONTRACT_PRICING_PLANS,
  PRICING_METADATA,
  PRICING_STORAGE_KEYS,
  type PricingPlan,
} from "@/features/pricing/constants";
import DurationPlansCard from "@/features/pricing/components/duration-plans-card";

type FilterTab = "all" | "short" | "medium" | "long" | "manage";

export default function PricingSection() {
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>("all");

  // Load plans with localStorage persistence
  const [plans, setPlans] = useState<PricingPlan[]>(() => {
    const saved = localStorage.getItem(PRICING_STORAGE_KEYS.plans);
    return saved ? JSON.parse(saved) : [...CONTRACT_PRICING_PLANS];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(PRICING_STORAGE_KEYS.plans, JSON.stringify(plans));
  }, [plans]);

  const handleResetPlans = () => {
    setPlans([...CONTRACT_PRICING_PLANS]);
    localStorage.setItem(
      PRICING_STORAGE_KEYS.plans,
      JSON.stringify(CONTRACT_PRICING_PLANS)
    );
  };

  const filteredPlans = plans.filter((plan: PricingPlan) => {
    if (selectedFilter === "short") {
      return plan.durationUnit === "months";
    }
    if (selectedFilter === "medium") {
      return plan.durationUnit === "years" && plan.durationValue <= 5;
    }
    if (selectedFilter === "long") {
      return plan.durationUnit === "years" && plan.durationValue > 5;
    }
    return true;
  });

  return (
    <div className="page-shell space-y-6 py-8">
      <PageHeader
        title={PRICING_METADATA.title}
        description={PRICING_METADATA.description}
        badge={
          <Badge variant="secondary" className="gap-1.5 font-medium">
            <Tag className="size-3.5" />
            <span>{PRICING_METADATA.subtitle}</span>
          </Badge>
        }
      />

      {/* Filter Tabs and Quick Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={selectedFilter}
          onValueChange={(val) => setSelectedFilter(val as FilterTab)}
        >
          <TabsList className="w-full sm:w-auto" aria-label="تصفية الباقات">
            <TabsTrigger value="all">عرض البطاقات ({plans.length})</TabsTrigger>
            <TabsTrigger value="short">أقل من سنة</TabsTrigger>
            <TabsTrigger value="medium">1 - 5 سنوات</TabsTrigger>
            <TabsTrigger value="long">6 - 10 سنوات</TabsTrigger>
            <TabsTrigger value="manage">جدول التعديل والإدارة</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <Link to={ROUTES.taxes}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-primary/30 text-xs font-semibold text-primary hover:bg-primary-50"
            >
              <Percent className="size-3.5" />
              <span>إدارة الضرائب والرسوم</span>
            </Button>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground ps-2">
            <FileCheck2 className="size-4 text-primary" />
            <span>متوافق مع منصة إيجار</span>
          </div>
        </div>
      </div>

      {selectedFilter === "manage" ? (
        <DurationPlansCard
          plans={plans}
          onPlansChange={setPlans}
          onResetDefaults={handleResetPlans}
        />
      ) : (
        /* Pricing Cards Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`group relative overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-md ${
                plan.isPopular ? "border-primary bg-primary-50/30" : "bg-card"
              }`}
            >
              {plan.isPopular ? (
                <div className="absolute top-3 end-3">
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    الأكثر طلباً
                  </Badge>
                </div>
              ) : null}

              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    مدة العقد
                  </span>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {plan.duration}
                  </h3>
                </div>

                <div className="text-end">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-2xl font-extrabold text-primary">
                      <bdi>{plan.amount}</bdi>
                    </span>
                    <span className="text-xs font-semibold text-primary/80">
                      ر.س
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    شامل الرسوم والضريبة
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tax & Official Fees Notice Banner */}
      <div className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary-50/50 p-4 text-center text-sm font-medium text-foreground">
        <Sparkles className="size-4 text-primary shrink-0" />
        <span>{PRICING_METADATA.taxNote}</span>
        <CheckCircle2 className="size-4 text-primary shrink-0" />
      </div>
    </div>
  );
}
