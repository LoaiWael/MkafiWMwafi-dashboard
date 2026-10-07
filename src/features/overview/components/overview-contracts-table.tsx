import {
  Building2,
  Eye,
  FileText,
  MapPin,
  SaudiRiyal,
  Store,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
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
import {
  type OverviewContract,
  RECENT_CONTRACTS_DATA,
} from "@/features/overview/constants";
import { cn } from "@/lib/utils";

export default function OverviewContractsTable() {
  const navigate = useNavigate();
  const columns: DataTableColumn<OverviewContract>[] = [
    {
      id: "contractNumber",
      header: "رقم العقد والتوثيق",
      accessorKey: "contractNumber",
      minWidth: "180px",
      cell: (item) => {
        const isResidential = item.type === "residential";

        return (
          <div className="flex items-start gap-2.5">
            <div
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl",
                isResidential
                  ? "bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400"
                  : "bg-secondary-50 text-secondary-600 dark:bg-secondary-950 dark:text-secondary-400",
              )}
            >
              {isResidential ? (
                <FileText className="size-4" />
              ) : (
                <Store className="size-4" />
              )}
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <Link
                  to={`/contracts/${item.id}`}
                  viewTransition
                  className="font-semibold text-foreground hover:text-primary hover:underline truncate"
                >
                  {item.contractNumber}
                </Link>
                <CopyButton
                  value={item.contractNumber}
                  itemId={`cnt-${item.id}`}
                  label="نسخ رقم العقد"
                  successMessage="تم النسخ بنجاح!"
                />
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>شبكة إيجار:</span>
                <span className="font-mono font-medium text-foreground/80">
                  {item.ejarContractId}
                </span>
                <CopyButton
                  value={item.ejarContractId}
                  itemId={`ejr-${item.id}`}
                  label="نسخ رمز إيجار"
                  successMessage="تم النسخ بنجاح!"
                />
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "propertyTitle",
      header: "العقار والوحدة",
      accessorKey: "propertyTitle",
      minWidth: "200px",
      cell: (item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{item.propertyTitle}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
              {item.unitNumber}
            </span>
            <span className="flex items-center gap-0.5">
              <MapPin className="size-3 text-muted-foreground shrink-0" />
              {item.city} - {item.district}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "parties",
      header: "أطراف العقد",
      accessorKey: "lessorName",
      minWidth: "200px",
      cell: (item) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground shrink-0">
              المؤجر:
            </span>
            <span className="font-medium text-foreground truncate">
              {item.lessorName}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground shrink-0">
              المستأجر:
            </span>
            <span className="font-medium text-foreground truncate">
              {item.lesseeName}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "type",
      header: "نوع العقد",
      accessorKey: "type",
      align: "center",
      minWidth: "100px",
      cell: (item) => {
        const isResidential = item.type === "residential";
        return (
          <Badge
            variant="outline"
            className={
              isResidential
                ? "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 text-xs font-medium"
                : "border-secondary-200 bg-secondary-50 text-secondary-800 dark:border-secondary-800 dark:bg-secondary-950 dark:text-secondary-300 text-xs font-medium"
            }
          >
            {item.typeLabel}
          </Badge>
        );
      },
    },
    {
      id: "rentalAmount",
      header: "القيمة الإيجارية",
      accessorKey: "rentalAmount",
      sortable: true,
      align: "end",
      minWidth: "130px",
      cell: (item) => (
        <div className="text-end">
          <div className="inline-flex items-center gap-1 font-semibold text-foreground text-sm sm:text-base">
            <span>{item.rentalAmount.toLocaleString()}</span>
            <SaudiRiyal className="size-3.5 text-muted-foreground shrink-0" />
          </div>
          <div className="text-xs text-muted-foreground">
            {item.durationMonths} شهر
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "حالة التوثيق",
      accessorKey: "status",
      align: "center",
      minWidth: "150px",
      cell: (item) => (
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 border px-2.5 py-1 text-xs font-medium",
            item.statusColorClass,
          )}
        >
          <span className="size-1.5 rounded-full bg-current" />
          <span>{item.statusLabel}</span>
        </Badge>
      ),
    },
    {
      id: "documentedAt",
      header: "تاريخ التوثيق",
      accessorKey: "documentedAtDate",
      sortable: true,
      align: "end",
      minWidth: "120px",
      cell: (item) => (
        <div className="text-end text-xs">
          <span className="font-medium text-foreground">
            {item.documentedAt}
          </span>
          <div className="text-xs text-muted-foreground">
            {item.documentedAtDate}
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      align: "center",
      minWidth: "100px",
      cell: (item) => (
        <div className="flex items-center justify-center gap-1">
          <TooltipProvider delay={150}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Link
                    to={`/contracts/${item.id}`}
                    viewTransition
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted active:scale-95"
                    aria-label="عرض تفاصيل العقد"
                  />
                }
              >
                <Eye className="size-4" />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4}>
                عرض تفاصيل العقد
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  const filterConfigs: DataTableFilterConfig<OverviewContract>[] = [
    {
      id: "type",
      title: "النوع",
      accessorKey: "type",
      options: [
        { value: "residential", label: "سكني" },
        { value: "commercial", label: "تجاري" },
      ],
    },
    {
      id: "status",
      title: "الحالة",
      accessorKey: "status",
      options: [
        { value: "certified", label: "موثق مع إيجار" },
        { value: "under_review", label: "قيد المراجعة" },
        { value: "pending_approval", label: "بانتظار الموافقة" },
        { value: "pending_payment", label: "بانتظار السداد" },
      ],
    },
    {
      id: "city",
      title: "المدينة",
      accessorKey: "city",
      options: [
        { value: "الرياض", label: "الرياض" },
        { value: "جدة", label: "جدة" },
        { value: "الدمام", label: "الدمام" },
        { value: "الخبر", label: "الخبر" },
        { value: "مكة المكرمة", label: "مكة المكرمة" },
        { value: "المدينة المنورة", label: "المدينة المنورة" },
      ],
    },
  ];

  return (
    <DataTable
      data={RECENT_CONTRACTS_DATA}
      columns={columns}
      title="أحدث عمليات توثيق العقود والعقارات"
      subtitle="سجل فوري لجميع العقود السكنية والتجارية الموثقة عبر شبكة إيجار والهيئة العامة للعقار."
      searchPlaceholder="بحث برقم العقد، العقار، المؤجر، المستأجر، أو المدينة..."
      searchKeys={[
        "contractNumber",
        "ejarContractId",
        "propertyTitle",
        "unitNumber",
        "city",
        "district",
        "lessorName",
        "lesseeName",
      ]}
      filters={filterConfigs}
      pageSize={5}
      pageSizeOptions={[5, 10, 20]}
      onRowDoubleClick={(item) =>
        navigate(`/contracts/${item.id}`, { viewTransition: true })
      }
    />
  );
}
