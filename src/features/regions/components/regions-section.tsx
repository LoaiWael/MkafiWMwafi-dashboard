import { useEffect, useState } from "react";
import { MapPin, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { MountFade } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import RegionCard from "@/features/regions/components/region-card";
import RegionDialog, {
  type RegionDialogSeed,
} from "@/features/regions/components/region-dialog";
import RegionsFilters from "@/features/regions/components/regions-filters";
import {
  ALL_REGIONS_FILTER,
  INITIAL_REGIONS,
  REGION_ENTRY_KIND,
  cloneRegions,
  REGIONS_METADATA,
  REGIONS_STORAGE_KEY,
  filterRegions,
  namesMatch,
  readStoredRegions,
  type AdministrativeRegion,
} from "@/features/regions/constants";

export default function RegionsSection() {
  const [regions, setRegions] = useState<AdministrativeRegion[]>(readStoredRegions);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState(ALL_REGIONS_FILTER);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSeed, setDialogSeed] = useState<RegionDialogSeed>({
    kind: REGION_ENTRY_KIND.region,
  });

  useEffect(() => {
    localStorage.setItem(REGIONS_STORAGE_KEY, JSON.stringify(regions));
  }, [regions]);

  const isRegionFilterValid =
    regionFilter === ALL_REGIONS_FILTER ||
    regions.some((item) => item.id === regionFilter);
  const effectiveRegionFilter = isRegionFilterValid
    ? regionFilter
    : ALL_REGIONS_FILTER;

  const filteredRegions = filterRegions(regions, search, effectiveRegionFilter);
  const hasActiveFilters =
    search.trim().length > 0 || effectiveRegionFilter !== ALL_REGIONS_FILTER;

  function openDialog(seed: RegionDialogSeed) {
    setDialogSeed(seed);
    setDialogOpen(true);
  }

  function handleCreateRegion(nameAr: string) {
    const exists = regions.some((region) => namesMatch(region.nameAr, nameAr));
    if (exists) return "هذه المنطقة مسجّلة مسبقاً";

    setRegions((current) => [
      ...current,
      { id: crypto.randomUUID(), nameAr, cities: [] },
    ]);
    toast.success("تمت إضافة المنطقة بنجاح");
    return null;
  }

  function handleCreateCity(regionId: string, nameAr: string) {
    const region = regions.find((item) => item.id === regionId);
    if (!region) return "المنطقة المحددة غير موجودة";

    const exists = region.cities.some((city) => namesMatch(city.nameAr, nameAr));
    if (exists) return "هذه المدينة مسجّلة مسبقاً في المنطقة";

    setRegions((current) =>
      current.map((item) =>
        item.id === regionId
          ? {
              ...item,
              cities: [...item.cities, { id: crypto.randomUUID(), nameAr }],
            }
          : item,
      ),
    );
    toast.success("تمت إضافة المدينة بنجاح");
    return null;
  }

  function handleRemoveCity(regionId: string, cityId: string) {
    const region = regions.find((item) => item.id === regionId);
    const city = region?.cities.find((item) => item.id === cityId);
    setRegions((current) =>
      current.map((item) =>
        item.id === regionId
          ? { ...item, cities: item.cities.filter((entry) => entry.id !== cityId) }
          : item,
      ),
    );
    if (city) toast.success(`تم حذف مدينة ${city.nameAr}`);
  }

  function handleRemoveRegion(regionId: string) {
    const region = regions.find((item) => item.id === regionId);
    setRegions((current) => current.filter((item) => item.id !== regionId));
    if (regionFilter === regionId) setRegionFilter(ALL_REGIONS_FILTER);
    if (region) toast.success(`تم حذف ${region.nameAr}`);
  }

  function handleResetFilters() {
    setSearch("");
    setRegionFilter(ALL_REGIONS_FILTER);
  }

  function handleRestoreDefaults() {
    const defaults = cloneRegions(INITIAL_REGIONS);
    setRegions(defaults);
    setSearch("");
    setRegionFilter(ALL_REGIONS_FILTER);
    localStorage.setItem(REGIONS_STORAGE_KEY, JSON.stringify(defaults));
    toast.success("تمت استعادة المناطق والمدن الافتراضية بنجاح");
  }

  return (
    <div className="page-shell space-y-6 py-8">
      <PageHeader
        title={REGIONS_METADATA.title}
        description={REGIONS_METADATA.description}
        actions={
          <div className="flex items-center gap-2">
            {regions.length === 0 ? (
              <Button
                variant="outline"
                size="sm"
                className="h-10 cursor-pointer"
                onClick={handleRestoreDefaults}
              >
                <RotateCcw className="size-4" />
                استعادة الافتراضي
              </Button>
            ) : null}
            <Button
              size="sm"
              className="h-10 cursor-pointer"
              onClick={() => openDialog({ kind: REGION_ENTRY_KIND.region })}
            >
              <Plus className="size-4" />
              إضافة منطقة أو مدينة
            </Button>
          </div>
        }
      />

      <MountFade delay={0.04}>
        <RegionsFilters
          search={search}
          onSearchChange={setSearch}
          regionId={effectiveRegionFilter}
          onRegionChange={setRegionFilter}
          regions={regions}
          resultCount={filteredRegions.length}
          hasActiveFilters={hasActiveFilters}
          onReset={handleResetFilters}
        />
      </MountFade>

      {filteredRegions.length === 0 ? (
        <MountFade distance={0} duration={0.2}>
          <Empty className="border border-dashed border-border bg-card py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MapPin />
              </EmptyMedia>
              <EmptyTitle>
                {regions.length === 0
                  ? "لا توجد مناطق أو مدن مسجّلة"
                  : "لا توجد نتائج مطابقة"}
              </EmptyTitle>
              <EmptyDescription>
                {regions.length === 0
                  ? "تم حذف جميع المناطق أو لم يتم تسجيل أي مناطق بعد. يمكنك استعادة المناطق الافتراضية أو إضافة مناطق جديدة."
                  : "لم نتمكن من العثور على أي منطقة أو مدينة مطابقة لمعايير البحث الحالية."}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              {regions.length === 0 ? (
                <Button
                  className="cursor-pointer gap-2"
                  onClick={handleRestoreDefaults}
                >
                  <RotateCcw className="size-4" />
                  استعادة المناطق الافتراضية
                </Button>
              ) : hasActiveFilters ? (
                <Button
                  variant="outline"
                  className="cursor-pointer gap-2"
                  onClick={handleResetFilters}
                >
                  <RotateCcw className="size-4" />
                  إعادة ضبط البحث والتصفية
                </Button>
              ) : null}
            </EmptyContent>
          </Empty>
        </MountFade>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredRegions.map((region, index) => (
            <MountFade
              key={region.id}
              className="h-full"
              delay={Math.min(index, 8) * 0.04}
              distance={10}
            >
              <RegionCard
                region={region}
                onAddCity={(regionId) =>
                  openDialog({ kind: REGION_ENTRY_KIND.city, regionId })
                }
                onRemoveCity={handleRemoveCity}
                onRemoveRegion={handleRemoveRegion}
              />
            </MountFade>
          ))}
        </div>
      )}

      <RegionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        regions={regions}
        seed={dialogSeed}
        onCreateRegion={handleCreateRegion}
        onCreateCity={handleCreateCity}
      />
    </div>
  );
}
