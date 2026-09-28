import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Download,
  Edit3,
  FileCheck2,
  FileText,
  Home,
  Layers,
  MapPin,
  Plus,
  SaudiRiyal,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import { MOCK_PROPERTIES } from "../constants";
import type { Property, PropertyUnit } from "../types";
import AddUnitDialog from "./add-unit-dialog";
import EditPropertyDialog from "./edit-property-dialog";
import PropertyDeedCard from "./property-deed-card";
import PropertyLinkedContracts from "./property-linked-contracts";
import PropertyLocationMapCard from "./property-location-map-card";
import PropertyOwnerCard from "./property-owner-card";
import PropertyUnitsTable from "./property-units-table";

import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import { useUrlTab } from "@/hooks/use-url-tab";

const PROPERTY_DETAILS_TABS = [
  "units",
  "location",
  "deed",
  "contracts",
] as const;

type PropertyDetailsTab = (typeof PROPERTY_DETAILS_TABS)[number];

interface PropertyDetailsViewProps {
  propertyId: string;
}

export default function PropertyDetailsView({
  propertyId,
}: PropertyDetailsViewProps) {
  // Find initial property from mocks
  const initialProperty =
    MOCK_PROPERTIES.find((p) => p.id === propertyId) ||
    MOCK_PROPERTIES.find((p) => p.code === propertyId) ||
    MOCK_PROPERTIES[0];

  const [property, setProperty] = useState<Property>(initialProperty);
  const [activeTab, setActiveTab] = useUrlTab<PropertyDetailsTab>({
    paramKey: "tab",
    defaultValue: "units",
    validValues: PROPERTY_DETAILS_TABS,
  });
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const isResidential = property.type === "residential";
  const occupancyRate =
    property.totalUnitsCount > 0
      ? Math.round((property.rentedUnitsCount / property.totalUnitsCount) * 100)
      : 0;

  // Handle adding unit
  function handleAddUnit(newUnit: PropertyUnit) {
    setProperty((prev) => {
      const updatedUnits = [newUnit, ...prev.units];
      const isRented = newUnit.rentalStatus === "rented";
      return {
        ...prev,
        units: updatedUnits,
        totalUnitsCount: prev.totalUnitsCount + 1,
        rentedUnitsCount: isRented
          ? prev.rentedUnitsCount + 1
          : prev.rentedUnitsCount,
        vacantUnitsCount: !isRented
          ? prev.vacantUnitsCount + 1
          : prev.vacantUnitsCount,
        totalAnnualRevenue: isRented
          ? prev.totalAnnualRevenue + (newUnit.currentAnnualRent || 0)
          : prev.totalAnnualRevenue,
      };
    });
  }

  // Handle editing property
  function handleSaveProperty(updated: Property) {
    setProperty(updated);
  }

  // Export report
  function handleExportReport() {
    toast.success("جاري تصدير تقرير العقار الشامل بصيغة PDF...");
  }

  // Tab definitions matching contract-details-view pattern
  const tabsList: FilterTabItem<PropertyDetailsTab>[] = [
    {
      id: "units",
      label: "الوحدات العقارية",
      icon: Layers,
      count: property.units.length,
    },
    {
      id: "location",
      label: "العنوان والموقع الجغرافي",
      icon: MapPin,
    },
    {
      id: "deed",
      label: "صك الملكية والتوثيق",
      icon: FileText,
    },
    {
      id: "contracts",
      label: "العقود المرتبطة",
      icon: FileCheck2,
      count: property.activeContractsCount,
    },
  ];

  return (
    <div className="page-shell space-y-4 sm:space-y-6 py-3 sm:py-6" dir="rtl">
      {/* 1. Top Breadcrumbs & Back Navigation */}
      <FadeIn duration={0.3}>
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-border/60 pb-3">
          <div className="space-y-1.5 min-w-0">
            {/* Responsive Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-muted-foreground overflow-x-auto no-scrollbar py-0.5 whitespace-nowrap">
              <Link
                to="/"
                viewTransition
                className="transition-colors hover:text-foreground shrink-0"
              >
                الرئيسية
              </Link>
              <span className="text-muted-foreground/60">/</span>
              <Link
                to="/properties"
                viewTransition
                className="transition-colors hover:text-foreground shrink-0"
              >
                سجل العقارات والوحدات
              </Link>
              <span className="text-muted-foreground/60">/</span>
              <span className="font-semibold text-foreground shrink-0 truncate max-w-[140px] sm:max-w-none">
                {property.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-start sm:self-auto">
            <Link
              to="/properties"
              viewTransition
              className="inline-flex h-8 sm:h-8.5 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2.5 sm:px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:scale-98 cursor-pointer"
            >
              <ArrowRight className="size-3.5" />
              <span>العودة للقائمة</span>
            </Link>
            <button
              type="button"
              onClick={handleExportReport}
              className="inline-flex h-8 sm:h-8.5 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2.5 sm:px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:scale-98 cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>تصدير تقرير</span>
            </button>
          </div>
        </div>
      </FadeIn>

      {/* 2. Master Header Banner */}
      <FadeIn direction="up" duration={0.4}>
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-5 md:p-6 shadow-xs">
          <div className="space-y-3 sm:space-y-3.5 text-start">
            {/* Top row: Badges on the right, Action buttons on the top left */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-mono text-xs sm:text-sm font-bold text-primary px-2.5 py-0.5 sm:py-1 rounded-xl bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800">
                  {property.code}
                </span>
                <CopyButton
                  value={property.code}
                  itemId={`top-prop-code-${property.id}`}
                  label="نسخ رمز العقار"
                  className="size-7 rounded-xl"
                />

                <Badge
                  variant={isResidential ? "outline" : "secondary"}
                  className={cn(
                    "text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-xl",
                    isResidential
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                  )}
                >
                  {property.typeLabel}
                </Badge>

                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-xl"
                >
                  {property.buildingTypeLabel}
                </Badge>
              </div>

              {/* Action buttons at the same level as badges in the top left */}
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsEditDialogOpen(true)}
                  className="inline-flex h-8 sm:h-8.5 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2.5 sm:px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:scale-98 cursor-pointer"
                >
                  <Edit3 className="size-3.5" />
                  <span>تعديل العقار</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddUnitOpen(true)}
                  className="inline-flex h-8 sm:h-8.5 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-primary-800 via-primary to-primary-400 text-primary-foreground px-3 sm:px-3.5 text-xs font-bold shadow-md shadow-inner-primary hover:brightness-105 active:scale-98 cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>إضافة وحدة</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
                {property.name}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 flex-wrap">
                <MapPin className="size-3.5 sm:size-4 text-primary shrink-0" />
                <span>
                  {property.location.region} - {property.location.city} (
                  {property.location.district}، {property.location.street}) •
                  العنوان المختصر:{" "}
                  <strong className="text-primary font-mono">
                    {property.location.shortAddress}
                  </strong>
                </span>
              </p>
            </div>

            {property.description && (
              <p className="max-w-4xl text-xs sm:text-sm text-muted-foreground/90 leading-relaxed">
                {property.description}
              </p>
            )}
          </div>
        </div>
      </FadeIn>

      {/* 3. Hero Metric Cards (Staggered) */}
      <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        <StaggerItem className="h-full">
          <div className="h-full rounded-xl sm:rounded-2xl border border-primary-100/80 bg-primary-50/50 dark:border-primary-900/40 dark:bg-primary-950/25 p-2.5 sm:p-3.5 shadow-2xs text-start flex flex-col justify-between gap-1.5 transition-colors">
            <span className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1 font-medium">
              <Layers className="size-3.5 text-primary" />
              إجمالي الوحدات
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-2xl font-bold text-foreground">
                {property.totalUnitsCount}
              </span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                وحدة
              </span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="h-full">
          <div className="h-full rounded-xl sm:rounded-2xl border border-tertiary-100/80 bg-tertiary-50/50 dark:border-tertiary-900/40 dark:bg-tertiary-950/25 p-2.5 sm:p-3.5 shadow-2xs text-start flex flex-col justify-between gap-1.5 transition-colors">
            <span className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1 font-medium">
              <CheckCircle2 className="size-3.5 text-tertiary" />
              نسبة الإشغال
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-2xl font-bold text-tertiary-700 dark:text-tertiary-300">
                {occupancyRate}%
              </span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                ({property.rentedUnitsCount} مؤجرة)
              </span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="h-full">
          <div className="h-full rounded-xl sm:rounded-2xl border border-sky-100/80 bg-sky-50/50 dark:border-sky-900/40 dark:bg-sky-950/25 p-2.5 sm:p-3.5 shadow-2xs text-start flex flex-col justify-between gap-1.5 transition-colors">
            <span className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1 font-medium">
              <Home className="size-3.5 text-sky-600 dark:text-sky-400" />
              الوحدات الشاغرة
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-2xl font-bold text-foreground">
                {property.vacantUnitsCount}
              </span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                متاحة
              </span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="h-full">
          <div className="h-full rounded-xl sm:rounded-2xl border border-secondary-100/80 bg-secondary-50/50 dark:border-secondary-900/40 dark:bg-secondary-950/25 p-2.5 sm:p-3.5 shadow-2xs text-start flex flex-col justify-between gap-1.5 transition-colors">
            <span className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1 font-medium">
              <SaudiRiyal className="size-3.5 text-secondary" />
              الدخل السنوي
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-xl font-bold text-secondary-700 dark:text-secondary-300">
                {property.totalAnnualRevenue?.toLocaleString("en-US")}
              </span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                ر.س
              </span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem className="col-span-2 sm:col-span-2 lg:col-span-1 h-full">
          <div className="h-full rounded-xl sm:rounded-2xl border border-border/80 bg-muted/40 dark:border-border/50 dark:bg-muted/20 p-2.5 sm:p-3.5 shadow-2xs text-start flex flex-col justify-between gap-1.5 transition-colors">
            <span className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1 font-medium">
              <Building2 className="size-3.5 text-muted-foreground" />
              المواصفات العامة
            </span>
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-bold text-foreground">
                {property.floorsCount} أدوار • {property.totalAreaSqm} م²
              </p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                عمر العقار: {property.propertyAgeYears} سنوات
              </p>
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* 4. Owner Important Details Section */}
      <FadeIn direction="up" duration={0.4} delay={0.1}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <UserCheck className="size-5 text-primary" />
              <span>بيانات مالك العقار والوكيل الشرعي</span>
            </h2>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              البيانات الرسمية لمالك العقار والوكيل المعتمد لتوثيق العقود
              والتعاملات
            </span>
          </div>

          <PropertyOwnerCard owner={property.owner} property={property} />
        </div>
      </FadeIn>

      {/* 5. SEGMENTED TAB BAR MATCHING CONTRACT DETAILS VIEW */}
      <FadeIn duration={0.3} delay={0.15}>
        <div className="space-y-4 sm:space-y-6">
          <FilterTabs
            items={tabsList}
            value={activeTab}
            onValueChange={setActiveTab}
            layout="grid"
            gridColsClass="grid-cols-2 md:grid-cols-4"
            ariaLabel="تبويبات تفاصيل العقار"
            idPrefix="property-details-tab"
          />

          {/* Tab Panels with Enter/Exit Presence Animation */}
          <AnimatePresence mode="wait">
            {/* TAB 1: Units Table */}
            {activeTab === "units" && (
              <motion.div
                key="units"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <PropertyUnitsTable
                  units={property.units}
                  onAddUnit={() => setIsAddUnitOpen(true)}
                />
              </motion.div>
            )}

            {/* TAB 2: Location & National Address */}
            {activeTab === "location" && (
              <motion.div
                key="location"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <PropertyLocationMapCard
                  location={property.location}
                  propertyName={property.name}
                />
              </motion.div>
            )}

            {/* TAB 3: Deed Card */}
            {activeTab === "deed" && (
              <motion.div
                key="deed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <PropertyDeedCard deed={property.deed} />
              </motion.div>
            )}

            {/* TAB 5: Linked Contracts */}
            {activeTab === "contracts" && (
              <motion.div
                key="contracts"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <PropertyLinkedContracts property={property} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeIn>

      {/* Dialogs */}
      <AddUnitDialog
        isOpen={isAddUnitOpen}
        onClose={() => setIsAddUnitOpen(false)}
        onAddUnit={handleAddUnit}
        existingUnitsCount={property.units.length}
      />

      <EditPropertyDialog
        property={property}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveProperty}
      />
    </div>
  );
}
