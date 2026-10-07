import { useState } from "react";
import { ArrowRight, CheckCircle2, KeyRound, Mail, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ForgotPasswordDialog({
  open,
  onOpenChange,
}: ForgotPasswordDialogProps) {
  const [identifier, setIdentifier] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      // Reset state when closing
      setTimeout(() => {
        setIsSubmitted(false);
        setIdentifier("");
      }, 200);
    }
    onOpenChange(newOpen);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = identifier.trim();
    if (!value) {
      toast.error("يرجى إدخال البريد الإلكتروني أو رقم الجوال المسجل.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("تم إرسال تعليمات استعادة كلمة المرور بنجاح.");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <div className="mb-2 inline-flex size-11 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            {isSubmitted ? (
              <CheckCircle2 className="size-6 text-primary" />
            ) : (
              <KeyRound className="size-6 text-primary" />
            )}
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            {isSubmitted ? "تم إرسال رابط الاستعادة" : "استعادة كلمة المرور"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isSubmitted
              ? `تم إرسال رابط وتعليمات إعادة تعيين كلمة المرور إلى (${identifier}). يرجى التحقق من الرسائل الواردة.`
              : "أدخل بريدك الإلكتروني أو رقم الجوال المرتبط بحسابك الإداري وسنرسل لك رابطاً لإعادة تعيين كلمة المرور."}
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="mt-2 space-y-4">
            <div className="rounded-xl border border-primary/20 bg-primary-50/60 p-4 text-xs text-primary-900">
              <p className="font-semibold">لم تصلك الرسالة؟</p>
              <p className="mt-1 text-muted-foreground">
                يرجى التحقق من مجلد الرسائل غير المرغوب فيها (Spam) أو إعادة المحاولة بعد دقيقة واحدة.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="text-xs"
              >
                إعادة المحاولة ببيانات أخرى
              </Button>
              <Button
                variant="primary"
                onClick={() => handleOpenChange(false)}
                className="text-xs"
              >
                تم، إغلاق
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="space-y-2">
              <Label htmlFor="forgot-identifier" className="text-xs font-semibold">
                البريد الإلكتروني أو رقم الجوال
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-muted-foreground">
                  {identifier.includes("@") ? (
                    <Mail className="size-4" />
                  ) : (
                    <Phone className="size-4" />
                  )}
                </div>
                <Input
                  id="forgot-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="h-10 ps-10 pe-4 text-start"
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowRight className="size-3.5 rtl:rotate-180" />
                <span>العودة لتسجيل الدخول</span>
              </button>

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !identifier.trim()}
                className="h-10 text-xs font-semibold"
              >
                {isSubmitting ? (
                  <span>جاري الإرسال...</span>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    <span>إرسال الرابط</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
