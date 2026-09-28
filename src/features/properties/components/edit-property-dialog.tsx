import { useState } from "react";
import { Edit3, Save } from "lucide-react";
import { toast } from "sonner";
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
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { Property, PropertyBuildingType } from "../types";

interface EditPropertyDialogProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProperty: Property) => void;
}

export default function EditPropertyDialog({
  property,
  isOpen,
  onClose,
  onSave,
}: EditPropertyDialogProps) {
  const [name, setName] = useState(property.name);
  const [buildingType, setBuildingType] = useState<PropertyBuildingType>(
    property.buildingType,
  );
  const [propertyAgeYears, setPropertyAgeYears] = useState(
    String(property.propertyAgeYears),
  );
  const [floorsCount, setFloorsCount] = useState(String(property.floorsCount));
  const [totalAreaSqm, setTotalAreaSqm] = useState(String(property.totalAreaSqm));
  const [description, setDescription] = useState(property.description || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("يرجى إدخال اسم العقار");
      return;
    }

    const buildingTypeLabels: Record<PropertyBuildingType, string> = {
      building: "عمارة سكنية",
      villa: "فيلا",
      commercial_center: "مجمع تجاري",
      office_tower: "برج مكاتب",
      compound: "مجمع سكني",
      warehouse_complex: "مجمع مستودعات",
      showroom_plaza: "مجمع معارض",
    };

    const updated: Property = {
      ...property,
      name,
      buildingType,
      buildingTypeLabel: buildingTypeLabels[buildingType] || property.buildingTypeLabel,
      propertyAgeYears: Number(propertyAgeYears) || property.propertyAgeYears,
      floorsCount: Number(floorsCount) || property.floorsCount,
      totalAreaSqm: Number(totalAreaSqm) || property.totalAreaSqm,
      description,
      updatedAt: new Date().toISOString(),
    };

    onSave(updated);
    toast.success("تم تحديث بيانات العقار بنجاح");
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="text-start">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Edit3 className="size-5 text-primary" />
              تعديل بيانات العقار
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              تحديث المعلومات الأساسية، عدد الأدوار، والمساحة الإجمالية للعقار.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-start">
            <div className="space-y-1.5">
              <Label htmlFor="propName" className="text-xs">
                اسم العقار *
              </Label>
              <Input
                id="propName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="propBldType" className="text-xs">
                  نوع المبنى
                </Label>
                <NativeSelect
                  id="propBldType"
                  value={buildingType}
                  onChange={(e) =>
                    setBuildingType(e.target.value as PropertyBuildingType)
                  }
                  className="h-9 text-xs"
                >
                  <option value="building">عمارة سكنية</option>
                  <option value="villa">فيلا سكنية</option>
                  <option value="commercial_center">مجمع تجاري</option>
                  <option value="office_tower">برج مكاتب</option>
                  <option value="compound">مجمع سكني مغلق</option>
                  <option value="warehouse_complex">مجمع مستودعات</option>
                  <option value="showroom_plaza">مجمع معارض تجارية</option>
                </NativeSelect>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="propArea" className="text-xs">
                  إجمالي المساحة (م²)
                </Label>
                <Input
                  id="propArea"
                  type="number"
                  value={totalAreaSqm}
                  onChange={(e) => setTotalAreaSqm(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="propFloors" className="text-xs">
                  عدد الأدوار
                </Label>
                <Input
                  id="propFloors"
                  type="number"
                  value={floorsCount}
                  onChange={(e) => setFloorsCount(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="propAge" className="text-xs">
                  عمر العقار (سنوات)
                </Label>
                <Input
                  id="propAge"
                  type="number"
                  value={propertyAgeYears}
                  onChange={(e) => setPropertyAgeYears(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="propDesc" className="text-xs">
                الوصف والملاحظات
              </Label>
              <Textarea
                id="propDesc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="text-xs resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2.5 sm:gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:scale-98 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-primary-800 via-primary to-primary-400 text-primary-foreground px-4 text-xs font-bold shadow-md shadow-inner-primary hover:brightness-105 active:scale-98 cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>حفظ التعديلات</span>
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
