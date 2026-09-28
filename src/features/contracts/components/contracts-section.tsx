import { useState } from "react";
import { Download } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  CONTRACT_PAYMENT_PARAM,
  CONTRACT_STATUS_OPTIONS,
  CONTRACT_STATUS_PARAM,
  CONTRACT_TYPE_PARAM,
  CONTRACT_TYPE_TABS,
  MOCK_CONTRACTS,
  PAYMENT_STATUS_OPTIONS,
  parseContractType,
} from "../constants";
import type {
  Contract,
  ContractStatus,
  PaymentMethod,
  PaymentStatus,
} from "../types";
import ContractCertificateModal from "./contract-certificate-modal";
import ContractsStatCards from "./contracts-stat-cards";
import ContractsTable from "./contracts-table";
import UpdateContractStatusDialog from "./update-contract-status-dialog";
import UpdatePaymentStatusDialog from "./update-payment-status-dialog";

export default function ContractsSection() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Selected contract for status & payment dialogs
  const [selectedContractForStatus, setSelectedContractForStatus] =
    useState<Contract | null>(null);
  const [selectedContractForPayment, setSelectedContractForPayment] =
    useState<Contract | null>(null);
  const [selectedContractForCertificate, setSelectedContractForCertificate] =
    useState<Contract | null>(null);

  // URL State
  const activeType = parseContractType(searchParams.get(CONTRACT_TYPE_PARAM));
  const activePayment =
    searchParams.get(CONTRACT_PAYMENT_PARAM) ||
    searchParams.get("paymentStatus") ||
    "all";

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
  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("تم تحديث بيانات ومزامنة العقود مع شبكة إيجار بنجاح");
    }, 600);
  }

  // Export CSV handler
  function handleExport() {
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
    const statusOption = CONTRACT_STATUS_OPTIONS.find(
      (s) => s.value === newStatus,
    );

    setContracts((prev) =>
      prev.map((c) => {
        if (c.id !== contractId) return c;

        const updatedHistory = [
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
            action: `تحديث الحالة إلى ${statusOption?.label || newStatus}`,
            performedBy: "مدير العمليات",
            note: note || undefined,
            previousStatus: c.statusLabel,
            newStatus: statusOption?.label || newStatus,
          },
          ...c.historyLogs,
        ];

        const updatedContract: Contract = {
          ...c,
          status: newStatus,
          statusLabel: statusOption?.label || newStatus,
          statusColorClass: statusOption?.badgeClass || c.statusColorClass,
          updatedAt: new Date().toISOString(),
          notes: note || c.notes,
          historyLogs: updatedHistory,
          ejar: {
            ...c.ejar,
            ejarContractNumber: ejarNumber || c.ejar.ejarContractNumber,
            ejarStatus: newStatus === "certified" ? "synced_active" : c.ejar.ejarStatus,
            ejarStatusLabel:
              newStatus === "certified"
                ? "متزامن ونشط في شبكة إيجار"
                : c.ejar.ejarStatusLabel,
            ejarSyncedAt:
              newStatus === "certified"
                ? new Date().toISOString().replace("T", " ").slice(0, 16)
                : c.ejar.ejarSyncedAt,
          },
        };

        return updatedContract;
      }),
    );

    toast.success(`تم تحديث حالة العقد إلى "${statusOption?.label}" بنجاح`);
  }

  // Update Payment Status in State
  function handleUpdatePayment(
    contractId: string,
    newPaymentStatus: PaymentStatus,
    paymentMethod?: PaymentMethod,
    transactionId?: string,
  ) {
    const paymentOption = PAYMENT_STATUS_OPTIONS.find(
      (p) => p.value === newPaymentStatus,
    );

    setContracts((prev) =>
      prev.map((c) => {
        if (c.id !== contractId) return c;

        const isPaid = newPaymentStatus === "paid";
        const updatedInstallments = c.financials.installments.map((inst) =>
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
          ...c,
          updatedAt: new Date().toISOString(),
          financials: {
            ...c.financials,
            paymentStatus: newPaymentStatus,
            paymentStatusLabel: paymentOption?.label || newPaymentStatus,
            paymentMethod: paymentMethod || c.financials.paymentMethod,
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
              : c.financials.paymentMethodLabel,
            transactionId: transactionId || c.financials.transactionId,
            paidAt: isPaid
              ? new Date().toISOString().replace("T", " ").slice(0, 16)
              : undefined,
            totalPaid: isPaid
              ? c.financials.platformFee + c.financials.taxAmount
              : 0,
            installments: updatedInstallments,
          },
        };

        return updatedContract;
      }),
    );

    toast.success(`تم تحديث حالة السداد إلى "${paymentOption?.label}" بنجاح`);
  }

  return (
    <div className="page-shell space-y-4 sm:space-y-6 py-4 sm:py-8">
      {/* Top Header */}
      <PageHeader
        title="عقود الإيجار والتوثيق الإلكتروني"
        description="إدارة شاملة لجميع عقود الإيجار السكنية والتجارية (المدفوعة وغير المدفوعة)، وتحديث الحالات والربط مع شبكة إيجار والهيئة العامة للعقار."
        showRefresh
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        refreshTooltip="تحديث البيانات ومزامنة إيجار"
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

      {/* Summary KPI Stat Cards */}
      <ContractsStatCards
        contracts={contracts}
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
              <TabsList className="w-auto flex flex-nowrap" aria-label="نوع العقد">
                {CONTRACT_TYPE_TABS.map((tab) => {
                  const count =
                    tab.value === "all"
                      ? contracts.length
                      : contracts.filter((c) => c.type === tab.value).length;
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
          onViewDetails={(contract) =>
            navigate(`/contracts/${contract.id}`, { viewTransition: true })
          }
          onUpdateStatus={(contract) => setSelectedContractForStatus(contract)}
          onUpdatePayment={(contract) => setSelectedContractForPayment(contract)}
          onPrintCertificate={(contract) =>
            setSelectedContractForCertificate(contract)
          }
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

      {/* 3. Certificate Print / Preview Modal */}
      <ContractCertificateModal
        contract={selectedContractForCertificate}
        isOpen={Boolean(selectedContractForCertificate)}
        onClose={() => setSelectedContractForCertificate(null)}
      />
    </div>
  );
}
