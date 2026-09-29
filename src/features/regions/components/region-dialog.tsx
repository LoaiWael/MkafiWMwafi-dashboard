import { useState } from "react";
import { Building2, MapPinned } from "lucide-react";
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
  const [kind, setKind] = useState<RegionEntryKind>(() =>
    seed.kind === REGION_ENTRY_KIND.city && canAddCity
      ? REGION_ENTRY_KIND.city
      : REGION_ENTRY_KIND.region,
  );
  const [nameAr, setNameAr] = useState("");
  const [regionId, setRegionId] = useState(
    () => seed.regionId ?? regions[0]?.id ?? "",
  );
  const [error, setError] = useState("");

  const selectedRegion = regions.find((region) => region.id === regionId);

  function handleKindChange(value: string) {
    if (value !== REGION_ENTRY_KIND.region && value !== REGION_ENTRY_KIND.city) {
      return;
    }
    if (value === REGION_ENTRY_KIND.city && !canAddCity) return;
    setKind(value);
    setError("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = nameAr.trim();
    if (name.length < 2) {
      setError("أدخل اسماً من حرفين على الأقل");
      return;
    }

    if (kind === REGION_ENTRY_KIND.region) {
      const message = onCreateRegion(name);
      if (message) {
        setError(message);
        return;
      }
      onClose();
      return;
    }

    if (!regionId) {
      setError("اختر المنطقة التي تتبعها المدينة");
      return;
    }

    const message = onCreateCity(regionId, name);
    if (message) {
      setError(message);
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

      <form className="space-y-4" onSubmit={handleSubmit}>
        <RadioGroup
          value={kind}
          onValueChange={handleKindChange}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
          aria-label="نوع الإضافة"
        >
          <label
            htmlFor="region-kind-region"
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors",
              kind === REGION_ENTRY_KIND.region
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
              kind === REGION_ENTRY_KIND.city
                ? "border-primary bg-primary-50 font-semibold text-primary-900"
                : "border-border bg-card",
              canAddCity &&
                kind !== REGION_ENTRY_KIND.city &&
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

        {kind === REGION_ENTRY_KIND.city ? (
          <div className="space-y-1.5">
            <Label htmlFor="region-parent">المنطقة</Label>
            <Select value={regionId} onValueChange={(value) => setRegionId(value ?? "")}>
              <SelectTrigger
                id="region-parent"
                aria-label="المنطقة"
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
          </div>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="region-entry-name">
            {kind === REGION_ENTRY_KIND.region ? "اسم المنطقة" : "اسم المدينة"}
          </Label>
          <Input
            id="region-entry-name"
            value={nameAr}
            onChange={(event) => {
              setNameAr(event.target.value);
              setError("");
            }}
            dir="auto"
            placeholder={
              kind === REGION_ENTRY_KIND.region
                ? "مثال: منطقة القصيم"
                : "مثال: بريدة"
            }
            aria-invalid={Boolean(error)}
            className="h-10"
          />
          {error ? (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={onClose}
          >
            إلغاء
          </Button>
          <Button type="submit" className="cursor-pointer">
            {kind === REGION_ENTRY_KIND.region ? "إضافة المنطقة" : "إضافة المدينة"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
