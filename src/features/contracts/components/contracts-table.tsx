import { Link, useNavigate } from "react-router";
import {
  Building2,
  CreditCard,
  ExternalLink,
  Eye,
  FileText,
  MapPin,
  MoreVertical,
  RefreshCw,
  SaudiRiyal,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilterConfig,
} from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Contract } from "../types";

interface ContractsTableProps {
  contracts: Contract[];
  totalCount?: number;
  pageSize?: number;
  manualPagination?: boolean;
  isLoading?: boolean;
  onViewDetails?: (contract: Contract) => void;
  onUpdateStatus: (contract: Contract) => void;
  onUpdatePayment: (contract: Contract) => void;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  syncWithUrl?: boolean;
}

export default function ContractsTable({
  contracts,
  totalCount,
  pageSize = 15,
  manualPagination = false,
  isLoading = false,
  onViewDetails,
  onUpdateStatus,
  onUpdatePayment,
  title = "سجل عقود الإيجار والتوثيق",
  subtitle = "إدارة عقود الإيجار السكنية والتجارية المدفوعة وغير المدفوعة مع إمكانية تحديث الحالة.",
  emptyTitle,
  emptyDescription,
  syncWithUrl,
}: ContractsTableProps) {
  const navigate = useNavigate();
  const columns: DataTableColumn<Contract>[] = [
    {
      id: "contractNumber",
      header: "رقم العقد وشبكة إيجار",
      accessorKey: "contractNumber",
      sortable: false,
      minWidth: "190px",
      cell: (item) => {
        const isResidential = item.type === "residential";

        return (
          <div className="flex items-start gap-2.5">
            <Link
              to={`/contracts/${item.id}`}
              viewTransition
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg transition-transform hover:scale-105",
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
            </Link>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Link
                  to={`/contracts/${item.id}`}
                  viewTransition
                  className="font-semibold text-foreground hover:text-primary hover:underline transition-colors"
                >
                  {item.contractNumber}
                </Link>
                <CopyButton
                  value={item.contractNumber}
                  itemId={`table-cnt-${item.id}`}
                  label="نسخ رقم العقد"
                />
              </div>
              {item.ejar.ejarContractNumber ? (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>إيجار:</span>
                  <span className="font-mono font-medium text-foreground/80">
                    {item.ejar.ejarContractNumber}
                  </span>
                  <CopyButton
                    value={item.ejar.ejarContractNumber}
                    itemId={`table-ejr-${item.id}`}
                    label="نسخ رمز إيجار"
                  />
                </div>
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      id: "property",
      header: "العقار والوحدة",
      sortable: false,
      minWidth: "200px",
      cell: (item) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
            <span>{item.property.name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
              {item.property.unitNumber}
            </span>
            <span className="flex items-center gap-0.5">
              <MapPin className="size-3 text-muted-foreground" />
              {item.property.city} - {item.property.district}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "parties",
      header: "أطراف العقد (المؤجر والمستأجر)",
      minWidth: "220px",
      cell: (item) => (
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              المؤجر:
            </span>
            <span
              className="font-medium text-foreground truncate max-w-[140px]"
              title={item.lessor.name}
            >
              {item.lessor.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              المستأجر:
            </span>
            <span
              className="font-medium text-foreground truncate max-w-[140px]"
              title={item.lessee.name}
            >
              {item.lessee.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "type",
      header: "نوع العقد",
      accessorKey: "type",
      sortable: false,
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
      sortable: true,
      sortValue: (item) => item.financials.rentalAmount,
      align: "end",
      minWidth: "140px",
      cell: (item) => (
        <div className="text-end">
          <div className="flex items-center justify-end gap-1 text-sm font-semibold text-foreground sm:text-base">
            <span>{item.financials.rentalAmount.toLocaleString("en-US")}</span>
            <SaudiRiyal className="size-3.5 text-muted-foreground shrink-0" />
          </div>
          <div className="text-xs text-muted-foreground">
            {item.financials.paymentFrequencyLabel}
          </div>
        </div>
      ),
    },
    {
      id: "paymentStatus",
      header: "حالة السداد",
      sortable: false,
      align: "center",
      minWidth: "130px",
      cell: (item) => {
        const isPaid = item.financials.paymentStatus === "paid";
        return (
          <Badge
            variant="outline"
            className={cn(
              "font-medium text-xs px-2 py-0.5",
              isPaid
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
            )}
          >
            {item.financials.paymentStatusLabel}
          </Badge>
        );
      },
    },
    {
      id: "status",
      header: "حالة التوثيق",
      accessorKey: "status",
      sortable: false,
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
      id: "actions",
      header: "الإجراءات",
      align: "center",
      minWidth: "80px",
      cell: (item) => (
        <div className="flex items-center justify-center">
          {/* Options Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted hover:text-primary cursor-pointer"
              aria-label={`خيارات العقد ${item.contractNumber}`}
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-1 text-xs">
              <DropdownMenuGroup className="space-y-0.5">
                <DropdownMenuItem
                  onClick={() => {
                    if (onViewDetails) {
                      onViewDetails(item);
                    } else {
                      navigate(`/contracts/${item.id}`, {
                        viewTransition: true,
                      });
                    }
                  }}
                  className="gap-2 cursor-pointer font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                >
                  <Eye className="size-4 text-primary shrink-0" />
                  <span>معاينة تفاصيل العقد</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onUpdateStatus(item)}
                  className="gap-2 cursor-pointer font-medium transition-colors hover:bg-secondary/10 hover:text-secondary focus:bg-secondary/10 focus:text-secondary"
                >
                  <RefreshCw className="size-4 text-secondary shrink-0" />
                  <span>تحديث حالة التوثيق</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onUpdatePayment(item)}
                  className="gap-2 cursor-pointer font-medium transition-colors hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400"
                >
                  <CreditCard className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>تحديث حالة السداد والرسوم</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup className="space-y-0.5">
                <DropdownMenuItem
                  onClick={() => {
                    window.open(item.ejar.verificationQrUrl, "_blank");
                  }}
                  className="gap-2 cursor-pointer font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground"
                >
                  <ExternalLink className="size-4 text-foreground shrink-0" />
                  <span>التحقق في شبكة إيجار</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const uniqueCities = Array.from(
    new Set(
      contracts
        .map((c) => c.property.city)
        .filter((c) => Boolean(c && c !== "—")),
    ),
  );

  const filterConfigs: DataTableFilterConfig<Contract>[] = [
    {
      id: "type",
      title: "نوع العقد",
      accessorKey: "type",
      options: [
        { value: "residential", label: "سكني" },
        { value: "commercial", label: "تجاري" },
      ],
    },
    {
      id: "payment",
      title: "حالة السداد",
      options: [
        { value: "paid", label: "مدفوع بالكامل" },
        { value: "unpaid", label: "غير مدفوع" },
        { value: "partially_paid", label: "مدفوع جزئياً" },
        { value: "refunded", label: "مسترد / ملغي" },
      ],
      filterFn: (item, val) =>
        !val || val === "all" || item.financials.paymentStatus === val,
    },
    {
      id: "status",
      title: "حالة التوثيق",
      accessorKey: "status",
      options: [
        { value: "certified", label: "موثق مع إيجار" },
        { value: "under_review", label: "قيد المراجعة والتدقيق" },
        { value: "pending_approval", label: "بانتظار موافقة الأطراف" },
        { value: "pending_payment", label: "بانتظار السداد" },
        { value: "cancelled", label: "ملغي" },
      ],
    },
    ...(uniqueCities.length > 0
      ? [
          {
            id: "city",
            title: "المدينة",
            options: uniqueCities.map((city) => ({
              value: city,
              label: city,
            })),
            filterFn: (item: Contract, val: string) =>
              !val || val === "all" || item.property.city === val,
          },
        ]
      : []),
  ];

  return (
    <DataTable
      data={contracts}
      columns={columns}
      title={title}
      subtitle={subtitle}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      syncWithUrl={syncWithUrl}
      isLoading={isLoading}
      totalCount={totalCount}
      pageSize={pageSize}
      manualPagination={manualPagination}
      onRowDoubleClick={(item) => {
        if (onViewDetails) {
          onViewDetails(item);
        } else {
          navigate(`/contracts/${item.id}`, { viewTransition: true });
        }
      }}
      searchPlaceholder="بحث برقم العقد، رمز إيجار، العقار، المؤجر، المستأجر، أو المدينة..."
      searchKeys={["contractNumber"]}
      searchFilter={(item, query) => {
        const q = query.toLowerCase().trim();
        return (
          item.contractNumber.toLowerCase().includes(q) ||
          item.ejar.ejarContractNumber.toLowerCase().includes(q) ||
          item.property.name.toLowerCase().includes(q) ||
          item.property.unitNumber.toLowerCase().includes(q) ||
          item.property.city.toLowerCase().includes(q) ||
          item.property.district.toLowerCase().includes(q) ||
          item.property.deedNumber.toLowerCase().includes(q) ||
          item.lessor.name.toLowerCase().includes(q) ||
          item.lessor.idNumber.toLowerCase().includes(q) ||
          item.lessee.name.toLowerCase().includes(q) ||
          item.lessee.idNumber.toLowerCase().includes(q)
        );
      }}
      filters={filterConfigs}
      pageSizeOptions={[5, 10, 15, 20, 50]}
    />
  );
}
