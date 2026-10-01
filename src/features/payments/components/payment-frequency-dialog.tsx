import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import type { PaymentFrequencyOption } from "@/features/payments/constants";

interface PaymentFrequencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  frequency: PaymentFrequencyOption | null;
  onSave: (
    data: Omit<PaymentFrequencyOption, "id">,
    id?: string,
  ) => void;
}

export default function PaymentFrequencyDialog({
  open,
  onOpenChange,
  frequency,
  onSave,
}: PaymentFrequencyDialogProps) {
  const [formState, setFormState] = useState<{
    nameAr: string;
    installmentCount: number;
    periodAr: string;
    description: string;
    isActive: boolean;
  }>({
    nameAr: "",
    installmentCount: 1,
    periodAr: "سنوي",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (frequency) {
      setFormState({
        nameAr: frequency.nameAr,
        installmentCount: frequency.installmentCount,
        periodAr: frequency.periodAr,
        description: frequency.description,
        isActive: frequency.isActive,
      });
    } else {
      setFormState({
        nameAr: "",
        installmentCount: 1,
        periodAr: "سنوي",
        description: "",
        isActive: true,
      });
    }
  }, [frequency, open]);

  const handleSave = () => {
    if (!formState.nameAr.trim()) return;

    onSave(
      {
        nameAr: formState.nameAr.trim(),
        installmentCount: Number(formState.installmentCount),
        periodAr: formState.periodAr.trim(),
        description: formState.description.trim(),
        isActive: formState.isActive,
      },
      frequency?.id,
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {frequency
              ? "تعديل خيار طريقة الدفعات"
              : "إضافة خيار طريقة دفعات جديد"}
          </DialogTitle>
          <DialogDescription>
            سيظهر هذا الخيار في القائمة المنسدلة لطريقة الدفعات في استمارة
            الموقع الرئيسي.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="freqName">اسم الخيار بالعربية *</Label>
            <Input
              id="freqName"
              value={formState.nameAr}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  nameAr: e.target.value,
                }))
              }
              placeholder="مثال: دفعتان (نصف سنوي)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="installmentCount">عدد الدفعات سنوياً</Label>
              <Input
                id="installmentCount"
                type="number"
                min={1}
                max={24}
                value={formState.installmentCount}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    installmentCount: Number(e.target.value),
                  }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="freqPeriod">التكرار</Label>
              <Input
                id="freqPeriod"
                value={formState.periodAr}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    periodAr: e.target.value,
                  }))
                }
                placeholder="مثال: كل 6 أشهر"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="freqDesc">الوصف والتوضيح</Label>
            <Input
              id="freqDesc"
              value={formState.description}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="توضيح آلية التقسيط أو السداد"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
            <div>
              <Label className="text-sm font-medium">
                تفعيل الخيار مباشرة
              </Label>
              <p className="text-xs text-muted-foreground">
                إتاحة هذا الخيار فوراً في القائمة المنسدلة بالموقع
              </p>
            </div>
            <Switch
              checked={formState.isActive}
              onCheckedChange={(checked) =>
                setFormState((prev) => ({ ...prev, isActive: checked }))
              }
            />
          </div>
        </div>

        <DialogFooter className="gap-2.5 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formState.nameAr.trim()}
            className="gap-1.5 cursor-pointer"
          >
            <Check className="size-4" />
            {frequency ? "حفظ التعديلات" : "إضافة الخيار"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
