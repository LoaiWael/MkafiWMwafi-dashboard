import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  ExternalLink,
  FileCheck2,
  FilePlus2,
  FileText,
  Home,
  Info,
  Layers,
  Mail,
  MapPin,
  Phone,
  QrCode,
  RefreshCw,
  SaudiRiyal,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  CONTRACT_STATUS_OPTIONS,
  MOCK_CONTRACTS,
  PAYMENT_STATUS_OPTIONS,
} from "../constants";
import type {
  Contract,
  ContractHistoryLog,
  ContractStatus,
  PaymentMethod,
  PaymentStatus,
} from "../types";
import UpdateContractStatusDialog from "./update-contract-status-dialog";
import UpdatePaymentStatusDialog from "./update-payment-status-dialog";

import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import { useUrlTab } from "@/hooks/use-url-tab";

const CONTRACT_DETAILS_TABS = [
  "overview",
  "parties",
  "property",
  "financials",
  "ejar",
  "terms",
  "history",
] as const;

type ContractDetailsTab = (typeof CONTRACT_DETAILS_TABS)[number];

interface ContractDetailsViewProps {
  contractId: string;
}

export default function ContractDetailsView({
  contractId,
}: ContractDetailsViewProps) {
  // Find initial contract
  const initialContract =
    MOCK_CONTRACTS.find((c) => c.id === contractId) || MOCK_CONTRACTS[0];

  const [contract, setContract] = useState<Contract>(initialContract);
  const [activeTab, setActiveTab] = useUrlTab<ContractDetailsTab>({
    paramKey: "tab",
    defaultValue: "overview",
    validValues: CONTRACT_DETAILS_TABS,
  });

  // Dialog & Modal states
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isSyncingWithEjar, setIsSyncingWithEjar] = useState(false);

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

    setContract((prev) => ({
      ...prev,
      status: newStatus,
      statusLabel: statusOption?.label || newStatus,
      statusColorClass: statusOption?.badgeClass || prev.statusColorClass,
      updatedAt: new Date().toISOString(),
      notes: note || prev.notes,
      historyLogs: updatedHistory,
      ejar: {
        ...prev.ejar,
        ejarContractNumber: ejarNumber || prev.ejar.ejarContractNumber,
        ejarStatus:
          newStatus === "certified" ? "synced_active" : prev.ejar.ejarStatus,
        ejarStatusLabel:
          newStatus === "certified"
            ? "متزامن ونشط في شبكة إيجار"
            : prev.ejar.ejarStatusLabel,
        ejarSyncedAt:
          newStatus === "certified"
            ? new Date().toISOString().replace("T", " ").slice(0, 16)
            : prev.ejar.ejarSyncedAt,
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

    setContract((prev) => ({
      ...prev,
      updatedAt: new Date().toISOString(),
      financials: {
        ...prev.financials,
        paymentStatus: newPaymentStatus,
        paymentStatusLabel: paymentOption?.label || newPaymentStatus,
        paymentMethod: paymentMethod || prev.financials.paymentMethod,
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
          : prev.financials.paymentMethodLabel,
        transactionId: transactionId || prev.financials.transactionId,
        paidAt: isPaid
          ? new Date().toISOString().replace("T", " ").slice(0, 16)
          : undefined,
        totalPaid: isPaid
          ? prev.financials.platformFee + prev.financials.taxAmount
          : 0,
        installments: updatedInstallments,
      },
    }));

    toast.success(`تم تحديث حالة السداد إلى "${paymentOption?.label}" بنجاح`);
  }

  // Handle live Ejar sync simulation
  function handleSyncWithEjar() {
    setIsSyncingWithEjar(true);
    setTimeout(() => {
      setIsSyncingWithEjar(false);
      toast.success(
        "تمت المزامنة اللحظية والتحقق من حالة العقد مع شبكة إيجار بنجاح",
      );
    }, 800);
  }

  // Calculate lifecycle step states
  type StepState = "completed" | "current" | "upcoming" | "failed";

  const isPaymentDone =
    contract.financials.paymentStatus === "paid" ||
    contract.financials.paymentStatus === "partially_paid";

  const isReviewDone =
    contract.status === "pending_approval" || contract.status === "certified";

  const isApprovalDone = contract.status === "certified";
  const isEjarDone = contract.status === "certified";
  const isFailed =
    contract.status === "rejected" || contract.status === "expired";

  let currentStepIndex = 2;
  if (isEjarDone) {
    currentStepIndex = 5; // all done
  } else if (contract.status === "pending_approval") {
    currentStepIndex = 3;
  } else if (contract.status === "under_review") {
    currentStepIndex = 2;
  } else if (!isPaymentDone) {
    currentStepIndex = 1;
  }

  const lifecycleSteps: {
    stepNumber: number;
    title: string;
    subtitle: string;
    state: StepState;
    stateLabel: string;
    note?: string;
  }[] = [
    {
      stepNumber: 1,
      title: "إنشاء الطلب والبيانات",
      subtitle: `بواسطة ${contract.owner.name}`,
      state: "completed",
      stateLabel: "مكتمل",
      note: "تم إدخال كامل بيانات الأطراف والوحدة وتدقيقها",
    },
    {
      stepNumber: 2,
      title: "سداد رسوم التوثيق",
      subtitle: contract.financials.paymentStatusLabel,
      state: isPaymentDone
        ? "completed"
        : currentStepIndex === 1
          ? "current"
          : "upcoming",
      stateLabel: isPaymentDone
        ? "تم السداد"
        : currentStepIndex === 1
          ? "بانتظار السداد"
          : "لم تبدأ بعد",
      note: isPaymentDone
        ? `عبر ${contract.financials.paymentMethodLabel || "المنصة"}`
        : "بانتظار سداد الفاتورة",
    },
    {
      stepNumber: 3,
      title: "مطابقة الصك وتدقيق الهوية",
      subtitle: "البورصة العقارية ونفاذ",
      state: isReviewDone
        ? "completed"
        : currentStepIndex === 2
          ? isFailed
            ? "failed"
            : "current"
          : "upcoming",
      stateLabel: isReviewDone
        ? "تم التدقيق"
        : currentStepIndex === 2
          ? isFailed
            ? "مرفوض"
            : "قيد التدقيق"
          : "لم تبدأ بعد",
      note: isReviewDone
        ? "مطابقة الصك 100% مع وزارة العدل"
        : "التحقق من سريان الصك وصلاحية المؤجر",
    },
    {
      stepNumber: 4,
      title: "موافقة أطراف العقد عبر نفاذ",
      subtitle: "قبول المؤجر والمستأجر",
      state: isApprovalDone
        ? "completed"
        : currentStepIndex === 3
          ? "current"
          : "upcoming",
      stateLabel: isApprovalDone
        ? "تمت الموافقة"
        : currentStepIndex === 3
          ? "بانتظار القبول"
          : "لم تبدأ بعد",
      note: isApprovalDone
        ? "موافقة واعتماد كافة الأطراف"
        : "إرسال رسائل التحقق عبر نفاذ الوطني",
    },
    {
      stepNumber: 5,
      title: "اعتماد وتوثيق شبكة إيجار",
      subtitle: contract.ejar.ejarContractNumber || "إصدار العقد الرسمي",
      state: isEjarDone
        ? "completed"
        : currentStepIndex === 4
          ? "current"
          : "upcoming",
      stateLabel: isEjarDone
        ? "موثق رسمي"
        : currentStepIndex === 4
          ? "قيد الربط"
          : "المرحلة النهائية",
      note: isEjarDone
        ? "عقد ساري وموثق ومعتمد نظامياً"
        : "المصادقة النهائية لدى الهيئة العامة للعقار",
    },
  ];

  // Tab definitions
  const tabsList: FilterTabItem<ContractDetailsTab>[] = [
    { id: "overview", label: "نظرة عامة والمسار", icon: Layers },
    { id: "parties", label: "أطراف العقد", icon: Users },
    { id: "property", label: "العقار والوحدة", icon: Building2 },
    { id: "financials", label: "المالية والدفعات", icon: CreditCard },
    { id: "ejar", label: "شبكة إيجار", icon: ShieldCheck },
    { id: "terms", label: "البنود والشروط", icon: FileCheck2 },
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

          {/* Action Buttons - 2x2 grid on mobile, flexible row on tablet/desktop */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <TooltipProvider delay={150}>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={handleSyncWithEjar}
                  disabled={isSyncingWithEjar}
                  className="inline-flex h-8.5 sm:h-9 w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2.5 sm:px-3 text-[11px] sm:text-xs font-semibold text-foreground transition-colors hover:bg-muted active:scale-98 cursor-pointer disabled:opacity-50"
                  aria-label="مزامنة لحظية مع إيجار"
                >
                  <RefreshCw
                    className={cn(
                      "size-3.5 shrink-0",
                      isSyncingWithEjar && "animate-spin text-primary",
                    )}
                  />
                  <span className="truncate">مزامنة إيجار</span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  فحص وتحديث حالة العقد مع بوابة شبكة إيجار الرسمية
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsStatusDialogOpen(true)}
              className="gap-1.5 rounded-xl text-[11px] sm:text-xs font-semibold cursor-pointer w-full sm:w-auto justify-center h-8.5 sm:h-9 px-2.5 sm:px-3 active:scale-98"
            >
              <RefreshCw className="size-3.5 text-secondary shrink-0" />
              <span className="truncate">تحديث الحالة</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPaymentDialogOpen(true)}
              className="gap-1.5 rounded-xl text-[11px] sm:text-xs font-semibold cursor-pointer w-full sm:w-auto justify-center h-8.5 sm:h-9 px-2.5 sm:px-3 active:scale-98"
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
              <span>حالة التوثيق: {contract.statusLabel}</span>
            </Badge>

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

            <Badge
              variant="outline"
              className="gap-1.5 border-border bg-muted/80 px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-foreground shadow-2xs"
            >
              <ShieldCheck className="size-3.5 sm:size-4 text-tertiary-600 dark:text-tertiary-400 shrink-0" />
              <span>رقم إيجار: {contract.ejar.ejarContractNumber}</span>
              <CopyButton
                value={contract.ejar.ejarContractNumber}
                itemId={`ejar-${contract.id}`}
                label="نسخ رمز إيجار"
              />
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
                  <Badge
                    variant="outline"
                    className="border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300 text-[10px] sm:text-xs font-bold px-2 py-0.5"
                  >
                    {contract.owner.roleLabel}
                  </Badge>
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
              <div className="rounded-xl sm:rounded-2xl border border-border bg-card/80 p-2 sm:p-3 text-center backdrop-blur-xs">
                <span className="block text-[10px] sm:text-[11px] font-medium text-muted-foreground">
                  صفة مقدم الطلب
                </span>
                <span className="block mt-0.5 text-xs font-bold text-foreground truncate">
                  {contract.owner.role === "lessee"
                    ? "المستأجر"
                    : contract.owner.role === "lessor"
                      ? "المؤجر"
                      : "وسيط عقاري"}
                </span>
              </div>

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

        {/* Metric 3: Ejar Status */}
        <StaggerItem>
          <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-2.5 sm:p-4 shadow-2xs space-y-1">
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground line-clamp-1">
              حالة التوثيق في إيجار
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-tertiary-700 dark:text-tertiary-300 sm:text-base">
              <ShieldCheck className="size-3 sm:size-4 shrink-0" />
              <span className="truncate">{contract.ejar.ejarStatusLabel}</span>
            </div>
            <div className="text-[10px] sm:text-xs font-mono text-muted-foreground pt-0.5 truncate">
              {contract.ejar.ejarContractNumber}
            </div>
          </div>
        </StaggerItem>

        {/* Metric 4: Platform Fee & VAT */}
        <StaggerItem>
          <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-2.5 sm:p-4 shadow-2xs space-y-1">
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground line-clamp-1">
              رسوم التوثيق والضريبة
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

      {/* 5. ROBUST CUSTOM SEGMENTED TAB BAR WITH HORIZONTAL SCROLL ON MOBILE */}
      <FadeIn duration={0.3} delay={0.15}>
        <div className="space-y-4 sm:space-y-6">
          <FilterTabs
            items={tabsList}
            value={activeTab}
            onValueChange={setActiveTab}
            gridColsClass="sm:grid-cols-4 lg:grid-cols-7"
            ariaLabel="تبويبات تفاصيل العقد"
            idPrefix="contract-details-tab"
          />

          {/* TAB 1: OVERVIEW & LIFECYCLE */}
          {activeTab === "overview" && (
            <FadeIn duration={0.2} className="space-y-4 sm:space-y-6">
              {/* Lifecycle Stepper with High-Contrast Visible Badges */}
              <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3 sm:pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-primary shrink-0" />
                      <h3 className="font-bold text-foreground text-sm sm:text-base">
                        متتبع مسار ومراحل توثيق العقد
                      </h3>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      متابعة حية لتقدم مراحل إصدار العقد من الإنشاء حتى الاعتماد
                      الرسمي في شبكة إيجار
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1.5 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold shadow-2xs",
                        contract.statusColorClass,
                      )}
                    >
                      <span className="size-1.5 sm:size-2 rounded-full bg-current" />
                      <span>{contract.statusLabel}</span>
                    </Badge>
                  </div>
                </div>

                {/* Stepper Cards */}
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
                  {lifecycleSteps.map((step) => {
                    const isDone = step.state === "completed";
                    const isCurrent = step.state === "current";
                    const isUpcoming = step.state === "upcoming";
                    const isFailedStep = step.state === "failed";

                    return (
                      <div
                        key={step.stepNumber}
                        className={cn(
                          "relative flex flex-col justify-between rounded-xl sm:rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 shadow-2xs overflow-hidden",
                          isDone &&
                            "border-emerald-300 bg-emerald-50/90 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100",
                          isCurrent &&
                            "border-primary-400 bg-primary-50/90 text-primary-950 dark:border-primary-600 dark:bg-primary-950/50 dark:text-primary-100 ring-2 ring-primary/25 shadow-sm",
                          isUpcoming &&
                            "border-border/80 bg-muted/20 text-muted-foreground dark:bg-muted/10 opacity-75 hover:opacity-100",
                          isFailedStep &&
                            "border-destructive/40 bg-destructive/10 text-destructive dark:bg-destructive/20",
                        )}
                      >
                        {/* Top decorative accent bar */}
                        <div
                          className={cn(
                            "absolute top-0 inset-x-0 h-1",
                            isDone && "bg-emerald-500",
                            isCurrent && "bg-primary animate-pulse",
                            isUpcoming && "bg-muted-foreground/20",
                            isFailedStep && "bg-destructive",
                          )}
                        />

                        {/* Top Step Header */}
                        <div className="flex items-center justify-between mb-2 sm:mb-3 pt-0.5">
                          {/* Step Number Circle */}
                          <div
                            className={cn(
                              "flex size-6 sm:size-7 items-center justify-center rounded-full text-xs font-bold shadow-xs transition-transform",
                              isDone &&
                                "bg-emerald-600 text-white shadow-emerald-600/20",
                              isCurrent &&
                                "bg-primary text-primary-foreground shadow-primary/30 ring-2 ring-primary/20 animate-pulse",
                              isUpcoming &&
                                "bg-muted text-muted-foreground border border-border",
                              isFailedStep &&
                                "bg-destructive text-destructive-foreground",
                            )}
                          >
                            {isDone ? (
                              <CheckCircle2 className="size-3.5 sm:size-4" />
                            ) : (
                              <span>{step.stepNumber}</span>
                            )}
                          </div>

                          {/* State Tag Badge */}
                          <Badge
                            variant="outline"
                            className={cn(
                              "px-2 py-0.5 text-[10px] font-bold",
                              isDone &&
                                "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200",
                              isCurrent &&
                                "border-primary bg-primary text-primary-foreground shadow-2xs",
                              isUpcoming &&
                                "border-border bg-muted/60 text-muted-foreground",
                              isFailedStep &&
                                "border-destructive bg-destructive text-destructive-foreground",
                            )}
                          >
                            {isCurrent && (
                              <span className="size-1.5 rounded-full bg-current animate-ping me-1" />
                            )}
                            <span>{step.stateLabel}</span>
                          </Badge>
                        </div>

                        {/* Step Details */}
                        <div className="space-y-1 flex-1">
                          <h4
                            className={cn(
                              "text-xs font-bold leading-snug",
                              isDone &&
                                "text-emerald-950 dark:text-emerald-100",
                              isCurrent &&
                                "text-primary-950 dark:text-primary-100 font-extrabold",
                              isUpcoming && "text-foreground/80",
                              isFailedStep && "text-destructive",
                            )}
                          >
                            {step.title}
                          </h4>

                          <p
                            className={cn(
                              "text-[11px] leading-tight line-clamp-1",
                              isDone &&
                                "text-emerald-700 dark:text-emerald-300 font-medium",
                              isCurrent &&
                                "text-primary-700 dark:text-primary-300 font-semibold",
                              isUpcoming && "text-muted-foreground",
                              isFailedStep && "text-destructive/80",
                            )}
                          >
                            {step.subtitle}
                          </p>

                          {step.note && (
                            <p
                              className={cn(
                                "text-[10px] pt-1 border-t leading-tight",
                                isDone &&
                                  "border-emerald-200/80 text-emerald-600/90 dark:border-emerald-800/60 dark:text-emerald-400",
                                isCurrent &&
                                  "border-primary-200/80 text-primary-700/90 dark:border-primary-800/60 dark:text-primary-300",
                                isUpcoming &&
                                  "border-border/60 text-muted-foreground/70",
                                isFailedStep &&
                                  "border-destructive/30 text-destructive",
                              )}
                            >
                              {step.note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Summary Grid */}
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
                        {contract.purposeLabel || "سكني عائلي"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        رقم الصك الإلكتروني:
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
                        {contract.endDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        المدة المحسوبة:
                      </span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs">
                        {contract.durationMonths} شهر
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-b border-border/50 py-1.5 sm:py-2">
                      <span className="text-muted-foreground text-[11px] sm:text-xs shrink-0">
                        التجديد التلقائي:
                      </span>
                      <span className="font-semibold text-foreground text-[11px] sm:text-xs">
                        {contract.autoRenewal ? "نعم (تلقائي)" : "لا"}
                      </span>
                    </div>
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
                        الموقع:
                      </span>
                      <span className="font-semibold text-foreground text-end text-[11px] sm:text-xs truncate">
                        {contract.property.city} — {contract.property.district}
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

          {/* TAB 2: PARTIES & VERIFICATION */}
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
                            "مالك العقار الأصيل"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-border bg-muted/60 text-foreground text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 shrink-0"
                    >
                      {contract.lessor.idTypeLabel}
                    </Badge>
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
                    </div>

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
                        <span className="block text-[10px] sm:text-[11px] text-muted-foreground">
                          البنك: {contract.lessor.bankName || "مصرف معتمد"}
                        </span>
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
                            "المستأجر المستفيد الأصيل"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-border bg-muted/60 text-foreground text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 shrink-0"
                    >
                      {contract.lessee.idTypeLabel}
                    </Badge>
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

                    {/* Government support eligibility pills */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                      {contract.lessee.citizenAccountEligible && (
                        <div className="flex items-center gap-1.5 rounded-xl border border-primary-200 bg-primary-50/60 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-primary-800 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-300">
                          <CheckCircle2 className="size-3.5 shrink-0" />
                          <span>متوافق مع حساب المواطن</span>
                        </div>
                      )}

                      {contract.lessee.socialInsuranceEligible && (
                        <div className="flex items-center gap-1.5 rounded-xl border border-secondary-200 bg-secondary-50/60 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-secondary-800 dark:border-secondary-800 dark:bg-secondary-950/40 dark:text-secondary-300">
                          <CheckCircle2 className="size-3.5 shrink-0" />
                          <span>متوافق مع الضمان الاجتماعي المطور</span>
                        </div>
                      )}
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
                          الوسيط العقاري المرخص (الهيئة العامة للعقار - فال)
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                          وساطة وإبرام عقود معتمدة
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-border bg-muted/60 text-foreground text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 shrink-0"
                    >
                      رخصة فال:{" "}
                      {contract.broker.valLicenseNumber || "VAL-1200029"}
                    </Badge>
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
                        <span>{contract.broker.crNumber}</span>
                        <CopyButton
                          value={contract.broker.crNumber || ""}
                          label="نسخ"
                        />
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
                        {contract.broker.phone}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </FadeIn>
          )}

          {/* TAB 3: PROPERTY, DEED & UNITS */}
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
                      <Badge
                        variant="outline"
                        className="gap-1 border-border bg-muted/60 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1"
                      >
                        <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                        <span>صيانة مشتركة</span>
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* National Address & Meters Card */}
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <MapPin className="size-4 text-secondary shrink-0" />
                    <h3 className="font-bold text-foreground text-sm sm:text-base">
                      العنوان الوطني والعدادات
                    </h3>
                  </div>

                  {/* National address grid */}
                  <div className="space-y-2 text-xs">
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
                        {contract.property.street}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-1">
                      <div className="rounded-xl border border-border p-1.5 sm:p-2 text-center">
                        <span className="block text-[9px] sm:text-[10px] text-muted-foreground">
                          رقم المبنى
                        </span>
                        <span className="font-mono font-bold text-foreground text-xs sm:text-sm">
                          {contract.property.buildingNumber}
                        </span>
                      </div>

                      <div className="rounded-xl border border-border p-1.5 sm:p-2 text-center">
                        <span className="block text-[9px] sm:text-[10px] text-muted-foreground">
                          الرمز البريدي
                        </span>
                        <span className="font-mono font-bold text-foreground text-xs sm:text-sm">
                          {contract.property.postalCode}
                        </span>
                      </div>

                      <div className="rounded-xl border border-border p-1.5 sm:p-2 text-center">
                        <span className="block text-[9px] sm:text-[10px] text-muted-foreground">
                          الرقم الإضافي
                        </span>
                        <span className="font-mono font-bold text-foreground text-xs sm:text-sm">
                          {contract.property.additionalNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Meters info */}
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <span className="block text-[11px] sm:text-xs font-semibold text-foreground">
                      أرقام حسابات العدادات الملحقة:
                    </span>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
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
                    </div>
                  </div>
                </div>
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
                    {contract.financials.paymentMethodLabel ||
                      "بوابة مدى الإلكترونية"}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground block truncate">
                    {contract.financials.transactionId || "سداد إلكتروني"}
                  </span>
                </div>
              </div>

              {/* Installments Table & Mobile Cards */}
              <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <h3 className="font-bold text-foreground text-sm sm:text-base">
                      جدول سداد الدفعات الإيجارية
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      مواعيد الاستحقاق وقيم الدفعات المجدولة في شبكة إيجار
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

          {/* TAB 5: EJAR INTEGRATION & SEALS */}
          {activeTab === "ejar" && (
            <FadeIn duration={0.2} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
                {/* Ejar Status & QR Code */}
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4 lg:col-span-2">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <ShieldCheck className="size-5 text-tertiary-600 shrink-0" />
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground text-sm sm:text-base truncate">
                          بيانات التوثيق والربط مع شبكة إيجار
                        </h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                          رقم العقد الموحد والربط مع الهيئة العامة للعقار
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-tertiary-200 bg-tertiary-50 text-tertiary-800 dark:border-tertiary-800 dark:bg-tertiary-950 dark:text-tertiary-300 text-[10px] sm:text-xs font-semibold shrink-0"
                    >
                      {contract.ejar.ejarStatusLabel}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4 text-xs">
                    <div className="rounded-xl sm:rounded-2xl border border-border bg-muted/20 p-3 sm:p-3.5 space-y-1">
                      <span className="text-[11px] text-muted-foreground">
                        رقم العقد في شبكة إيجار:
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-bold text-foreground">
                        <span>{contract.ejar.ejarContractNumber}</span>
                        <CopyButton
                          value={contract.ejar.ejarContractNumber}
                          label="نسخ رقم إيجار"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl sm:rounded-2xl border border-border bg-muted/20 p-3 sm:p-3.5 space-y-1">
                      <span className="text-[11px] text-muted-foreground">
                        ترخيص الهيئة العامة للعقار (REGA):
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-bold text-foreground">
                        <span>{contract.ejar.regaLicenseNumber}</span>
                        <CopyButton
                          value={contract.ejar.regaLicenseNumber}
                          label="نسخ رقم الترخيص"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Digital Seals with Visible High-Contrast Backgrounds */}
                  <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
                    <span className="block text-[11px] sm:text-xs font-bold text-foreground">
                      الأختام والشهادات الرقمية المعتمدة:
                    </span>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                      <div className="flex items-center gap-2.5 rounded-xl sm:rounded-2xl border border-emerald-200 bg-emerald-50 p-2.5 sm:p-3.5 dark:border-emerald-800 dark:bg-emerald-950/60">
                        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <span className="block text-xs font-bold text-emerald-900 dark:text-emerald-200">
                            ختم شبكة إيجار
                          </span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                            معتمد وموثق رقمياً
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 rounded-xl sm:rounded-2xl border border-emerald-200 bg-emerald-50 p-2.5 sm:p-3.5 dark:border-emerald-800 dark:bg-emerald-950/60">
                        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <span className="block text-xs font-bold text-emerald-900 dark:text-emerald-200">
                            هيئة العقار (REGA)
                          </span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                            مطابق للأنظمة واللوائح
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 rounded-xl sm:rounded-2xl border border-emerald-200 bg-emerald-50 p-2.5 sm:p-3.5 dark:border-emerald-800 dark:bg-emerald-950/60">
                        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                          <span className="block text-xs font-bold text-emerald-900 dark:text-emerald-200">
                            المركز السعودي للأعمال
                          </span>
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                            مصادق للسجلات والمنشآت
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Card */}
                <div className="flex flex-col items-center justify-between rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 text-center shadow-xs space-y-3.5 sm:space-y-4">
                  <div className="space-y-1">
                    <div className="flex size-9 sm:size-10 mx-auto items-center justify-center rounded-2xl bg-muted text-foreground">
                      <QrCode className="size-4 sm:size-5" />
                    </div>
                    <h4 className="font-bold text-foreground text-xs sm:text-sm">
                      رمز التحقق السريع (QR)
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                      امسح الرمز للتحقق الفوري من صحة العقد عبر منصة إيجار
                      الرسمية
                    </p>
                  </div>

                  {/* QR Display box */}
                  <div className="flex size-30 sm:size-36 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white p-2 shadow-inner">
                    <svg
                      viewBox="0 0 100 100"
                      className="size-full text-foreground"
                      fill="currentColor"
                    >
                      <rect x="10" y="10" width="30" height="30" rx="4" />
                      <rect x="16" y="16" width="18" height="18" fill="white" />
                      <rect x="20" y="20" width="10" height="10" />

                      <rect x="60" y="10" width="30" height="30" rx="4" />
                      <rect x="66" y="16" width="18" height="18" fill="white" />
                      <rect x="70" y="20" width="10" height="10" />

                      <rect x="10" y="60" width="30" height="30" rx="4" />
                      <rect x="16" y="66" width="18" height="18" fill="white" />
                      <rect x="20" y="70" width="10" height="10" />

                      <rect x="45" y="15" width="8" height="8" />
                      <rect x="45" y="30" width="8" height="15" />
                      <rect x="45" y="60" width="15" height="8" />
                      <rect x="65" y="50" width="20" height="8" />
                      <rect x="75" y="65" width="15" height="15" />
                    </svg>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(contract.ejar.verificationQrUrl, "_blank")
                    }
                    className="w-full gap-1.5 text-xs font-semibold cursor-pointer active:scale-98"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>فتح صفحة التحقق</span>
                  </Button>
                </div>
              </div>
            </FadeIn>
          )}

          {/* TAB 6: TERMS & CONDITIONS */}
          {activeTab === "terms" && (
            <FadeIn duration={0.2} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                {/* Standard Ejar Terms */}
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <FileCheck2 className="size-4 text-primary shrink-0" />
                    <h3 className="font-bold text-foreground text-sm sm:text-base">
                      البنود الموحدة لشبكة إيجار
                    </h3>
                  </div>

                  <div className="space-y-2 sm:space-y-2.5">
                    {contract.termsAndConditions.map((term, idx) => (
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
                    ))}
                  </div>
                </div>

                {/* Custom Clauses */}
                <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <Sparkles className="size-4 text-secondary shrink-0" />
                    <h3 className="font-bold text-foreground text-sm sm:text-base">
                      الشروط والالتزامات الخاصة المتفق عليها
                    </h3>
                  </div>

                  {contract.customTerms && contract.customTerms.length > 0 ? (
                    <div className="space-y-2 sm:space-y-2.5">
                      {contract.customTerms.map((clause, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 rounded-xl sm:rounded-2xl border border-secondary-200/60 bg-secondary-50/20 p-2.5 sm:p-3 text-[11px] sm:text-xs dark:border-secondary-800/60 dark:bg-secondary-950/20"
                        >
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-800 dark:bg-secondary-950 dark:text-secondary-300 text-[10px] sm:text-[11px] font-bold">
                            {idx + 1}
                          </span>
                          <p className="text-foreground/90 leading-relaxed">
                            {clause}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl sm:rounded-2xl border border-dashed border-border p-5 sm:p-6 text-center text-xs text-muted-foreground">
                      لا توجد شروط خاصة إضافية مسجلة في هذا العقد.
                    </div>
                  )}
                </div>
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

                {/* Modern Timeline Container with Pixel-Perfect Responsive Alignment */}
                <div className="relative space-y-4 sm:space-y-6 ps-7 sm:ps-10 before:absolute before:inset-y-3 before:start-3.5 sm:before:start-4 before:w-0.5 before:bg-linear-to-b before:from-primary before:via-border before:to-muted-foreground/30">
                  {contract.historyLogs.map((log) => {
                    // Determine icon and color based on action
                    const isCreation =
                      log.action.includes("إنشاء") ||
                      log.action.includes("رفع");
                    const isPayment =
                      log.action.includes("سداد") || log.action.includes("دفع");
                    const isVerification =
                      log.action.includes("نفاذ") ||
                      log.action.includes("قبول");
                    const isEjar =
                      log.action.includes("إيجار") ||
                      log.action.includes("توثيق") ||
                      log.action.includes("اعتماد");
                    const isCancelled =
                      log.action.includes("إلغاء") ||
                      log.action.includes("رفض");

                    const nodeIcon = isCreation ? (
                      <FilePlus2 className="size-3.5 sm:size-4 text-primary" />
                    ) : isPayment ? (
                      <CreditCard className="size-3.5 sm:size-4 text-emerald-600 dark:text-emerald-400" />
                    ) : isVerification ? (
                      <ShieldCheck className="size-3.5 sm:size-4 text-tertiary-600 dark:text-tertiary-400" />
                    ) : isEjar ? (
                      <CheckCircle2 className="size-3.5 sm:size-4 text-emerald-600 dark:text-emerald-400" />
                    ) : isCancelled ? (
                      <ShieldAlert className="size-3.5 sm:size-4 text-destructive" />
                    ) : (
                      <RefreshCw className="size-3.5 sm:size-4 text-secondary" />
                    );

                    const nodeBgClass = isCreation
                      ? "bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-950 dark:border-primary-800 dark:text-primary-300"
                      : isPayment
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300"
                        : isVerification
                          ? "bg-tertiary-50 border-tertiary-300 text-tertiary-700 dark:bg-tertiary-950 dark:border-tertiary-800 dark:text-tertiary-300"
                          : isEjar
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
    </div>
  );
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
