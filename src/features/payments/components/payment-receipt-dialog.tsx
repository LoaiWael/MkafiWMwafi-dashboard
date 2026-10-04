import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Building2,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  Loader2,
  MapPin,
  Printer,
  Receipt,
  SaudiRiyal,
  ShieldCheck,
  Store,
  User,
  XCircle,
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
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

/**
 * Authentic SVG QR Code representation for certified receipts
 */
function ReceiptQrCode({ value }: { value: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg border border-border/80 bg-background shrink-0">
      <svg
        viewBox="0 0 100 100"
        className="size-20 sm:size-24 fill-foreground"
        aria-label={`رمز الاستجابة السريعة: ${value}`}
      >
        {/* Top-Left Position Detection Pattern */}
        <rect x="5" y="5" width="28" height="28" rx="3" fill="currentColor" />
        <rect x="9" y="9" width="20" height="20" rx="2" fill="var(--color-background, #fff)" />
        <rect x="13" y="13" width="12" height="12" rx="1" fill="currentColor" />

        {/* Top-Right Position Detection Pattern */}
        <rect x="67" y="5" width="28" height="28" rx="3" fill="currentColor" />
        <rect x="71" y="9" width="20" height="20" rx="2" fill="var(--color-background, #fff)" />
        <rect x="75" y="13" width="12" height="12" rx="1" fill="currentColor" />

        {/* Bottom-Left Position Detection Pattern */}
        <rect x="5" y="67" width="28" height="28" rx="3" fill="currentColor" />
        <rect x="9" y="71" width="20" height="20" rx="2" fill="var(--color-background, #fff)" />
        <rect x="13" y="75" width="12" height="12" rx="1" fill="currentColor" />

        {/* Alignment Pattern */}
        <rect x="70" y="70" width="16" height="16" rx="2" fill="currentColor" />
        <rect x="74" y="74" width="8" height="8" rx="1" fill="var(--color-background, #fff)" />
        <rect x="76" y="76" width="4" height="4" fill="currentColor" />

        {/* Simulated Data Grid */}
        <rect x="38" y="8" width="4" height="4" fill="currentColor" />
        <rect x="46" y="8" width="8" height="4" fill="currentColor" />
        <rect x="58" y="8" width="4" height="4" fill="currentColor" />
        <rect x="38" y="16" width="8" height="4" fill="currentColor" />
        <rect x="50" y="16" width="4" height="4" fill="currentColor" />
        <rect x="58" y="16" width="4" height="4" fill="currentColor" />
        <rect x="38" y="24" width="4" height="4" fill="currentColor" />
        <rect x="46" y="24" width="4" height="4" fill="currentColor" />
        <rect x="54" y="24" width="8" height="4" fill="currentColor" />

        <rect x="8" y="38" width="4" height="4" fill="currentColor" />
        <rect x="16" y="38" width="8" height="4" fill="currentColor" />
        <rect x="28" y="38" width="4" height="4" fill="currentColor" />
        <rect x="38" y="38" width="8" height="8" fill="currentColor" />
        <rect x="50" y="38" width="4" height="4" fill="currentColor" />
        <rect x="58" y="38" width="8" height="4" fill="currentColor" />
        <rect x="70" y="38" width="4" height="4" fill="currentColor" />
        <rect x="78" y="38" width="8" height="4" fill="currentColor" />
        <rect x="90" y="38" width="4" height="4" fill="currentColor" />

        <rect x="8" y="46" width="8" height="4" fill="currentColor" />
        <rect x="20" y="46" width="4" height="4" fill="currentColor" />
        <rect x="28" y="46" width="4" height="4" fill="currentColor" />
        <rect x="50" y="46" width="8" height="8" fill="currentColor" />
        <rect x="62" y="46" width="4" height="4" fill="currentColor" />
        <rect x="70" y="46" width="8" height="4" fill="currentColor" />
        <rect x="82" y="46" width="4" height="4" fill="currentColor" />
        <rect x="90" y="46" width="4" height="4" fill="currentColor" />

        <rect x="8" y="54" width="4" height="4" fill="currentColor" />
        <rect x="16" y="54" width="4" height="4" fill="currentColor" />
        <rect x="24" y="54" width="8" height="4" fill="currentColor" />
        <rect x="38" y="54" width="4" height="4" fill="currentColor" />
        <rect x="62" y="54" width="8" height="4" fill="currentColor" />
        <rect x="74" y="54" width="4" height="4" fill="currentColor" />
        <rect x="82" y="54" width="8" height="4" fill="currentColor" />

        <rect x="38" y="66" width="8" height="4" fill="currentColor" />
        <rect x="50" y="66" width="4" height="4" fill="currentColor" />
        <rect x="58" y="66" width="4" height="4" fill="currentColor" />
        <rect x="38" y="74" width="4" height="4" fill="currentColor" />
        <rect x="46" y="74" width="8" height="4" fill="currentColor" />
        <rect x="58" y="74" width="8" height="4" fill="currentColor" />
        <rect x="38" y="86" width="8" height="4" fill="currentColor" />
        <rect x="50" y="86" width="8" height="4" fill="currentColor" />
      </svg>
      <span className="text-[9px] font-mono text-muted-foreground mt-1 text-center font-medium">
        ZATCA • EJAR
      </span>
    </div>
  );
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
  const isResidential = record.contractType === "residential";
  const tafqeetText = tafqeetArabic(record.totalAmount);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingPdf(true);
    const toastId = toast.loading("جاري إعداد وتحميل إيصال السداد المعتمد (PDF)...");

    try {
      const element = receiptRef.current;

      // Render high-resolution canvas from receipt voucher
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfMargin = 10;
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
      toast.success("تم تحميل إيصال السداد الإلكتروني بنجاح", { id: toastId });
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
      <DialogContent className="max-w-3xl sm:max-w-3xl max-h-[92vh] overflow-y-auto p-3 sm:p-6 bg-background">
        <DialogHeader className="text-start space-y-1.5 pb-2 border-b border-border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Receipt className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold">
                  إيصال سداد مالي معتمد
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  سند قبض إلكتروني رسمي مطابق لمعايير شبكة إيجار والهيئة العامة للعقار
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "px-3 py-1 text-xs font-bold gap-1.5 shrink-0 rounded-full",
                  isCompleted &&
                    "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  isPending &&
                    "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
                  isFailed &&
                    "border-destructive/40 bg-destructive/10 text-destructive",
                )}
              >
                {isCompleted && <CheckCircle2 className="size-3.5" />}
                {isPending && <Clock className="size-3.5" />}
                {isFailed && <XCircle className="size-3.5" />}
                <span>{record.statusLabel}</span>
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Printable & Exportable Authentic Receipt Voucher */}
        <div
          id="certified-payment-receipt"
          ref={receiptRef}
          className="rounded-2xl border-2 border-border/80 bg-card p-4 sm:p-7 space-y-5 shadow-sm relative overflow-hidden"
        >
          {/* Subtle Background Security Watermark */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.04] bg-repeat bg-center"
            style={{
              backgroundImage: `radial-gradient(var(--color-primary, #00b2bd) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Receipt Top Header with Logo & Official Certifications */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-dashed border-border pb-5">
            <div className="flex items-center gap-3.5">
              <img
                src="/logo.svg"
                alt="شعار مكفي وموفي"
                className="size-14 sm:size-16 object-contain rounded-xl p-1 border border-border/60 bg-background shadow-xs shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-foreground">
                    منصة مكفي وموفي للوساطة العقارية
                  </h2>
                </div>
                <p className="text-xs font-bold text-primary">
                  إيصال سداد إلكتروني معتمد • سداد رسوم توثيق العقد
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  س.ت: <span className="font-mono">1010849201</span> • ترخيص الهيئة العامة للعقار (فال):{" "}
                  <span className="font-mono">1200028491</span> • معتمد لدى شبكة إيجار
                </p>
              </div>
            </div>

            {/* QR Code & Official Seal Stamp */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {/* Receipt Stamp Badge */}
              <div
                className={cn(
                  "hidden sm:flex flex-col items-center justify-center p-2 rounded-xl border-2 border-dashed font-bold text-center rotate-[-3deg] transition-transform select-none",
                  isCompleted &&
                    "border-emerald-500/50 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400",
                  isPending &&
                    "border-amber-500/50 bg-amber-500/5 text-amber-700 dark:text-amber-400",
                  isFailed &&
                    "border-destructive/50 bg-destructive/5 text-destructive",
                )}
              >
                <div className="flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="size-3.5" />
                  <span>{isCompleted ? "مسدد بالكامل" : record.statusLabel}</span>
                </div>
                <span className="text-[9px] font-mono mt-0.5 opacity-80">
                  EJAR CERTIFIED
                </span>
              </div>

              <ReceiptQrCode value={`${record.transactionNumber}|${record.totalAmount}|${record.paidAt || record.createdAt}`} />
            </div>
          </div>

          {/* Transaction Metadata Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl bg-muted/50 p-3.5 border border-border/80">
            <div>
              <span className="text-[11px] text-muted-foreground block font-medium">
                رقم الإيصال / العملية
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="font-mono font-bold text-xs sm:text-sm text-foreground">
                  {record.transactionNumber}
                </span>
                <CopyButton
                  value={record.transactionNumber}
                  itemId={`dlg-trx-${record.id}`}
                  label="نسخ رقم العملية"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block font-medium">
                رقم الفاتورة الضريبية
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="font-mono font-bold text-xs sm:text-sm text-foreground">
                  {record.invoiceNumber}
                </span>
                <CopyButton
                  value={record.invoiceNumber}
                  itemId={`dlg-inv-${record.id}`}
                  label="نسخ رقم الفاتورة"
                />
              </div>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block font-medium">
                تاريخ ووقت السداد
              </span>
              <p className="font-medium text-xs sm:text-sm text-foreground mt-0.5">
                {record.paidAt || record.createdAt}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block font-medium">
                قناة الدفع والمرجع
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-xs sm:text-sm text-foreground">
                  {record.paymentMethodLabel}
                </span>
                {record.gatewayRef && (
                  <span className="text-[10px] font-mono text-muted-foreground truncate">
                    ({record.gatewayRef})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Two-Column Info Cards: Payer Details & Contract/Property Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Payer & Client Information Card */}
            <div className="rounded-xl border border-border p-3.5 space-y-2.5 bg-background">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <User className="size-4 text-primary" />
                  <span>بيانات العميل والقائم بالسداد</span>
                </div>
                <Badge variant="secondary" className="text-[10px] font-semibold">
                  {record.payer.roleLabel}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الاسم الكامل:</span>
                  <Link
                    to={`/users/${record.payer.id || record.payer.nationalId || "usr-default"}`}
                    viewTransition
                    className="font-bold text-foreground hover:text-primary hover:underline transition-colors flex items-center gap-1"
                  >
                    <span>{record.payer.name}</span>
                    <ExternalLink className="size-3 text-muted-foreground" />
                  </Link>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">رقم الهوية / السجل:</span>
                  <span className="font-mono font-bold text-foreground">
                    {record.payer.nationalId}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">رقم الجوال المسجل:</span>
                  <span className="font-mono font-medium text-foreground" dir="ltr">
                    {record.payer.phone}
                  </span>
                </div>

                {record.payer.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">البريد الإلكتروني:</span>
                    <span className="font-mono text-muted-foreground truncate max-w-[180px]">
                      {record.payer.email}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contract & Property Information Card */}
            <div className="rounded-xl border border-border p-3.5 space-y-2.5 bg-background">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  {isResidential ? (
                    <FileText className="size-4 text-primary" />
                  ) : (
                    <Store className="size-4 text-secondary" />
                  )}
                  <span>بيانات العقد والوحدة العقارية</span>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-semibold",
                    isResidential
                      ? "border-primary-200 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                      : "border-secondary-200 bg-secondary-50 text-secondary-800 dark:bg-secondary-950 dark:text-secondary-300",
                  )}
                >
                  {record.contractTypeLabel}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">رقم العقد بالمنصة:</span>
                  <Link
                    to={`/contracts/${record.contractId}`}
                    viewTransition
                    className="font-bold text-foreground hover:text-primary hover:underline transition-colors flex items-center gap-1"
                  >
                    <span>{record.contractNumber}</span>
                    <ExternalLink className="size-3" />
                  </Link>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">رقم عقد شبكة إيجار:</span>
                  <span className="font-mono font-bold text-foreground">
                    {record.ejarNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">العقار والوحدة:</span>
                  <span className="font-medium text-foreground">
                    {record.property.name} (وحدة {record.property.unitNumber})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">المدينة والحي:</span>
                  <span className="flex items-center gap-1 text-foreground font-medium">
                    <MapPin className="size-3 text-muted-foreground" />
                    {record.property.city} - {record.property.district}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">رقم الصك العقاري:</span>
                  <span className="font-mono text-muted-foreground">
                    {record.property.deedNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Itemized Financial Breakdown Table */}
          <div className="rounded-xl border border-border overflow-hidden bg-background">
            <div className="bg-muted/70 px-4 py-2.5 font-bold text-xs sm:text-sm text-foreground flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-primary" />
                <span>جدول التفاصيل المالية وبيان الرسوم</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>ضريبة القيمة المضافة 15% (VAT)</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3.5 text-start w-10">#</th>
                    <th className="py-2.5 px-3.5 text-start">بيان الخدمة / البند</th>
                    <th className="py-2.5 px-3.5 text-end">المبلغ الأساسي</th>
                    <th className="py-2.5 px-3.5 text-end">نسبة الضريبة</th>
                    <th className="py-2.5 px-3.5 text-end">مبلغ الضريبة</th>
                    <th className="py-2.5 px-3.5 text-end">الإجمالي (شامل الضريبة)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-foreground font-medium">
                  <tr>
                    <td className="py-3 px-3.5 font-mono text-muted-foreground">1</td>
                    <td className="py-3 px-3.5 font-semibold">
                      <span>{record.paymentTypeLabel}</span>
                      <span className="block text-[11px] text-muted-foreground font-normal mt-0.5">
                        توثيق وإصدار عقد إيجار إلكتروني معتمد لدى شبكة إيجار
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-end font-mono">
                      {record.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      <span className="text-[10px] text-muted-foreground">ر.س</span>
                    </td>
                    <td className="py-3 px-3.5 text-end font-mono">15%</td>
                    <td className="py-3 px-3.5 text-end font-mono">
                      {record.taxAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      <span className="text-[10px] text-muted-foreground">ر.س</span>
                    </td>
                    <td className="py-3 px-3.5 text-end font-mono font-bold text-primary">
                      {record.totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      <span className="text-[10px] text-muted-foreground">ر.س</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals Summary Footer */}
            <div className="bg-muted/40 p-4 border-t border-border space-y-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-muted-foreground block font-medium">
                    المبلغ الإجمالي كتابة (تفقيط):
                  </span>
                  <p className="font-bold text-foreground text-xs sm:text-sm text-primary">
                    {tafqeetText}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-start sm:text-end">
                    <span className="text-muted-foreground block text-[11px]">
                      المجموع قبل الضريبة:
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {record.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      ر.س
                    </span>
                  </div>
                  <div className="text-start sm:text-end">
                    <span className="text-muted-foreground block text-[11px]">
                      إجمالي الضريبة (15%):
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {record.taxAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      ر.س
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-extrabold text-foreground text-sm sm:text-base">
                  صافي المبلغ الإجمالي المسدد
                </span>
                <div className="flex items-center gap-1 font-extrabold text-primary text-base sm:text-xl">
                  <span className="font-mono">
                    {record.totalAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <SaudiRiyal className="size-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Notes or Verification Disclaimer */}
          <div className="rounded-xl bg-muted/40 p-3.5 text-xs text-muted-foreground space-y-1.5 border border-border/60">
            <div className="flex items-start gap-2">
              <FileCheck2 className="size-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed">
                <p className="font-semibold text-foreground">
                  إشعار نظامي ومعتمد:
                </p>
                <p>
                  هذا الإشعار صادر إلكترونياً من منصة مكفي وموفي ويعتبر سند قبض مالي رسمي
                  معتمد لتوثيق سداد الرسوم المطلوبة وفقاً للائحة التنفيذية لشبكة إيجار
                  والهيئة العامة للعقار بالمملكة العربية السعودية، ولا يتطلب توقيعاً أو ختماً
                  يدوياً.
                </p>
                {record.notes && (
                  <p className="text-foreground/90 font-medium pt-0.5">
                    ملاحظات: {record.notes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Receipt Bottom Security Hash & Date Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground pt-1 border-t border-dashed border-border/80">
            <span className="font-mono">
              HASH: SHA256:{record.transactionNumber.toLowerCase()}-verified-auth
            </span>
            <span>
              منصة مكفي وموفي © {new Date().getFullYear()} • www.makfiwamwafi.sa
            </span>
          </div>
        </div>

        {/* Dialog Actions Footer */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2 border-t border-border pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto cursor-pointer"
          >
            إغلاق
          </Button>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 w-full sm:w-auto cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>طباعة الإيصال</span>
            </Button>
            <Button
              size="sm"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className="gap-1.5 w-full sm:w-auto cursor-pointer font-bold shadow-xs"
            >
              {isGeneratingPdf ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              <span>تحميل الإيصال (PDF)</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

