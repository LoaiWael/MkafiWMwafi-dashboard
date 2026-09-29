import { Building2, Filter, MapPin, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ALL_REGIONS_FILTER,
  formatCityCount,
  formatRegionCount,
  type AdministrativeRegion,
} from "@/features/regions/constants";

interface RegionsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  regionId: string;
  onRegionChange: (value: string) => void;
  regions: AdministrativeRegion[];
  resultCount: number;
  hasActiveFilters: boolean;
  onReset: () => void;
}

export default function RegionsFilters({
  search,
  onSearchChange,
  regionId,
  onRegionChange,
  regions,
  resultCount,
  hasActiveFilters,
  onReset,
}: RegionsFiltersProps) {
  const isSpecificRegion =
    regionId !== ALL_REGIONS_FILTER && regions.some((r) => r.id === regionId);
  const currentRegionId = isSpecificRegion ? regionId : ALL_REGIONS_FILTER;
  const selectedRegion = regions.find((region) => region.id === currentRegionId);
  const regionLabel = selectedRegion?.nameAr ?? "كل المناطق";
  const cityCount = regions.reduce(
    (total, region) => total + region.cities.length,
    0,
  );

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs sm:p-4">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") onSearchChange("");
            }}
            placeholder="بحث باسم المنطقة أو المدينة..."
            aria-label="بحث باسم المنطقة أو المدينة"
            dir="auto"
            className="h-10 rounded-xl border-border/80 bg-background ps-9.5 pe-9 text-sm shadow-none placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-primary/20"
          />
          {search ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="مسح البحث"
              className="absolute end-2 top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={currentRegionId}
            onValueChange={(value) => onRegionChange(value || ALL_REGIONS_FILTER)}
          >
            <SelectTrigger
              aria-label="تصفية حسب المنطقة"
              className="h-10 w-full cursor-pointer rounded-xl border-border/80 bg-background text-sm font-medium shadow-none hover:bg-muted/40 transition-colors sm:w-56"
            >
              <Filter className="size-3.5 text-muted-foreground" />
              <SelectValue>{regionLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value={ALL_REGIONS_FILTER}>كل المناطق</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-10 cursor-pointer gap-1.5 rounded-xl px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={onReset}
            >
              <RotateCcw className="size-3.5" />
              <span>إعادة ضبط</span>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground">
            <MapPin className="size-3 text-primary" />
            <span>
              {hasActiveFilters
                ? `المناطق: ${resultCount} من ${regions.length}`
                : formatRegionCount(regions.length)}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground">
            <Building2 className="size-3 text-secondary" />
            <span>{formatCityCount(cityCount)}</span>
          </span>
        </div>

        {hasActiveFilters ? (
          <span className="text-[11px] font-medium text-muted-foreground">
            {resultCount === 0
              ? "لا توجد مناطق مطابقة لمعايير البحث"
              : `عرض ${formatRegionCount(resultCount)} مطابقة`}
          </span>
        ) : null}
      </div>
    </div>
  );
}
