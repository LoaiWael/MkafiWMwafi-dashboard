import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import {
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  Loader2,
  MapPin,
  Printer,
  Receipt,
  SaudiRiyal,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { PaymentReportRecord } from "../constants";

interface PaymentReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: PaymentReportRecord | null;
}

/**
 * Converts a numeric SAR amount to Arabic words (Tafqeet)
 */
function tafqeetArabic(amount: number): string {
  if (!amount || amount === 0) return "صفر ريال سعودي فقط لا غير";

  const units = [
    "",
    "واحد",
    "اثنان",
    "ثلاثة",
    "أربعة",
    "خمسة",
    "ستة",
    "سبعة",
    "ثمانية",
    "تسعة",
    "عشرة",
  ];
  const teens = [
    "عشرة",
    "أحد عشر",
    "اثنا عشر",
    "ثلاثة عشر",
    "أربعة عشر",
    "خمسة عشر",
    "ستة عشر",
    "سبعة عشر",
    "ثمانية عشر",
    "تسعة عشر",
  ];
  const tens = [
    "",
    "عشرة",
    "عشرون",
    "ثلاثون",
    "أربعون",
    "خمسون",
    "ستون",
    "سبعون",
    "ثمانون",
    "تسعون",
  ];
  const hundreds = [
    "",
    "مائة",
    "مئتان",
    "ثلاثمائة",
    "أربعمائة",
    "خمسمائة",
    "ستمائة",
    "سبعمائة",
    "ثمانمائة",
    "تسعمائة",
  ];

  function convertGroup(n: number): string {
    if (n === 0) return "";
    let res = "";
    const h = Math.floor(n / 100);
    const remainder = n % 100;

    if (h > 0) {
      res += hundreds[h];
    }

    if (remainder > 0) {
      if (res) res += " و ";
      if (remainder <= 10) {
        res += units[remainder];
      } else if (remainder < 20) {
        res += teens[remainder - 10];
      } else {
        const u = remainder % 10;
        const t = Math.floor(remainder / 10);
        if (u > 0) {
          res += units[u] + " و " + tens[t];
        } else {
          res += tens[t];
        }
      }
    }
    return res;
  }

  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  let words = "";
  if (integerPart >= 1000) {
    const k = Math.floor(integerPart / 1000);
    const rem = integerPart % 1000;
    if (k === 1) words += "ألف";
    else if (k === 2) words += "ألفان";
    else if (k >= 3 && k <= 10) words += convertGroup(k) + " آلاف";
    else words += convertGroup(k) + " ألفاً";

    if (rem > 0) {
      words += " و " + convertGroup(rem);
    }
  } else {
    words = convertGroup(integerPart);
  }

  let result = words + " ريال سعودي";
  if (decimalPart > 0) {
    result += " و " + convertGroup(decimalPart) + " هللة";
  }
  return result + " فقط لا غير";
}

export default function PaymentReceiptDialog({
  open,
  onOpenChange,
  record,
}: PaymentReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!record) return null;

  const isCompleted = record.status === "completed";
  const isPending = record.status === "pending";
  const isFailed = record.status === "failed";
  const tafqeetText = tafqeetArabic(record.totalAmount);

  const handlePrint = () => {
    if (!receiptRef.current) {
      window.print();
      return;
    }

    const receiptElement = receiptRef.current;

    // Create an isolated hidden iframe for printing clean receipt
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      window.print();
      return;
    }

    // Collect all active styles and fonts from head
    const headElements = Array.from(
      document.head.querySelectorAll("link[rel='stylesheet'], style"),
    )
      .map((el) => el.outerHTML)
      .join("\n");

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8" />
          <title>إيصال سداد - ${record.transactionNumber}</title>
          ${headElements}
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm 20mm;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: #ffffff !important;
              color: #0d2426 !important;
              font-family: "IBM Plex Sans Arabic", sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-container {
              max-width: 580px;
              margin: 0 auto;
              padding: 16px;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${receiptElement.outerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow?.focus();
    setTimeout(() => {
      try {
        iframe.contentWindow?.print();
      } catch (err) {
        console.error("Print failed:", err);
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1000);
      }
    }, 400);
  };

  const handleDownloadPdf = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingPdf(true);
    const toastId = toast.loading("جاري إعداد وتحميل إيصال السداد (PDF)...");

    try {
      const element = receiptRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfMargin = 15;
      const contentWidth = pdfWidth - pdfMargin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        pdfMargin,
        pdfMargin,
        contentWidth,
        contentHeight,
        undefined,
        "FAST",
      );

      pdf.save(`receipt-${record.transactionNumber}.pdf`);
      toast.success("تم تحميل إيصال السداد بنجاح", { id: toastId });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("تعذر تحميل ملف الـ PDF. يرجى المحاولة مرة أخرى.", {
        id: toastId,
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[94vh] overflow-y-auto p-2.5 sm:p-5 bg-background">
        <DialogHeader className="text-start space-y-1 pb-1.5 sm:pb-2 border-b border-border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex size-7 sm:size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Receipt className="size-3.5 sm:size-4" />
              </div>
              <div>
                <DialogTitle className="text-sm sm:text-base font-bold">
                  إيصال سداد مالي
                </DialogTitle>
                <DialogDescription className="text-[10px] sm:text-xs text-muted-foreground">
                  سند قبض إلكتروني معتمد
                </DialogDescription>
              </div>
            </div>

            <Badge
              variant="outline"
              className={cn(
                "px-2 py-0.5 text-[10px] sm:text-xs font-semibold gap-1 shrink-0 rounded-full",
                isCompleted &&
                  "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                isPending &&
                  "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
                isFailed &&
                  "border-destructive/40 bg-destructive/10 text-destructive",
              )}
            >
              {isCompleted && <CheckCircle2 className="size-3" />}
              {isPending && <Clock className="size-3" />}
              {isFailed && <XCircle className="size-3" />}
              <span>{record.statusLabel}</span>
            </Badge>
          </div>
        </DialogHeader>

        {/* Compact Authentic Receipt Slip */}
        <div
          id="certified-payment-receipt"
          ref={receiptRef}
          className="rounded-xl border border-border bg-card p-2.5 sm:p-4 space-y-2.5 sm:space-y-3.5 shadow-xs text-xs"
        >
          {/* Top Brand Header */}
          <div className="flex items-center justify-between gap-2 border-b border-dashed border-border pb-2 sm:pb-3">
            <div className="flex items-center gap-2">
              <img
                src="/logo.svg"
                alt="شعار مكفي وموفي"
                className="size-8 sm:size-10 object-contain rounded-md sm:rounded-lg p-0.5 border border-border/60 bg-background shrink-0"
              />
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-foreground leading-tight">
                  منصة مكفي وموفي للوساطة العقارية
                </h3>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">
                  ترخيص فال: <span className="font-mono">1200028491</span> • معتمد لدى إيجار
                </p>
              </div>
            </div>
          </div>

          {/* Key Transaction Info Grid */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 rounded-lg bg-muted/50 p-2 sm:p-2.5 border border-border/60">
            <div>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground block">
                رقم العملية
              </span>
              <span className="font-mono font-bold text-[11px] sm:text-xs text-foreground block mt-0.5">
                {record.transactionNumber}
              </span>
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground block">
                تاريخ السداد
              </span>
              <p className="font-medium text-[11px] sm:text-xs text-foreground mt-0.5">
                {record.paidAt || record.createdAt}
              </p>
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground block">
                رقم الفاتورة
              </span>
              <span className="font-mono font-bold text-[11px] sm:text-xs text-foreground block mt-0.5">
                {record.invoiceNumber}
              </span>
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground block">
                طريقة الدفع
              </span>
              <span className="font-semibold text-[11px] sm:text-xs text-foreground block mt-0.5">
                {record.paymentMethodLabel}
              </span>
            </div>
          </div>

          {/* Important Parties & Contract Details */}
          <div className="space-y-1.5 sm:space-y-2 rounded-lg border border-border/70 p-2 sm:p-2.5 bg-background text-[11px] sm:text-xs">
            <div className="flex items-center justify-between pb-1 sm:pb-1.5 border-b border-border/50">
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="size-3 sm:size-3.5 text-primary" />
                <span>العميل:</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-foreground">
                <span>{record.payer.name}</span>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground font-normal">
                  ({record.payer.roleLabel})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pb-1 sm:pb-1.5 border-b border-border/50">
              <span className="text-muted-foreground">رقم الهوية / السجل:</span>
              <span className="font-mono font-medium text-foreground">
                {record.payer.nationalId}
              </span>
            </div>

            <div className="flex items-center justify-between pb-1 sm:pb-1.5 border-b border-border/50">
              <span className="text-muted-foreground">رقم الجوال:</span>
              <span className="font-mono font-medium text-foreground" dir="ltr">
                {record.payer.phone}
              </span>
            </div>

            <div className="flex items-center justify-between pb-1 sm:pb-1.5 border-b border-border/50">
              <span className="text-muted-foreground">رقم العقد بالمنصة:</span>
              <span className="font-mono font-bold text-foreground">
                {record.contractNumber}
              </span>
            </div>

            <div className="flex items-center justify-between pb-1 sm:pb-1.5 border-b border-border/50">
              <span className="text-muted-foreground">رقم عقد شبكة إيجار:</span>
              <span className="font-mono font-medium text-foreground">
                {record.ejarNumber}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">العقار والوحدة:</span>
              <span className="font-medium text-foreground flex items-center gap-1">
                <MapPin className="size-3 text-muted-foreground" />
                <span>
                  {record.property.name} ({record.property.city})
                </span>
              </span>
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="rounded-lg border border-border/80 overflow-hidden bg-background">
            <div className="p-2 sm:p-2.5 space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">
                  {record.paymentTypeLabel}
                </span>
                <span className="font-mono text-foreground">
                  {record.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ر.س
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">
                  ضريبة القيمة المضافة (15%)
                </span>
                <span className="font-mono text-foreground">
                  {record.taxAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ر.س
                </span>
              </div>
            </div>

            {/* Total Highlight */}
            <div className="bg-muted/60 p-2 sm:p-2.5 border-t border-border flex items-center justify-between">
              <div>
                <span className="text-[11px] sm:text-xs font-bold text-foreground block">
                  المبلغ الإجمالي المسدد
                </span>
                <span className="text-[9px] sm:text-[10px] text-primary font-medium block">
                  {tafqeetText}
                </span>
              </div>
              <div className="flex items-center gap-1 font-bold text-primary text-sm sm:text-lg">
                <span className="font-mono">
                  {record.totalAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <SaudiRiyal className="size-3.5 sm:size-4" />
              </div>
            </div>
          </div>

          {/* Certified Footer Note */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-muted-foreground pt-1 border-t border-dashed border-border/80">
            <div className="flex items-center gap-1">
              <FileCheck2 className="size-3 text-primary shrink-0" />
              <span className="truncate">إيصال معتمد إلكترونياً</span>
            </div>
            <span className="shrink-0">منصة مكفي وموفي © {new Date().getFullYear()}</span>
          </div>
        </div>

        {/* Actions Footer */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-border pt-2.5 sm:pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto cursor-pointer shrink-0"
          >
            إغلاق
          </Button>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Printer className="size-3.5" />
              <span>طباعة</span>
            </Button>
            <Button
              size="sm"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className="gap-1.5 cursor-pointer font-bold shadow-xs w-full sm:w-auto justify-center"
            >
              {isGeneratingPdf ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              <span>تحميل (PDF)</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



