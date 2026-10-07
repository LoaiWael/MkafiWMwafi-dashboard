import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
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
import type { UnitOptionItem } from "../types";
import {
  unitOptionFormSchema,
  type UnitOptionFormData,
} from "../schemas/unit-options-schema";

interface UnitOptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: UnitOptionItem | null;
  entityLabel: string;
  isSaving: boolean;
  onSave: (data: UnitOptionFormData) => Promise<boolean>;
}

export default function UnitOptionDialog({
  open,
  onOpenChange,
  editingItem,
  entityLabel,
  isSaving,
  onSave,
}: UnitOptionDialogProps) {
  const [formData, setFormData] = useState<UnitOptionFormData>({
    name: "",
    sortOrder: 1,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        sortOrder: editingItem.sortOrder,
        isActive: editingItem.isActive,
      });
    } else {
      setFormData({
        name: "",
        sortOrder: 1,
        isActive: true,
      });
    }
    setErrors({});
  }, [editingItem, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = unitOptionFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    await onSave(result.data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl p-4 sm:max-w-md sm:p-6">
        <DialogHeader className="gap-1 text-start">
          <DialogTitle className="text-base font-bold sm:text-lg">
            {editingItem ? `تعديل ${entityLabel}` : `إضافة ${entityLabel} جديد`}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            سيتم ربط وحفظ هذا الخيار مباشرة بقاعدة البيانات ويظهر في القوائم المنسدلة بالموقع.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 py-1 sm:space-y-4 sm:py-2">
          <div className="space-y-1 sm:space-y-1.5">
            <Label htmlFor="optionName" className="text-xs font-semibold sm:text-sm">
              الاسم بالعربية *
            </Label>
            <Input
              id="optionName"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder={`أدخل اسم ${entityLabel}`}
              className="h-9 text-xs placeholder:text-muted-foreground/70 sm:text-sm"
              autoFocus
            />
            {errors.name ? (
              <p className="text-[11px] text-destructive">{errors.name}</p>
            ) : null}
          </div>

          <div className="space-y-1 sm:space-y-1.5">
            <Label htmlFor="optionSortOrder" className="text-xs font-semibold sm:text-sm">
              ترتيب العرض
            </Label>
            <Input
              id="optionSortOrder"
              type="number"
              min={0}
              value={formData.sortOrder}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  sortOrder: Number(e.target.value) || 0,
                }));
                if (errors.sortOrder)
                  setErrors((prev) => ({ ...prev, sortOrder: "" }));
              }}
              placeholder="1"
              className="h-9 text-xs placeholder:text-muted-foreground/70 sm:text-sm"
            />
            {errors.sortOrder ? (
              <p className="text-[11px] text-destructive">{errors.sortOrder}</p>
            ) : null}
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-2.5 sm:p-3">
            <div>
              <Label htmlFor="optionIsActive" className="text-xs font-medium sm:text-sm">
                تفعيل الخيار مباشرة
              </Label>
              <p className="text-[11px] text-muted-foreground sm:text-xs">
                إتاحة هذا الخيار فوراً في القوائم المنسدلة بالموقع الرئيسي
              </p>
            </div>
            <Switch
              id="optionIsActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isActive: checked }))
              }
              className="scale-90 sm:scale-100 cursor-pointer"
            />
          </div>

          <DialogFooter className="flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="h-9 w-full text-xs sm:w-auto sm:text-sm cursor-pointer"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !formData.name.trim()}
              className="h-9 w-full gap-1.5 text-xs sm:w-auto sm:text-sm cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              <span>{editingItem ? "حفظ التعديلات" : "إضافة الخيار"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
