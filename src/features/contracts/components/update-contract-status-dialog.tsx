import { useState } from "react";
import { CheckCircle2, FileCheck2, Sparkles } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { CONTRACT_STATUS_OPTIONS } from "../constants";
import type { Contract, ContractStatus } from "../types";

interface UpdateContractStatusDialogProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (
    contractId: string,
    newStatus: ContractStatus,
    note?: string,
    ejarNumber?: string,
  ) => void;
}

export default function UpdateContractStatusDialog({
  contract,
  isOpen,
  onClose,
  onUpdateStatus,
}: UpdateContractStatusDialogProps) {
  if (!contract) return null;

  const [selectedStatus, setSelectedStatus] = useState<ContractStatus>(
    contract.status,
  );
  const [note, setNote] = useState("");
  const [ejarNumber, setEjarNumber] = useState(
    contract.ejar.ejarContractNumber || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onUpdateStatus(contract!.id, selectedStatus, note, ejarNumber);
      setIsSubmitting(false);
      onClose();
    }, 200);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[92vh] no-scrollbar overflow-y-auto sm:max-w-lg"
        dir="rtl"
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
              <FileCheck2 className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                تحديث حالة العقد
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                رقم العقد: {contract.contractNumber} — {contract.property.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Status Selection Cards */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">
              اختر الحالة الجديدة للعقد
            </Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 p-0.5">
              {CONTRACT_STATUS_OPTIONS.map((status) => {
                const isSelected = selectedStatus === status.value;
                return (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setSelectedStatus(status.value)}
                    className={`flex flex-col items-start gap-1 rounded-xl border p-2.5 text-start transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-50/50 shadow-xs ring-1 ring-primary dark:bg-primary-950/40"
                        : "border-border bg-card hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 font-medium text-xs text-foreground">
                        <span
                          className={`size-2 rounded-full ${status.dotClass}`}
                        />
                        <span>{status.label}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="size-3.5 text-primary" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {status.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* If certified, allow updating Ejar reference */}
          {selectedStatus === "certified" && (
            <div className="rounded-xl border border-tertiary-200 bg-tertiary-50/60 p-3 dark:border-tertiary-800 dark:bg-tertiary-950/40 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-tertiary-800 dark:text-tertiary-300">
                <Sparkles className="size-3.5" />
                <span>بيانات الاعتماد في شبكة إيجار</span>
              </div>
              <div>
                <Label
                  htmlFor="ejarNumberInput"
                  className="text-[11px] text-muted-foreground"
                >
                  رقم العقد في شبكة إيجار (Ejar Contract ID)
                </Label>
                <input
                  id="ejarNumberInput"
                  type="text"
                  value={ejarNumber}
                  onChange={(e) => setEjarNumber(e.target.value)}
                  placeholder="مثال: EJR-9842105"
                  className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* Admin Note / Reason */}
          <div className="space-y-1.5">
            <Label
              htmlFor="statusNote"
              className="text-xs font-semibold text-foreground"
            >
              ملاحظات أو سبب التحديث (اختياري)
            </Label>
            <Textarea
              id="statusNote"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="اكتب ملاحظة أو توضيح يظهر في سجل أنشطة العقد..."
              rows={3}
              className="resize-none text-xs"
            />
          </div>

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
              {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
