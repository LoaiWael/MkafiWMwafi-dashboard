import {
  MapPin,
  ExternalLink,
  Navigation,
  Compass,
  Building2,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import type { PropertyLocation } from "../types";

interface PropertyLocationMapCardProps {
  location: PropertyLocation;
  propertyName: string;
  className?: string;
}

export default function PropertyLocationMapCard({
  location,
  propertyName,
  className,
}: PropertyLocationMapCardProps) {
  // Formatted full national address
  const fullNationalAddress = `شارع ${location.street}، حي ${location.district}، ${location.city} ${location.postalCode}، مبنى رقم ${location.buildingNumber}، الرقم الإضافي ${location.additionalNumber}، المملكة العربية السعودية.`;

  const hasCoordinates = Boolean(
    location.mapCoordinates?.lat && location.mapCoordinates?.lng,
  );
  const lat = location.mapCoordinates?.lat || 24.7136;
  const lng = location.mapCoordinates?.lng || 46.6753;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  function handleOpenMaps() {
    toast.info("جاري فتح الموقع في خرائط Google...");
    window.open(googleMapsUrl, "_blank");
  }

  function handleShareLocation() {
    if (navigator.share) {
      navigator
        .share({
          title: `موقع ${propertyName}`,
          text: `العنوان الوطني: ${fullNationalAddress}`,
          url: googleMapsUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(fullNationalAddress);
      toast.success("تم نسخ العنوان الوطني لمشاركته");
    }
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-3.5 sm:p-5 md:p-6 shadow-xs space-y-4 sm:space-y-5",
        className,
      )}
      dir="rtl"
    >
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3 sm:pb-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex size-9 sm:size-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <MapPin className="size-4.5 sm:size-5.5" />
          </div>

          <div className="space-y-0.5 text-start">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground">
              العنوان الوطني للعقار
            </h3>
            <p className="text-xs text-muted-foreground">
              بيانات العنوان الوطني المسجل في سبل (البريد السعودي) والموقع الجغرافي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
          <button
            type="button"
            onClick={handleShareLocation}
            className="inline-flex h-8 sm:h-8.5 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2.5 sm:px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:scale-98 cursor-pointer"
          >
            <Share2 className="size-3.5" />
            <span>مشاركة العنوان</span>
          </button>

          {hasCoordinates && (
            <button
              type="button"
              onClick={handleOpenMaps}
              className="inline-flex h-8 sm:h-8.5 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-primary-800 via-primary to-primary-400 text-primary-foreground px-3 sm:px-3.5 text-xs font-bold shadow-md shadow-inner-primary hover:brightness-105 active:scale-98 cursor-pointer"
            >
              <Navigation className="size-3.5" />
              <span>خرائط Google</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. National Address Data Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 text-start">
        {/* Region & City */}
        <div className="rounded-xl border border-border/70 bg-muted/30 p-2.5 sm:p-3 space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium block">
            المنطقة
          </span>
          <strong className="text-xs sm:text-sm font-bold text-foreground block">
            {location.region || "منطقة الرياض"}
          </strong>
        </div>

        <div className="rounded-xl border border-border/70 bg-muted/30 p-2.5 sm:p-3 space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium block">
            المدينة
          </span>
          <strong className="text-xs sm:text-sm font-bold text-foreground block">
            {location.city || "الرياض"}
          </strong>
        </div>

        {/* District */}
        <div className="rounded-xl border border-border/70 bg-muted/30 p-2.5 sm:p-3 space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium block">
            الحي
          </span>
          <strong className="text-xs sm:text-sm font-bold text-foreground block">
            {location.district}
          </strong>
        </div>

        {/* Building Number */}
        <div className="rounded-xl border border-border/70 bg-muted/30 p-2.5 sm:p-3 space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium block">
            رقم المبنى
          </span>
          <div className="flex items-center justify-between gap-1">
            <strong className="font-mono text-xs sm:text-sm font-bold text-foreground">
              {location.buildingNumber}
            </strong>
            <CopyButton
              value={location.buildingNumber}
              itemId="loc-bld"
              label="نسخ رقم المبنى"
            />
          </div>
        </div>

        {/* Street Name */}
        <div className="rounded-xl border border-border/70 bg-muted/30 p-2.5 sm:p-3 space-y-0.5 sm:space-y-1 sm:col-span-2">
          <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium block">
            اسم الشارع
          </span>
          <strong className="text-xs sm:text-sm font-bold text-foreground block truncate">
            {location.street}
          </strong>
        </div>

        {/* Additional Number */}
        <div className="rounded-xl border border-border/70 bg-muted/30 p-2.5 sm:p-3 space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium block">
            الرقم الإضافي
          </span>
          <div className="flex items-center justify-between gap-1">
            <strong className="font-mono text-xs sm:text-sm font-bold text-foreground">
              {location.additionalNumber}
            </strong>
            <CopyButton
              value={location.additionalNumber}
              itemId="loc-add"
              label="نسخ الرقم الإضافي"
            />
          </div>
        </div>

        {/* Postal Code */}
        <div className="rounded-xl border border-border/70 bg-muted/30 p-2.5 sm:p-3 space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium block">
            الرمز البريدي
          </span>
          <div className="flex items-center justify-between gap-1">
            <strong className="font-mono text-xs sm:text-sm font-bold text-foreground">
              {location.postalCode}
            </strong>
            <CopyButton
              value={location.postalCode}
              itemId="loc-zip"
              label="نسخ الرمز البريدي"
            />
          </div>
        </div>

        {/* Short National Address */}
        <div className="rounded-xl border border-primary/30 bg-primary-50/40 dark:bg-primary-950/30 p-2.5 sm:p-3 space-y-1 sm:col-span-2 lg:col-span-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <div className="space-y-0.5">
              <span className="text-[10px] sm:text-[11px] text-primary font-bold block">
                العنوان الوطني المختصر (Short Address)
              </span>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                رمز العنوان الوطني المعتمد للاستدلال السريع والمراسلات
              </p>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <strong className="font-mono text-xs sm:text-sm md:text-base font-bold text-primary">
                {location.shortAddress || "RDHA4102"}
              </strong>
              <CopyButton
                value={location.shortAddress || "RDHA4102"}
                itemId="loc-short"
                label="نسخ العنوان المختصر"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Map Section: Shown under the form if coordinates exist */}
      {hasCoordinates && (
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
              <Compass className="size-3.5 sm:size-4 text-primary" />
              الموقع على الخريطة
            </span>

            <span className="text-[11px] sm:text-xs font-mono text-muted-foreground">
              {lat.toFixed(5)}, {lng.toFixed(5)}
            </span>
          </div>

          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-border bg-muted/40 h-44 sm:h-56 md:h-64 flex flex-col items-center justify-center text-center p-3 sm:p-4">
            {/* Subtle grid pattern background */}
            <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] opacity-70 pointer-events-none" />

            {/* Map Center Pin */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="relative">
                <div className="flex size-10 sm:size-12 items-center justify-center rounded-full bg-linear-to-tr from-primary-700 to-primary text-primary-foreground shadow-lg animate-bounce">
                  <Building2 className="size-5 sm:size-6" />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-foreground/20 rounded-full blur-xs" />
              </div>

              <div className="bg-card/90 backdrop-blur-md px-3 py-1 rounded-full border border-border shadow-xs text-[11px] sm:text-xs font-bold text-foreground flex items-center gap-1.5">
                <Compass className="size-3.5 text-primary" />
                <span>
                  الإحداثيات: {lat.toFixed(4)}, {lng.toFixed(4)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleOpenMaps}
                className="mt-0.5 inline-flex h-7.5 sm:h-8 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-bold text-foreground shadow-xs hover:bg-muted active:scale-98 cursor-pointer transition-colors"
              >
                <span>عرض الموقع على الخرائط</span>
                <ExternalLink className="size-3 text-primary" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
