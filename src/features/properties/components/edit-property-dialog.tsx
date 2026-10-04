import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import {
  editPropertySchema,
  type EditPropertyFormData,
} from "@/features/properties/schemas/property-schema";
import type { Property, PropertyBuildingType } from "../types";

interface EditPropertyDialogProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProperty: Property) => void;
}

const buildingTypeLabels: Record<PropertyBuildingType, string> = {
  building: "عمارة سكنية",
  villa: "فيلا سكنية",
  commercial_center: "مجمع تجاري",
  office_tower: "برج مكاتب",
  compound: "مجمع سكني مغلق",
  warehouse_complex: "مجمع مستودعات",
  showroom_plaza: "مجمع معارض تجارية",
};

export default function EditPropertyDialog({
  property,
  isOpen,
  onClose,
  onSave,
}: EditPropertyDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditPropertyFormData>({
    resolver: zodResolver(editPropertySchema),
    defaultValues: {
      name: property.name,
      buildingType: property.buildingType,
      propertyAgeYears: String(property.propertyAgeYears || ""),
      floorsCount: String(property.floorsCount || ""),
      totalAreaSqm: String(property.totalAreaSqm || ""),
      description: property.description || "",
    },
  });

  useEffect(() => {
    reset({
      name: property.name,
      buildingType: property.buildingType,
      propertyAgeYears: String(property.propertyAgeYears || ""),
      floorsCount: String(property.floorsCount || ""),
      totalAreaSqm: String(property.totalAreaSqm || ""),
      description: property.description || "",
    });
  }, [property, reset]);

  function onSubmit(data: EditPropertyFormData) {
    const updated: Property = {
      ...property,
      name: data.name,
      buildingType: data.buildingType as PropertyBuildingType,
      buildingTypeLabel:
        buildingTypeLabels[data.buildingType as PropertyBuildingType] ||
        property.buildingTypeLabel,
      propertyAgeYears: data.propertyAgeYears
        ? Number(data.propertyAgeYears)
        : property.propertyAgeYears,
      floorsCount: data.floorsCount
        ? Number(data.floorsCount)
        : property.floorsCount,
      totalAreaSqm: data.totalAreaSqm
        ? Number(data.totalAreaSqm)
        : property.totalAreaSqm,
      description: data.description || "",
      updatedAt: new Date().toISOString(),
    };

    onSave(updated);
    toast.success("تم تحديث بيانات العقار بنجاح");
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
              <Label htmlFor="propName" className="text-xs font-semibold">
                اسم العقار <span className="text-destructive">*</span>
              </Label>
              <Input
                id="propName"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.name)}
                className="h-9 text-xs"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="propBldType" className="text-xs font-semibold">
                  نوع المبنى <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="buildingType"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="propBldType"
                        aria-invalid={Boolean(errors.buildingType)}
                        className="w-full h-9 text-xs"
                      >
                        <SelectValue placeholder="اختر نوع المبنى" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="building">عمارة سكنية</SelectItem>
                        <SelectItem value="villa">فيلا سكنية</SelectItem>
                        <SelectItem value="commercial_center">
                          مجمع تجاري
                        </SelectItem>
                        <SelectItem value="office_tower">برج مكاتب</SelectItem>
                        <SelectItem value="compound">
                          مجمع سكني مغلق
                        </SelectItem>
                        <SelectItem value="warehouse_complex">
                          مجمع مستودعات
                        </SelectItem>
                        <SelectItem value="showroom_plaza">
                          مجمع معارض تجارية
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.buildingType && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.buildingType.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="propArea" className="text-xs font-semibold">
                  إجمالي المساحة (م²)
                </Label>
                <Input
                  id="propArea"
                  type="number"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.totalAreaSqm)}
                  className="h-9 text-xs"
                  {...register("totalAreaSqm")}
                />
                {errors.totalAreaSqm && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.totalAreaSqm.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="propFloors" className="text-xs font-semibold">
                  عدد الأدوار
                </Label>
                <Input
                  id="propFloors"
                  type="number"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.floorsCount)}
                  className="h-9 text-xs"
                  {...register("floorsCount")}
                />
                {errors.floorsCount && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.floorsCount.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="propAge" className="text-xs font-semibold">
                  عمر العقار (سنوات)
                </Label>
                <Input
                  id="propAge"
                  type="number"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.propertyAgeYears)}
                  className="h-9 text-xs"
                  {...register("propertyAgeYears")}
                />
                {errors.propertyAgeYears && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.propertyAgeYears.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="propDesc" className="text-xs font-semibold">
                الوصف والملاحظات
              </Label>
              <Textarea
                id="propDesc"
                rows={3}
                disabled={isSubmitting}
                className="text-xs resize-none"
                {...register("description")}
              />
            </div>
          </div>

          <DialogFooter className="gap-2.5 sm:gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 px-4 text-xs font-semibold"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="h-9 px-4 text-xs font-bold shadow-md shadow-inner-primary"
            >
              <Save className="size-3.5" />
              <span>حفظ التعديلات</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
