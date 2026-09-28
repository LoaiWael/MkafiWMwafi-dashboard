import { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  SaudiRiyal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PAYMENT_STATUS_OPTIONS } from "../constants";
import type { Contract, PaymentMethod, PaymentStatus } from "../types";

interface UpdatePaymentStatusDialogProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePayment: (
    contractId: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: PaymentMethod,
    transactionId?: string,
  ) => void;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "mada", label: "بطاقة مدى (Mada)" },
  { value: "visa", label: "بطاقة فيزا (Visa)" },
  { value: "mastercard", label: "ماستركارد (Mastercard)" },
  { value: "apple_pay", label: "أبل باي (Apple Pay)" },
  { value: "bank_transfer", label: "تحويل بنكي مباشر (سريع)" },
  { value: "sadad", label: "نظام سداد للمدفوعات" },
];

export default function UpdatePaymentStatusDialog({
  contract,
  isOpen,
  onClose,
  onUpdatePayment,
}: UpdatePaymentStatusDialogProps) {
  if (!contract) return null;

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    contract.financials.paymentStatus,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    contract.financials.paymentMethod || "mada",
  );
  const [transactionId, setTransactionId] = useState(
    contract.financials.transactionId || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onUpdatePayment(
        contract!.id,
        paymentStatus,
        paymentStatus === "paid" || paymentStatus === "partially_paid"
          ? paymentMethod
          : undefined,
        paymentStatus === "paid" || paymentStatus === "partially_paid"
          ? transactionId
          : undefined,
      );
      setIsSubmitting(false);
      onClose();
    }, 200);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CreditCard className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                تحديث حالة السداد والرسوم
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                رقم العقد: {contract.contractNumber} — {contract.property.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Financial summary overview */}
          <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>القيمة الإيجارية السنوية:</span>
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <span>{contract.financials.rentalAmount.toLocaleString("en-US")}</span>
                <SaudiRiyal className="size-3.5 text-muted-foreground shrink-0" />
              </span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>رسوم توثيق المنصة + الضريبة:</span>
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <span>{(contract.financials.platformFee + contract.financials.taxAmount).toLocaleString("en-US")}</span>
                <SaudiRiyal className="size-3.5 text-muted-foreground shrink-0" />
              </span>
            </div>
          </div>

          {/* Payment Status selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">
              حالة السداد
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_STATUS_OPTIONS.map((status) => {
                const isSelected = paymentStatus === status.value;
                return (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setPaymentStatus(status.value)}
                    className={`flex items-center justify-between rounded-xl border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-50/50 shadow-xs ring-1 ring-primary dark:bg-primary-950/40 text-foreground"
                        : "border-border bg-card hover:bg-muted/50 text-muted-foreground"
                    }`}
                  >
                    <span>{status.label}</span>
                    {isSelected && (
                      <CheckCircle2 className="size-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method & Transaction ID if paid */}
          {(paymentStatus === "paid" || paymentStatus === "partially_paid") && (
            <div className="space-y-3 rounded-xl border border-border bg-card p-3">
              <div className="space-y-1">
                <Label htmlFor="payMethodSelect" className="text-xs font-semibold text-foreground">
                  طريقة السداد
                </Label>
                <select
                  id="payMethodSelect"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="txnIdInput" className="text-xs font-semibold text-foreground">
                  رقم العملية / المرجع المالي
                </Label>
                <input
                  id="txnIdInput"
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="مثال: TXN-88192031"
                  className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2.5 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              size="sm"
              className="gap-1.5 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري الحفظ..." : "تأكيد التحديث"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
