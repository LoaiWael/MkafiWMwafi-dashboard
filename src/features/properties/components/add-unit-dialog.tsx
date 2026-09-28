import { useState } from "react";
import { Plus } from "lucide-react";
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
import type { PropertyBuildingType, PropertyUnit, UnitType } from "../types";

interface AddUnitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUnit: (unit: PropertyUnit) => void;
  existingUnitsCount: number;
}

export default function AddUnitDialog({
  isOpen,
  onClose,
  onAddUnit,
  existingUnitsCount,
}: AddUnitDialogProps) {
  // Form fields matching the exact specification image
  const [type, setType] = useState<UnitType>("apartment");
  const [buildingType, setBuildingType] = useState<PropertyBuildingType | string>(
    "building",
  );
  const [unitNumber, setUnitNumber] = useState(`${existingUnitsCount + 12}`);
  const [floor, setFloor] = useState("الدور الثالث");
  const [areaSqm, setAreaSqm] = useState("145");
  const [roomsCount, setRoomsCount] = useState("3");
  const [livingRoomsCount, setLivingRoomsCount] = useState("1");
  const [kitchensCount, setKitchensCount] = useState("1");
  const [bathroomsCount, setBathroomsCount] = useState("2");
  const [windowAcCount, setWindowAcCount] = useState("لا يوجد");
  const [splitAcCount, setSplitAcCount] = useState("2");
  const [electricityMeterNumber, setElectricityMeterNumber] = useState("E-884211");
  const [waterMeterNumber, setWaterMeterNumber] = useState("W-331902");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!unitNumber.trim()) {
      toast.error("يرجى إدخال رقم الوحدة");
      return;
    }

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

    const newUnit: PropertyUnit = {
      id: `unit-${Date.now()}`,
      unitNumber,
      name: `${typeLabels[type] || "وحدة"} رقم ${unitNumber} - ${floor}`,
      type,
      typeLabel: typeLabels[type] || "شقة",
      buildingType,
      buildingTypeLabel: buildingTypeLabels[buildingType] || "عمارة",
      floor,
      floorLabel: floor.startsWith("الدور") ? floor : `الدور ${floor}`,
      areaSqm: Number(areaSqm) || 145,
      roomsCount: Number(roomsCount) || 3,
      livingRoomsCount: Number(livingRoomsCount) || 1,
      kitchensCount: Number(kitchensCount) || 1,
      bathroomsCount: Number(bathroomsCount) || 2,
      windowAcCount,
      splitAcCount,
      electricityMeterNumber: electricityMeterNumber.trim() || undefined,
      waterMeterNumber: waterMeterNumber.trim() || undefined,
      rentalStatus: "vacant",
      rentalStatusLabel: "شاغرة",
    };

    onAddUnit(newUnit);
    toast.success(`تمت إضافة الوحدة رقم "${unitNumber}" بنجاح`);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="unitType" className="text-xs font-bold flex items-center gap-1">
                  <span>نوع الوحدة</span>
                  <span className="text-destructive">*</span>
                </Label>
                <NativeSelect
                  id="unitType"
                  value={type}
                  onChange={(e) => setType(e.target.value as UnitType)}
                  className="h-10 text-xs font-medium"
                >
                  <option value="apartment">شقة</option>
                  <option value="floor">دور</option>
                  <option value="villa">فيلا</option>
                  <option value="studio">استوديو</option>
                  <option value="office">مكتب</option>
                  <option value="shop">محل</option>
                  <option value="showroom">معرض</option>
                  <option value="warehouse">مستودع</option>
                </NativeSelect>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="buildingType" className="text-xs font-bold flex items-center gap-1">
                  <span>نوع العقار / المبنى</span>
                  <span className="text-destructive">*</span>
                </Label>
                <NativeSelect
                  id="buildingType"
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value)}
                  className="h-10 text-xs font-medium"
                >
                  <option value="building">عمارة</option>
                  <option value="villa">فيلا</option>
                  <option value="commercial_center">مجمع تجاري</option>
                  <option value="office_tower">برج مكاتب</option>
                  <option value="compound">مجمع سكني</option>
                  <option value="warehouse_complex">مجمع مستودعات</option>
                  <option value="showroom_plaza">مجمع معارض</option>
                </NativeSelect>
              </div>
            </div>

            {/* ROW 2: رقم الوحدة * & رقم الطابق * */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="unitNumber" className="text-xs font-bold flex items-center gap-1">
                  <span>رقم الوحدة</span>
                  <span className="text-destructive">*</span>
                </Label>
                <NativeSelect
                  id="unitNumberSelect"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  className="h-10 text-xs font-mono font-bold"
                >
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={String(num)}>
                      {num}
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="floorNumber" className="text-xs font-bold flex items-center gap-1">
                  <span>رقم الطابق</span>
                  <span className="text-destructive">*</span>
                </Label>
                <NativeSelect
                  id="floorNumber"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="h-10 text-xs font-medium"
                >
                  <option value="الدور الأرضي">الدور الأرضي</option>
                  <option value="الدور الأول">الدور الأول</option>
                  <option value="الدور الثاني">الدور الثاني</option>
                  <option value="الدور الثالث">الدور الثالث</option>
                  <option value="الدور الرابع">الدور الرابع</option>
                  <option value="الدور الخامس">الدور الخامس</option>
                  <option value="الدور السادس">الدور السادس</option>
                  <option value="الملحق العلوي">الملحق العلوي</option>
                  <option value="القبو / السرداب">القبو / السرداب</option>
                </NativeSelect>
              </div>
            </div>

            {/* ROW 3: مساحة الوحدة الإجمالية تقريبا * */}
            <div className="space-y-1.5">
              <Label htmlFor="areaSqm" className="text-xs font-bold flex items-center gap-1">
                <span>مساحة الوحدة الإجمالية تقريبا</span>
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="areaSqm"
                type="number"
                value={areaSqm}
                onChange={(e) => setAreaSqm(e.target.value)}
                placeholder="145"
                required
                className="h-10 text-xs font-bold"
              />
            </div>

            {/* ROW 4: عدد الغرف * & عدد الصالات * */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="roomsCount" className="text-xs font-bold flex items-center gap-1">
                  <span>عدد الغرف</span>
                  <span className="text-destructive">*</span>
                </Label>
                <NativeSelect
                  id="roomsCount"
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(e.target.value)}
                  className="h-10 text-xs font-medium"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8+">8+</option>
                </NativeSelect>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="livingRoomsCount" className="text-xs font-bold flex items-center gap-1">
                  <span>عدد الصالات</span>
                  <span className="text-destructive">*</span>
                </Label>
                <NativeSelect
                  id="livingRoomsCount"
                  value={livingRoomsCount}
                  onChange={(e) => setLivingRoomsCount(e.target.value)}
                  className="h-10 text-xs font-medium"
                >
                  <option value="0">لا يوجد</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4+</option>
                </NativeSelect>
              </div>
            </div>

            {/* ROW 5: عدد المطابخ * & عدد دورات المياه * */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="kitchensCount" className="text-xs font-bold flex items-center gap-1">
                  <span>عدد المطابخ</span>
                  <span className="text-destructive">*</span>
                </Label>
                <NativeSelect
                  id="kitchensCount"
                  value={kitchensCount}
                  onChange={(e) => setKitchensCount(e.target.value)}
                  className="h-10 text-xs font-medium"
                >
                  <option value="0">لا يوجد</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </NativeSelect>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bathroomsCount" className="text-xs font-bold flex items-center gap-1">
                  <span>عدد دورات المياه</span>
                  <span className="text-destructive">*</span>
                </Label>
                <NativeSelect
                  id="bathroomsCount"
                  value={bathroomsCount}
                  onChange={(e) => setBathroomsCount(e.target.value)}
                  className="h-10 text-xs font-medium"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </NativeSelect>
              </div>
            </div>

            {/* ROW 6: مكيف شباك * & مكيف سبليت * */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="windowAc" className="text-xs font-bold flex items-center gap-1">
                  <span>مكيف شباك</span>
                  <span className="text-destructive">*</span>
                </Label>
                <NativeSelect
                  id="windowAc"
                  value={windowAcCount}
                  onChange={(e) => setWindowAcCount(e.target.value)}
                  className="h-10 text-xs font-medium"
                >
                  <option value="لا يوجد">لا يوجد</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </NativeSelect>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="splitAc" className="text-xs font-bold flex items-center gap-1">
                  <span>مكيف سبليت</span>
                  <span className="text-destructive">*</span>
                </Label>
                <NativeSelect
                  id="splitAc"
                  value={splitAcCount}
                  onChange={(e) => setSplitAcCount(e.target.value)}
                  className="h-10 text-xs font-medium"
                >
                  <option value="لا يوجد">لا يوجد</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6+">6+</option>
                </NativeSelect>
              </div>
            </div>

            {/* ROW 7: رقم عداد الكهرباء (اختياري) & رقم عداد المياه (اختياري) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="elecMeter" className="text-xs font-medium text-muted-foreground">
                  رقم عداد الكهرباء (اختياري)
                </Label>
                <Input
                  id="elecMeter"
                  value={electricityMeterNumber}
                  onChange={(e) => setElectricityMeterNumber(e.target.value)}
                  placeholder="مثال: E-884211"
                  className="h-10 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="waterMeter" className="text-xs font-medium text-muted-foreground">
                  رقم عداد المياه (اختياري)
                </Label>
                <Input
                  id="waterMeter"
                  value={waterMeterNumber}
                  onChange={(e) => setWaterMeterNumber(e.target.value)}
                  placeholder="مثال: W-331902"
                  className="h-10 text-xs font-mono"
                />
              </div>
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
              className="inline-flex h-9 items-center justify-center rounded-xl bg-linear-to-r from-primary-800 via-primary to-primary-400 text-primary-foreground px-4 text-xs font-bold shadow-md shadow-inner-primary hover:brightness-105 active:scale-98 cursor-pointer"
            >
              حفظ وإضافة الوحدة
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
