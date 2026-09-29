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
import {
  PARTY_OPTION_CATEGORIES,
  type OptionItem,
} from "@/features/party-options/constants";

export interface PartyOptionFormValues {
  nameAr: string;
  category: string;
  description: string;
  isActive: boolean;
}

interface PartyOptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: OptionItem | null;
  formData: PartyOptionFormValues;
  onFormDataChange: (next: PartyOptionFormValues) => void;
  onSave: () => void;
}

export default function PartyOptionDialog({
  open,
  onOpenChange,
  editingItem,
  formData,
  onFormDataChange,
  onSave,
}: PartyOptionDialogProps) {
  const categoryOptions = [
    ...new Set(
      [...PARTY_OPTION_CATEGORIES, formData.category].filter(Boolean),
    ),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "تعديل صفة الطرف" : "إضافة صفة طرف جديدة"}
          </DialogTitle>
          <DialogDescription>
            تظهر هذه الصفة في قائمة صفة المستأجر والمؤجر بالموقع الرئيسي.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="partyOptionName">الاسم بالعربية *</Label>
            <Input
              id="partyOptionName"
              value={formData.nameAr}
              onChange={(event) =>
                onFormDataChange({ ...formData, nameAr: event.target.value })
              }
              placeholder="أدخل صفة الطرف (مثال: مؤسسة / شركة)"
              dir="auto"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="partyOptionCategory">التصنيف</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => {
                if (!value) return;
                onFormDataChange({ ...formData, category: value });
              }}
            >
              <SelectTrigger id="partyOptionCategory" className="w-full">
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent align="start">
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="partyOptionDesc">الوصف</Label>
            <Input
              id="partyOptionDesc"
              value={formData.description}
              onChange={(event) =>
                onFormDataChange({
                  ...formData,
                  description: event.target.value,
                })
              }
              placeholder="توضيح صفة الطرف"
              dir="auto"
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3">
            <div>
              <Label className="text-sm font-medium">تفعيل الخيار مباشرة</Label>
              <p className="text-xs text-muted-foreground">
                إتاحة هذه الصفة فوراً في القائمة المنسدلة بالموقع الرئيسي
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                onFormDataChange({ ...formData, isActive: checked })
              }
            />
          </div>
        </div>

        <DialogFooter className="gap-2.5 sm:gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button
            onClick={onSave}
            disabled={!formData.nameAr.trim()}
            className="gap-1.5"
          >
            <Check className="size-4" />
            {editingItem ? "حفظ التعديلات" : "إضافة الخيار"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
