import { useState } from "react";
import { Clock, Edit2, Plus, RotateCcw, Star, Trash2 } from "lucide-react";
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
import type { PricingPlan } from "@/features/pricing/constants";

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

  const handleOpenAdd = () => {
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
  };

  const handleOpenEdit = (plan: PricingPlan) => {
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
  };

  const handleDelete = (id: string) => {
    onPlansChange(plans.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    if (!formData.duration?.trim() || !formData.amount) return;

    if (editingPlan) {
      const updated = plans.map((p) =>
        p.id === editingPlan.id
          ? ({
              ...p,
              duration: formData.duration || p.duration,
              durationUnit: formData.durationUnit || p.durationUnit,
              durationValue: Number(formData.durationValue) || p.durationValue,
              amount: Number(formData.amount) || p.amount,
              isPopular: !!formData.isPopular,
              notes: formData.notes,
            } as PricingPlan)
          : p
      );
      onPlansChange(updated);
    } else {
      const newPlan: PricingPlan = {
        id: `plan_${Date.now()}`,
        duration: formData.duration || "",
        durationUnit: formData.durationUnit || "years",
        durationValue: Number(formData.durationValue) || 1,
        amount: Number(formData.amount) || 0,
        isPopular: !!formData.isPopular,
        notes: formData.notes,
      };
      onPlansChange([...plans, newPlan]);
    }

    setIsDialogOpen(false);
  };

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold">
            رسوم مدد توثيق العقود الإلكترونية
          </CardTitle>
          <CardDescription>
            إدارة مدد العقود ورسوم التوثيق الأساسية المعتمدة في النظام
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={onResetDefaults}
          >
            <RotateCcw className="size-3.5" />
            <span>استعادة الافتراضي</span>
          </Button>

          <Button
            type="button"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={handleOpenAdd}
          >
            <Plus className="size-3.5" />
            <span>إضافة باقة / مدة جديدة</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="font-bold">مدة العقد</TableHead>
                <TableHead className="font-bold">الوحدة الزمنية</TableHead>
                <TableHead className="font-bold">رسوم التوثيق</TableHead>
                <TableHead className="font-bold">التمييز والتفضيل</TableHead>
                <TableHead className="w-24 text-end font-bold">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id} className="transition-colors hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-2.5 font-bold text-foreground">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <Clock className="size-4" />
                      </div>
                      <span>{plan.duration}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {plan.durationUnit === "months"
                        ? `${plan.durationValue} شهور`
                        : `${plan.durationValue} سنوات`}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-baseline gap-1 font-extrabold text-foreground">
                      <span className="text-base text-primary">{plan.amount}</span>
                      <span className="text-xs font-semibold text-muted-foreground">﷼</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {plan.isPopular ? (
                      <Badge className="bg-primary text-primary-foreground text-xs gap-1">
                        <Star className="size-3 fill-current" />
                        <span>الأكثر طلباً</span>
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">عادي</span>
                    )}
                  </TableCell>

                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenEdit(plan)}
                        title="تعديل"
                      >
                        <Edit2 className="size-3.5" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive/70 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(plan.id)}
                        title="حذف"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit / Add Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingPlan ? "تعديل مدة التوثيق والسعر" : "إضافة مدة جديدة"}
            </DialogTitle>
            <DialogDescription>
              تحديد مدة العقد ورسوم التوثيق المعتمدة
            </DialogDescription>
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
                placeholder="مثال: سنتين أو 3 سنوات"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="unit-type">الوحدة</Label>
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
                  <SelectTrigger id="unit-type">
                    <SelectValue />
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
              <Label htmlFor="plan-amount">المبلغ الأساسي (﷼)</Label>
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
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <Label htmlFor="is-pop" className="cursor-pointer">
                تمييز كباقة الأكثر طلباً
              </Label>
              <Switch
                id="is-pop"
                checked={formData.isPopular}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPopular: checked })
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="button" onClick={handleSave}>
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
