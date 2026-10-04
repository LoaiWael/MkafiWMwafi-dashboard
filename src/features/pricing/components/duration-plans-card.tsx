import { useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  CalendarRange,
  Clock,
  Edit2,
  FileText,
  Plus,
  RotateCcw,
  SaudiRiyal,
  SlidersHorizontal,
  Trash2,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PricingPlan } from "@/features/pricing/constants";
import { PopularBadge } from "@/features/pricing/components/popular-badge";
import PlanDialog from "@/features/pricing/components/plan-dialog";
import type { PricingPlanFormData } from "@/features/pricing/schemas/pricing-schema";
import WarningDialog from "@/components/warning-dialog";

interface DurationPlansCardProps {
  plans: PricingPlan[];
  onPlansChange: (plans: PricingPlan[]) => void;
  onResetDefaults: () => void;
}

export default function DurationPlansCard({
  plans,
  onPlansChange,
  onResetDefaults,
}: DurationPlansCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const popularCount = plans.filter((p) => p.isPopular).length;

  function handleOpenAdd() {
    setEditingPlan(null);
    setIsDialogOpen(true);
  }

  function handleOpenEdit(plan: PricingPlan) {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  }

  const confirmDelete = () => {
    if (deleteId) {
      onPlansChange(plans.filter((p) => p.id !== deleteId));
      toast.success("تم حذف مدة التوثيق بنجاح");
      setDeleteId(null);
    }
  };

  function handleSave(data: PricingPlanFormData) {
    if (editingPlan) {
      const updated = plans.map((p) =>
        p.id === editingPlan.id
          ? ({
              ...p,
              duration: data.duration.trim(),
              durationUnit: data.durationUnit,
              durationValue: Number(data.durationValue),
              amount: Number(data.amount),
              isPopular: Boolean(data.isPopular),
              notes: data.notes?.trim() || undefined,
            } as PricingPlan)
          : p,
      );
      onPlansChange(updated);
      toast.success("تم تحديث باقة مدة التوثيق بنجاح");
    } else {
      const newPlan: PricingPlan = {
        id: `plan_${Date.now()}`,
        duration: data.duration.trim(),
        durationUnit: data.durationUnit,
        durationValue: Number(data.durationValue),
        amount: Number(data.amount),
        isPopular: Boolean(data.isPopular),
        notes: data.notes?.trim() || undefined,
      };
      onPlansChange([...plans, newPlan]);
      toast.success("تمت إضافة مدة توثيق جديدة بنجاح");
    }

    setIsDialogOpen(false);
  }


  function getPlanIcon(plan: PricingPlan) {
    if (plan.durationUnit === "months") return Clock;
    if (plan.durationValue > 5) return CalendarRange;
    return CalendarDays;
  }

  return (
    <Card className="border-border/80 shadow-xs overflow-hidden">
      <CardHeader className="flex flex-col gap-4 border-b border-border/60 bg-card/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary dark:bg-primary-950/40">
              <SlidersHorizontal className="size-4" />
            </div>
            <CardTitle className="text-lg font-bold">
              رسوم ومدد توثيق العقود
            </CardTitle>
            <Badge variant="secondary" className="font-semibold text-xs">
              {plans.length} باقة
            </Badge>
            {popularCount > 0 && (
              <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                {popularCount} مُميزة
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs sm:text-sm">
            إدارة مدد العقود ورسوم التوثيق الأساسية المعتمدة في النظام وتخصيص الباقات الأكثر طلباً
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={onResetDefaults}
          >
            <RotateCcw className="size-3.5" />
            <span>استعادة الافتراضي</span>
          </Button>

          <Button
            type="button"
            size="sm"
            className="h-9 gap-1.5 text-xs font-semibold"
            onClick={handleOpenAdd}
          >
            <Plus className="size-3.5" />
            <span>إضافة مدة جديدة</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground mb-3">
              <FileText className="size-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              لا توجد باقات أو مدد مضافة
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm">
              قم بإضافة باقة مدة جديدة أو استعادة الباقات والمدد الافتراضية للنظام
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Button size="sm" onClick={onResetDefaults} variant="outline" className="text-xs">
                <RotateCcw className="size-3.5 me-1" />
                استعادة الافتراضي
              </Button>
              <Button size="sm" onClick={handleOpenAdd} className="text-xs">
                <Plus className="size-3.5 me-1" />
                إضافة باقة
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/70">
                  <TableHead className="font-bold text-start ps-5">مدة العقد</TableHead>
                  <TableHead className="font-bold text-start">الوحدة الزمنية</TableHead>
                  <TableHead className="font-bold text-start">رسوم التوثيق</TableHead>
                  <TableHead className="font-bold text-start">التمييز</TableHead>
                  <TableHead className="font-bold text-start">الملاحظات</TableHead>
                  <TableHead className="w-24 text-end font-bold pe-5">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => {
                  const PlanIcon = getPlanIcon(plan);
                  const isMultiYear =
                    plan.durationUnit === "years" && plan.durationValue > 1;

                  return (
                    <TableRow
                      key={plan.id}
                      className="transition-colors hover:bg-muted/30 border-b border-border/50 last:border-0"
                    >
                      {/* Duration Name & Icon */}
                      <TableCell className="ps-5 py-3.5">
                        <div className="flex items-center gap-3 font-bold text-foreground">
                          <div
                            className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                              plan.isPopular
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "bg-primary-50 text-primary dark:bg-primary-950/40 dark:text-primary-400"
                            }`}
                          >
                            <PlanIcon className="size-4.5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-foreground block">
                              {plan.duration}
                            </span>
                            <span className="text-[11px] font-normal text-muted-foreground">
                              {plan.durationUnit === "months"
                                ? `${plan.durationValue} شهر`
                                : `${plan.durationValue} ${plan.durationValue === 1 ? "سنة" : plan.durationValue === 2 ? "سنتين" : "سنوات"}`}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Time Unit */}
                      <TableCell className="py-3.5">
                        <Badge
                          variant="secondary"
                          className="font-medium text-xs rounded-md px-2 py-0.5"
                        >
                          {plan.durationUnit === "months" ? "شهري" : "سنوي"} (
                          {plan.durationValue}{" "}
                          {plan.durationUnit === "months" ? "شهر" : "سنة"})
                        </Badge>
                      </TableCell>

                      {/* Fee Amount with SaudiRiyal Icon */}
                      <TableCell className="py-3.5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-extrabold text-foreground">
                            <span className="text-base text-primary">
                              <bdi>{plan.amount.toLocaleString("en-US")}</bdi>
                            </span>
                            <SaudiRiyal className="size-4 text-primary shrink-0" />
                          </div>
                          {isMultiYear && (
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                              ~{Math.round(plan.amount / plan.durationValue)}{" "}
                              <SaudiRiyal className="size-3" /> / سنة
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Popular Badge */}
                      <TableCell className="py-3.5">
                        {plan.isPopular ? (
                          <PopularBadge />
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground border-border/60 text-[11px] font-normal"
                          >
                            عادي
                          </Badge>
                        )}
                      </TableCell>

                      {/* Notes / Highlights */}
                      <TableCell className="py-3.5 max-w-[200px]">
                        {plan.notes ? (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                            <Zap className="size-3 text-secondary shrink-0" />
                            <span className="truncate" title={plan.notes}>
                              {plan.notes}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">—</span>
                        )}
                      </TableCell>

                      {/* Actions with Tooltips */}
                      <TableCell className="text-end pe-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                  onClick={() => handleOpenEdit(plan)}
                                  aria-label={`تعديل باقة ${plan.duration}`}
                                >
                                  <Edit2 className="size-3.5" />
                                </Button>
                              }
                            />
                            <TooltipContent side="top">تعديل الباقة</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => setDeleteId(plan.id)}
                                  aria-label={`حذف باقة ${plan.duration}`}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              }
                            />
                            <TooltipContent side="top">حذف الباقة</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Edit / Add Plan Dialog */}
      <PlanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        editingPlan={editingPlan}
        onSave={handleSave}
      />

      <WarningDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="تأكيد الحذف"
        description="هل أنت متأكد من رغبتك في حذف باقة التوثيق هذه؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف"
        onConfirm={confirmDelete}
      />
    </Card>
  );
}
