import {
  FileText,
  ShieldCheck,
  Building,
  Calendar,
  CheckCircle2,
  QrCode,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";
import type { PropertyDeed } from "../types";

interface PropertyDeedCardProps {
  deed: PropertyDeed;
  className?: string;
}

export default function PropertyDeedCard({
  deed,
  className,
}: PropertyDeedCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-3.5 sm:p-5 md:p-6 shadow-xs",
        className,
      )}
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3 sm:pb-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex size-9 sm:size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
            <FileText className="size-4.5 sm:size-5.5" />
          </div>

          <div className="space-y-0.5 text-start">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                صك الملكية العقارية
              </h3>
              <Badge
                variant="outline"
                className="border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] sm:text-xs font-semibold"
              >
                {deed.deedTypeLabel || "صك ملكية الكتروني"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              موثق ومعتمد رسمياً لدى وزارة العدل والهيئة العامة للعقار
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="size-3.5" />
            {deed.statusLabel}
          </span>
        </div>
      </div>

      {/* Grid of Deed Specifications */}
      <div className="mt-3.5 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 text-start">
        <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5 sm:p-3 space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] text-muted-foreground block">
            رقم صك الملكية
          </span>
          <div className="flex items-center justify-between">
            <strong className="font-mono text-xs sm:text-sm md:text-base font-bold text-foreground">
              {deed.deedNumber}
            </strong>
            <CopyButton
              value={deed.deedNumber}
              itemId={`deed-num-${deed.deedNumber}`}
              label="نسخ رقم الصك"
            />
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5 sm:p-3 space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] text-muted-foreground block">
            تاريخ إصدار الصك (هجري)
          </span>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-foreground">
            <Calendar className="size-3.5 text-muted-foreground" />
            <span>{deed.deedDate} هـ</span>
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5 sm:p-3 space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] text-muted-foreground block">
            الجهة المصدرة للصك
          </span>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-foreground">
            <Building className="size-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">{deed.issuerNotary}</span>
          </div>
        </div>

        {deed.electronicDeedId && (
          <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5 sm:p-3 space-y-0.5 sm:space-y-1 sm:col-span-2 lg:col-span-2">
            <span className="text-[10px] sm:text-[11px] text-muted-foreground block">
              الرقم المرجعي الإلكتروني (وزارة العدل)
            </span>
            <div className="flex items-center justify-between">
              <strong className="font-mono text-xs sm:text-sm font-bold text-primary">
                {deed.electronicDeedId}
              </strong>
              <CopyButton
                value={deed.electronicDeedId}
                itemId={`deed-moj-${deed.electronicDeedId}`}
                label="نسخ الرقم المرجعي"
              />
            </div>
          </div>
        )}

        <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5 sm:p-3 space-y-0.5 sm:space-y-1">
          <span className="text-[10px] sm:text-[11px] text-muted-foreground block">
            حالة المطابقة في إيجار
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5 shrink-0" />
            <span>مطابق وموثق في إيجار</span>
          </div>
        </div>
      </div>

      {/* Official MoJ Stamp Footer */}
      <div className="mt-3.5 sm:mt-4 rounded-xl border border-emerald-200/60 bg-emerald-50/30 dark:border-emerald-900/50 dark:bg-emerald-950/20 p-2.5 sm:p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-start">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Award className="size-4 sm:size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-foreground">
              صك الملكية محقق ومطابق إلكترونياً
            </p>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground">
              تمت المطابقة مع قواعد بيانات وزارة العدل والهيئة العامة للعقار (REGA).
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className="border-emerald-300 bg-background text-emerald-700 dark:text-emerald-300 text-[11px] sm:text-xs font-semibold gap-1 shrink-0"
        >
          <QrCode className="size-3" />
          رمز الاستجابة السريع مفعّل
        </Badge>
      </div>
    </div>
  );
}
