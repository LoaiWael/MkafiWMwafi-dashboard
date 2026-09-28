import {
  AlertCircle,
  Clock,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  FileX2,
  SaudiRiyal,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MOCK_CONTRACTS } from "@/features/contracts/constants";
import type { ContractStatus } from "@/features/contracts/types";
import type { Property } from "../types";

interface PropertyLinkedContractsProps {
  property: Property;
  className?: string;
}

function getStatusIcon(status: ContractStatus) {
  switch (status) {
    case "certified":
      return ShieldCheck;
    case "under_review":
      return Clock;
    case "pending_approval":
      return UserCheck;
    case "pending_payment":
      return AlertCircle;
    case "rejected":
      return ShieldAlert;
    case "expired":
      return FileCheck2;
    case "cancelled":
      return FileX2;
    default:
      return ShieldCheck;
  }
}

function getStatusBadgeClasses(status: ContractStatus) {
  switch (status) {
    case "certified":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
    case "under_review":
      return "border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300";
    case "pending_approval":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300";
    case "pending_payment":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300";
    case "rejected":
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300";
    case "expired":
      return "border-border bg-muted/70 text-muted-foreground dark:border-border/60 dark:bg-muted/40";
    case "cancelled":
      return "border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/40 dark:bg-destructive/20";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

export default function PropertyLinkedContracts({
  property,
  className,
}: PropertyLinkedContractsProps) {
  // Collect all unit contract IDs and matching contracts
  const unitContractIds = property.units
    .map((u) => u.currentContractId)
    .filter((id): id is string => Boolean(id));

  const linkedContracts = MOCK_CONTRACTS.filter(
    (c) =>
      unitContractIds.includes(c.id) ||
      c.property.deedNumber === property.deed.deedNumber ||
      c.property.name.includes(property.name) ||
      (property.id === "re-residential-narjis" &&
        (c.id === "cnt-001" || c.id === "cnt-003")),
  );

  return (
    <div
      className={cn(
        "rounded-2xl sm:rounded-3xl border border-border bg-card p-3.5 sm:p-5 md:p-6 shadow-xs space-y-3.5 sm:space-y-4",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3 sm:pb-4">
        <div className="space-y-0.5 text-start">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <FileText className="size-4 sm:size-5 text-primary" />
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              العقود الإيجارية المرتبطة بالعقار
            </h3>
            <Badge variant="secondary" className="text-[11px] sm:text-xs font-semibold px-2 py-0.5">
              {linkedContracts.length} عقود موثقة
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            سجل عقود إيجار الوحدات التابعة لهذا العقار المعتمدة في شبكة إيجار
          </p>
        </div>

        <Link
          to="/contracts"
          viewTransition
          className="inline-flex h-8 sm:h-8.5 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:scale-98 self-start sm:self-center cursor-pointer"
        >
          <span>كل العقود</span>
          <ExternalLink className="size-3.5" />
        </Link>
      </div>

      {linkedContracts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 sm:p-8 text-center space-y-2">
          <FileText className="size-8 text-muted-foreground mx-auto" />
          <p className="text-sm sm:text-base font-bold text-foreground">
            لا توجد عقود مسجلة لهذا العقار حالياً
          </p>
          <p className="text-xs text-muted-foreground">
            عند إنشاء وتوثيق عقود للوحدات ستظهر هنا تلقائياً.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto no-scrollbar rounded-xl border border-border/80">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-start text-xs font-bold whitespace-nowrap">رقم العقد</TableHead>
                <TableHead className="text-start text-xs font-bold whitespace-nowrap">المستأجر</TableHead>
                <TableHead className="text-start text-xs font-bold whitespace-nowrap">الوحدة</TableHead>
                <TableHead className="text-start text-xs font-bold whitespace-nowrap">مدة العقد</TableHead>
                <TableHead className="text-start text-xs font-bold whitespace-nowrap">القيمة السنوية</TableHead>
                <TableHead className="text-start text-xs font-bold whitespace-nowrap">حالة العقد</TableHead>
                <TableHead className="text-center text-xs font-bold whitespace-nowrap">معاينة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linkedContracts.map((contract) => {
                const StatusIcon = getStatusIcon(contract.status);
                const statusCustomBadgeClass = getStatusBadgeClasses(contract.status);

                return (
                  <TableRow key={contract.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/contracts/${contract.id}`}
                          viewTransition
                          className="font-bold text-primary hover:underline"
                        >
                          {contract.contractNumber}
                        </Link>
                        <CopyButton
                          value={contract.contractNumber}
                          itemId={`contract-num-${contract.id}`}
                          label="نسخ رقم العقد"
                          className="size-5.5"
                        />
                      </div>
                      {contract.ejar?.ejarContractNumber && (
                        <span className="text-[10px] text-muted-foreground block font-mono mt-0.5">
                          إيجار: {contract.ejar.ejarContractNumber}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-start whitespace-nowrap">
                      <div className="space-y-0.5">
                        <p className="font-bold text-xs text-foreground">
                          {contract.lessee.name}
                        </p>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          {contract.lessee.phone}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="text-start text-xs font-semibold whitespace-nowrap">
                      {contract.property.unitNumber
                        ? `وحدة رقم ${contract.property.unitNumber}`
                        : contract.property.name}
                    </TableCell>

                    <TableCell className="text-start text-xs whitespace-nowrap">
                      <div className="space-y-0.5">
                        <span className="text-foreground font-semibold">
                          {contract.durationMonths} شهر
                        </span>
                        <span className="text-[11px] text-muted-foreground block">
                          من {contract.startDate} إلى {contract.endDate}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-start whitespace-nowrap">
                      <span className="font-bold text-xs text-foreground inline-flex items-center gap-1">
                        <span>{contract.financials.rentalAmount.toLocaleString("en-US")}</span>
                        <SaudiRiyal className="size-3 shrink-0 text-muted-foreground" />
                      </span>
                    </TableCell>

                    <TableCell className="text-start whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs",
                          statusCustomBadgeClass,
                        )}
                      >
                        <StatusIcon className="size-3 shrink-0" />
                        <span>{contract.statusLabel}</span>
                      </span>
                    </TableCell>

                    <TableCell className="text-center whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <TooltipProvider delay={150}>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Link
                                  to={`/contracts/${contract.id}`}
                                  viewTransition
                                  aria-label="عرض تفاصيل العقد"
                                  className="inline-flex size-8 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all duration-150 hover:bg-primary/10 hover:text-primary hover:border-primary/30 active:scale-95 cursor-pointer shadow-2xs"
                                />
                              }
                            >
                              <Eye className="size-3.5" />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <span>عرض تفاصيل العقد</span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
