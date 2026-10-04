import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CreditCard, SaudiRiyal } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAYMENT_STATUS_OPTIONS } from "../constants";
import {
  updatePaymentStatusSchema,
  type UpdatePaymentStatusFormData,
} from "../schemas/contract-schema";
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
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePaymentStatusFormData>({
    resolver: zodResolver(updatePaymentStatusSchema),
    defaultValues: {
      paymentStatus: contract?.financials.paymentStatus || "unpaid",
      paymentMethod: contract?.financials.paymentMethod || "mada",
      transactionId: contract?.financials.transactionId || "",
    },
  });

  useEffect(() => {
    if (contract) {
      reset({
        paymentStatus: contract.financials.paymentStatus,
        paymentMethod: contract.financials.paymentMethod || "mada",
        transactionId: contract.financials.transactionId || "",
      });
    }
  }, [contract, reset]);

  if (!contract) return null;

  const currentPaymentStatus = watch("paymentStatus");
  const isPaidOrPartial =
    currentPaymentStatus === "paid" || currentPaymentStatus === "partially_paid";

  function onSubmit(data: UpdatePaymentStatusFormData) {
    onUpdatePayment(
      contract!.id,
      data.paymentStatus,
      isPaidOrPartial ? data.paymentMethod : undefined,
      isPaidOrPartial ? data.transactionId : undefined,
    );
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader className="text-start">
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-2 text-start"
          noValidate
        >
          {/* Financial summary overview */}
          <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>القيمة الإيجارية السنوية:</span>
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <span>
                  {contract.financials.rentalAmount.toLocaleString("en-US")}
                </span>
                <SaudiRiyal className="size-3.5 text-muted-foreground shrink-0" />
              </span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>رسوم توثيق المنصة + الضريبة:</span>
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <span>
                  {(
                    contract.financials.platformFee +
                    contract.financials.taxAmount
                  ).toLocaleString("en-US")}
                </span>
                <SaudiRiyal className="size-3.5 text-muted-foreground shrink-0" />
              </span>
            </div>
          </div>

          {/* Payment Status selection */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">
              حالة السداد <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="paymentStatus"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_STATUS_OPTIONS.map((status) => {
                    const isSelected = field.value === status.value;
                    return (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => field.onChange(status.value)}
                        disabled={isSubmitting}
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
              )}
            />
            {errors.paymentStatus && (
              <p className="text-[11px] font-medium text-destructive">
                {errors.paymentStatus.message}
              </p>
            )}
          </div>

          {/* Payment Method & Transaction ID if paid */}
          {isPaidOrPartial && (
            <div className="space-y-3 rounded-xl border border-border bg-card p-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="payMethodSelect"
                  className="text-xs font-semibold text-foreground"
                >
                  طريقة السداد <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger
                        id="payMethodSelect"
                        aria-invalid={Boolean(errors.paymentMethod)}
                        className="w-full h-9 text-xs"
                      >
                        <SelectValue placeholder="اختر طريقة السداد" />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.paymentMethod && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="txnIdInput"
                  className="text-xs font-semibold text-foreground"
                >
                  رقم العملية / المرجع المالي{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="txnIdInput"
                  type="text"
                  placeholder="مثال: TXN-88192031"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.transactionId)}
                  className="h-9 text-xs font-mono"
                  {...register("transactionId")}
                />
                {errors.transactionId && (
                  <p className="text-[11px] font-medium text-destructive">
                    {errors.transactionId.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2.5 sm:gap-3 pt-2">
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
              variant="primary"
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
