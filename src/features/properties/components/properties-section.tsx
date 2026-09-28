import { useState } from "react";
import { Download } from "lucide-react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  MOCK_PROPERTIES,
  PROPERTY_STATUS_PARAM,
  PROPERTY_TYPE_PARAM,
  PROPERTY_TYPE_TABS,
  parsePropertyType,
} from "../constants";
import PropertiesStatCards from "./properties-stat-cards";
import PropertiesTable from "./properties-table";

export default function PropertiesSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const properties = MOCK_PROPERTIES;
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active filters from URL
  const activeType = parsePropertyType(searchParams.get(PROPERTY_TYPE_PARAM));
  const activeStatus = searchParams.get(PROPERTY_STATUS_PARAM) || "all";

  // Tab change handler
  function handleTypeChange(value: string | null) {
    const nextType = parsePropertyType(value);

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (nextType === "all") {
          next.delete(PROPERTY_TYPE_PARAM);
        } else {
          next.set(PROPERTY_TYPE_PARAM, nextType);
        }
        return next;
      },
      { replace: true },
    );
  }

  // Filter change from Stat cards or status chips
  function handleFilterChange(filterKey: "type" | "status", value: string) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);

        if (filterKey === "type") {
          if (value === "all") next.delete(PROPERTY_TYPE_PARAM);
          else next.set(PROPERTY_TYPE_PARAM, value);
        } else if (filterKey === "status") {
          if (value === "all") next.delete(PROPERTY_STATUS_PARAM);
          else next.set(PROPERTY_STATUS_PARAM, value);
        }

        return next;
      },
      { replace: true },
    );
  }

  // Clear all property filters handler
  function handleClearFilters() {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete(PROPERTY_TYPE_PARAM);
        next.delete(PROPERTY_STATUS_PARAM);
        return next;
      },
      { replace: true },
    );
  }

  // Refresh handler
  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("تم تحديث ومزامنة بيانات العقارات والوحدات بنجاح");
    }, 600);
  }

  // Export CSV handler
  function handleExport() {
    const csvContent = [
      [
        "رمز العقار",
        "اسم العقار",
        "النوع",
        "طبيعة المبنى",
        "المدينة",
        "الحي",
        "العنوان الوطني",
        "رقم الصك",
        "المالك",
        "رقم الهوية",
        "عدد الوحدات",
        "الوحدات المؤجرة",
        "الوحدات الشاغرة",
        "الدخل السنوي",
      ].join(","),
      ...properties.map((p) =>
        [
          p.code,
          p.name,
          p.typeLabel,
          p.buildingTypeLabel,
          p.location.city,
          p.location.district,
          p.location.shortAddress,
          p.deed.deedNumber,
          p.owner.name,
          p.owner.idNumber,
          p.totalUnitsCount,
          p.rentedUnitsCount,
          p.vacantUnitsCount,
          p.totalAnnualRevenue,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `real-estates-export-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("تم تصدير سجل العقارات والوحدات كملف CSV بنجاح");
  }

  // Filter properties by active filters
  const filteredProperties = properties.filter((p) => {
    if (activeType !== "all" && p.type !== activeType) return false;
    if (activeStatus === "vacant" && p.vacantUnitsCount === 0) return false;
    if (activeStatus === "rented" && p.rentedUnitsCount === 0) return false;
    return true;
  });

  return (
    <div className="page-shell space-y-4 sm:space-y-6 py-4 sm:py-8">
      {/* Top Header */}
      <PageHeader
        title="العقارات والوحدات العقارية"
        description="سجل شامل لإدارة العقارات السكنية والتجارية، وعناوينها الوطنية، وبيانات صكوك الملكية، وتتبع الوحدات المؤجرة والشاغرة وعدادات الخدمات."
        showRefresh
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        refreshTooltip="تحديث ومزامنة بيانات العقارات"
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2 rounded-xl text-sm font-semibold cursor-pointer"
          >
            <Download className="size-4" />
            <span>تصدير CSV</span>
          </Button>
        }
      />

      {/* KPI Fast Filter Cards */}
      <PropertiesStatCards
        properties={properties}
        activeTypeFilter={activeType}
        activeStatusFilter={activeStatus}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Main Filter Toolbar */}
      <FadeIn duration={0.3} delay={0.1}>
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-2.5 sm:p-3 shadow-xs lg:flex-row lg:items-center">
          {/* Primary Type Tabs */}
          <div className="overflow-x-auto no-scrollbar max-w-full">
            <Tabs value={activeType} onValueChange={handleTypeChange}>
              <TabsList className="w-auto flex flex-nowrap" aria-label="نوع العقار">
                {PROPERTY_TYPE_TABS.map((tab) => {
                  const count =
                    tab.value === "all"
                      ? properties.length
                      : properties.filter((p) => p.type === tab.value).length;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap shrink-0 px-2.5 sm:px-3"
                    >
                      <span>{tab.label}</span>
                      <span className="ms-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] sm:text-xs font-bold">
                        {count}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>

          {/* Quick Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full whitespace-nowrap pt-1 lg:pt-0">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground me-1 shrink-0">
              حالة الوحدات:
            </span>
            <button
              type="button"
              onClick={() => handleFilterChange("status", "all")}
              className={cn(
                "rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 active:scale-98",
                activeStatus === "all"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              الكل
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange("status", "vacant")}
              className={cn(
                "rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 active:scale-98",
                activeStatus === "vacant"
                  ? "bg-purple-600 text-white font-semibold"
                  : "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
              )}
            >
              يحتوي وحدات شاغرة
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange("status", "rented")}
              className={cn(
                "rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 active:scale-98",
                activeStatus === "rented"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20",
              )}
            >
              مؤجر / إشغال نشط
            </button>
          </div>
        </div>
      </FadeIn>

      {/* Properties DataTable */}
      <FadeIn duration={0.3} delay={0.15}>
        <PropertiesTable properties={filteredProperties} />
      </FadeIn>
    </div>
  );
}
