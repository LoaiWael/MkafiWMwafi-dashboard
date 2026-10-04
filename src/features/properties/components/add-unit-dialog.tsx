import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
import {
  addUnitSchema,
  type AddUnitFormData,
} from "@/features/properties/schemas/property-schema";
import type { PropertyBuildingType, PropertyUnit, UnitType } from "../types";

interface AddUnitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUnit: (unit: PropertyUnit) => void;
  existingUnitsCount?: number;
}

const defaultValues: AddUnitFormData = {
  type: "apartment",
  buildingType: "building",
  unitNumber: "",
  floor: "",
  areaSqm: "",
  roomsCount: "",
  livingRoomsCount: "",
  kitchensCount: "",
  bathroomsCount: "",
  windowAcCount: "",
  splitAcCount: "",
  electricityMeterNumber: "",
  waterMeterNumber: "",
};

const typeLabels: Record<UnitType, string> = {
  apartment: "شقة",
  villa: "فيلا",
  floor: "دور",
  studio: "استوديو",
  office: "مكتب",
  shop: "محل",
  showroom: "معرض",
  warehouse: "مستودع",
};

const buildingTypeLabels: Record<string, string> = {
  building: "عمارة",
  villa: "فيلا",
  commercial_center: "مجمع تجاري",
  office_tower: "برج مكاتب",
  compound: "مجمع سكني",
  warehouse_complex: "مجمع مستودعات",
  showroom_plaza: "مجمع معارض",
};

export default function AddUnitDialog({
  isOpen,
  onClose,
  onAddUnit,
}: AddUnitDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddUnitFormData>({
    resolver: zodResolver(addUnitSchema),
    defaultValues,
  });

  function handleClose() {
    reset(defaultValues);
    onClose();
  }

  function onSubmit(data: AddUnitFormData) {
    const newUnit: PropertyUnit = {
      id: `unit-${Date.now()}`,
      unitNumber: data.unitNumber,
      name: `${typeLabels[data.type] || "وحدة"} رقم ${data.unitNumber} - ${data.floor}`,
      type: data.type as UnitType,
      typeLabel: typeLabels[data.type] || "شقة",
      buildingType: data.buildingType as PropertyBuildingType,
      buildingTypeLabel:
        buildingTypeLabels[data.buildingType] || data.buildingType,
      floor: data.floor,
      floorLabel: data.floor.startsWith("الدور")
        ? data.floor
        : `الدور ${data.floor}`,
      areaSqm: Number(data.areaSqm) || 0,
      roomsCount: Number(data.roomsCount) || 1,
      livingRoomsCount: Number(data.livingRoomsCount) || 0,
      kitchensCount: Number(data.kitchensCount) || 1,
      bathroomsCount: Number(data.bathroomsCount) || 1,
      windowAcCount: data.windowAcCount,
      splitAcCount: data.splitAcCount,
      electricityMeterNumber:
        data.electricityMeterNumber?.trim() || undefined,
      waterMeterNumber: data.waterMeterNumber?.trim() || undefined,
      rentalStatus: "vacant",
      rentalStatusLabel: "شاغرة",
    };

    onAddUnit(newUnit);
    toast.success(`تمت إضافة الوحدة رقم "${data.unitNumber}" بنجاح`);
    handleClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <DialogHeader className="text-start">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Plus className="size-5 text-primary" />
              إضافة وحدة عقارية جديدة
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              أدخل مواصفات وتفاصيل الوحدة والعدادات والتكييف.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 text-start pt-1">
            {/* ROW 1: نوع الوحدة * & نوع العقار / المبنى * */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="unitType"
                  className="text-xs font-bold flex items-center gap-1"
                >
                  <span>نوع الوحدة</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="unitType"
                        aria-invalid={Boolean(errors.type)}
                        className="w-full h-10 text-xs font-medium"
                      >
                        <SelectValue placeholder="اختر نوع الوحدة">
                          {(val: string | null) =>
                            val ? typeLabels[val as UnitType] : "اختر نوع الوحدة"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">شقة</SelectItem>
                        <SelectItem value="floor">دور</SelectItem>
                        <SelectItem value="villa">فيلا</SelectItem>
                        <SelectItem value="studio">استوديو</SelectItem>
                        <SelectItem value="office">مكتب</SelectItem>
                        <SelectItem value="shop">محل</SelectItem>
                        <SelectItem value="showroom">معرض</SelectItem>
                        <SelectItem value="warehouse">مستودع</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="buildingType"
                  className="text-xs font-bold flex items-center gap-1"
                >
                  <span>نوع العقار / المبنى</span>
                  <span className="text-destructive">*</span>
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
                        id="buildingType"
                        aria-invalid={Boolean(errors.buildingType)}
                        className="w-full h-10 text-xs font-medium"
                      >
                        <SelectValue placeholder="اختر نوع المبنى">
                          {(val: string | null) =>
                            val ? buildingTypeLabels[val] : "اختر نوع المبنى"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="building">عمارة</SelectItem>
                        <SelectItem value="villa">فيلا</SelectItem>
                        <SelectItem value="commercial_center">
                          مجمع تجاري
                        </SelectItem>
                        <SelectItem value="office_tower">برج مكاتب</SelectItem>
                        <SelectItem value="compound">مجمع سكني</SelectItem>
                        <SelectItem value="warehouse_complex">
                          مجمع مستودعات
                        </SelectItem>
                        <SelectItem value="showroom_plaza">
                          مجمع معارض
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
            </div>

            {/* ROW 2: رقم الوحدة * & رقم الطابق * */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="unitNumber"
                  className="text-xs font-bold flex items-center gap-1"
                >
                  <span>رقم الوحدة</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="unitNumber"
                  placeholder="مثال: 101 أو A-12"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.unitNumber)}
                  className="h-10 text-xs font-mono font-bold"
                  {...register("unitNumber")}
                />
                {errors.unitNumber && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.unitNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="floorNumber"
                  className="text-xs font-bold flex items-center gap-1"
                >
                  <span>رقم الطابق</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="floor"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="floorNumber"
                        aria-invalid={Boolean(errors.floor)}
                        className="w-full h-10 text-xs font-medium"
                      >
                        <SelectValue placeholder="اختر رقم الطابق" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="الدور الأرضي">الدور الأرضي</SelectItem>
                        <SelectItem value="الدور الأول">الدور الأول</SelectItem>
                        <SelectItem value="الدور الثاني">الدور الثاني</SelectItem>
                        <SelectItem value="الدور الثالث">الدور الثالث</SelectItem>
                        <SelectItem value="الدور الرابع">الدور الرابع</SelectItem>
                        <SelectItem value="الدور الخامس">الدور الخامس</SelectItem>
                        <SelectItem value="الدور السادس">الدور السادس</SelectItem>
                        <SelectItem value="الملحق العلوي">
                          الملحق العلوي
                        </SelectItem>
                        <SelectItem value="القبو / السرداب">
                          القبو / السرداب
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.floor && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.floor.message}
                  </p>
                )}
              </div>
            </div>

            {/* ROW 3: مساحة الوحدة الإجمالية تقريبا * */}
            <div className="space-y-1.5">
              <Label
                htmlFor="areaSqm"
                className="text-xs font-bold flex items-center gap-1"
              >
                <span>مساحة الوحدة الإجمالية تقريباً (م²)</span>
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="areaSqm"
                type="number"
                placeholder="مثال: 145"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.areaSqm)}
                className="h-10 text-xs font-bold"
                {...register("areaSqm")}
              />
              {errors.areaSqm && (
                <p className="text-[11px] font-medium text-destructive">
                  {errors.areaSqm.message}
                </p>
              )}
            </div>

            {/* ROW 4: عدد الغرف * & عدد الصالات * */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="roomsCount"
                  className="text-xs font-bold flex items-center gap-1"
                >
                  <span>عدد الغرف</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="roomsCount"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="roomsCount"
                        aria-invalid={Boolean(errors.roomsCount)}
                        className="w-full h-10 text-xs font-medium"
                      >
                        <SelectValue placeholder="اختر عدد الغرف" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="7">7</SelectItem>
                        <SelectItem value="8+">8+</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.roomsCount && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.roomsCount.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="livingRoomsCount"
                  className="text-xs font-bold flex items-center gap-1"
                >
                  <span>عدد الصالات</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="livingRoomsCount"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="livingRoomsCount"
                        aria-invalid={Boolean(errors.livingRoomsCount)}
                        className="w-full h-10 text-xs font-medium"
                      >
                        <SelectValue placeholder="اختر عدد الصالات">
                          {(val: string | null) =>
                            val === "0" ? "لا يوجد" : val || "اختر عدد الصالات"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">لا يوجد</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4+">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.livingRoomsCount && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.livingRoomsCount.message}
                  </p>
                )}
              </div>
            </div>

            {/* ROW 5: عدد المطابخ * & عدد دورات المياه * */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="kitchensCount"
                  className="text-xs font-bold flex items-center gap-1"
                >
                  <span>عدد المطابخ</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="kitchensCount"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="kitchensCount"
                        aria-invalid={Boolean(errors.kitchensCount)}
                        className="w-full h-10 text-xs font-medium"
                      >
                        <SelectValue placeholder="اختر عدد المطابخ">
                          {(val: string | null) =>
                            val === "0" ? "لا يوجد" : val || "اختر عدد المطابخ"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">لا يوجد</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.kitchensCount && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.kitchensCount.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="bathroomsCount"
                  className="text-xs font-bold flex items-center gap-1"
                >
                  <span>عدد دورات المياه</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="bathroomsCount"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="bathroomsCount"
                        aria-invalid={Boolean(errors.bathroomsCount)}
                        className="w-full h-10 text-xs font-medium"
                      >
                        <SelectValue placeholder="اختر عدد دورات المياه" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5+">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.bathroomsCount && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.bathroomsCount.message}
                  </p>
                )}
              </div>
            </div>

            {/* ROW 6: مكيف شباك * & مكيف سبليت * */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="windowAc"
                  className="text-xs font-bold flex items-center gap-1"
                >
                  <span>مكيف شباك</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="windowAcCount"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="windowAc"
                        aria-invalid={Boolean(errors.windowAcCount)}
                        className="w-full h-10 text-xs font-medium"
                      >
                        <SelectValue placeholder="اختر مكيف شباك" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5+">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.windowAcCount && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.windowAcCount.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="splitAc"
                  className="text-xs font-bold flex items-center gap-1"
                >
                  <span>مكيف سبليت</span>
                  <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="splitAcCount"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="splitAc"
                        aria-invalid={Boolean(errors.splitAcCount)}
                        className="w-full h-10 text-xs font-medium"
                      >
                        <SelectValue placeholder="اختر مكيف سبليت" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="لا يوجد">لا يوجد</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="6+">6+</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.splitAcCount && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.splitAcCount.message}
                  </p>
                )}
              </div>
            </div>

            {/* ROW 7: رقم عداد الكهرباء (اختياري) & رقم عداد المياه (اختياري) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="space-y-1.5">
                <Label
                  htmlFor="elecMeter"
                  className="text-xs font-medium text-muted-foreground"
                >
                  رقم عداد الكهرباء (اختياري)
                </Label>
                <Input
                  id="elecMeter"
                  placeholder="مثال: E-884211"
                  disabled={isSubmitting}
                  className="h-10 text-xs font-mono"
                  {...register("electricityMeterNumber")}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="waterMeter"
                  className="text-xs font-medium text-muted-foreground"
                >
                  رقم عداد المياه (اختياري)
                </Label>
                <Input
                  id="waterMeter"
                  placeholder="مثال: W-331902"
                  disabled={isSubmitting}
                  className="h-10 text-xs font-mono"
                  {...register("waterMeterNumber")}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2.5 sm:gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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
              حفظ وإضافة الوحدة
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
