import { useState } from "react";
import {
  Bath,
  CheckCircle2,
  ChefHat,
  DoorClosed,
  Droplets,
  ExternalLink,
  Layers,
  Maximize2,
  Phone,
  Plus,
  SaudiRiyal,
  Search,
  Sofa,
  User,
  Wind,
  Zap,
} from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { PropertyUnit } from "../types";

interface PropertyUnitsTableProps {
  units: PropertyUnit[];
  onAddUnit?: () => void;
  className?: string;
}

export default function PropertyUnitsTable({
  units,
  onAddUnit,
  className,
}: PropertyUnitsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredUnits = units.filter((unit) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      unit.unitNumber.toLowerCase().includes(q) ||
      (unit.name && unit.name.toLowerCase().includes(q)) ||
      (unit.currentTenantName &&
        unit.currentTenantName.toLowerCase().includes(q)) ||
      (unit.electricityMeterNumber &&
        unit.electricityMeterNumber.toLowerCase().includes(q)) ||
      (unit.waterMeterNumber &&
        unit.waterMeterNumber.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "all" || unit.rentalStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div
      className={cn(
        "rounded-2xl sm:rounded-3xl border border-border bg-card p-3.5 sm:p-5 md:p-6 shadow-xs space-y-3.5 sm:space-y-4",
        className,
      )}
    >
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3 sm:pb-4">
        <div className="space-y-0.5 text-start">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <Layers className="size-4 sm:size-5 text-primary" />
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              سجل الوحدات العقارية
            </h3>
            <Badge variant="secondary" className="text-[11px] sm:text-xs font-semibold">
              {filteredUnits.length} من أصل {units.length} وحدة
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            إدارة الشقق والمكاتب والوحدات، بيانات العدادات، التكييف، والمستأجرين
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
          {onAddUnit && (
            <button
              type="button"
              onClick={onAddUnit}
              className="inline-flex h-8 sm:h-8.5 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-primary-800 via-primary to-primary-400 text-primary-foreground px-3 sm:px-3.5 text-xs font-bold shadow-md shadow-inner-primary hover:brightness-105 active:scale-98 cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>إضافة وحدة جديدة</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
        <div className="relative w-full sm:w-72 md:w-80">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث برقم الوحدة، المستأجر، أو رقم العداد..."
            className="ps-8.5 h-8.5 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/60 p-0.5 sm:p-1 text-xs font-semibold shadow-inner">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs",
                statusFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/60",
              )}
            >
              <span>الكل</span>
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-md font-mono text-[11px] font-bold leading-none",
                  statusFilter === "all"
                    ? "bg-white/25 text-primary-foreground"
                    : "bg-background text-muted-foreground border border-border/50",
                )}
              >
                {units.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("rented")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs",
                statusFilter === "rented"
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/25 dark:bg-emerald-600"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/60",
              )}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    statusFilter === "rented"
                      ? "bg-white"
                      : "bg-emerald-500",
                  )}
                />
                <span>المؤجرة</span>
              </span>
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-md font-mono text-[11px] font-bold leading-none",
                  statusFilter === "rented"
                    ? "bg-white/25 text-white"
                    : "bg-background text-muted-foreground border border-border/50",
                )}
              >
                {units.filter((u) => u.rentalStatus === "rented").length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("vacant")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs",
                statusFilter === "vacant"
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-600/25 dark:bg-sky-600"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/60",
              )}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    statusFilter === "vacant"
                      ? "bg-white"
                      : "bg-sky-500",
                  )}
                />
                <span>الشاغرة</span>
              </span>
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-md font-mono text-[11px] font-bold leading-none",
                  statusFilter === "vacant"
                    ? "bg-white/25 text-white"
                    : "bg-background text-muted-foreground border border-border/50",
                )}
              >
                {units.filter((u) => u.rentalStatus === "vacant").length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Units Cards Grid */}
      {filteredUnits.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-2">
          <Layers className="size-8 text-muted-foreground mx-auto" />
          <p className="text-sm font-bold text-foreground">
            لم يتم العثور على وحدات مطابقة للبحث
          </p>
          <p className="text-xs text-muted-foreground">
            جرّب تغيير كلمات البحث أو إضافة وحدات جديدة.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {filteredUnits.map((unit) => {
            const isRented = unit.rentalStatus === "rented";

            return (
              <div
                key={unit.id}
                className="group rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 md:p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3 text-start"
              >
                {/* 1. Unit Card Top Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="font-mono text-[11px] sm:text-xs font-bold text-primary px-2 py-0.5 rounded-lg bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800">
                          وحدة #{unit.unitNumber}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm md:text-base text-foreground truncate">
                          {unit.typeLabel || "شقة"} - {unit.floorLabel || "الدور الثالث"}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground">
                        {unit.buildingTypeLabel && (
                          <Badge variant="outline" className="text-[10px] sm:text-[11px] font-medium px-2 py-0">
                            {unit.buildingTypeLabel}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px] sm:text-[11px] font-medium px-2 py-0">
                          {unit.floorLabel}
                        </Badge>
                        <span className="inline-flex items-center gap-1 font-semibold text-foreground bg-muted/50 px-1.5 py-0.5 rounded-md text-[11px] sm:text-xs">
                          <Maximize2 className="size-2.5 sm:size-3 text-muted-foreground" />
                          <span>{unit.areaSqm} م²</span>
                        </span>
                      </div>
                    </div>

                    {unit.rentalStatusLabel && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl text-[11px] sm:text-xs font-bold shrink-0 border",
                          isRented
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                            : "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            isRented
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-sky-500",
                          )}
                        />
                        {unit.rentalStatusLabel}
                      </span>
                    )}
                  </div>

                  {/* 2. Rooms & Specifications Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl bg-muted/40 border border-border/50 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <DoorClosed className="size-3.5 text-primary shrink-0" />
                      <span className="text-[11px] sm:text-xs">الغرف:</span>
                      <strong className="text-foreground font-bold">{unit.roomsCount ?? 3}</strong>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Sofa className="size-3.5 text-secondary shrink-0" />
                      <span className="text-[11px] sm:text-xs">الصالات:</span>
                      <strong className="text-foreground font-bold">{unit.livingRoomsCount ?? 1}</strong>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <ChefHat className="size-3.5 text-amber-500 shrink-0" />
                      <span className="text-[11px] sm:text-xs">المطابخ:</span>
                      <strong className="text-foreground font-bold">{unit.kitchensCount ?? 1}</strong>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Bath className="size-3.5 text-sky-500 shrink-0" />
                      <span className="text-[11px] sm:text-xs">الحمامات:</span>
                      <strong className="text-foreground font-bold">{unit.bathroomsCount ?? 2}</strong>
                    </div>
                  </div>

                  {/* 3. AC / Air Conditioning Specs */}
                  <div className="flex items-center gap-2 sm:gap-2.5 text-xs bg-muted/20 p-2 sm:p-2.5 rounded-xl border border-border/40 flex-wrap">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Wind className="size-3.5 text-sky-500 shrink-0" />
                      <span className="text-[11px] sm:text-xs">مكيف سبليت:</span>
                      <strong className="text-foreground font-bold">
                        {unit.splitAcCount !== undefined ? String(unit.splitAcCount) : "2"}
                      </strong>
                    </div>

                    <span className="text-border">|</span>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Wind className="size-3.5 text-amber-500 shrink-0" />
                      <span className="text-[11px] sm:text-xs">مكيف شباك:</span>
                      <strong className="text-foreground font-bold">
                        {unit.windowAcCount !== undefined ? String(unit.windowAcCount) : "لا يوجد"}
                      </strong>
                    </div>
                  </div>

                  {/* 4. Meter Numbers (if present) */}
                  {(unit.electricityMeterNumber || unit.waterMeterNumber) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 bg-muted/30 p-2 sm:p-2.5 rounded-xl border border-border/40 text-xs">
                      {unit.electricityMeterNumber && (
                        <div className="flex items-center justify-between gap-1.5 text-muted-foreground">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Zap className="size-3.5 text-amber-500 shrink-0" />
                            <span className="text-[10px] sm:text-[11px] shrink-0">عداد الكهرباء:</span>
                            <strong className="text-foreground font-mono text-[10px] sm:text-[11px] truncate">
                              {unit.electricityMeterNumber}
                            </strong>
                          </div>
                          <CopyButton
                            value={unit.electricityMeterNumber}
                            itemId={`meter-elec-${unit.id}`}
                            label="نسخ رقم عداد الكهرباء"
                            className="size-5.5 shrink-0"
                          />
                        </div>
                      )}

                      {unit.waterMeterNumber && (
                        <div className="flex items-center justify-between gap-1.5 text-muted-foreground">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Droplets className="size-3.5 text-blue-500 shrink-0" />
                            <span className="text-[10px] sm:text-[11px] shrink-0">عداد المياه:</span>
                            <strong className="text-foreground font-mono text-[10px] sm:text-[11px] truncate">
                              {unit.waterMeterNumber}
                            </strong>
                          </div>
                          <CopyButton
                            value={unit.waterMeterNumber}
                            itemId={`meter-water-${unit.id}`}
                            label="نسخ رقم عداد المياه"
                            className="size-5.5 shrink-0"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 5. Footer: Rental Information & Primary Gradient Contract Link */}
                {isRented ? (
                  <div className="rounded-xl border border-border/70 bg-muted/40 p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-foreground font-bold">
                        <User className="size-3.5 text-primary shrink-0" />
                        <span className="truncate text-xs sm:text-sm">{unit.currentTenantName}</span>
                      </div>
                      {unit.currentTenantPhone && (
                        <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
                          <Phone className="size-3 text-muted-foreground shrink-0" />
                          <span>{unit.currentTenantPhone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                      <div className="text-start sm:text-end">
                        <span className="text-muted-foreground text-[10px] block font-medium">
                          الإيجار السنوي
                        </span>
                        <strong className="text-primary font-bold text-xs sm:text-sm inline-flex items-center gap-1">
                          <span>{unit.currentAnnualRent?.toLocaleString("en-US")}</span>
                          <SaudiRiyal className="size-3 shrink-0" />
                        </strong>
                      </div>

                      {unit.currentContractId && (
                        <Link
                          to={`/contracts/${unit.currentContractId}`}
                          viewTransition
                          className="inline-flex h-8 sm:h-8.5 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-primary-800 via-primary to-primary-400 text-primary-foreground px-3 text-xs font-bold shadow-md shadow-inner-primary hover:brightness-105 hover:shadow-lg hover:shadow-primary/20 active:scale-98 transition-all cursor-pointer shrink-0"
                        >
                          <span>عرض العقد</span>
                          <ExternalLink className="size-3 sm:size-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-sky-300/60 dark:border-sky-800/60 bg-sky-50/40 dark:bg-sky-950/20 p-2.5 sm:p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="size-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span className="text-[11px] sm:text-xs">الوحدة شاغرة ومتاحة للتعاقد الفوري</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-sky-300 text-sky-700 dark:text-sky-300 bg-background font-semibold text-[11px]"
                    >
                      جاهزة للتأجير
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
