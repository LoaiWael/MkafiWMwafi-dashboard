import { useState } from "react";
import { Ban, LockOpen } from "lucide-react";
import { toast } from "sonner";
import WarningDialog from "@/components/warning-dialog";
import { Button } from "@/components/ui/button";
import { setCustomerBlocked } from "@/features/users/customers-store";
import type { CustomerRecord } from "@/features/users/constants";

interface UserBlockActionProps {
  customer: CustomerRecord;
}

export default function UserBlockAction({ customer }: UserBlockActionProps) {
  const [open, setOpen] = useState(false);
  const willBlock = customer.active;

  function handleConfirm() {
    setCustomerBlocked(customer.id, willBlock);
    toast.success(willBlock ? "تم حظر الحساب" : "تم إلغاء الحظر");
  }

  return (
    <>
      <Button
        variant={willBlock ? "destructive" : "outline"}
        onClick={() => setOpen(true)}
        className={
          willBlock
            ? undefined
            : "border-emerald-600/30 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
        }
      >
        {willBlock ? (
          <Ban className="size-4" />
        ) : (
          <LockOpen className="size-4" />
        )}
        {willBlock ? "حظر الحساب" : "إلغاء الحظر"}
      </Button>
      <WarningDialog
        open={open}
        onOpenChange={setOpen}
        title={willBlock ? "حظر الحساب" : "إلغاء الحظر"}
        description={
          willBlock
            ? `حظر حساب ${customer.name} يمنع استخدام المنصة إلى حين إلغاء الحظر.`
            : `إلغاء الحظر عن حساب ${customer.name} يعيد إمكانية استخدام المنصة.`
        }
        confirmLabel={willBlock ? "حظر الحساب" : "إلغاء الحظر"}
        onConfirm={handleConfirm}
      />
    </>
  );
}
