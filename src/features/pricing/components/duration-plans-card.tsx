import { useState } from "react";
import {
  Building2,
  CalendarDays,
  CalendarRange,
  Clock,
  Edit2,
  Home,
  Plus,
  RefreshCw,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { PricingPlanItem } from "../types";
import { PopularBadge } from "./popular-badge";
import PlanDialog from "./plan-dialog";
import type { PricingPlanFormData } from "../schemas/pricing-schema";
import WarningDialog from "@/components/warning-dialog";

interface DurationPlansCardProps {
  plans: PricingPlanItem[];
  isLoading?: boolean;
  isSaving?: boolean;
  onSave: (
    data: PricingPlanFormData,
    editingPlan: PricingPlanItem | null,
  ) => Promise<unknown> | void;
  onDelete: (id: string | number) => Promise<unknown> | void;
  onToggleActive?: (plan: PricingPlanItem) => Promise<unknown> | void;
  onRefresh?: () => void;
}

export default function DurationPlansCard({
  plans,
  isLoading = false,
  isSaving = false,
  onSave,
  onDelete,
  onToggleActive,
  onRefresh,
}: DurationPlansCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlanItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  const popularCount = plans.filter((p) => p.isPopular).length;
  const activeCount = plans.filter((p) => p.isActive).length;

  function handleOpenAdd() {
    setEditingPlan(null);
    setIsDialogOpen(true);
  }

  function handleOpenEdit(plan: PricingPlanItem) {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  }

  async function confirmDelete() {
    if (deleteId !== null) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  }

  async function handleDialogSave(data: PricingPlanFormData) {
    await onSave(data, editingPlan);
  }

  function getPlanIcon(plan: PricingPlanItem) {
    if (plan.durationUnit === "months") return Clock;
    if (plan.durationValue > 5) return CalendarRange;
    return CalendarDays;
  }

  return (
    <Card className="border-border/80 shadow-xs overflow-hidden">
      <CardHeader className="flex flex-col gap-4 border-b border-border/60 bg-card/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5 text-start">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary dark:bg-primary-950/40">
              <SlidersHorizontal className="size-4" />
            </div>
            <CardTitle className="text-lg font-bold">
              رسوم ومدد توثيق العقود
            </CardTitle>
            <Badge variant="secondary" className="font-semibold text-xs">
              {plans.length} باقة
            </Badge>
            {plans.length > 0 && (
              <Badge
                variant="outline"
                className="border-border text-xs text-muted-foreground"
              >
                {activeCount} نشطة
              </Badge>
            )}
            {popularCount > 0 && (
              <Badge
                variant="outline"
                className="border-primary/30 text-primary text-xs"
              >
                {popularCount} مُميزة
              </Badge>
            )}
          </div>
          <CardDescription className="text-xs sm:text-sm">
            إدارة مدد العقود ورسوم التوثيق الأساسية المعتمدة وتخصيص الباقات الأكثر طلباً
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onRefresh && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={onRefresh}
              disabled={isLoading || isSaving}
            >
              <RefreshCw className="size-3.5" />
              <span>تحديث</span>
            </Button>
          )}

          <Button
            type="button"
            size="sm"
            className="h-9 gap-1.5 text-xs font-semibold cursor-pointer"
            onClick={handleOpenAdd}
            disabled={isLoading || isSaving}
          >
            <Plus className="size-3.5" />
            <span>إضافة باقة جديدة</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 py-2 border-b border-border/40 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <Empty className="border-0 bg-transparent py-14 sm:py-20">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="size-12 rounded-xl bg-primary/10 text-primary"
              >
                <SlidersHorizontal className="size-6 text-primary" />
              </EmptyMedia>
              <EmptyTitle className="text-base sm:text-lg font-bold">
                لا توجد باقات توثيق مسجلة حالياً
              </EmptyTitle>
              <EmptyDescription className="text-xs sm:text-sm max-w-md">
                لم يتم إضافة أي باقات تسعير لتوثيق العقود بعد. يمكنك إضافة أول باقة لتظهر مباشرة للمستخدمين في حاسبة ونظام التوثيق.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Button
                onClick={handleOpenAdd}
                className="gap-2 font-bold cursor-pointer"
                size="sm"
              >
                <Plus className="size-4" />
                <span>إضافة أول باقة توثيق</span>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/70">
                  <TableHead className="font-bold text-start ps-5">
                    مدة العقد
                  </TableHead>
                  <TableHead className="font-bold text-start">
                    نوع العقد
                  </TableHead>
                  <TableHead className="font-bold text-start">
                    رسوم التوثيق
                  </TableHead>
                  <TableHead className="font-bold text-start">الحالة</TableHead>
                  <TableHead className="font-bold text-start">التمييز</TableHead>
                  <TableHead className="font-bold text-start">
                    الملاحظات
                  </TableHead>
                  <TableHead className="w-24 text-end font-bold pe-5">
                    إجراءات
                  </TableHead>
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
                          <div className="text-start">
                            <span className="text-sm font-bold text-foreground block">
                              {plan.duration}
                            </span>
                            <span className="text-[11px] font-normal text-muted-foreground">
                              {plan.durationUnit === "months"
                                ? `${plan.durationValue} شهر`
                                : `${plan.durationValue} ${
                                    plan.durationValue === 1
                                      ? "سنة"
                                      : plan.durationValue === 2
                                        ? "سنتين"
                                        : "سنوات"
                                  }`}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Contract Type */}
                      <TableCell className="py-3.5 text-start">
                        <Badge
                          variant="outline"
                          className={
                            plan.contractType === "commercial"
                              ? "border-secondary/30 bg-secondary/10 text-secondary-700 dark:text-secondary-300 gap-1 font-medium text-xs rounded-md px-2 py-0.5"
                              : "border-primary/30 bg-primary/10 text-primary-700 dark:text-primary-300 gap-1 font-medium text-xs rounded-md px-2 py-0.5"
                          }
                        >
                          {plan.contractType === "commercial" ? (
                            <Building2 className="size-3" />
                          ) : (
                            <Home className="size-3" />
                          )}
                          <span>
                            {plan.contractType === "commercial"
                              ? "تجاري"
                              : "سكني"}
                          </span>
                        </Badge>
                      </TableCell>

                      {/* Fee Amount with SaudiRiyal Icon */}
                      <TableCell className="py-3.5 text-start">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-extrabold text-foreground">
                            <span className="text-base text-primary">
                              <bdi>{plan.amount.toLocaleString("en-US")}</bdi>
                            </span>
                            <SaudiRiyal className="size-4 text-primary shrink-0" />
                          </div>
                          {isMultiYear && (
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                              ~
                              {plan.yearlyAverage ??
                                Math.round(plan.amount / plan.durationValue)}{" "}
                              <SaudiRiyal className="size-3" /> / سنة
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Active Status Toggle */}
                      <TableCell className="py-3.5 text-start">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={plan.isActive}
                            onCheckedChange={() => onToggleActive?.(plan)}
                            aria-label={`تفعيل باقة ${plan.duration}`}
                            className="cursor-pointer"
                          />
                          <span className="text-xs text-muted-foreground">
                            {plan.isActive ? "نشط" : "معطل"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Popular Badge */}
                      <TableCell className="py-3.5 text-start">
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
                      <TableCell className="py-3.5 max-w-[200px] text-start">
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

                      {/* Actions */}
                      <TableCell className="text-end pe-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
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
                                  className="size-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
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
        onSave={handleDialogSave}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Dialog */}
      <WarningDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="تأكيد حذف باقة التوثيق"
        description="هل أنت متأكد من رغبتك في حذف باقة التوثيق هذه؟ لن تكون متاحة للمستخدمين في نظام العقود بعد الحذف."
        confirmLabel="حذف"
        onConfirm={confirmDelete}
      />
    </Card>
  );
}
