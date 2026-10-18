import {
  Eye,
  Home,
  Layers,
  MapPin,
  Store,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router";
import { TITLE_DEED_TYPES } from "../constants";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilterConfig,
} from "@/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Property } from "../types";

interface PropertiesTableProps {
  properties: Property[];
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  syncWithUrl?: boolean;
}

export default function PropertiesTable({
  properties,
  title = "سجل العقارات والوحدات",
  subtitle = "إدارة العقارات والوحدات السكنية والتجارية، بيانات العناوين الوطنية وصكوك الملكية وتتبع الإشغال.",
  emptyTitle,
  emptyDescription,
  syncWithUrl,
}: PropertiesTableProps) {
  const columns: DataTableColumn<Property>[] = [
    {
      id: "name",
      header: "العقار والنوع",
      accessorKey: "name",
      sortable: true,
      minWidth: "220px",
      cell: (item) => {
        const isResidential = item.type === "residential";
        const PropertyIcon = isResidential ? Home : Store;

        return (
          <div className="flex items-start gap-2.5">
            <Link
              to={`/properties/${item.id}`}
              viewTransition
              className={cn(
                "mt-0.5 flex size-8.5 shrink-0 items-center justify-center rounded-xl transition-transform hover:scale-105 cursor-pointer",
                isResidential
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
              )}
            >
              <PropertyIcon className="size-4" />
            </Link>

            <div className="space-y-1 text-start">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  to={`/properties/${item.id}`}
                  viewTransition
                  className="font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer text-start"
                >
                  {item.name}
                </Link>
                <CopyButton
                  value={item.code}
                  itemId={`table-prop-${item.id}`}
                  label="نسخ رمز العقار"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0",
                    isResidential
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                  )}
                >
                  {item.typeLabel}
                </Badge>
                <span className="text-[11px] text-muted-foreground">
                  {item.buildingTypeLabel}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground/80">
                  • {item.code}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "location",
      header: "الموقع والعنوان الوطني",
      sortable: false,
      minWidth: "170px",
      cell: (item) => (
        <div className="space-y-1 text-start">
          <p className="font-semibold text-foreground flex items-center gap-1">
            <MapPin className="size-3 text-primary shrink-0" />
            <span>
              {item.location.city} - {item.location.district}
            </span>
          </p>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground ps-4">
            <span>العنوان:</span>
            <span className="font-mono font-bold text-foreground">
              {item.location.shortAddress}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "owner",
      header: "مالك العقار",
      sortable: false,
      minWidth: "170px",
      cell: (item) => (
        <div className="space-y-0.5 text-start">
          <p className="font-semibold text-foreground flex items-center gap-1">
            <UserCheck className="size-3 text-primary" />
            <span className="truncate max-w-[150px]" title={item.owner.name}>
              {item.owner.name}
            </span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            {item.owner.hasAgent ? "يوجد وكيل معتمد" : "مالك أصيل مباشر"} •{" "}
            <span className="font-mono">{item.owner.idNumber}</span>
          </p>
        </div>
      ),
    },
    {
      id: "deed",
      header: "صك الملكية والنوع",
      sortable: false,
      minWidth: "160px",
      cell: (item) => (
        <div className="space-y-1 text-start">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-foreground">
              {item.deed.deedNumber}
            </span>
            <CopyButton
              value={item.deed.deedNumber}
              itemId={`table-deed-${item.id}`}
              label="نسخ رقم الصك"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              variant="outline"
              className="font-medium px-1.5 py-0 border-border bg-muted/60 text-foreground"
            >
              {item.deed.deedTypeLabel || "صك ملكية الكتروني"}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      id: "units",
      header: "الوحدات والإشغال",
      sortable: true,
      sortValue: (item) => item.rentedUnitsCount / (item.totalUnitsCount || 1),
      minWidth: "160px",
      cell: (item) => {
        const occupancy =
          item.totalUnitsCount > 0
            ? Math.round((item.rentedUnitsCount / item.totalUnitsCount) * 100)
            : 0;

        return (
          <div className="space-y-1.5 min-w-[130px] text-start">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground flex items-center gap-1">
                <Layers className="size-3 text-muted-foreground" />
                <span>{item.totalUnitsCount} وحدة</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                {occupancy}% إشغال
              </span>
            </div>

            {/* Mini Progress bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${occupancy}%` }}
              />
            </div>

            <p className="text-[10px] text-muted-foreground">
              {item.rentedUnitsCount} مؤجرة • {item.vacantUnitsCount} شاغرة
            </p>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "الإجراءات",
      align: "center",
      minWidth: "80px",
      cell: (item) => (
        <div className="flex items-center justify-center">
          <TooltipProvider delay={150}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link
                    to={`/properties/${item.id}`}
                    viewTransition
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted hover:text-primary cursor-pointer"
                    aria-label="عرض تفاصيل العقار"
                  />
                }
              >
                <Eye className="size-4" />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4}>
                عرض تفاصيل العقار
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  const filterConfigs: DataTableFilterConfig<Property>[] = [
    {
      id: "type",
      title: "نوع العقار",
      accessorKey: "type",
      options: [
        { value: "residential", label: "سكني" },
        { value: "commercial", label: "تجاري" },
      ],
    },
    {
      id: "deedType",
      title: "نوع صك الملكية",
      options: TITLE_DEED_TYPES.map((d) => ({
        value: d.id,
        label: d.label,
      })),
      filterFn: (item, val) =>
        !val || val === "all" || item.deed.deedType === val,
    },
    {
      id: "status",
      title: "حالة الإشغال",
      options: [
        { value: "has_vacant", label: "يحتوي وحدات شاغرة" },
        { value: "fully_rented", label: "مكتمل الإشغال (100%)" },
      ],
      filterFn: (item, val) => {
        if (!val || val === "all") return true;
        if (val === "has_vacant") return item.vacantUnitsCount > 0;
        if (val === "fully_rented") return item.vacantUnitsCount === 0;
        return true;
      },
    },
    {
      id: "city",
      title: "المدينة",
      options: [
        { value: "الرياض", label: "الرياض" },
        { value: "جدة", label: "جدة" },
        { value: "الدمام", label: "الدمام" },
      ],
      filterFn: (item, val) =>
        !val || val === "all" || item.location.city === val,
    },
  ];

  return (
    <DataTable
      data={properties}
      columns={columns}
      title={title}
      subtitle={subtitle}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      syncWithUrl={syncWithUrl}
      searchPlaceholder="بحث باسم العقار، الحي، المدينة، الرمز، رقم الصك، أو المالك..."
      searchKeys={["name"]}
      searchFilter={(item, query) => {
        const q = query.toLowerCase().trim();
        return (
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.location.city.toLowerCase().includes(q) ||
          item.location.district.toLowerCase().includes(q) ||
          item.location.shortAddress.toLowerCase().includes(q) ||
          item.deed.deedNumber.includes(q) ||
          (item.deed.deedTypeLabel &&
            item.deed.deedTypeLabel.toLowerCase().includes(q)) ||
          item.owner.name.toLowerCase().includes(q) ||
          item.owner.idNumber.includes(q)
        );
      }}
      filters={filterConfigs}
      pageSize={10}
      pageSizeOptions={[5, 10, 20, 50]}
    />
  );
}
