import { useState } from "react";
import { Link } from "react-router";
import {
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileText,
  MapPin,
  MoreVertical,
  Printer,
  Receipt,
  SaudiRiyal,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { FadeIn } from "@/components/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import { cn } from "@/lib/utils";
import type { PaymentReportRecord, PaymentRecordStatus } from "../constants";
import PaymentReceiptDialog from "./payment-receipt-dialog";
import PaymentsStatCards from "./payments-stat-cards";

interface PaymentReportsTableProps {
  reports: PaymentReportRecord[];
  onReportsChange?: (
    updater:
      | PaymentReportRecord[]
      | ((prev: PaymentReportRecord[]) => PaymentReportRecord[]),
  ) => void;
}

type StatusFilterTab = "all" | PaymentRecordStatus;

export default function PaymentReportsTable({
  reports,
}: PaymentReportsTableProps) {
  const [selectedStatusTab, setSelectedStatusTab] =
    useState<StatusFilterTab>("all");
  const [selectedRecord, setSelectedRecord] =
    useState<PaymentReportRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  const handleOpenReceipt = (record: PaymentReportRecord) => {
    setSelectedRecord(record);
    setIsReceiptOpen(true);
  };

  const handleExportCSV = () => {
    toast.success("جاري تصدير تقرير المدفوعات بصيغة CSV...");
  };

  // Filter by status tab
  const filteredData =
    selectedStatusTab === "all"
      ? reports
      : reports.filter((r) => r.status === selectedStatusTab);

  const completedCount = reports.filter((r) => r.status === "completed").length;
  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const failedCount = reports.filter((r) => r.status === "failed").length;

  const statusFilterTabs: FilterTabItem<StatusFilterTab>[] = [
    {
      id: "all",
      label: "جميع العمليات",
      icon: Receipt,
      count: reports.length,
    },
    {
      id: "completed",
      label: "ناجحة ومكتملة",
      icon: CheckCircle2,
      count: completedCount,
    },
    {
      id: "pending",
      label: "قيد المعالجة",
      icon: Clock,
      count: pendingCount,
    },
    {
      id: "failed",
      label: "فاشلة / ملغاة",
      icon: XCircle,
      count: failedCount,
    },
  ];

  const columns: DataTableColumn<PaymentReportRecord>[] = [
    {
      id: "transactionNumber",
      header: "رقم العملية والفاتورة",
      accessorKey: "transactionNumber",
      sortable: false,
      minWidth: "170px",
      cell: (item) => (
        <div className="space-y-1 text-start">
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-xs text-foreground">
              {item.transactionNumber}
            </span>
            <CopyButton
              value={item.transactionNumber}
              itemId={`trx-${item.id}`}
              label="نسخ رقم العملية"
            />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>فاتورة:</span>
            <span className="font-mono font-medium text-foreground/80">
              {item.invoiceNumber}
            </span>
            <CopyButton
              value={item.invoiceNumber}
              itemId={`inv-${item.id}`}
              label="نسخ رقم الفاتورة"
            />
          </div>
        </div>
      ),
    },
    {
      id: "payer",
      header: "العميل (القائم بالدفع)",
      minWidth: "190px",
      cell: (item) => (
        <div className="space-y-1 text-start">
          <div className="flex items-center gap-1.5">
            <Link
              to={`/users/${item.payer.id || item.payer.nationalId || "usr-creator-default"}`}
              viewTransition
              className="font-semibold text-xs text-foreground hover:text-primary hover:underline transition-colors truncate max-w-[170px]"
              title={item.payer.name}
            >
              {item.payer.name}
            </Link>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="font-mono text-[11px]" dir="ltr">
              {item.payer.phone}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "contract",
      header: "العقد وشبكة إيجار",
      minWidth: "180px",
      cell: (item) => {
        const isResidential = item.contractType === "residential";
        return (
          <div className="space-y-1 text-start">
            <div className="flex items-center gap-1.5">
              <Link
                to={`/contracts/${item.contractId}`}
                viewTransition
                className="font-semibold text-xs text-foreground hover:text-primary hover:underline transition-colors flex items-center gap-1"
              >
                <span>{item.contractNumber}</span>
              </Link>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 font-medium",
                  isResidential
                    ? "border-primary-200 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                    : "border-secondary-200 bg-secondary-50 text-secondary-800 dark:bg-secondary-950 dark:text-secondary-300",
                )}
              >
                {item.contractTypeLabel}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <span>إيجار:</span>
              <span className="font-mono font-medium text-foreground/80">
                {item.ejarNumber}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "property",
      header: "العقار والوحدة",
      minWidth: "190px",
      cell: (item) => (
        <div className="space-y-1 text-start">
          <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
            <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate max-w-[140px]" title={item.property.name}>
              {item.property.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className="rounded bg-muted px-1 py-0.2 font-medium text-foreground text-[10px]">
              {item.property.unitNumber}
            </span>
            <span className="flex items-center gap-0.5 truncate">
              <MapPin className="size-3 text-muted-foreground shrink-0" />
              {item.property.city} - {item.property.district}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "paymentType",
      header: "الغرض وقناة السداد",
      minWidth: "170px",
      cell: (item) => (
        <div className="space-y-1 text-start">
          <span className="font-medium text-xs text-foreground block">
            {item.paymentTypeLabel}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <CreditCard className="size-3 text-muted-foreground shrink-0" />
            <span>{item.paymentMethodLabel}</span>
          </div>
        </div>
      ),
    },
    {
      id: "totalAmount",
      header: "المبلغ الإجمالي",
      accessorKey: "totalAmount",
      sortable: true,
      align: "end",
      minWidth: "130px",
      cell: (item) => (
        <div className="text-end">
          <div className="flex items-center justify-end gap-1 text-sm font-bold text-foreground">
            <span>{item.totalAmount.toLocaleString("en-US")}</span>
            <SaudiRiyal className="size-3.5 text-muted-foreground shrink-0" />
          </div>
          {item.taxAmount > 0 && (
            <span className="text-[10px] text-muted-foreground">
              شامل ضريبة {item.taxAmount} ر.س
            </span>
          )}
        </div>
      ),
    },
    {
      id: "status",
      header: "حالة العملية",
      accessorKey: "status",
      sortable: false,
      align: "center",
      minWidth: "130px",
      cell: (item) => {
        const isCompleted = item.status === "completed";
        const isPending = item.status === "pending";
        const isFailed = item.status === "failed";

        return (
          <Badge
            variant="outline"
            className={cn(
              "font-medium text-xs px-2 py-0.5 gap-1",
              isCompleted &&
                "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
              isPending &&
                "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
              isFailed &&
                "border-destructive/20 bg-destructive/10 text-destructive",
            )}
          >
            <span className="size-1.5 rounded-full bg-current" />
            <span>{item.statusLabel}</span>
          </Badge>
        );
      },
    },
    {
      id: "createdAt",
      header: "التاريخ",
      accessorKey: "createdAt",
      sortable: true,
      minWidth: "120px",
      cell: (item) => (
        <span className="text-xs text-muted-foreground font-mono">
          {item.createdAt}
        </span>
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      align: "center",
      minWidth: "80px",
      cell: (item) => (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted hover:text-primary cursor-pointer"
              aria-label={`خيارات العملية ${item.transactionNumber}`}
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-1 text-xs">
              <DropdownMenuGroup className="space-y-0.5">
                <DropdownMenuItem
                  onClick={() => handleOpenReceipt(item)}
                  className="gap-2 cursor-pointer font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                >
                  <Receipt className="size-4 text-primary shrink-0" />
                  <span>معاينة إيصال السداد</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  render={
                    <Link
                      to={`/contracts/${item.contractId}`}
                      viewTransition
                      className="flex items-center gap-2 cursor-pointer"
                    />
                  }
                  className="gap-2 cursor-pointer font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                >
                  <FileText className="size-4 text-primary shrink-0" />
                  <span>فتح العقد المرتبط</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => {
                    handleOpenReceipt(item);
                  }}
                  className="gap-2 cursor-pointer font-medium transition-colors hover:bg-secondary/10 hover:text-secondary focus:bg-secondary/10 focus:text-secondary"
                >
                  <Printer className="size-4 text-secondary shrink-0" />
                  <span>طباعة الإيصال المعتمد</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const filterConfigs: DataTableFilterConfig<PaymentReportRecord>[] = [
    {
      id: "contractType",
      title: "نوع العقد",
      options: [
        { value: "residential", label: "عقود سكنية" },
        { value: "commercial", label: "عقود تجارية" },
      ],
      filterFn: (item, val) => {
        if (!val || val === "all") return true;
        return item.contractType === val;
      },
    },
    {
      id: "paymentMethod",
      title: "طريقة وقناة السداد",
      options: [
        { value: "mada", label: "مدى (Mada)" },
        { value: "apple_pay", label: "Apple Pay" },
        { value: "visa", label: "فيزا / ماستركارد" },
        { value: "sadad", label: "سداد (Sadad)" },
        { value: "bank_transfer", label: "حوالة بنكية" },
      ],
      filterFn: (item, val) => {
        if (!val || val === "all") return true;
        return item.paymentMethod === val;
      },
    },
    {
      id: "paymentType",
      title: "غرض العملية",
      options: [
        { value: "contract_certification", label: "توثيق عقد إيجار" },
        { value: "rent_installment", label: "دفعة إيجارية" },
        { value: "security_deposit", label: "تأمين مسترد" },
        { value: "platform_fee", label: "رسوم وخدمات منصة" },
      ],
      filterFn: (item, val) => {
        if (!val || val === "all") return true;
        return item.paymentType === val;
      },
    },
  ];

  const searchFilter = (item: PaymentReportRecord, query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.transactionNumber.toLowerCase().includes(q) ||
      item.invoiceNumber.toLowerCase().includes(q) ||
      item.contractNumber.toLowerCase().includes(q) ||
      item.ejarNumber.toLowerCase().includes(q) ||
      item.payer.name.toLowerCase().includes(q) ||
      item.payer.phone.toLowerCase().includes(q) ||
      item.payer.nationalId.toLowerCase().includes(q) ||
      item.property.name.toLowerCase().includes(q) ||
      item.property.city.toLowerCase().includes(q) ||
      item.property.district.toLowerCase().includes(q) ||
      item.paymentMethodLabel.toLowerCase().includes(q) ||
      item.paymentTypeLabel.toLowerCase().includes(q)
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stat Cards Overview */}
      <PaymentsStatCards
        reports={reports}
        activeStatusFilter={selectedStatusTab}
        onStatusFilterChange={setSelectedStatusTab}
        onClearFilters={() => setSelectedStatusTab("all")}
      />

      {/* Status Filter Tabs */}
      <FadeIn duration={0.3} delay={0.03}>
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <FilterTabs
            items={statusFilterTabs}
            value={selectedStatusTab}
            onValueChange={(val) => setSelectedStatusTab(val as StatusFilterTab)}
            layout="scroll"
            className="w-full sm:w-auto"
            ariaLabel="تصفية تقارير المدفوعات حسب الحالة"
            idPrefix="payments-report-status"
          />

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="gap-1.5 text-xs cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>تصدير تقرير المدفوعات</span>
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Main DataTable */}
      <FadeIn duration={0.3} delay={0.06}>
        <DataTable
          data={filteredData}
          columns={columns}
          title="سجل وتقارير المدفوعات والعمليات المالية"
          subtitle="سجل تفصيلي لجميع عمليات السداد المنفذة من قبل المستخدمين مع ربطها بالعقود والوحدات السكنية والتجارية."
          searchPlaceholder="بحث برقم العملية، الفاتورة، اسم العميل، رقم العقد، اسم العقار، أو المدينة..."
          searchFilter={searchFilter}
          filters={filterConfigs}
          pageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </FadeIn>

      {/* Payment Receipt / Details Modal */}
      <PaymentReceiptDialog
        open={isReceiptOpen}
        onOpenChange={setIsReceiptOpen}
        record={selectedRecord}
      />
    </div>
  );
}
