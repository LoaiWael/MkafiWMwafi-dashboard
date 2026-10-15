import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CreditCard,
  FileCheck,
  IdCard,
  Mail,
  Phone,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { Link } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { cn, formatIban } from "@/lib/utils";
import type { Property, PropertyOwner } from "../types";

interface PropertyOwnerCardProps {
  owner: PropertyOwner;
  property: Property;
  className?: string;
}

export default function PropertyOwnerCard({
  owner,
  property,
  className,
}: PropertyOwnerCardProps) {
  // Format initials from owner name
  const ownerInitials = owner.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  const cleanOwnerPhone = owner.phone.replace(/[^0-9]/g, "");
  const internationalOwnerPhone = cleanOwnerPhone.startsWith("0")
    ? `966${cleanOwnerPhone.slice(1)}`
    : cleanOwnerPhone;

  function handleSendOwnerWhatsApp() {
    const message = encodeURIComponent(
      `السلام عليكم ورحمة الله، الأستاذ ${owner.name} بخصوص العقار (${property.name} - ${property.code}) في منصة مكفي وموفي.`,
    );
    window.open(
      `https://wa.me/${internationalOwnerPhone}?text=${message}`,
      "_blank",
    );
  }

  function handleSendAgentWhatsApp() {
    if (!owner.agent) return;
    const cleanAgentPhone = owner.agent.phone.replace(/[^0-9]/g, "");
    const internationalAgentPhone = cleanAgentPhone.startsWith("0")
      ? `966${cleanAgentPhone.slice(1)}`
      : cleanAgentPhone;
    const message = encodeURIComponent(
      `السلام عليكم ورحمة الله، بصفتكم وكيلاً لمالك العقار (${property.name} - ${property.code}) بموجب الوكالة رقم (${owner.agent.agencyNumber}) في منصة مكفي وموفي.`,
    );
    window.open(
      `https://wa.me/${internationalAgentPhone}?text=${message}`,
      "_blank",
    );
  }

  const hasAgent = Boolean(owner.hasAgent && owner.agent);

  // Account who saved / created the property
  const creator = property.createdBy || {
    id: "usr-creator-default",
    name: "محمد عبد الله القحطاني",
    phone: "0504111307",
    email: "m.qahtani@example.com",
    roleLabel: "وسيط ومسؤول إدارة العقار",
    isVerified: true,
  };

  const creatorInitials = creator.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-3.5 sm:p-5 md:p-6 shadow-xs transition-all space-y-4 sm:space-y-5",
        className,
      )}
    >
      {/* Subtle background decorative accent */}
      <div className="absolute top-0 end-0 -mt-10 -me-10 size-40 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      {/* 1. Header Profile Banner (Property Owner) */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
          {/* Avatar without shield */}
          <div className="relative shrink-0">
            <Avatar className="size-11 sm:size-13 border-2 border-primary/20 bg-primary/10 text-primary font-bold text-sm sm:text-base shadow-xs">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {ownerInitials || "م"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Owner details info */}
          <div className="space-y-1 text-start min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                {owner.name}
              </h3>
              <Badge
                variant="outline"
                className={cn(
                  "text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-xl",
                  hasAgent
                    ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                    : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
                )}
              >
                {hasAgent ? "يوجد وكيل شرعي معتمد" : "مالك أصيل مباشر"}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground">
              <span className="font-medium text-foreground/80">رقم الهوية:</span>
              <span className="font-mono font-bold text-foreground">
                {owner.idNumber}
              </span>
              <CopyButton
                value={owner.idNumber}
                itemId={`owner-id-top-${owner.idNumber}`}
                label="نسخ رقم هوية المالك"
                className="size-5.5"
              />
            </div>
          </div>
        </div>

        {/* Quick Communication CTA */}
        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
          <button
            type="button"
            className="inline-flex h-8 sm:h-8.5 items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50/70 px-3 text-xs font-bold text-emerald-700 hover:bg-emerald-100/90 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60 shadow-xs transition-colors active:scale-98 cursor-pointer"
            onClick={handleSendOwnerWhatsApp}
          >
            <FaWhatsapp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>مراسلة واتساب</span>
          </button>
        </div>
      </div>

      {/* 2. SECTION: بيانات مالك العقار */}
      <div className="rounded-xl sm:rounded-2xl border border-border/80 bg-muted/20 p-3 sm:p-4 space-y-3 sm:space-y-4 text-start">
        <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
          <div className="flex items-center gap-2">
            <User className="size-4 text-primary" />
            <h4 className="text-xs sm:text-sm font-bold text-foreground">
              بيانات مالك العقار
            </h4>
          </div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground">
            المالك المسجل بصك الملكية
          </span>
        </div>

        {/* Grid of 4 Key Owner Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {/* 1. اسم مالك العقار */}
          <div className="rounded-xl border border-border/60 bg-card p-2.5 sm:p-3 space-y-1">
            <span className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1">
              <UserCheck className="size-3 text-muted-foreground" />
              اسم مالك العقار
            </span>
            <p className="text-xs sm:text-sm font-bold text-foreground">
              {owner.name}
            </p>
          </div>

          {/* 2. رقم هوية المالك */}
          <div className="rounded-xl border border-border/60 bg-card p-2.5 sm:p-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1">
                <IdCard className="size-3 text-muted-foreground" />
                رقم هوية المالك
              </span>
              <p className="font-mono text-xs sm:text-sm font-bold text-foreground">
                {owner.idNumber}
              </p>
            </div>
            <CopyButton
              value={owner.idNumber}
              itemId={`owner-id-${owner.idNumber}`}
              label="نسخ رقم الهوية"
            />
          </div>

          {/* 3. تاريخ ميلاد المالك */}
          <div className="rounded-xl border border-border/60 bg-card p-2.5 sm:p-3 space-y-1">
            <span className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1">
              <Calendar className="size-3 text-muted-foreground" />
              تاريخ ميلاد المالك
            </span>
            <p className="text-xs sm:text-sm font-bold text-foreground">
              {owner.birthDate || "غير محدد"}
            </p>
          </div>

          {/* 4. رقم جوال المالك */}
          <div className="rounded-xl border border-border/60 bg-card p-2.5 sm:p-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1">
                <Phone className="size-3 text-muted-foreground" />
                رقم جوال المالك
              </span>
              <p className="font-mono text-xs sm:text-sm font-bold text-foreground">
                <bdi>{owner.phone}</bdi>
              </p>
            </div>
            <CopyButton
              value={owner.phone}
              itemId={`owner-phone-${owner.phone}`}
              label="نسخ رقم الجوال"
            />
          </div>
        </div>

        {/* 5. رقم الآيبان البنكي للمالك (IBAN container) */}
        <div className="space-y-1.5 pt-0.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <CreditCard className="size-3.5 text-primary" />
            <span>رقم الآيبان البنكي للمالك (IBAN)</span>
          </label>

          {(() => {
            const rawIban = owner.iban || "";
            const formattedIban = formatIban(rawIban);

            return (
              <div
                className="flex items-center justify-between rounded-xl border border-border bg-card px-3 sm:px-4 py-2 sm:py-2.5 shadow-2xs min-w-0"
                dir="ltr"
              >
                <span className="font-mono text-xs sm:text-sm font-bold tracking-wide text-foreground truncate">
                  {formattedIban || "غير مسجل"}
                </span>
                {formattedIban ? (
                  <CopyButton
                    value={formattedIban}
                    itemId={`owner-iban-${owner.idNumber}`}
                    label="نسخ رقم الآيبان"
                    className="size-6 sm:size-7 shrink-0"
                  />
                ) : null}
              </div>
            );
          })()}
        </div>
      </div>

      {/* 3. SECTION: بيانات الوكيل (Agent Data) if added, or Clean Indicator if direct */}
      {hasAgent && owner.agent ? (
        <div className="rounded-xl sm:rounded-2xl border border-blue-200/80 bg-blue-50/30 dark:border-blue-900/60 dark:bg-blue-950/20 p-3 sm:p-4 space-y-3 sm:space-y-4 text-start">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/60 dark:border-blue-900/50 pb-2.5">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <Users className="size-4 text-blue-600 dark:text-blue-400" />
              <h4 className="text-xs sm:text-sm font-bold text-foreground">
                بيانات الوكيل الشرعي المعتمد
              </h4>
              {owner.agent.name && (
                <span className="text-xs text-muted-foreground font-semibold">
                  ({owner.agent.name})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="outline"
                className="border-blue-300 bg-blue-100/50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] sm:text-[11px] font-semibold"
              >
                وكالة شرعية معتمدة عبر وزارة العدل
              </Badge>

              <button
                type="button"
                onClick={handleSendAgentWhatsApp}
                className="inline-flex h-7 items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                title="مراسلة الوكيل واتساب"
              >
                <FaWhatsapp className="size-3 text-emerald-600" />
                <span>واتساب الوكيل</span>
              </button>
            </div>
          </div>

          {/* Grid of Agent Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {/* 1. رقم هوية وكيل المالك */}
            <div className="rounded-xl border border-border/60 bg-card p-2.5 sm:p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1">
                  <IdCard className="size-3 text-muted-foreground" />
                  رقم هوية الوكيل
                </span>
                <p className="font-mono text-xs sm:text-sm font-bold text-foreground">
                  {owner.agent.idNumber}
                </p>
              </div>
              <CopyButton
                value={owner.agent.idNumber}
                itemId={`agent-id-${owner.agent.idNumber}`}
                label="نسخ رقم هوية الوكيل"
              />
            </div>

            {/* 2. تاريخ ميلاد وكيل المالك */}
            <div className="rounded-xl border border-border/60 bg-card p-2.5 sm:p-3 space-y-1">
              <span className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3 text-muted-foreground" />
                تاريخ ميلاد الوكيل
              </span>
              <p className="text-xs sm:text-sm font-bold text-foreground">
                {owner.agent.birthDate}
              </p>
            </div>

            {/* 3. رقم جوال وكيل المالك */}
            <div className="rounded-xl border border-border/60 bg-card p-2.5 sm:p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1">
                  <Phone className="size-3 text-muted-foreground" />
                  رقم جوال الوكيل
                </span>
                <p className="font-mono text-xs sm:text-sm font-bold text-foreground">
                  <bdi>{owner.agent.phone}</bdi>
                </p>
              </div>
              <CopyButton
                value={owner.agent.phone}
                itemId={`agent-phone-${owner.agent.phone}`}
                label="نسخ جوال الوكيل"
              />
            </div>

            {/* 4. رقم الوكالة */}
            <div className="rounded-xl border border-border/60 bg-card p-2.5 sm:p-3 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1">
                  <FileCheck className="size-3 text-blue-600 dark:text-blue-400" />
                  رقم الوكالة
                </span>
                <p className="font-mono text-xs sm:text-sm font-bold text-foreground">
                  {owner.agent.agencyNumber}
                </p>
              </div>
              <CopyButton
                value={owner.agent.agencyNumber}
                itemId={`agent-poa-${owner.agent.agencyNumber}`}
                label="نسخ رقم الوكالة"
              />
            </div>

            {/* 5. تاريخ الوكالة */}
            <div className="rounded-xl border border-border/60 bg-card p-2.5 sm:p-3 space-y-1">
              <span className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1">
                <Calendar className="size-3 text-muted-foreground" />
                تاريخ الوكالة
              </span>
              <p className="text-xs sm:text-sm font-bold text-foreground">
                {owner.agent.agencyDate}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border/60 bg-muted/15 p-3 flex items-center justify-between text-start flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-6 sm:size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserCheck className="size-3.5 sm:size-4" />
            </span>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-foreground">
                المالك مباشر (لا يوجد وكيل مضاف)
              </p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                يتم إبرام وتوثيق كافة العقود والعمليات مع المالك الأصيل مباشرة
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] text-muted-foreground">
            وكيل: لا
          </Badge>
        </div>
      )}

      {/* 4. SECTION: الحساب المسجل لحفظ العقار (Account who saved/created the property) */}
      <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-card p-3 sm:p-4 space-y-3 text-start shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-border/60 pb-2.5">
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <h4 className="text-xs sm:text-sm font-bold text-foreground">
              الحساب المسجل والمشرف على العقار
            </h4>
          </div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground">
            الحساب الذي قام بحفظ وتسجيل العقار على المنصة
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          {/* Creator Profile with Verification Checkmark Badge on PP */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative shrink-0">
              <Avatar className="size-10 sm:size-11 border-2 border-border bg-muted text-foreground font-bold text-xs sm:text-sm shadow-xs">
                <AvatarFallback className="bg-muted text-foreground font-bold">
                  {creatorInitials || "م"}
                </AvatarFallback>
              </Avatar>
              {creator.isVerified && (
                <span
                  className="absolute -bottom-1 -start-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs ring-2 ring-card pointer-events-none"
                  aria-label="حساب موثق"
                  title="حساب موثق"
                >
                  <CheckCircle2 className="size-2.5" />
                </span>
              )}
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <p className="font-bold text-xs sm:text-sm text-foreground">
                  {creator.name}
                </p>
                {creator.roleLabel && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium px-1.5 py-0 border-border bg-muted/50 text-muted-foreground"
                  >
                    {creator.roleLabel}
                  </Badge>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>حساب موثق ونشط</span>
              </p>
            </div>
          </div>

          {/* Actions & Contact Details */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Phone */}
            <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted/30 px-2.5 py-1 text-xs">
              <Phone className="size-3 text-muted-foreground" />
              <span className="font-mono font-bold text-foreground text-[11px] sm:text-xs">
                <bdi>{creator.phone}</bdi>
              </span>
              <CopyButton
                value={creator.phone}
                itemId={`creator-phone-${creator.id}`}
                label="نسخ جوال الحساب"
                className="size-5"
              />
            </div>

            {/* Email with copy button only */}
            {creator.email && (
              <div className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted/30 px-2.5 py-1 text-xs">
                <Mail className="size-3 text-muted-foreground" />
                <span className="font-medium text-foreground max-w-[130px] sm:max-w-[160px] truncate text-[11px] sm:text-xs">
                  {creator.email}
                </span>
                <CopyButton
                  value={creator.email}
                  itemId={`creator-email-${creator.id}`}
                  label="نسخ البريد الإلكتروني"
                  className="size-5"
                />
              </div>
            )}

            {/* Navigate to User Details Page */}
            <Link
              to={`/users/${creator.id}`}
              viewTransition
              className="inline-flex h-8 sm:h-8.5 items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2.5 sm:px-3 text-xs font-semibold text-foreground hover:bg-muted transition-colors active:scale-98 cursor-pointer shadow-2xs"
            >
              <User className="size-3.5 text-primary" />
              <span>الملف</span>
              <ArrowLeft className="size-3 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
