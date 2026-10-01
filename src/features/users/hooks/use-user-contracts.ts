import { useState } from "react";
import { toast } from "sonner";
import {
  CONTRACT_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "@/features/contracts/constants";
import type {
  Contract,
  ContractStatus,
  PaymentMethod,
  PaymentStatus,
} from "@/features/contracts/types";
import { contractsForCustomer } from "@/features/users/customer-relations";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mada: "بطاقة مدى (Mada)",
  visa: "بطاقة فيزا (Visa)",
  mastercard: "ماستركارد (Mastercard)",
  apple_pay: "أبل باي (Apple Pay)",
  bank_transfer: "تحويل بنكي مباشر (سريع)",
  sadad: "نظام سداد للمدفوعات",
};

export function useUserContracts(customerId: string) {
  const [contracts, setContracts] = useState<Contract[]>(() =>
    contractsForCustomer(customerId),
  );
  const [sourceId, setSourceId] = useState(customerId);
  const [statusContract, setStatusContract] = useState<Contract | null>(null);
  const [paymentContract, setPaymentContract] = useState<Contract | null>(null);
  const [certificateContract, setCertificateContract] =
    useState<Contract | null>(null);

  if (sourceId !== customerId) {
    setSourceId(customerId);
    setContracts(contractsForCustomer(customerId));
    setStatusContract(null);
    setPaymentContract(null);
    setCertificateContract(null);
  }

  function updateStatus(
    contractId: string,
    newStatus: ContractStatus,
    note?: string,
    ejarNumber?: string,
  ) {
    const statusOption = CONTRACT_STATUS_OPTIONS.find(
      (option) => option.value === newStatus,
    );

    setContracts((prev) =>
      prev.map((contract) => {
        if (contract.id !== contractId) return contract;

        return {
          ...contract,
          status: newStatus,
          statusLabel: statusOption?.label || newStatus,
          statusColorClass: statusOption?.badgeClass || contract.statusColorClass,
          updatedAt: new Date().toISOString(),
          notes: note || contract.notes,
          historyLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
              action: `تحديث الحالة إلى ${statusOption?.label || newStatus}`,
              performedBy: "مدير العمليات",
              note: note || undefined,
              previousStatus: contract.statusLabel,
              newStatus: statusOption?.label || newStatus,
            },
            ...contract.historyLogs,
          ],
          ejar: {
            ...contract.ejar,
            ejarContractNumber: ejarNumber || contract.ejar.ejarContractNumber,
            ejarStatus:
              newStatus === "certified" ? "synced_active" : contract.ejar.ejarStatus,
            ejarStatusLabel:
              newStatus === "certified"
                ? "متزامن ونشط في شبكة إيجار"
                : contract.ejar.ejarStatusLabel,
            ejarSyncedAt:
              newStatus === "certified"
                ? new Date().toISOString().replace("T", " ").slice(0, 16)
                : contract.ejar.ejarSyncedAt,
          },
        };
      }),
    );

    toast.success(`تم تحديث حالة العقد إلى "${statusOption?.label}" بنجاح`);
  }

  function updatePayment(
    contractId: string,
    newPaymentStatus: PaymentStatus,
    paymentMethod?: PaymentMethod,
    transactionId?: string,
  ) {
    const paymentOption = PAYMENT_STATUS_OPTIONS.find(
      (option) => option.value === newPaymentStatus,
    );
    const isPaid = newPaymentStatus === "paid";

    setContracts((prev) =>
      prev.map((contract) => {
        if (contract.id !== contractId) return contract;

        return {
          ...contract,
          updatedAt: new Date().toISOString(),
          financials: {
            ...contract.financials,
            paymentStatus: newPaymentStatus,
            paymentStatusLabel: paymentOption?.label || newPaymentStatus,
            paymentMethod: paymentMethod || contract.financials.paymentMethod,
            paymentMethodLabel: paymentMethod
              ? PAYMENT_METHOD_LABELS[paymentMethod]
              : contract.financials.paymentMethodLabel,
            transactionId: transactionId || contract.financials.transactionId,
            paidAt: isPaid
              ? new Date().toISOString().replace("T", " ").slice(0, 16)
              : undefined,
            totalPaid: isPaid
              ? contract.financials.platformFee + contract.financials.taxAmount
              : 0,
            installments: contract.financials.installments.map((installment) =>
              isPaid
                ? {
                    ...installment,
                    status: "paid" as const,
                    statusLabel: "تم السداد",
                    paidDate: new Date().toISOString().slice(0, 10),
                  }
                : installment,
            ),
          },
        };
      }),
    );

    toast.success(`تم تحديث حالة السداد إلى "${paymentOption?.label}" بنجاح`);
  }

  return {
    contracts,
    statusContract,
    setStatusContract,
    paymentContract,
    setPaymentContract,
    certificateContract,
    setCertificateContract,
    updateStatus,
    updatePayment,
  };
}
