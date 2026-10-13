import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileCheck2,
  FilePlus2,
  FileText,
  Home,
  Info,
  Layers,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Receipt,
  RefreshCw,
  SaudiRiyal,
  Shield,
  ShieldAlert,
  Store,
  User,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  CONTRACT_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from "../constants";
import { useContractDetails } from "../hooks";
import type {
  Contract,
  ContractHistoryLog,
  ContractStatus,
  PaymentMethod,
  PaymentStatus,
} from "../types";
import {
  MediaPreviewDialog,
  type MediaPreviewItem,
} from "@/components/ui/media-preview-dialog";
import UpdateContractStatusDialog from "./update-contract-status-dialog";
import UpdatePaymentStatusDialog from "./update-payment-status-dialog";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import { useUrlTab } from "@/hooks/use-url-tab";
import ContractDetailsPageSkeleton from "@/routes/dashboard/contract-details-page-skeleton";

const CONTRACT_DETAILS_TABS = [
  "overview",
  "parties",
  "property",
  "financials",
  "terms",
  "documents",
  "history",
] as const;

type ContractDetailsTab = (typeof CONTRACT_DETAILS_TABS)[number];

interface ContractDetailsViewProps {
  contractId: string;
}

export default function ContractDetailsView({
  contractId,
}: ContractDetailsViewProps) {
  // Fetch contract from API
  const {
    contract: fetchedContract,
    isLoading,
    refetch,
  } = useContractDetails(contractId);

  // Local optimistic overrides
  const [localOverrides, setLocalOverrides] = useState<Partial<Contract> | null>(null);

  const [activeTab, setActiveTab] = useUrlTab<ContractDetailsTab>({
    paramKey: "tab",
    defaultValue: "overview",
    validValues: CONTRACT_DETAILS_TABS,
  });

  // Dialog states
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<MediaPreviewItem | null>(null);

  if (isLoading) {
    return <ContractDetailsPageSkeleton />;
  }

  if (!fetchedContract) {
    return (
      <div className="page-shell space-y-6 py-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/contracts" viewTransition className="hover:text-foreground">
            العقود
          </Link>
          <span>/</span>
          <span>تفاصيل العقد</span>
        </div>

        <Empty className="border border-border bg-card py-16">
          <EmptyMedia variant="icon" className="size-14 bg-muted text-muted-foreground">
            <FileText className="size-7" />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle className="text-lg font-bold">لم يتم العثور على بيانات العقد</EmptyTitle>
            <EmptyDescription className="max-w-md">
              العقد المطلوب برقم المعرّف ({contractId}) غير متوفر في النظام أو قد يكون تم حذفه.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              className="gap-2 cursor-pointer rounded-xl font-semibold"
            >
              <RefreshCw className="size-4" />
              <span>إعادة المحاولة</span>
            </Button>
            <Link to="/contracts" viewTransition>
              <Button type="button" className="gap-2 cursor-pointer rounded-xl font-semibold">
                <ArrowRight className="size-4" />
                <span>العودة إلى قائمة العقود</span>
              </Button>
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  const contract: Contract = {
    ...fetchedContract,
    ...(localOverrides || {}),
    financials: {
      ...fetchedContract.financials,
      ...(localOverrides?.financials || {}),
    },
    ejar: {
      ...fetchedContract.ejar,
      ...(localOverrides?.ejar || {}),
    },
    historyLogs: localOverrides?.historyLogs || fetchedContract.historyLogs,
  };

  const isResidential = contract.type === "residential";

  // Handle status update
  function handleUpdateStatus(
    _targetId: string,
    newStatus: ContractStatus,
    note?: string,
    ejarNumber?: string,
  ) {
    const statusOption = CONTRACT_STATUS_OPTIONS.find(
      (s) => s.value === newStatus,
    );

    const updatedHistory: ContractHistoryLog[] = [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
        action: `تحديث الحالة إلى ${statusOption?.label || newStatus}`,
        performedBy: "مدير العمليات",
        note: note || undefined,
        previousStatus: contract.statusLabel,
        newStatus: statusOption?.label || newStatus,
      },
      ...contract.historyLogs,
    ];

    setLocalOverrides((prev) => ({
      ...(prev || {}),
      status: newStatus,
      statusLabel: statusOption?.label || newStatus,
      statusColorClass: statusOption?.badgeClass || contract.statusColorClass,
      updatedAt: new Date().toISOString(),
      notes: note || contract.notes,
      historyLogs: updatedHistory,
      ejar: {
        ...contract.ejar,
        ejarContractNumber: ejarNumber || contract.ejar.ejarContractNumber,
      },
    }));

    toast.success(`تم تحديث حالة العقد إلى "${statusOption?.label}" بنجاح`);
  }

  // Handle payment update
  function handleUpdatePayment(
    _targetId: string,
    newPaymentStatus: PaymentStatus,
    paymentMethod?: PaymentMethod,
    transactionId?: string,
  ) {
    const paymentOption = PAYMENT_STATUS_OPTIONS.find(
      (p) => p.value === newPaymentStatus,
    );

    const isPaid = newPaymentStatus === "paid";
    const updatedInstallments = contract.financials.installments.map((inst) =>
      isPaid
        ? {
          ...inst,
          status: "paid" as const,
          statusLabel: "تم السداد",
          paidDate: new Date().toISOString().slice(0, 10),
        }
        : inst,
    );

    setLocalOverrides((prev) => ({
      ...(prev || {}),
      updatedAt: new Date().toISOString(),
      financials: {
        ...contract.financials,
        paymentStatus: newPaymentStatus,
        paymentStatusLabel: paymentOption?.label || newPaymentStatus,
        paymentMethod: paymentMethod || contract.financials.paymentMethod,
        paymentMethodLabel: paymentMethod
          ? paymentMethod === "mada"
            ? "مدى (Mada)"
            : paymentMethod === "visa"
              ? "فيزا (Visa)"
              : paymentMethod === "apple_pay"
                ? "أبل باي (Apple Pay)"
                : paymentMethod === "bank_transfer"
                  ? "تحويل بنكي مباشر"
                  : "نظام سداد"
          : contract.financials.paymentMethodLabel,
        transactionId: transactionId || contract.financials.transactionId,
        paidAt: isPaid
          ? new Date().toISOString().replace("T", " ").slice(0, 16)
          : undefined,
        totalPaid: isPaid
          ? contract.financials.platformFee + contract.financials.taxAmount
          : 0,
        installments: updatedInstallments,
      },
    }));

    toast.success(`تم تحديث حالة السداد إلى "${paymentOption?.label}" بنجاح`);
  }

  // Tab definitions
  const tabsList: FilterTabItem<ContractDetailsTab>[] = [
    { id: "overview", label: "نظرة عامة", icon: Layers },
    { id: "parties", label: "أطراف العقد", icon: Users },
    { id: "property", label: "العقار والوحدة", icon: Building2 },
    { id: "financials", label: "المالية والدفعات", icon: CreditCard },
    { id: "terms", label: "البنود والشروط", icon: FileCheck2 },
    {
      id: "documents",
      label: "الصك والوثائق",
      icon: Paperclip,
      count: contract.documents?.length || 0,
    },
    {
      id: "history",
      label: "سجل العمليات",
      icon: Clock,
      count: contract.historyLogs.length,
    },
  ];

  return (
    <div className="page-shell space-y-4 sm:space-y-6 py-4 sm:py-8">
      {/* 1. Top Breadcrumb & Quick Actions Bar */}
      <FadeIn duration={0.3}>
        <div className="flex flex-col gap-3.5 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2 min-w-0">
            {/* Responsive Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-muted-foreground overflow-x-auto no-scrollbar py-0.5 whitespace-nowrap">
              <Link
                to="/"
                viewTransition
                className="transition-colors hover:text-foreground shrink-0"
              >
                الرئيسية
              </Link>
              <span className="text-muted-foreground/60">/</span>
              <Link
                to="/contracts"
                viewTransition
                className="transition-colors hover:text-foreground shrink-0"
              >
                سجل العقود
              </Link>
              <span className="text-muted-foreground/60">/</span>
              <span className="font-semibold text-foreground shrink-0 truncate max-w-[140px] sm:max-w-none">
                {contract.contractNumber}
              </span>
            </div>

            {/* Main Header Title & Badge */}
            <div className="flex items-start gap-2 sm:gap-2.5">
              <Link
                to="/contracts"
                viewTransition
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted active:scale-95 mt-0.5"
                aria-label="العودة إلى سجل العقود"
              >
                <ArrowRight className="size-4" />
              </Link>

              <div
                className={cn(
                  "flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl mt-0.5",
                  isResidential
                    ? "bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400"
                    : "bg-secondary-50 text-secondary-600 dark:bg-secondary-950 dark:text-secondary-400",
                )}
              >
                {isResidential ? (
                  <FileText className="size-4 sm:size-5" />
                ) : (
                  <Store className="size-4 sm:size-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h1 className="text-sm font-bold tracking-tight text-foreground sm:text-lg md:text-2xl break-words">
                    عقد إيجار {contract.typeLabel} — {contract.contractNumber}
                  </h1>
                  <CopyButton
                    value={contract.contractNumber}
                    itemId={`hero-${contract.id}`}
                    label="نسخ رقم العقد"
                  />
                </div>
                <p className="text-[11px] sm:text-xs text-muted-foreground truncate mt-0.5">
                  {contract.property.name} ({contract.property.unitNumber}) —{" "}
                  {contract.property.city}، {contract.property.district}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsStatusDialogOpen(true)}
              className="gap-1.5 rounded-xl text-[11px] sm:text-xs font-semibold cursor-pointer h-8.5 sm:h-9 px-2.5 sm:px-3 active:scale-98"
            >
              <RefreshCw className="size-3.5 text-secondary shrink-0" />
              <span className="truncate">تحديث الحالة</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPaymentDialogOpen(true)}
              className="gap-1.5 rounded-xl text-[11px] sm:text-xs font-semibold cursor-pointer h-8.5 sm:h-9 px-2.5 sm:px-3 active:scale-98"
            >
              <CreditCard className="size-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">تحديث السداد</span>
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* 2. Contract Status & High-Visibility Badges Strip */}
      <FadeIn duration={0.3} delay={0.05}>
        <div className="flex flex-col gap-2.5 sm:gap-3 rounded-2xl border border-border bg-card p-3 sm:p-3.5 shadow-xs md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 border px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold shadow-2xs",
                contract.statusColorClass,
              )}
            >
              <span className="size-1.5 sm:size-2 rounded-full bg-current" />
              <span>حالة العقد: {contract.statusLabel}</span>
            </Badge>

            {contract.stageLabel && (
              <Badge
                variant="outline"
                className="border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold shadow-2xs"
              >
                <span>المرحلة: {contract.stageLabel}</span>
              </Badge>
            )}

            <Badge
              variant="outline"
              className={cn(
                "px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold shadow-2xs",
                contract.financials.paymentStatus === "paid"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
              )}
            >
              حالة السداد: {contract.financials.paymentStatusLabel}
            </Badge>

            {contract.purposeLabel && (
              <Badge
                variant="outline"
                className="border-border bg-muted/60 px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-foreground shadow-2xs"
              >
                الغرض: {contract.purposeLabel}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-muted-foreground border-t border-border/40 pt-2 md:border-t-0 md:pt-0">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5 text-muted-foreground shrink-0" />
              تاريخ الإنشاء: {contract.createdAt.slice(0, 10)}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5 text-muted-foreground shrink-0" />
              آخر تحديث: {contract.updatedAt.slice(0, 10)}
            </span>
          </div>
        </div>
      </FadeIn>

      {/* 3. CONTRACT OWNER & REQUEST CREATOR HERO CARD */}
      <FadeIn duration={0.3} delay={0.1}>
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-linear-to-br from-card via-card to-primary-50/30 p-3.5 sm:p-6 shadow-xs dark:to-primary-950/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Owner Details Left/Main */}
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4 min-w-0">
              <div className="relative shrink-0">
                <Avatar className="size-13 sm:size-16 md:size-20 border-2 border-primary-200 bg-muted shadow-sm dark:border-primary-800">
                  <AvatarImage
                    src={contract.owner.avatar}
                    alt={contract.owner.name}
                  />
                  <AvatarFallback className="text-sm sm:text-base md:text-lg font-bold bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300">
                    {contract.owner.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {contract.owner.verifiedViaNafath && (
                  <div
                    className="absolute -bottom-1 -end-1 flex size-5 sm:size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs"
                    title="موثق عبر نفاذ الوطني"
                  >
                    <CheckCircle2 className="size-3.5 sm:size-4" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5 min-w-0 w-full sm:w-auto">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-[11px] sm:text-xs font-semibold text-primary-700 dark:text-primary-300">
                    منشئ ومقدّم طلب العقد:
                  </span>
                  {contract.owner.roleLabel && (
                    <Badge
                      variant="outline"
                      className="border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 text-[10px] sm:text-xs font-bold px-2 py-0.5"
                    >
                      {contract.owner.roleLabel}
                    </Badge>
                  )}
                  {contract.owner.verifiedViaNafath && (
                    <Badge
                      variant="outline"
                      className="gap-1 border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] sm:text-xs font-medium px-2 py-0.5"
                    >
                      <BadgeCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>موثق</span>
                    </Badge>
                  )}
                </div>

                <h2 className="text-sm font-bold text-foreground sm:text-lg md:text-xl break-words">
                  {contract.owner.name}
                </h2>

                <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-muted-foreground shrink-0" />
                    <a
                      href={`tel:${contract.owner.phone}`}
                      className="font-mono font-medium text-foreground hover:underline"
                      dir="ltr"
                    >
                      {contract.owner.phone}
                    </a>
                    <CopyButton
                      value={contract.owner.phone}
                      itemId={`owner-phone-${contract.owner.id}`}
                      label="نسخ رقم الجوال"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 min-w-0">
                    <Mail className="size-3.5 text-muted-foreground shrink-0" />
                    <a
                      href={`mailto:${contract.owner.email}`}
                      className="font-medium text-foreground hover:underline truncate max-w-[180px] sm:max-w-none"
                    >
                      {contract.owner.email}
                    </a>
                    <CopyButton
                      value={contract.owner.email}
                      itemId={`owner-email-${contract.owner.id}`}
                      label="نسخ البريد"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <User className="size-3.5 text-muted-foreground shrink-0" />
                    <span>{contract.owner.idTypeLabel}:</span>
                    <span className="font-mono font-medium text-foreground">
                      {contract.owner.idNumber}
                    </span>
                    <CopyButton
                      value={contract.owner.idNumber}
                      itemId={`owner-id-${contract.owner.id}`}
                      label="نسخ رقم الهوية"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Quick Meta Cards */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:items-center">
              {Boolean(contract.owner.role || contract.owner.roleLabel) && (
                <div className="rounded-xl sm:rounded-2xl border border-border bg-card/80 p-2 sm:p-3 text-center backdrop-blur-xs">
                  <span className="block text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                    صفة مقدم الطلب
                  </span>
                  <span className="block mt-0.5 text-xs font-bold text-foreground truncate">
                    {contract.owner.roleLabel ||
                      (contract.owner.role === "lessee"
                        ? "المستأجر"
                        : contract.owner.role === "lessor"
                          ? "المؤجر"
                          : "وسيط عقاري")}
                  </span>
                </div>
              )}

              <div className="rounded-xl sm:rounded-2xl border border-border bg-card/80 p-2 sm:p-3 text-center backdrop-blur-xs">
                <span className="block text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                  نوع العقد المطلوب
                </span>
                <span className="block mt-0.5 text-xs font-bold text-foreground truncate">
                  {contract.typeLabel}
                </span>
              </div>

              <div className="col-span-2 rounded-xl sm:rounded-2xl border border-border bg-card/80 p-2 sm:p-3 text-center backdrop-blur-xs sm:col-span-1">
                <span className="block text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                  التجديد التلقائي
                </span>
                <span
                  className={cn(
                    "block mt-0.5 text-xs font-bold truncate",
                    contract.autoRenewal
                      ? "text-emerald-600"
                      : "text-muted-foreground",
                  )}
                >
                  {contract.autoRenewal ? "مفعل تلقائياً" : "غير مفعل"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* 4. KEY METRICS HIGHLIGHTS CARDS */}
      <StaggerContainer className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {/* Metric 1: Rental Amount */}
        <StaggerItem>
          <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-2.5 sm:p-4 shadow-2xs space-y-1">
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground line-clamp-1">
              القيمة الإيجارية السنوية
            </span>
            <div className="flex items-center gap-1 text-sm sm:text-lg md:text-xl font-bold text-foreground">
              <span className="truncate">
                {contract.financials.rentalAmount.toLocaleString("en-US")}
              </span>
              <SaudiRiyal className="size-3 sm:size-4 text-muted-foreground shrink-0" />
            </div>
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground pt-0.5">
              <span className="truncate">
                {contract.financials.paymentFrequencyLabel}
              </span>
              <span className="font-semibold text-foreground shrink-0 ms-1">
                {contract.financials.installments.length} دفعات
              </span>
            </div>
          </div>
        </StaggerItem>

        {/* Metric 2: Duration */}
        <StaggerItem>
          <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-2.5 sm:p-4 shadow-2xs space-y-1">
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground line-clamp-1">
              مدة وسريان العقد
            </span>
            <div className="text-sm sm:text-lg md:text-xl font-bold text-foreground truncate">
              {contract.durationMonths} شهر
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground pt-0.5 truncate">
              من {contract.startDate} إلى {contract.endDate}
            </div>
          </div>
        </StaggerItem>

        {/* Metric 3: Security Deposit */}
        <StaggerItem>
          <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-2.5 sm:p-4 shadow-2xs space-y-1">
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground line-clamp-1">
              مبلغ الضمان المسترد
            </span>
            <div className="flex items-center gap-1 text-sm sm:text-lg md:text-xl font-bold text-foreground">
              <span className="truncate">
                {contract.financials.securityDeposit.toLocaleString("en-US")}
              </span>
              <SaudiRiyal className="size-3 sm:size-4 text-muted-foreground shrink-0" />
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground pt-0.5 truncate">
              يُسترد بنهاية مدة العقد
            </div>
          </div>
        </StaggerItem>

        {/* Metric 4: Platform Fee & VAT */}
        <StaggerItem>
          <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-2.5 sm:p-4 shadow-2xs space-y-1">
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground line-clamp-1">
              رسوم المنصة والضريبة
            </span>
            <div className="flex items-center gap-1 text-sm sm:text-lg md:text-xl font-bold text-foreground">
              <span className="truncate">
                {(
                  contract.financials.platformFee +
                  contract.financials.taxAmount
                ).toLocaleString("en-US")}
              </span>
              <SaudiRiyal className="size-3 sm:size-4 text-muted-foreground shrink-0" />
            </div>
            <div className="text-[10px] sm:text-xs font-semibold text-emerald-600 pt-0.5 truncate">
              {contract.financials.paymentStatusLabel}
            </div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      {/* 5. TAB BAR AND CONTENT */}
      <FadeIn duration={0.3} delay={0.15}>
        <div className="space-y-4 sm:space-y-6">
          <FilterTabs
            items={tabsList}
            value={activeTab}
            onValueChange={setActiveTab}
            layout="scroll"
            className="w-full"
            navClassName="w-full"
            ariaLabel="تبويبات تفاصيل العقد"
            idPrefix="contract-details-tab"
          />

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <FadeIn duration={0.2} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Card 1: Contract Details Summary */}
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <FileText className="size-4 text-primary shrink-0" />
                    <h3 className="font-bold text-foreground text-sm sm:text-base">
                      بيانات العقد والتوثيق الأساسية
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 text-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        رقم العقد:
                      </span>
                      <div className="flex items-center gap-1 font-mono font-semibold text-foreground text-[11px] sm:text-xs">
                        <span>{contract.contractNumber}</span>
                        <CopyButton
                          value={contract.contractNumber}
                          label="نسخ"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        نوع العقد:
                      </span>
                      <span className="font-semibold text-foreground text-end text-[11px] sm:text-xs truncate">
                        {contract.typeLabel} ({contract.property.typeLabel})
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        الغرض من التأجير:
                      </span>
                      <span className="font-semibold text-foreground text-end text-[11px] sm:text-xs truncate">
                        {contract.purposeLabel || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        {contract.property.deedType ? `رقم الصك (${contract.property.deedType}):` : "رقم الصك الإلكتروني:"}
                      </span>
                      <div className="flex items-center gap-1 font-mono font-semibold text-foreground text-[11px] sm:text-xs">
                        <span>{contract.property.deedNumber}</span>
                        <CopyButton
                          value={contract.property.deedNumber}
                          label="نسخ"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        تاريخ الصك:
                      </span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs text-end">
                        {contract.property.hijriDate ? `${contract.property.hijriDate} هـ` : ""}
                        {contract.property.gregorianDate ? ` (${contract.property.gregorianDate} م)` : ""}
                        {!contract.property.hijriDate && !contract.property.gregorianDate && (contract.property.deedDate || "—")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        تاريخ بداية العقد:
                      </span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs">
                        {contract.startDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        تاريخ نهاية العقد:
                      </span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs">
                        {contract.endDate !== "—" ? contract.endDate : "يحسب بنهاية المدة"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        المدة المعتمدة:
                      </span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs">
                        {contract.durationValue || 1} {contract.durationUnit || "سنوات"} ({contract.durationMonths} شهر)
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        التجديد التلقائي:
                      </span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs">
                        {contract.autoRenewal ? "مفعل" : "غير مفعل"}
                      </span>
                    </div>

                    {Boolean(contract.documents && contract.documents.length > 0) && (
                      <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                        <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                          وثائق الملكية المرفقة:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          <span className="font-semibold text-primary text-[11px] sm:text-xs">
                            {contract.documents?.length} مستندات ({contract.documents?.[0]?.documentType || "صك"})
                          </span>
                          {contract.documents?.[0]?.url && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setPreviewDoc(contract.documents![0])}
                              className="h-6 px-2 text-[10px] font-bold text-primary hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg cursor-pointer inline-flex items-center gap-1"
                            >
                              <Eye className="size-3" />
                              <span>معاينة الصك</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card 2: Property & Financial Overview */}
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <Building2 className="size-4 text-secondary shrink-0" />
                    <h3 className="font-bold text-foreground text-sm sm:text-base">
                      ملخص العقار والمالية
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 text-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        اسم العقار:
                      </span>
                      <span className="font-semibold text-foreground text-end text-[11px] sm:text-xs truncate">
                        {contract.property.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        رقم الوحدة:
                      </span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs">
                        {contract.property.unitNumber}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        الدور / الطابق:
                      </span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs">
                        {contract.property.floor || contract.property.floorNumber || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        الموقع:
                      </span>
                      <span className="font-semibold text-foreground text-end text-[11px] sm:text-xs truncate">
                        {contract.property.region ? `${contract.property.region} — ` : ""}{contract.property.city} — {contract.property.district}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        المساحة:
                      </span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs">
                        {contract.property.areaSqm} م²
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        الإيجار السنوي:
                      </span>
                      <div className="flex items-center gap-1 font-semibold text-foreground text-[11px] sm:text-xs">
                        <span>
                          {contract.financials.rentalAmount.toLocaleString(
                            "en-US",
                          )}
                        </span>
                        <SaudiRiyal className="size-3 text-muted-foreground shrink-0" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        دورية الدفع:
                      </span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs">
                        {contract.financials.paymentFrequencyLabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        مبلغ الضمان:
                      </span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs">
                        {contract.financials.securityDepositFormatted}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        حالة السداد:
                      </span>
                      <span className="font-semibold text-emerald-600 text-[11px] sm:text-xs">
                        {contract.financials.paymentStatusLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {/* TAB 2: PARTIES */}
          {activeTab === "parties" && (
            <FadeIn duration={0.2} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Lessor (الطرف الأول - المؤجر) */}
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950 shrink-0">
                        <Users className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground text-sm sm:text-base truncate">
                          الطرف الأول (المؤجر)
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                          {contract.lessor.representationTypeLabel ||
                            "المؤجر"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {contract.lessor.entityTypeLabel && (
                        <Badge
                          variant="outline"
                          className="border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 text-[10px] sm:text-xs font-semibold px-2 py-0.5"
                        >
                          {contract.lessor.entityTypeLabel}
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="border-border bg-muted/60 text-foreground text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5"
                      >
                        {contract.lessor.idTypeLabel}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="block text-[11px] text-muted-foreground">
                        الاسم الكامل / المنشأة:
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-foreground break-words">
                        {contract.lessor.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                      <div>
                        <span className="block text-[11px] text-muted-foreground">
                          رقم الهوية / السجل التجاري:
                        </span>
                        <div className="flex items-center gap-1 font-mono font-medium text-foreground text-xs">
                          <span>{contract.lessor.idNumber}</span>
                          <CopyButton
                            value={contract.lessor.idNumber}
                            label="نسخ"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="block text-[11px] text-muted-foreground">
                          رقم الجوال:
                        </span>
                        <div className="flex items-center gap-1 font-mono font-medium text-foreground text-xs">
                          <span dir="ltr">{contract.lessor.phone}</span>
                          <CopyButton
                            value={contract.lessor.phone}
                            label="نسخ"
                          />
                        </div>
                      </div>

                      {contract.lessor.birthDate && (
                        <div>
                          <span className="block text-[11px] text-muted-foreground">
                            تاريخ الميلاد:
                          </span>
                          <span className="font-mono font-medium text-foreground text-xs" dir="ltr">
                            {contract.lessor.birthDate}
                          </span>
                        </div>
                      )}

                      <div>
                        <span className="block text-[11px] text-muted-foreground">
                          البريد الإلكتروني:
                        </span>
                        <div className="flex items-center gap-1 font-medium text-foreground text-xs min-w-0">
                          <span className="truncate">
                            {contract.lessor.email}
                          </span>
                          <CopyButton
                            value={contract.lessor.email}
                            label="نسخ البريد"
                          />
                        </div>
                      </div>
                    </div>

                    {contract.lessor.iban && (
                      <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-muted/30 p-2.5 sm:p-3 space-y-1">
                        <span className="block text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                          الحساب البنكي لتحصيل الإيجار (IBAN):
                        </span>
                        <div className="flex items-center gap-1 font-mono text-xs font-semibold text-foreground break-all">
                          <span>{contract.lessor.iban}</span>
                          <CopyButton
                            value={contract.lessor.iban}
                            label="نسخ الآيبان"
                          />
                        </div>
                        {contract.lessor.bankName && (
                          <span className="block text-[10px] sm:text-[11px] text-muted-foreground">
                            البنك: {contract.lessor.bankName}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Lessee (الطرف الثاني - المستأجر) */}
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600 dark:bg-secondary-950 shrink-0">
                        <UserCheck className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground text-sm sm:text-base truncate">
                          الطرف الثاني (المستأجر)
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                          {contract.lessee.representationTypeLabel ||
                            "المستأجر المستفيد"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {contract.lessee.entityTypeLabel && (
                        <Badge
                          variant="outline"
                          className="border-secondary-200 bg-secondary-50 text-secondary-800 dark:border-secondary-800 dark:bg-secondary-950 dark:text-secondary-300 text-[10px] sm:text-xs font-semibold px-2 py-0.5"
                        >
                          {contract.lessee.entityTypeLabel}
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="border-border bg-muted/60 text-foreground text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5"
                      >
                        {contract.lessee.idTypeLabel}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="block text-[11px] text-muted-foreground">
                        الاسم الكامل / المستفيد:
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-foreground break-words">
                        {contract.lessee.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                      <div>
                        <span className="block text-[11px] text-muted-foreground">
                          رقم الهوية / الإقامة:
                        </span>
                        <div className="flex items-center gap-1 font-mono font-medium text-foreground text-xs">
                          <span>{contract.lessee.idNumber}</span>
                          <CopyButton
                            value={contract.lessee.idNumber}
                            label="نسخ"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="block text-[11px] text-muted-foreground">
                          رقم الجوال:
                        </span>
                        <div className="flex items-center gap-1 font-mono font-medium text-foreground text-xs">
                          <span dir="ltr">{contract.lessee.phone}</span>
                          <CopyButton
                            value={contract.lessee.phone}
                            label="نسخ"
                          />
                        </div>
                      </div>

                      {contract.lessee.birthDate && (
                        <div>
                          <span className="block text-[11px] text-muted-foreground">
                            تاريخ الميلاد:
                          </span>
                          <span className="font-mono font-medium text-foreground text-xs" dir="ltr">
                            {contract.lessee.birthDate}
                          </span>
                        </div>
                      )}

                      <div>
                        <span className="block text-[11px] text-muted-foreground">
                          البريد الإلكتروني:
                        </span>
                        <div className="flex items-center gap-1 font-medium text-foreground text-xs min-w-0">
                          <span className="truncate">
                            {contract.lessee.email}
                          </span>
                          <CopyButton
                            value={contract.lessee.email}
                            label="نسخ البريد"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] text-muted-foreground">
                        البريد الإلكتروني:
                      </span>
                      <div className="flex items-center gap-1 font-medium text-foreground text-xs min-w-0">
                        <span className="truncate">
                          {contract.lessee.email}
                        </span>
                        <CopyButton
                          value={contract.lessee.email}
                          label="نسخ البريد"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Broker details if present */}
              {contract.broker && (
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 items-center justify-center rounded-xl bg-tertiary-50 text-tertiary-600 dark:bg-tertiary-950 shrink-0">
                        <Shield className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground text-sm sm:text-base truncate">
                          الوسيط العقاري
                        </h3>
                      </div>
                    </div>
                    {contract.broker.valLicenseNumber && (
                      <Badge
                        variant="outline"
                        className="border-border bg-muted/60 text-foreground text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 shrink-0"
                      >
                        رخصة فال: {contract.broker.valLicenseNumber}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
                    <div>
                      <span className="block text-[11px] text-muted-foreground">
                        اسم المنشأة / المكتب:
                      </span>
                      <span className="font-bold text-foreground text-xs sm:text-sm">
                        {contract.broker.name}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[11px] text-muted-foreground">
                        رقم السجل التجاري:
                      </span>
                      <div className="flex items-center gap-1 font-mono font-medium text-foreground text-xs">
                        <span>{contract.broker.crNumber || "—"}</span>
                        {contract.broker.crNumber && (
                          <CopyButton
                            value={contract.broker.crNumber}
                            label="نسخ"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] text-muted-foreground">
                        رقم الجوال:
                      </span>
                      <span
                        className="font-mono font-medium text-foreground text-xs block"
                        dir="ltr"
                      >
                        {contract.broker.phone || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </FadeIn>
          )}

          {/* TAB 3: PROPERTY & UNITS */}
          {activeTab === "property" && (
            <FadeIn duration={0.2} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Unit Specifications Card */}
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <Home className="size-4 text-primary shrink-0" />
                    <h3 className="font-bold text-foreground text-sm sm:text-base">
                      مواصفات وتفاصيل الوحدة الإيجارية
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-4 text-xs">
                    <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-muted/20 p-2.5 sm:p-3 space-y-1">
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                        نوع الوحدة:
                      </span>
                      <div className="font-bold text-foreground text-xs sm:text-sm truncate">
                        {contract.property.typeLabel}
                      </div>
                    </div>

                    <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-muted/20 p-2.5 sm:p-3 space-y-1">
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                        رقم الوحدة:
                      </span>
                      <div className="font-bold text-foreground text-xs sm:text-sm truncate">
                        {contract.property.unitNumber}
                      </div>
                    </div>

                    <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-muted/20 p-2.5 sm:p-3 space-y-1">
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                        الدور / الطابق:
                      </span>
                      <div className="font-bold text-foreground text-xs sm:text-sm truncate">
                        {contract.property.floor || contract.property.floorNumber || "الأرضي"}
                      </div>
                    </div>

                    <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-muted/20 p-2.5 sm:p-3 space-y-1">
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                        المساحة الإجمالية:
                      </span>
                      <div className="font-bold text-foreground text-xs sm:text-sm">
                        {contract.property.areaSqm} م²
                      </div>
                    </div>

                    <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-muted/20 p-2.5 sm:p-3 space-y-1">
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                        حالة التأثيث:
                      </span>
                      <div className="font-bold text-foreground text-xs sm:text-sm truncate">
                        {contract.property.furnishingStatusLabel || "غير مؤثث"}
                      </div>
                    </div>

                    {contract.property.roomsCount && (
                      <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-muted/20 p-2.5 sm:p-3 space-y-1">
                        <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                          عدد الغرف:
                        </span>
                        <div className="font-bold text-foreground text-xs sm:text-sm">
                          {contract.property.roomsCount} غرف
                        </div>
                      </div>
                    )}

                    {contract.property.bathroomsCount && (
                      <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-muted/20 p-2.5 sm:p-3 space-y-1">
                        <span className="text-[10px] sm:text-[11px] text-muted-foreground">
                          دورات المياه:
                        </span>
                        <div className="font-bold text-foreground text-xs sm:text-sm">
                          {contract.property.bathroomsCount} دورات مياه
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Facilities & Amenities */}
                  {(contract.property.hasElevator ||
                    contract.property.hasParking ||
                    contract.property.hasCentralAC) && (
                      <div className="space-y-2 pt-1 sm:pt-2">
                        <span className="block text-[11px] sm:text-xs font-semibold text-foreground">
                          المرافق والتجهيزات المشمولة:
                        </span>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {contract.property.hasElevator && (
                            <Badge
                              variant="outline"
                              className="gap-1 border-border bg-muted/60 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1"
                            >
                              <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                              <span>مصعد كهربائي</span>
                            </Badge>
                          )}
                          {contract.property.hasParking && (
                            <Badge
                              variant="outline"
                              className="gap-1 border-border bg-muted/60 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1"
                            >
                              <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                              <span>موقف سيارة مخصص</span>
                            </Badge>
                          )}
                          {contract.property.hasCentralAC && (
                            <Badge
                              variant="outline"
                              className="gap-1 border-border bg-muted/60 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1"
                            >
                              <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                              <span>تكييف مركزي</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* National Address & Meters Card */}
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <MapPin className="size-4 text-secondary shrink-0" />
                    <h3 className="font-bold text-foreground text-sm sm:text-base">
                      العنوان الوطني والبيانات العقارية
                    </h3>
                  </div>

                  {/* National address grid */}
                  <div className="space-y-2 text-xs">
                    {contract.property.region && (
                      <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5">
                        <span className="text-[11px] sm:text-xs text-muted-foreground shrink-0">
                          المنطقة الإدارية:
                        </span>
                        <span className="font-semibold text-foreground text-end text-[11px] sm:text-xs truncate">
                          {contract.property.region}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5">
                      <span className="text-[11px] sm:text-xs text-muted-foreground shrink-0">
                        وثيقة الملكية / الصك:
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                        {contract.property.deedType && (
                          <Badge variant="outline" className="border-secondary-200 bg-secondary-50 text-secondary-800 dark:border-secondary-800 dark:bg-secondary-950 dark:text-secondary-300 text-[10px] px-2 py-0.5 font-semibold">
                            {contract.property.deedType}
                          </Badge>
                        )}
                        <span className="font-mono font-semibold text-foreground">
                          {contract.property.deedNumber}
                        </span>
                        <CopyButton value={contract.property.deedNumber} label="نسخ رقم الصك" />
                      </div>
                    </div>

                    {(contract.property.hijriDate || contract.property.gregorianDate) && (
                      <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5">
                        <span className="text-[11px] sm:text-xs text-muted-foreground shrink-0">
                          تاريخ الصك:
                        </span>
                        <span className="font-semibold text-foreground text-[11px] sm:text-xs text-end">
                          {contract.property.hijriDate ? `${contract.property.hijriDate} هـ` : ""}
                          {contract.property.gregorianDate ? ` (${contract.property.gregorianDate} م)` : ""}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5">
                      <span className="text-[11px] sm:text-xs text-muted-foreground shrink-0">
                        المدينة والحي:
                      </span>
                      <span className="font-semibold text-foreground text-end text-[11px] sm:text-xs truncate">
                        {contract.property.city} — {contract.property.district}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5">
                      <span className="text-[11px] sm:text-xs text-muted-foreground shrink-0">
                        اسم الشارع:
                      </span>
                      <span className="font-semibold text-foreground text-end text-[11px] sm:text-xs truncate">
                        {contract.property.street || "—"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-1">
                      <div className="rounded-xl border border-border p-1.5 sm:p-2 text-center">
                        <span className="block text-[9px] sm:text-[10px] text-muted-foreground">
                          رقم المبنى
                        </span>
                        <span className="font-mono font-bold text-foreground text-xs sm:text-sm">
                          {contract.property.buildingNumber || "—"}
                        </span>
                      </div>

                      <div className="rounded-xl border border-border p-1.5 sm:p-2 text-center">
                        <span className="block text-[9px] sm:text-[10px] text-muted-foreground">
                          الرمز البريدي
                        </span>
                        <span className="font-mono font-bold text-foreground text-xs sm:text-sm">
                          {contract.property.postalCode || "—"}
                        </span>
                      </div>

                      <div className="rounded-xl border border-border p-1.5 sm:p-2 text-center">
                        <span className="block text-[9px] sm:text-[10px] text-muted-foreground">
                          الرقم الإضافي
                        </span>
                        <span className="font-mono font-bold text-foreground text-xs sm:text-sm">
                          {contract.property.additionalNumber || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Meters info if present */}
                  {(contract.property.electricityMeterNumber ||
                    contract.property.waterMeterNumber) && (
                      <div className="space-y-2 pt-2 border-t border-border/60">
                        <span className="block text-[11px] sm:text-xs font-semibold text-foreground">
                          أرقام حسابات العدادات الملحقة:
                        </span>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
                          {contract.property.electricityMeterNumber && (
                            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-2 sm:p-2.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Zap className="size-3.5 text-amber-500 shrink-0" />
                                <span className="text-[11px] sm:text-xs text-muted-foreground truncate">
                                  عداد الكهرباء:
                                </span>
                              </div>
                              <div className="flex items-center gap-1 font-mono font-semibold text-foreground text-xs shrink-0">
                                <span>
                                  {contract.property.electricityMeterNumber}
                                </span>
                                <CopyButton
                                  value={contract.property.electricityMeterNumber}
                                  label="نسخ"
                                />
                              </div>
                            </div>
                          )}

                          {contract.property.waterMeterNumber && (
                            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-2 sm:p-2.5">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <DropletsIcon className="size-3.5 text-cyan-500 shrink-0" />
                                <span className="text-[11px] sm:text-xs text-muted-foreground truncate">
                                  عداد المياه:
                                </span>
                              </div>
                              <div className="flex items-center gap-1 font-mono font-semibold text-foreground text-xs shrink-0">
                                <span>{contract.property.waterMeterNumber}</span>
                                <CopyButton
                                  value={contract.property.waterMeterNumber}
                                  label="نسخ"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Documents & Deeds Attachment Card in Property Tab */}
                {Boolean(contract.documents && contract.documents.length > 0) && (
                  <div className="col-span-1 lg:col-span-2 rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2">
                        <Paperclip className="size-4 text-primary shrink-0" />
                        <h3 className="font-bold text-foreground text-sm sm:text-base">
                          وثائق الملكية والصكوك المرفقة بالعقار
                        </h3>
                      </div>
                      <Badge variant="outline" className="border-border bg-muted/60 text-foreground text-[10px] sm:text-xs font-semibold px-2.5 py-0.5">
                        {contract.documents?.length} مستندات مرفقة
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {contract.documents?.map((doc) => {
                        const isImage = doc.mimeType?.startsWith("image");
                        return (
                          <div
                            key={doc.id}
                            className="flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border bg-muted/20 p-3 sm:p-4 hover:border-border/80 transition-all space-y-3"
                          >
                            <div className="flex items-start gap-3">
                              {isImage && doc.url ? (
                                <div
                                  onClick={() => setPreviewDoc(doc)}
                                  className="size-12 shrink-0 overflow-hidden rounded-xl border border-border bg-card cursor-pointer hover:opacity-85 transition-opacity"
                                  title="انقر للمعاينة"
                                >
                                  <img
                                    src={doc.url}
                                    alt={doc.fileName || "مستند الصك"}
                                    className="size-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div
                                  onClick={() => setPreviewDoc(doc)}
                                  className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400 cursor-pointer hover:opacity-85 transition-opacity"
                                  title="انقر للمعاينة"
                                >
                                  <FileText className="size-6" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <Badge
                                    variant="outline"
                                    className="border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 text-[10px] font-bold px-1.5 py-0.5"
                                  >
                                    {doc.documentType || "صك"}
                                  </Badge>
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    نسخة #{doc.version || 1}
                                  </span>
                                </div>
                                <p className="text-xs font-semibold text-foreground truncate mt-1" title={doc.fileName}>
                                  {doc.fileName || `مستند #${doc.id}`}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  {formatFileSize(doc.fileSize)} • {doc.createdAt ? doc.createdAt.slice(0, 10) : "—"}
                                </p>
                              </div>
                            </div>

                            {doc.url && (
                              <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                                <button
                                  type="button"
                                  onClick={() => setPreviewDoc(doc)}
                                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-card py-1.5 px-2.5 text-[11px] font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                                >
                                  <Eye className="size-3.5 text-primary" />
                                  <span>معاينة</span>
                                </button>
                                <a
                                  href={doc.url}
                                  download={doc.fileName || `document-${doc.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-card py-1.5 px-2 text-[11px] font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                                  title="تحميل الملف"
                                >
                                  <Download className="size-3.5 text-muted-foreground" />
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          )}

          {/* TAB 4: FINANCIALS & INSTALLMENTS */}
          {activeTab === "financials" && (
            <FadeIn duration={0.2} className="space-y-4 sm:space-y-6">
              {/* Financial Breakdown Cards */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4">
                <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-4 space-y-1">
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground line-clamp-1">
                    قيمة الإيجار السنوي
                  </span>
                  <div className="flex items-center gap-1 text-sm sm:text-lg md:text-xl font-bold text-foreground">
                    <span className="truncate">
                      {contract.financials.rentalAmount.toLocaleString("en-US")}
                    </span>
                    <SaudiRiyal className="size-3 sm:size-4 text-muted-foreground shrink-0" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground block truncate">
                    {contract.financials.paymentFrequencyLabel}
                  </span>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-4 space-y-1">
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground line-clamp-1">
                    الضمان المسترد
                  </span>
                  <div className="flex items-center gap-1 text-sm sm:text-lg md:text-xl font-bold text-foreground">
                    <span className="truncate">
                      {contract.financials.securityDeposit.toLocaleString(
                        "en-US",
                      )}
                    </span>
                    <SaudiRiyal className="size-3 sm:size-4 text-muted-foreground shrink-0" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground block truncate">
                    يُسترد بنهاية العقد
                  </span>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-4 space-y-1">
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground line-clamp-1">
                    رسوم المنصة والضريبة
                  </span>
                  <div className="flex items-center gap-1 text-sm sm:text-lg md:text-xl font-bold text-foreground">
                    <span className="truncate">
                      {(
                        contract.financials.platformFee +
                        contract.financials.taxAmount
                      ).toLocaleString("en-US")}
                    </span>
                    <SaudiRiyal className="size-3 sm:size-4 text-muted-foreground shrink-0" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-emerald-600 font-medium block truncate">
                    شامل 15% ضريبة
                  </span>
                </div>

                <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-4 space-y-1">
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground line-clamp-1">
                    طريقة وسداد الرسوم
                  </span>
                  <div className="text-xs sm:text-sm font-bold text-foreground truncate">
                    {contract.financials.paymentMethodLabel || "—"}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground block truncate">
                    {contract.financials.transactionId || "—"}
                  </span>
                </div>
              </div>

              {/* Financial Invoice Breakdown Table */}
              {Boolean(contract.financials.items && contract.financials.items.length > 0) && (
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <Receipt className="size-4 text-emerald-600 shrink-0" />
                      <h3 className="font-bold text-foreground text-sm sm:text-base">
                        تفاصيل فاتورة الرسوم والخدمات الإدارية
                      </h3>
                    </div>
                    <Badge variant="outline" className="border-border bg-muted/60 text-foreground text-[10px] sm:text-xs font-semibold px-2.5 py-0.5">
                      {contract.financials.items?.length} بنود مفصلة
                    </Badge>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 text-xs">
                          <TableHead className="text-start font-bold">البند / البيان</TableHead>
                          <TableHead className="text-center font-bold">النوع</TableHead>
                          <TableHead className="text-center font-bold">الكمية</TableHead>
                          <TableHead className="text-end font-bold">المبلغ</TableHead>
                          <TableHead className="text-end font-bold">الضريبة</TableHead>
                          <TableHead className="text-end font-bold">الإجمالي</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contract.financials.items?.map((item) => (
                          <TableRow key={item.id} className="text-xs">
                            <TableCell className="font-semibold text-foreground">
                              <div>{item.name || "رسوم الخدمة"}</div>
                              {Boolean(item.metadata && (item.metadata as Record<string, unknown>).charged === false) && (
                                <span className="text-[10px] text-muted-foreground block">(للعلم والإحاطة - غير محصل على المنصة)</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground">
                              <Badge variant="outline" className="border-border bg-muted/40 text-[10px]">
                                {item.type || "خدمة"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center font-mono font-medium text-foreground">
                              {item.quantity || 1}
                            </TableCell>
                            <TableCell className="text-end font-mono font-bold text-foreground">
                              {Number(item.amount || 0).toLocaleString("en-US")} {contract.financials.currency || "ر.س"}
                            </TableCell>
                            <TableCell className="text-end font-mono text-muted-foreground">
                              {Number(item.taxAmount || 0).toLocaleString("en-US")} {contract.financials.currency || "ر.س"}
                            </TableCell>
                            <TableCell className="text-end font-mono font-bold text-primary">
                              {Number(item.total || 0).toLocaleString("en-US")} {contract.financials.currency || "ر.س"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Financial Summary Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-muted/20 p-3 text-xs">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>المجموع الفرعي: <strong className="text-foreground font-mono">{contract.financials.subtotal?.toLocaleString("en-US")} {contract.financials.currency || "ر.س"}</strong></span>
                      {Boolean(contract.financials.discountAmount) && (
                        <span>الخصم: <strong className="text-emerald-600 font-mono">-{contract.financials.discountAmount?.toLocaleString("en-US")} {contract.financials.currency || "ر.س"}</strong></span>
                      )}
                      <span>الضريبة: <strong className="text-foreground font-mono">{contract.financials.taxAmount.toLocaleString("en-US")} {contract.financials.currency || "ر.س"}</strong></span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-foreground">
                      المبلغ الإجمالي النهائي: <span className="text-primary font-mono">{contract.financials.totalAmount?.toLocaleString("en-US")} {contract.financials.currency || "ر.س"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Installments Table & Mobile Cards */}
              <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h3 className="font-bold text-foreground text-sm sm:text-base">
                      جدول سداد الدفعات الإيجارية
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      مواعيد الاستحقاق وقيم الدفعات المجدولة للعقد
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-border bg-muted/60 text-foreground text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 shrink-0"
                  >
                    {contract.financials.installments.length} دفعات مجدولة
                  </Badge>
                </div>

                {/* Installments Table */}
                <div className="overflow-x-auto rounded-2xl border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 text-xs">
                        <TableHead className="text-center font-bold">
                          رقم الدفعة
                        </TableHead>
                        <TableHead className="text-start font-bold">
                          تاريخ الاستحقاق
                        </TableHead>
                        <TableHead className="text-end font-bold">
                          المبلغ المستحق
                        </TableHead>
                        <TableHead className="text-center font-bold">
                          حالة السداد
                        </TableHead>
                        <TableHead className="text-start font-bold">
                          رقم المرجع
                        </TableHead>
                        <TableHead className="text-start font-bold">
                          تاريخ السداد الفعلي
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contract.financials.installments.map((inst) => {
                        const isPaid = inst.status === "paid";
                        return (
                          <TableRow key={inst.id} className="text-xs">
                            <TableCell className="text-center font-bold text-foreground">
                              الدفعة #{inst.number}
                            </TableCell>
                            <TableCell className="font-mono text-foreground">
                              {inst.dueDate}
                            </TableCell>
                            <TableCell className="text-end font-bold text-foreground">
                              <div className="flex items-center justify-end gap-1">
                                <span>
                                  {inst.amount.toLocaleString("en-US")}
                                </span>
                                <SaudiRiyal className="size-3 text-muted-foreground" />
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "px-2.5 py-0.5 text-xs font-semibold",
                                  isPaid
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                    : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
                                )}
                              >
                                {inst.statusLabel}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground font-mono">
                              {inst.paymentReference || "—"}
                            </TableCell>
                            <TableCell className="text-muted-foreground font-mono">
                              {inst.paidDate || "—"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </FadeIn>
          )}

          {/* TAB 5: TERMS & CONDITIONS */}
          {activeTab === "terms" && (
            <FadeIn duration={0.2} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Standard Terms */}
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <FileCheck2 className="size-4 text-primary shrink-0" />
                    <h3 className="font-bold text-foreground text-sm sm:text-base">
                      بنود وشروط العقد الأساسية
                    </h3>
                  </div>

                  <div className="space-y-2 sm:space-y-2.5">
                    {contract.termsAndConditions && contract.termsAndConditions.length > 0 ? (
                      contract.termsAndConditions.map((term, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 rounded-xl sm:rounded-2xl border border-border/70 bg-muted/20 p-2.5 sm:p-3 text-[11px] sm:text-xs"
                        >
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300 text-[10px] sm:text-[11px] font-bold">
                            {idx + 1}
                          </span>
                          <p className="text-foreground/90 leading-relaxed">
                            {term}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl sm:rounded-2xl border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
                        لا توجد بنود عامة مسجلة.
                      </div>
                    )}
                  </div>
                </div>

                {/* Agreed Lease Contract Summary */}
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <Calendar className="size-4 text-secondary shrink-0" />
                    <h3 className="font-bold text-foreground text-sm sm:text-base">
                      تفاصيل الشروط والمدد المتفق عليها
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs">مدة العقد المحددة:</span>
                      <span className="font-bold text-foreground text-[11px] sm:text-xs">
                        {contract.durationValue || 1} {contract.durationUnit || "سنوات"} ({contract.durationMonths} شهر)
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs">تاريخ سريان البداية:</span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs">{contract.startDate}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs">تاريخ نهاية العقد:</span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs">
                        {contract.endDate !== "—" ? contract.endDate : "يُحتسب بنهاية مدة العقد"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs">القيمة الإيجارية السنوية:</span>
                      <div className="flex items-center gap-1 font-bold text-foreground text-[11px] sm:text-xs">
                        <span>{contract.financials.rentalAmount.toLocaleString("en-US")}</span>
                        <SaudiRiyal className="size-3 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs">دورية سداد الأقساط:</span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs">{contract.financials.paymentFrequencyLabel}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs">التجديد التلقائي للعقد:</span>
                      <span className={cn("font-bold text-[11px] sm:text-xs", contract.autoRenewal ? "text-emerald-600" : "text-muted-foreground")}>
                        {contract.autoRenewal ? "مفعل تلقائياً" : "غير مفعل"}
                      </span>
                    </div>

                    {/* Custom Terms if any */}
                    <div className="pt-2">
                      <span className="block text-[11px] sm:text-xs font-semibold text-foreground mb-1.5">
                        الشروط والالتزامات الإضافية الخاصة:
                      </span>
                      {contract.customTerms && contract.customTerms.length > 0 ? (
                        <div className="space-y-1.5">
                          {contract.customTerms.map((ct, idx) => (
                            <div key={idx} className="rounded-xl border border-border/80 bg-muted/20 p-2.5 text-[11px] sm:text-xs text-foreground/90">
                              {ct}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                          لا توجد شروط خاصة إضافية مسجلة من قبل الأطراف.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {/* TAB 6: DOCUMENTS & ATTACHMENTS */}
          {activeTab === "documents" && (
            <FadeIn duration={0.2} className="space-y-4 sm:space-y-6">
              <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 sm:pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400 shrink-0">
                      <Paperclip className="size-4 sm:size-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm sm:text-base">
                        الوثائق والمستندات المرفقة بالعقد
                      </h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">
                        ملفات الصكوك، الوكالات، والمستندات الثبوتية المرفوعة مع طلب العقد
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="border-border bg-muted/60 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-foreground shrink-0"
                  >
                    {contract.documents?.length || 0} مستندات مرفقة
                  </Badge>
                </div>

                {contract.documents && contract.documents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {contract.documents.map((doc) => {
                      const isImage = doc.mimeType?.startsWith("image");
                      return (
                        <div
                          key={doc.id}
                          className="flex flex-col justify-between rounded-2xl border border-border bg-muted/20 p-4 hover:border-border/80 hover:bg-card transition-all shadow-2xs space-y-4"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <Badge
                                variant="outline"
                                className="border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 text-xs font-bold px-2 py-0.5"
                              >
                                {doc.documentType || "صك"}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                نسخة #{doc.version || 1}
                              </span>
                            </div>

                            {isImage && doc.url ? (
                              <div
                                onClick={() => setPreviewDoc(doc)}
                                className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-card cursor-pointer"
                                title="انقر لمعاينة المستند"
                              >
                                <img
                                  src={doc.url}
                                  alt={doc.fileName || "مستند الصك"}
                                  className="size-full object-contain bg-muted/30 transition-transform duration-200 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-card/95 px-3 py-1.5 text-xs font-bold text-foreground shadow-md backdrop-blur-xs">
                                    <Eye className="size-3.5 text-primary" />
                                    معاينة المستند
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div
                                onClick={() => setPreviewDoc(doc)}
                                className="flex aspect-video w-full items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground cursor-pointer hover:bg-muted/60 transition-colors"
                                title="انقر لمعاينة المستند"
                              >
                                <FileText className="size-10 text-primary/70" />
                              </div>
                            )}

                            <div>
                              <h4 className="text-xs font-bold text-foreground truncate" title={doc.fileName}>
                                {doc.fileName || `مستند #${doc.id}`}
                              </h4>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1 flex-wrap">
                                <span>{formatFileSize(doc.fileSize)}</span>
                                <span>•</span>
                                <span>{doc.mimeType || "ملف"}</span>
                                <span>•</span>
                                <span>{doc.createdAt ? doc.createdAt : "—"}</span>
                                {doc.uploadedBy !== undefined && (
                                  <>
                                    <span>•</span>
                                    <span>مستخدم #{doc.uploadedBy}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {doc.url && (
                            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                              <button
                                type="button"
                                onClick={() => setPreviewDoc(doc)}
                                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2 px-3 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                              >
                                <Eye className="size-3.5 text-primary" />
                                <span>معاينة المستند</span>
                              </button>
                              <a
                                href={doc.url}
                                download={doc.fileName || `document-${doc.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1 rounded-xl border border-border bg-card p-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                                title="تحميل المستند"
                              >
                                <Download className="size-4 text-muted-foreground" />
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Empty className="border border-dashed border-border bg-muted/10 py-12">
                    <EmptyMedia variant="icon" className="size-12 bg-muted text-muted-foreground">
                      <Paperclip className="size-6" />
                    </EmptyMedia>
                    <EmptyHeader>
                      <EmptyTitle className="text-base font-bold">لا توجد وثائق مرفقة</EmptyTitle>
                      <EmptyDescription className="max-w-sm text-xs">
                        لم يتم إرفاق أي ملفات أو صور صكوك مع هذا العقد.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </div>
            </FadeIn>
          )}

          {/* TAB 7: ACTIVITY LOGS & AUDIT TRAIL TIMELINE */}
          {activeTab === "history" && (
            <FadeIn duration={0.2} className="space-y-4 sm:space-y-6">
              <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 sm:pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400 shrink-0">
                      <Clock className="size-4 sm:size-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm sm:text-base">
                        سجل العمليات والتدقيق الإداري
                      </h3>
                      <p className="text-[11px] sm:text-xs text-muted-foreground">
                        تتبع زمني تفصيلي لكافة الحركات والتحديثات والمدفوعات على
                        العقد
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="border-border bg-muted/60 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-foreground shrink-0"
                  >
                    {contract.historyLogs.length} إجراءات مسجلة
                  </Badge>
                </div>

                {/* Timeline Container */}
                <div className="relative space-y-4 sm:space-y-6 ps-7 sm:ps-10 before:absolute before:inset-y-3 before:start-3.5 sm:before:start-4 before:w-0.5 before:bg-linear-to-b before:from-primary before:via-border before:to-muted-foreground/30">
                  {contract.historyLogs.map((log) => {
                    const isCreation =
                      log.action.includes("إنشاء") ||
                      log.action.includes("رفع");
                    const isPayment =
                      log.action.includes("سداد") || log.action.includes("دفع");
                    const isCancelled =
                      log.action.includes("إلغاء") ||
                      log.action.includes("رفض");

                    const nodeIcon = isCreation ? (
                      <FilePlus2 className="size-3.5 sm:size-4 text-primary" />
                    ) : isPayment ? (
                      <CreditCard className="size-3.5 sm:size-4 text-emerald-600 dark:text-emerald-400" />
                    ) : isCancelled ? (
                      <ShieldAlert className="size-3.5 sm:size-4 text-destructive" />
                    ) : (
                      <RefreshCw className="size-3.5 sm:size-4 text-secondary" />
                    );

                    const nodeBgClass = isCreation
                      ? "bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-950 dark:border-primary-800 dark:text-primary-300"
                      : isPayment
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300"
                        : isCancelled
                          ? "bg-destructive/10 border-destructive/30 text-destructive dark:bg-destructive/20"
                          : "bg-secondary-50 border-secondary-300 text-secondary-700 dark:bg-secondary-950 dark:border-secondary-800 dark:text-secondary-300";

                    return (
                      <div key={log.id} className="relative group">
                        {/* Timeline Node Icon Circle */}
                        <div
                          className={cn(
                            "absolute -start-7 sm:-start-10 top-1.5 flex size-7 sm:size-8 items-center justify-center rounded-full border-2 shadow-xs transition-transform group-hover:scale-110",
                            nodeBgClass,
                          )}
                        >
                          {nodeIcon}
                        </div>

                        {/* Event Structured Card */}
                        <div className="rounded-xl sm:rounded-2xl border border-border bg-card/60 p-3 sm:p-4 transition-all hover:border-border/80 hover:bg-card hover:shadow-2xs space-y-2">
                          {/* Header Row */}
                          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <h4 className="text-xs font-bold text-foreground sm:text-sm">
                                {log.action}
                              </h4>

                              <Badge
                                variant="outline"
                                className="gap-1 border-border bg-muted/60 text-[10px] sm:text-[11px] font-medium text-foreground px-2 py-0.5"
                              >
                                <User className="size-3 text-muted-foreground" />
                                <span>{log.performedBy}</span>
                              </Badge>

                              {log.reason && (
                                <Badge
                                  variant="outline"
                                  className="border-primary-200 bg-primary-50 text-[10px] sm:text-[11px] text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 px-2 py-0.5"
                                >
                                  السبب: {log.reason}
                                </Badge>
                              )}
                            </div>

                            {/* Timestamp Badge */}
                            <div className="flex items-center gap-1.5 self-start font-mono text-[10px] sm:text-[11px] text-muted-foreground sm:self-center">
                              <Clock className="size-3 text-muted-foreground shrink-0" />
                              <span dir="ltr">{log.timestamp}</span>
                            </div>
                          </div>

                          {/* Status transition badge flow if present */}
                          {(log.previousStatus || log.newStatus) && (
                            <div className="flex flex-wrap items-center gap-1.5 text-xs pt-0.5">
                              {log.previousStatus && (
                                <Badge
                                  variant="outline"
                                  className="border-border bg-muted/40 text-[10px] sm:text-[11px] text-muted-foreground px-2 py-0.5"
                                >
                                  {log.previousStatus}
                                </Badge>
                              )}
                              {log.previousStatus && log.newStatus && (
                                <ArrowRight className="size-3 text-muted-foreground" />
                              )}
                              {log.newStatus && (
                                <Badge
                                  variant="outline"
                                  className="border-primary-200 bg-primary-50 text-[10px] sm:text-[11px] font-semibold text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 px-2 py-0.5"
                                >
                                  {log.newStatus}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Note callout if present */}
                          {log.note && (
                            <div className="flex items-start gap-2 rounded-xl border border-border/80 bg-muted/30 p-2 sm:p-2.5 text-[11px] sm:text-xs text-foreground/90">
                              <Info className="size-3.5 text-primary shrink-0 mt-0.5" />
                              <p className="leading-relaxed">{log.note}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </FadeIn>

      {/* 6. MODALS & DIALOGS */}
      <UpdateContractStatusDialog
        contract={isStatusDialogOpen ? contract : null}
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onUpdateStatus={handleUpdateStatus}
      />

      <UpdatePaymentStatusDialog
        contract={isPaymentDialogOpen ? contract : null}
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        onUpdatePayment={handleUpdatePayment}
      />

      {/* Global Reusable Document & Media Preview Modal */}
      <MediaPreviewDialog
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        item={previewDoc}
      />
    </div>
  );
}

function formatFileSize(bytes?: number): string {
  if (!bytes || bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} بايت`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ك.ب`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} م.ب`;
}

function DropletsIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
    </svg>
  );
}
