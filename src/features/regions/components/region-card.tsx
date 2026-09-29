import { Building2, MapPin, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  formatCityCount,
  type AdministrativeRegion,
} from "@/features/regions/constants";

interface RegionCardProps {
  region: AdministrativeRegion;
  onAddCity: (regionId: string) => void;
  onRemoveCity: (regionId: string, cityId: string) => void;
  onRemoveRegion: (regionId: string) => void;
}

export default function RegionCard({
  region,
  onAddCity,
  onRemoveCity,
  onRemoveRegion,
}: RegionCardProps) {
  const cityCount = region.cities.length;

  return (
    <Card className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5">
      <div>
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary-200/60 bg-primary-50 text-primary transition-transform duration-200 group-hover:scale-105 dark:border-primary-800/40 dark:bg-primary-950/40 dark:text-primary-300">
                <MapPin className="size-4.5" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <CardTitle className="truncate text-base font-bold text-foreground">
                  {region.nameAr}
                </CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <span className="size-1.5 rounded-full bg-primary/70" />
                  <span>{formatCityCount(cityCount)}</span>
                </div>
              </div>
            </div>

            <TooltipProvider delay={100}>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  aria-label={`حذف ${region.nameAr}`}
                  onClick={() => onRemoveRegion(region.id)}
                  className="flex size-8.5 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-all hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                  حذف المنطقة الإدارية
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {cityCount === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 px-3 py-6 text-center">
              <Building2 className="mb-1.5 size-5 text-muted-foreground/60" />
              <p className="text-xs font-semibold text-muted-foreground">
                لا توجد مدن مسجّلة في هذه المنطقة
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                انقر على الزر أدناه لإضافة أول مدينة
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-muted-foreground">
                المدن التابعة ({cityCount})
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {region.cities.map((city) => (
                  <li key={city.id}>
                    <span className="inline-flex h-7.5 items-center gap-1.5 rounded-lg border border-border/70 bg-muted/50 ps-2.5 pe-1 text-xs font-medium text-foreground transition-colors hover:border-border hover:bg-muted">
                      <span className="max-w-[140px] truncate sm:max-w-[160px]">
                        {city.nameAr}
                      </span>
                      <TooltipProvider delay={100}>
                        <Tooltip>
                          <TooltipTrigger
                            type="button"
                            aria-label={`حذف مدينة ${city.nameAr}`}
                            onClick={() => onRemoveCity(region.id, city.id)}
                            className="flex size-5.5 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                          >
                            <X className="size-3" />
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={6}>
                            حذف مدينة {city.nameAr}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </div>

      <div className="p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full cursor-pointer justify-center gap-1.5 rounded-xl border-dashed border-border/80 font-medium text-xs sm:text-sm transition-colors hover:border-primary/50 hover:bg-primary-50/50 hover:text-primary dark:hover:bg-primary-950/30"
          onClick={() => onAddCity(region.id)}
        >
          <Plus className="size-4" />
          إضافة مدينة جديدة
        </Button>
      </div>
    </Card>
  );
}
