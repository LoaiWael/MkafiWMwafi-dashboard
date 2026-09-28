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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { PricingPlan } from "@/features/pricing/constants";
import { PopularBadge } from "@/features/pricing/components/popular-badge";

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

  const [formData, setFormData] = useState<Partial<PricingPlan>>({
    duration: "",
    durationUnit: "years",
    durationValue: 1,
    amount: 249,
    isPopular: false,
    notes: "",
  });

  const popularCount = plans.filter((p) => p.isPopular).length;

  function handleOpenAdd() {
    setEditingPlan(null);
    setFormData({
      duration: "",
      durationUnit: "years",
      durationValue: 1,
      amount: 249,
      isPopular: false,
      notes: "",
    });
    setIsDialogOpen(true);
  }

  function handleOpenEdit(plan: PricingPlan) {
    setEditingPlan(plan);
    setFormData({
      duration: plan.duration,
      durationUnit: plan.durationUnit,
      durationValue: plan.durationValue,
      amount: plan.amount,
      isPopular: plan.isPopular || false,
      notes: plan.notes || "",
    });
    setIsDialogOpen(true);
  }

  function handleDelete(id: string) {
    onPlansChange(plans.filter((p) => p.id !== id));
    toast.success("تم حذف مدة التوثيق بنجاح");
  }

  function handleSave() {
    if (!formData.duration?.trim() || !formData.amount) {
      toast.error("يرجى إدخال اسم المدة ورسوم التوثيق");
      return;
    }

    if (editingPlan) {
      const updated = plans.map((p) =>
        p.id === editingPlan.id
          ? ({
              ...p,
              duration: formData.duration?.trim() || p.duration,
              durationUnit: formData.durationUnit || p.durationUnit,
              durationValue: Number(formData.durationValue) || p.durationValue,
              amount: Number(formData.amount) || p.amount,
              isPopular: !!formData.isPopular,
              notes: formData.notes?.trim() || undefined,
            } as PricingPlan)
          : p,
      );
      onPlansChange(updated);
      toast.success("تم تحديث باقة مدة التوثيق بنجاح");
    } else {
      const newPlan: PricingPlan = {
        id: `plan_${Date.now()}`,
        duration: formData.duration.trim(),
        durationUnit: formData.durationUnit || "years",
        durationValue: Number(formData.durationValue) || 1,
        amount: Number(formData.amount) || 0,
        isPopular: !!formData.isPopular,
        notes: formData.notes?.trim() || undefined,
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
                                  onClick={() => handleDelete(plan.id)}
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary dark:bg-primary-950/40">
                {editingPlan ? (
                  <Edit2 className="size-4.5" />
                ) : (
                  <Plus className="size-4.5" />
                )}
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">
                  {editingPlan ? "تعديل مدة التوثيق والسعر" : "إضافة مدة جديدة"}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  تحديد مدة العقد ورسوم التوثيق المعتمدة في النظام
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="plan-duration">اسم المدة (كما يظهر للمستخدم)</Label>
              <Input
                id="plan-duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="مثال: سنتين أو 3 سنوات أو 6 شهور"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="unit-type">الوحدة الزمنية</Label>
                <Select
                  value={formData.durationUnit}
                  onValueChange={(val) => {
                    if (val) {
                      setFormData((prev) => ({
                        ...prev,
                        durationUnit: val as "months" | "years",
                      }));
                    }
                  }}
                >
                  <SelectTrigger id="unit-type" className="w-full">
                    <SelectValue>
                      {formData.durationUnit === "months" ? "شهور" : "سنوات"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">سنوات</SelectItem>
                    <SelectItem value="months">شهور</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="unit-val">القيمة الرقمية</Label>
                <Input
                  id="unit-val"
                  type="number"
                  min="1"
                  value={formData.durationValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      durationValue: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="plan-amount" className="flex items-center gap-1.5">
                <span>المبلغ الأساسي</span>
                <span className="flex items-center text-xs text-muted-foreground font-normal">
                  (<SaudiRiyal className="size-3 inline text-primary" />)
                </span>
              </Label>
              <div className="relative">
                <Input
                  id="plan-amount"
                  type="number"
                  min="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="pe-9"
                />
                <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground">
                  <SaudiRiyal className="size-4 text-primary" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="plan-notes">ملاحظات / وصف إضافي (اختياري)</Label>
              <Input
                id="plan-notes"
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="مثال: الباقة الأكثر توفيراً للعقود طويلة الأجل"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/30 p-3">
              <div className="space-y-0.5">
                <Label htmlFor="is-pop" className="cursor-pointer font-bold text-sm">
                  تمييز كباقة الأكثر طلباً
                </Label>
                <p className="text-xs text-muted-foreground">
                  إظهار شارة مميزة وإبراز الباقة في واجهة التسعير
                </p>
              </div>
              <Switch
                id="is-pop"
                checked={formData.isPopular}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPopular: checked })
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2.5 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="button" onClick={handleSave}>
              {editingPlan ? "حفظ التعديلات" : "إضافة الباقة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
