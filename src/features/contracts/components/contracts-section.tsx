import { useState } from "react";
import { AlertCircle, Download, RefreshCw } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { FadeIn } from "@/components/animations";
import FeaturePageSkeleton from "@/components/layout/feature-page-skeleton";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  CONTRACT_PAYMENT_PARAM,
  CONTRACT_STATUS_OPTIONS,
  CONTRACT_STATUS_PARAM,
  CONTRACT_TYPE_PARAM,
  CONTRACT_TYPE_TABS,
  PAYMENT_STATUS_OPTIONS,
  parseContractType,
} from "../constants";
import { useContracts } from "../hooks";
import type {
  Contract,
  ContractStatus,
  PaymentMethod,
  PaymentStatus,
} from "../types";
import ContractsStatCards from "./contracts-stat-cards";
import ContractsTable from "./contracts-table";
import UpdateContractStatusDialog from "./update-contract-status-dialog";
import UpdatePaymentStatusDialog from "./update-payment-status-dialog";

export default function ContractsSection() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL State
  const activeType = parseContractType(searchParams.get(CONTRACT_TYPE_PARAM));
  const activePayment =
    searchParams.get(CONTRACT_PAYMENT_PARAM) ||
    searchParams.get("paymentStatus") ||
    "all";
  const activeStatus = searchParams.get(CONTRACT_STATUS_PARAM) || "all";
  const searchQuery = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;
  const per_page = Number(searchParams.get("per_page")) || 15;

  // API Query
  const {
    contracts: apiContracts,
    statistics,
    meta,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useContracts({
    page,
    per_page,
    search: searchQuery.trim() || undefined,
    contract_type: activeType !== "all" ? activeType : undefined,
    payment_status: activePayment !== "all" ? activePayment : undefined,
    status: activeStatus !== "all" ? activeStatus : undefined,
  });

  // Local overrides map for optimistic updates during dialog interactions
  const [localOverrides, setLocalOverrides] = useState<
    Record<string, Contract>
  >({});

  // Selected contract for status & payment dialogs
  const [selectedContractForStatus, setSelectedContractForStatus] =
    useState<Contract | null>(null);
  const [selectedContractForPayment, setSelectedContractForPayment] =
    useState<Contract | null>(null);

  // Compute actual list of contracts purely from API + local optimistic overrides
  const contracts = apiContracts.map((c) => localOverrides[c.id] || c);

  // Tab change handler
  function handleTypeChange(value: string | null) {
    const nextType = parseContractType(value);

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);

        if (nextType === "all") {
          next.delete(CONTRACT_TYPE_PARAM);
        } else {
          next.set(CONTRACT_TYPE_PARAM, nextType);
        }

        return next;
      },
      { replace: true },
    );
  }

  // Filter change from Stat cards or pills
  function handleFilterChange(
    filterType: "type" | "payment" | "status",
    value: string,
  ) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);

        // Remove any legacy duplicate param
        next.delete("paymentStatus");

        if (filterType === "type") {
          if (value === "all") next.delete(CONTRACT_TYPE_PARAM);
          else next.set(CONTRACT_TYPE_PARAM, value);
        } else if (filterType === "payment") {
          if (value === "all") next.delete(CONTRACT_PAYMENT_PARAM);
          else next.set(CONTRACT_PAYMENT_PARAM, value);
        } else if (filterType === "status") {
          if (value === "all") next.delete(CONTRACT_STATUS_PARAM);
          else next.set(CONTRACT_STATUS_PARAM, value);
        }

        return next;
      },
      { replace: true },
    );
  }

  // Refresh handler
  async function handleRefresh() {
    try {
      await refetch();
      setLocalOverrides({});
      toast.success("تم تحديث البيانات بنجاح");
    } catch {
      toast.error("تعذر تحديث البيانات من الخادم، يرجى المحاولة مرة أخرى");
    }
  }

  // Export CSV handler
  function handleExport() {
    if (contracts.length === 0) {
      toast.info("لا توجد عقود لتصديرها حالياً");
      return;
    }

    const csvContent = [
      [
        "رقم العقد",
        "رمز إيجار",
        "النوع",
        "العقار",
        "الوحدة",
        "المدينة",
        "المؤجر",
        "المستأجر",
        "القيمة الإيجارية",
        "حالة التوثيق",
        "حالة السداد",
      ].join(","),
      ...contracts.map((c) =>
        [
          c.contractNumber,
          c.ejar.ejarContractNumber,
          c.typeLabel,
          c.property.name,
          c.property.unitNumber,
          c.property.city,
          c.lessor.name,
          c.lessee.name,
          c.financials.rentalAmount,
          c.statusLabel,
          c.financials.paymentStatusLabel,
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
      `contracts-export-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("تم تصدير سجل العقود كملف CSV بنجاح");
  }

  // Update Contract Status in State
  function handleUpdateStatus(
    contractId: string,
    newStatus: ContractStatus,
    note?: string,
    ejarNumber?: string,
  ) {
    const target = contracts.find((c) => c.id === contractId);
    if (!target) return;

    const statusOption = CONTRACT_STATUS_OPTIONS.find(
      (s) => s.value === newStatus,
    );

    const updatedHistory = [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        action: `تحديث الحالة إلى ${statusOption?.label || newStatus}`,
        performedBy: "مدير العمليات",
        note: note || undefined,
        previousStatus: target.statusLabel,
        newStatus: statusOption?.label || newStatus,
      },
      ...target.historyLogs,
    ];

    const updatedContract: Contract = {
      ...target,
      status: newStatus,
      statusLabel: statusOption?.label || newStatus,
      statusColorClass: statusOption?.badgeClass || target.statusColorClass,
      updatedAt: new Date().toISOString(),
      notes: note || target.notes,
      historyLogs: updatedHistory,
      ejar: {
        ...target.ejar,
        ejarContractNumber: ejarNumber || target.ejar.ejarContractNumber,
        ejarStatus:
          newStatus === "certified" ? "synced_active" : target.ejar.ejarStatus,
        ejarStatusLabel:
          newStatus === "certified"
            ? "متزامن ونشط في شبكة إيجار"
            : target.ejar.ejarStatusLabel,
        ejarSyncedAt:
          newStatus === "certified"
            ? new Date().toISOString().replace("T", " ").slice(0, 16)
            : target.ejar.ejarSyncedAt,
      },
    };

    setLocalOverrides((prev) => ({
      ...prev,
      [contractId]: updatedContract,
    }));

    toast.success(`تم تحديث حالة العقد إلى "${statusOption?.label}" بنجاح`);
  }

  // Update Payment Status in State
  function handleUpdatePayment(
    contractId: string,
    newPaymentStatus: PaymentStatus,
    paymentMethod?: PaymentMethod,
    transactionId?: string,
  ) {
    const target = contracts.find((c) => c.id === contractId);
    if (!target) return;

    const paymentOption = PAYMENT_STATUS_OPTIONS.find(
      (p) => p.value === newPaymentStatus,
    );

    const isPaid = newPaymentStatus === "paid";
    const updatedInstallments = target.financials.installments.map((inst) =>
      isPaid
        ? {
            ...inst,
            status: "paid" as const,
            statusLabel: "تم السداد",
            paidDate: new Date().toISOString().slice(0, 10),
          }
        : inst,
    );

    const updatedContract: Contract = {
      ...target,
      updatedAt: new Date().toISOString(),
      financials: {
        ...target.financials,
        paymentStatus: newPaymentStatus,
        paymentStatusLabel: paymentOption?.label || newPaymentStatus,
        paymentMethod: paymentMethod || target.financials.paymentMethod,
        paymentMethodLabel: paymentMethod
          ? paymentMethod === "mada"
            ? "مدى (Mada)"
            : paymentMethod === "visa"
              ? "فيزا (Visa)"
              : paymentMethod === "apple_pay"
                ? "أبل باي (Apple Pay)"
                : paymentMethod === "bank_transfer"
                  ? "تحويل بنكي مباشر"
                  : "نظام سداد"
          : target.financials.paymentMethodLabel,
        transactionId: transactionId || target.financials.transactionId,
        paidAt: isPaid
          ? new Date().toISOString().replace("T", " ").slice(0, 16)
          : undefined,
        totalPaid: isPaid
          ? target.financials.platformFee + target.financials.taxAmount
          : 0,
        installments: updatedInstallments,
      },
    };

    setLocalOverrides((prev) => ({
      ...prev,
      [contractId]: updatedContract,
    }));

    toast.success(`تم تحديث حالة السداد إلى "${paymentOption?.label}" بنجاح`);
  }

  if (isLoading) {
    return <FeaturePageSkeleton />;
  }

  if (isError && contracts.length === 0) {
    return (
      <div className="page-shell space-y-6 py-6">
        <PageHeader
          title="عقود الإيجار والتوثيق الإلكتروني"
          description="إدارة شاملة لجميع عقود الإيجار السكنية والتجارية، وتحديث الحالات والربط مع شبكة إيجار والهيئة العامة للعقار."
          showRefresh
          onRefresh={handleRefresh}
          isRefreshing={isFetching}
        />
        <Empty className="border border-destructive/20 bg-destructive/5 py-12">
          <EmptyMedia
            variant="icon"
            className="bg-destructive/10 text-destructive size-12"
          >
            <AlertCircle className="size-6" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-base text-destructive">
              تعذر تحميل العقود من الخادم
            </EmptyTitle>
            <EmptyDescription>
              {error?.message || "حدث خطأ أثناء جلب قائمة العقود من الخادم."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              className="gap-2 cursor-pointer rounded-xl font-semibold"
            >
              <RefreshCw className="size-4" />
              <span>إعادة المحاولة</span>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return (
    <div className="page-shell space-y-4 sm:space-y-6 py-4 sm:py-8">
      {/* Top Header */}
      <PageHeader
        title="عقود الإيجار والتوثيق الإلكتروني"
        description="إدارة شاملة لجميع عقود الإيجار السكنية والتجارية (المدفوعة وغير المدفوعة)، وتحديث الحالات والربط مع شبكة إيجار والهيئة العامة للعقار."
        showRefresh
        onRefresh={handleRefresh}
        isRefreshing={isFetching}
        refreshTooltip="تحديث البيانات ومزامنة إيجار"
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={contracts.length === 0}
            className="gap-2 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50"
          >
            <Download className="size-4" />
            <span>تصدير CSV</span>
          </Button>
        }
      />

      {/* Summary KPI Stat Cards */}
      <ContractsStatCards
        contracts={contracts}
        statistics={statistics}
        activeTypeFilter={activeType}
        activePaymentFilter={activePayment}
        onFilterChange={handleFilterChange}
      />

      {/* Main Filter Toolbar & Quick Pills */}
      <FadeIn duration={0.3} delay={0.1}>
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-2.5 sm:p-3 shadow-xs lg:flex-row lg:items-center">
          {/* Primary Type Tabs - Swipeable on mobile */}
          <div className="overflow-x-auto no-scrollbar max-w-full">
            <Tabs value={activeType} onValueChange={handleTypeChange}>
              <TabsList
                className="w-auto flex flex-nowrap"
                aria-label="نوع العقد"
              >
                {CONTRACT_TYPE_TABS.map((tab) => {
                  const count =
                    tab.value === "all"
                      ? (statistics?.total ?? contracts.length)
                      : tab.value === "residential"
                        ? (statistics?.residential ??
                          contracts.filter((c) => c.type === "residential")
                            .length)
                        : (statistics?.commercial ??
                          contracts.filter((c) => c.type === "commercial")
                            .length);
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

          {/* Quick Payment State Chips - Swipeable on mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full whitespace-nowrap pt-1 lg:pt-0">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground me-1 shrink-0">
              حالة الرسوم:
            </span>
            <button
              type="button"
              onClick={() => handleFilterChange("payment", "all")}
              className={cn(
                "rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 active:scale-98",
                activePayment === "all"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              الكل
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange("payment", "paid")}
              className={cn(
                "rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 active:scale-98",
                activePayment === "paid"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20",
              )}
            >
              مدفوع بالكامل
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange("payment", "unpaid")}
              className={cn(
                "rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 active:scale-98",
                activePayment === "unpaid"
                  ? "bg-amber-600 text-white font-semibold"
                  : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
              )}
            >
              غير مدفوع / بانتظار السداد
            </button>
          </div>
        </div>
      </FadeIn>

      {/* Contracts Data Table */}
      <FadeIn duration={0.3} delay={0.15}>
        <ContractsTable
          contracts={contracts}
          totalCount={meta?.total}
          pageSize={per_page}
          manualPagination={true}
          isLoading={isFetching}
          onViewDetails={(contract) =>
            navigate(`/contracts/${contract.id}`, { viewTransition: true })
          }
          onUpdateStatus={(contract) => setSelectedContractForStatus(contract)}
          onUpdatePayment={(contract) =>
            setSelectedContractForPayment(contract)
          }
          emptyTitle="لا توجد عقود مسجلة"
          emptyDescription="لم يتم العثور على أي عقود في النظام حتى الآن. ستظهر العقود فور إنشائها عبر المنصة."
        />
      </FadeIn>

      {/* 1. Update Contract Status Dialog */}
      <UpdateContractStatusDialog
        contract={selectedContractForStatus}
        isOpen={Boolean(selectedContractForStatus)}
        onClose={() => setSelectedContractForStatus(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* 2. Update Payment Status Dialog */}
      <UpdatePaymentStatusDialog
        contract={selectedContractForPayment}
        isOpen={Boolean(selectedContractForPayment)}
        onClose={() => setSelectedContractForPayment(null)}
        onUpdatePayment={handleUpdatePayment}
      />
    </div>
  );
}
