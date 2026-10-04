import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, MapPinned } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  REGION_ENTRY_KIND,
  type AdministrativeRegion,
  type RegionEntryKind,
} from "@/features/regions/constants";
import {
  regionDialogSchema,
  type RegionDialogFormData,
} from "../schemas/region-schema";

export interface RegionDialogSeed {
  kind: RegionEntryKind;
  regionId?: string;
}

interface RegionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regions: AdministrativeRegion[];
  seed: RegionDialogSeed;
  onCreateRegion: (nameAr: string) => string | null;
  onCreateCity: (regionId: string, nameAr: string) => string | null;
}

export default function RegionDialog({
  open,
  onOpenChange,
  regions,
  seed,
  onCreateRegion,
  onCreateCity,
}: RegionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <RegionDialogForm
          key={`${seed.kind}-${seed.regionId ?? "new"}`}
          regions={regions}
          seed={seed}
          onClose={() => onOpenChange(false)}
          onCreateRegion={onCreateRegion}
          onCreateCity={onCreateCity}
        />
      ) : null}
    </Dialog>
  );
}

function RegionDialogForm({
  regions,
  seed,
  onClose,
  onCreateRegion,
  onCreateCity,
}: {
  regions: AdministrativeRegion[];
  seed: RegionDialogSeed;
  onClose: () => void;
  onCreateRegion: (nameAr: string) => string | null;
  onCreateCity: (regionId: string, nameAr: string) => string | null;
}) {
  const canAddCity = regions.length > 0;
  const initialKind: RegionEntryKind =
    seed.kind === REGION_ENTRY_KIND.city && canAddCity
      ? REGION_ENTRY_KIND.city
      : REGION_ENTRY_KIND.region;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegionDialogFormData>({
    resolver: zodResolver(regionDialogSchema),
    defaultValues: {
      kind: initialKind,
      regionId: seed.regionId ?? regions[0]?.id ?? "",
      nameAr: "",
    },
  });

  const kind = watch("kind");
  const regionId = watch("regionId");
  const selectedRegion = regions.find((region) => region.id === regionId);

  function onSubmit(data: RegionDialogFormData) {
    if (data.kind === REGION_ENTRY_KIND.region) {
      const message = onCreateRegion(data.nameAr);
      if (message) {
        setError("root", { message });
        return;
      }
      onClose();
      return;
    }

    if (!data.regionId) {
      setError("regionId", { message: "اختر المنطقة التي تتبعها المدينة" });
      return;
    }

    const message = onCreateCity(data.regionId, data.nameAr);
    if (message) {
      setError("root", { message });
      return;
    }
    onClose();
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>إضافة منطقة أو مدينة</DialogTitle>
        <DialogDescription>
          منطقة جديدة تظهر كبطاقة، والمدينة تُضاف داخل المنطقة المختارة.
        </DialogDescription>
      </DialogHeader>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          control={control}
          name="kind"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={(val) => {
                if (val === REGION_ENTRY_KIND.city && !canAddCity) return;
                field.onChange(val);
                clearErrors();
              }}
              className="grid grid-cols-1 gap-2 sm:grid-cols-2"
              aria-label="نوع الإضافة"
            >
              <label
                htmlFor="region-kind-region"
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors",
                  field.value === REGION_ENTRY_KIND.region
                    ? "border-primary bg-primary-50 font-semibold text-primary-900"
                    : "border-border bg-card hover:bg-muted/60",
                )}
              >
                <RadioGroupItem
                  value={REGION_ENTRY_KIND.region}
                  id="region-kind-region"
                />
                <MapPinned className="size-4 text-primary" />
                <span className="text-sm">منطقة جديدة</span>
              </label>

              <label
                htmlFor="region-kind-city"
                className={cn(
                  "flex items-center gap-2 rounded-lg border p-3 transition-colors",
                  canAddCity ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                  field.value === REGION_ENTRY_KIND.city
                    ? "border-primary bg-primary-50 font-semibold text-primary-900"
                    : "border-border bg-card",
                  canAddCity &&
                    field.value !== REGION_ENTRY_KIND.city &&
                    "hover:bg-muted/60",
                )}
              >
                <RadioGroupItem
                  value={REGION_ENTRY_KIND.city}
                  id="region-kind-city"
                  disabled={!canAddCity}
                />
                <Building2 className="size-4 text-primary" />
                <span className="text-sm">مدينة ضمن منطقة</span>
              </label>
            </RadioGroup>
          )}
        />

        {kind === REGION_ENTRY_KIND.city ? (
          <div className="space-y-1.5">
            <Label htmlFor="region-parent">المنطقة</Label>
            <Controller
              control={control}
              name="regionId"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    id="region-parent"
                    aria-label="المنطقة"
                    aria-invalid={Boolean(errors.regionId)}
                    className="h-10 w-full cursor-pointer"
                  >
                    <SelectValue>
                      {selectedRegion?.nameAr ?? "اختر المنطقة"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="start">
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.regionId && (
              <p role="alert" className="text-xs text-destructive">
                {errors.regionId.message}
              </p>
            )}
          </div>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="region-entry-name">
            {kind === REGION_ENTRY_KIND.region ? "اسم المنطقة" : "اسم المدينة"}
          </Label>
          <Input
            id="region-entry-name"
            {...register("nameAr")}
            dir="auto"
            disabled={isSubmitting}
            placeholder={
              kind === REGION_ENTRY_KIND.region
                ? "مثال: منطقة القصيم"
                : "مثال: بريدة"
            }
            aria-invalid={Boolean(errors.nameAr)}
            className="h-10"
          />
          {errors.nameAr && (
            <p role="alert" className="text-xs text-destructive">
              {errors.nameAr.message}
            </p>
          )}
        </div>

        {errors.root?.message && (
          <p role="alert" className="text-xs text-destructive">
            {errors.root.message}
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="cursor-pointer"
            onClick={onClose}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            {kind === REGION_ENTRY_KIND.region ? "إضافة المنطقة" : "إضافة المدينة"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
