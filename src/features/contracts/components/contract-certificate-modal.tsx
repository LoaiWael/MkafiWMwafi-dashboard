import { useRef } from "react";
import { toast } from "sonner";
import {
  FileCheck2,
  Printer,
  QrCode,
  SaudiRiyal,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Contract } from "../types";

interface ContractCertificateModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContractCertificateModal({
  contract,
  isOpen,
  onClose,
}: ContractCertificateModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!contract) return null;

  function handlePrint() {
    toast.info("جاري إعداد وثيقة العقد للطباعة...");
    window.print();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-3 pe-12">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
              <FileCheck2 className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                وثيقة عقد الإيجار الإلكتروني الموحد
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                رقم العقد: {contract.contractNumber} | شبكة إيجار: {contract.ejar.ejarContractNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 print:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 cursor-pointer"
            >
              <Printer className="size-4" />
              <span>طباعة الوثيقة</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Printable Official Document Layout */}
        <div
          ref={printRef}
          className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xs text-xs sm:text-sm"
        >
          {/* Header Banner with REGA & Ejar Branding */}
          <div className="flex flex-col items-center justify-between gap-4 border-b border-border pb-5 sm:flex-row">
            <div className="space-y-1 text-center sm:text-start">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="rounded-md bg-primary-50 px-2 py-0.5 font-bold text-primary-700 text-xs dark:bg-primary-950 dark:text-primary-300">
                  منصة مكفي وموفي
                </span>
                <span className="text-xs text-muted-foreground">
                  بالتكامل مع شبكة إيجار
                </span>
              </div>
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                شهادة توثيق عقد إيجار {contract.typeLabel}
              </h2>
              <p className="text-xs text-muted-foreground">
                صادر وفق الأنظمة واللوائح المعتمدة لدى الهيئة العامة للعقار (REGA)
              </p>
            </div>

            {/* Official Stamps / Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="flex flex-col items-center justify-center rounded-xl border border-tertiary-200 bg-tertiary-50/70 p-2.5 text-center dark:border-tertiary-800 dark:bg-tertiary-950/50">
                <ShieldCheck className="size-5 text-tertiary-600 dark:text-tertiary-400" />
                <span className="text-[10px] font-bold text-tertiary-800 dark:text-tertiary-300">
                  موثق معتمد
                </span>
                <span className="text-[9px] font-mono text-tertiary-700 dark:text-tertiary-400">
                  {contract.ejar.ejarContractNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/60 p-3 sm:grid-cols-4">
            <div>
              <span className="text-[11px] text-muted-foreground block">رقم العقد:</span>
              <span className="font-mono font-bold text-foreground">{contract.contractNumber}</span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">تاريخ بداية العقد:</span>
              <span className="font-semibold text-foreground">{contract.startDate}</span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">تاريخ نهاية العقد:</span>
              <span className="font-semibold text-foreground">{contract.endDate}</span>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground block">مدة العقد:</span>
              <span className="font-semibold text-foreground">{contract.durationMonths} شهر</span>
            </div>
          </div>

          {/* Parties Section */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Lessor Card */}
            <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                <span className="font-bold text-foreground">الطرف الأول (المؤجر)</span>
                <Badge variant="outline" className="text-[10px]">
                  {contract.lessor.idTypeLabel}
                </Badge>
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-foreground">{contract.lessor.name}</p>
                <p className="text-muted-foreground">رقم الهوية / السجل: <span className="font-mono text-foreground">{contract.lessor.idNumber}</span></p>
                <p className="text-muted-foreground">رقم الجوال: <span className="font-mono text-foreground">{contract.lessor.phone}</span></p>
                {contract.lessor.iban && (
                  <p className="text-muted-foreground">الآيبان: <span className="font-mono text-[11px] text-foreground">{contract.lessor.iban}</span></p>
                )}
              </div>
            </div>

            {/* Lessee Card */}
            <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                <span className="font-bold text-foreground">الطرف الثاني (المستأجر)</span>
                <Badge variant="outline" className="text-[10px]">
                  {contract.lessee.idTypeLabel}
                </Badge>
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-semibold text-foreground">{contract.lessee.name}</p>
                <p className="text-muted-foreground">رقم الهوية / السجل: <span className="font-mono text-foreground">{contract.lessee.idNumber}</span></p>
                <p className="text-muted-foreground">رقم الجوال: <span className="font-mono text-foreground">{contract.lessee.phone}</span></p>
              </div>
            </div>
          </div>

          {/* Property Section */}
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-2.5">
            <span className="font-bold text-foreground block border-b border-border/60 pb-1.5">
              بيانات العقار والوحدة الإيجارية
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              <div>
                <span className="text-muted-foreground block text-[11px]">اسم العقار:</span>
                <span className="font-semibold text-foreground">{contract.property.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">رقم الصك الإلكتروني:</span>
                <span className="font-mono font-semibold text-foreground">{contract.property.deedNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">رقم الوحدة:</span>
                <span className="font-semibold text-foreground">{contract.property.unitNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">المساحة:</span>
                <span className="font-semibold text-foreground">{contract.property.areaSqm} م²</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">المدينة والحي:</span>
                <span className="font-semibold text-foreground">{contract.property.city} - {contract.property.district}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">الشارع:</span>
                <span className="font-semibold text-foreground">{contract.property.street}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">عداد الكهرباء:</span>
                <span className="font-mono font-semibold text-foreground">{contract.property.electricityMeterNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">عداد المياه:</span>
                <span className="font-mono font-semibold text-foreground">{contract.property.waterMeterNumber}</span>
              </div>
            </div>
          </div>

          {/* Financials & Installments */}
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-2.5">
            <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
              <span className="font-bold text-foreground">البيانات المالية والأجرة الإجمالية</span>
              <span className="flex items-center gap-1 font-bold text-primary-700 text-sm dark:text-primary-300">
                <span>{contract.financials.rentalAmount.toLocaleString("en-US")}</span>
                <SaudiRiyal className="size-4 shrink-0" />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
              <div>
                <span className="text-muted-foreground block text-[11px]">دورية سداد الأجرة:</span>
                <span className="font-semibold text-foreground">{contract.financials.paymentFrequencyLabel}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">مبلغ الضمان:</span>
                <span className="font-semibold text-foreground">{contract.financials.securityDepositFormatted}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">حالة السداد:</span>
                <span className="font-semibold text-emerald-600">{contract.financials.paymentStatusLabel}</span>
              </div>
            </div>
          </div>

          {/* Footer Validation & QR */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row text-[11px] text-muted-foreground">
            <div className="space-y-0.5 text-center sm:text-start">
              <p>هذه الوثيقة صادرة إلكترونياً وتعتبر سنداً تنفيذياً ملزماً بعد اكتمال التوثيق.</p>
              <p>للتحقق من صحة الوثيقة يمكن مسح رمز الاستجابة السريع أو زيارة شبكة إيجار.</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2">
              <QrCode className="size-8 text-foreground" />
              <div className="text-[10px] space-y-0.5">
                <span className="block font-bold text-foreground">رمز التحقق الإلكتروني</span>
                <span className="font-mono text-muted-foreground">{contract.ejar.ejarContractNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
