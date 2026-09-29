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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { OptionItem } from "@/features/unit-options/constants";
import type { OptionItemFormValues } from "@/features/unit-options/hooks/use-option-item-editor";

const OPTION_CATEGORIES = [
  "سكني",
  "تجاري",
  "صناعي/لوجستي",
  "مختلط",
] as const;

interface OptionItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: OptionItem | null;
  addTitle: string;
  showCategory: boolean;
  formData: OptionItemFormValues;
  onFormDataChange: (next: OptionItemFormValues) => void;
  onSave: () => void;
}

export default function OptionItemDialog({
  open,
  onOpenChange,
  editingItem,
  addTitle,
  showCategory,
  formData,
  onFormDataChange,
  onSave,
}: OptionItemDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] rounded-2xl p-4 sm:max-w-md sm:p-6">
        <DialogHeader className="gap-1 text-start">
          <DialogTitle className="text-base font-bold sm:text-lg">
            {editingItem ? "تعديل خيار القائمة المنسدلة" : addTitle}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            سيظهر هذا الخيار في القوائم المنسدلة للمستخدمين بالموقع الرئيسي عند
            التفعيل.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1 sm:space-y-4 sm:py-2">
          <div className="space-y-1 sm:space-y-1.5">
            <Label htmlFor="optionName" className="text-xs font-semibold sm:text-sm">
              الاسم بالعربية *
            </Label>
            <Input
              id="optionName"
              value={formData.nameAr}
              onChange={(event) =>
                onFormDataChange({ ...formData, nameAr: event.target.value })
              }
              placeholder="أدخل اسم الخيار (مثال: استوديو مفروش)"
              className="h-9 text-xs placeholder:text-muted-foreground/70 sm:text-sm"
            />
          </div>

          {showCategory ? (
            <div className="space-y-1 sm:space-y-1.5">
              <Label htmlFor="optionCategory" className="text-xs font-semibold sm:text-sm">
                التصنيف
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  if (!value) return;
                  onFormDataChange({ ...formData, category: value });
                }}
              >
                <SelectTrigger
                  id="optionCategory"
                  className="h-9 w-full text-xs sm:text-sm"
                >
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent align="start">
                  {OPTION_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="space-y-1 sm:space-y-1.5">
            <Label htmlFor="optionDesc" className="text-xs font-semibold sm:text-sm">
              الوصف والتوضيح
            </Label>
            <Input
              id="optionDesc"
              value={formData.description}
              onChange={(event) =>
                onFormDataChange({
                  ...formData,
                  description: event.target.value,
                })
              }
              placeholder="وصف مختصر للوحدة أو العقار"
              className="h-9 text-xs placeholder:text-muted-foreground/70 sm:text-sm"
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-2.5 sm:p-3">
            <div>
              <Label className="text-xs font-medium sm:text-sm">
                تفعيل الخيار مباشرة
              </Label>
              <p className="text-[11px] text-muted-foreground sm:text-xs">
                إتاحة هذا الخيار فوراً في القوائم المنسدلة بالموقع الرئيسي
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                onFormDataChange({ ...formData, isActive: checked })
              }
              className="scale-90 sm:scale-100"
            />
          </div>
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2.5">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 w-full text-xs sm:w-auto sm:text-sm"
          >
            إلغاء
          </Button>
          <Button
            onClick={onSave}
            disabled={!formData.nameAr.trim()}
            className="h-9 w-full gap-1.5 text-xs sm:w-auto sm:text-sm"
          >
            <Check className="size-4" />
            <span>{editingItem ? "حفظ التعديلات" : "إضافة الخيار"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
