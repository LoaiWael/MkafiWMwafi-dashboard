import { useNavigate } from "react-router";
import ContractCertificateModal from "@/features/contracts/components/contract-certificate-modal";
import ContractsTable from "@/features/contracts/components/contracts-table";
import UpdateContractStatusDialog from "@/features/contracts/components/update-contract-status-dialog";
import UpdatePaymentStatusDialog from "@/features/contracts/components/update-payment-status-dialog";
import type { useUserContracts } from "@/features/users/hooks/use-user-contracts";

type UserContractsPanelProps = ReturnType<typeof useUserContracts>;

export default function UserContractsPanel({
  contracts,
  statusContract,
  setStatusContract,
  paymentContract,
  setPaymentContract,
  certificateContract,
  setCertificateContract,
  updateStatus,
  updatePayment,
}: UserContractsPanelProps) {
  const navigate = useNavigate();

  return (
    <>
      <ContractsTable
        contracts={contracts}
        syncWithUrl={false}
        title="عقود العميل"
        subtitle="عقود الإيجار السكنية والتجارية المرتبطة بهذا الحساب."
        emptyTitle="لا توجد عقود لهذا العميل"
        emptyDescription="ستظهر هنا عقود الإيجار بعد ربطها بهذا الحساب."
        onViewDetails={(contract) =>
          navigate(`/contracts/${contract.id}`, { viewTransition: true })
        }
        onUpdateStatus={setStatusContract}
        onUpdatePayment={setPaymentContract}
        onPrintCertificate={setCertificateContract}
      />
      <UpdateContractStatusDialog
        contract={statusContract}
        isOpen={Boolean(statusContract)}
        onClose={() => setStatusContract(null)}
        onUpdateStatus={updateStatus}
      />
      <UpdatePaymentStatusDialog
        contract={paymentContract}
        isOpen={Boolean(paymentContract)}
        onClose={() => setPaymentContract(null)}
        onUpdatePayment={updatePayment}
      />
      <ContractCertificateModal
        contract={certificateContract}
        isOpen={Boolean(certificateContract)}
        onClose={() => setCertificateContract(null)}
      />
    </>
  );
}
