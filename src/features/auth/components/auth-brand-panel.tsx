import {
  CheckCircle2,
  FileCheck2,
  LockKeyhole,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { SITE } from "@/lib/constants";

const BADGES = [
  { label: "شبكة إيجار", desc: "ربط معتمد ومباشر" },
  { label: "الهيئة العامة للعقار", desc: "ترخيص وتوثيق رسمي" },
  { label: "المركز السعودي للأعمال", desc: "اعتماد المنشآت" },
] as const;

const HIGHLIGHTS = [
  {
    icon: FileCheck2,
    title: "توثيق فوري ومعتمد للعقود",
    description: "إصدار وإدارة العقود السكنية والتجارية المتوافقة مع حساب المواطن والضمان الاجتماعي.",
  },
  {
    icon: LockKeyhole,
    title: "أمان ومطابقة حكومية صارمة",
    description: "تشفير بيانات متقدم وحماية للعمليات المالية والهويات الرسمية.",
  },
  {
    icon: TrendingUp,
    title: "لوحة تحكم ذكية للعمليات",
    description: "متابعة شاملة للمدفوعات، العملاء، العقارات، والتقارير في واجهة واحدة متكاملة.",
  },
] as const;

export default function AuthBrandPanel() {
  return (
    <div className="relative hidden h-full w-full flex-col justify-between overflow-hidden rounded-3xl bg-primary-950 p-8 text-primary-foreground lg:flex xl:p-12">
      {/* Decorative ambient gradients */}
      <div className="pointer-events-none absolute -top-24 -end-24 size-96 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -start-24 size-96 rounded-full bg-tertiary-500/15 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 start-1/3 size-64 -translate-y-1/2 rounded-full bg-secondary-500/10 blur-3xl" />

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Header section */}
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 p-2 backdrop-blur-md ring-1 ring-white/20">
            <img
              src={SITE.logo}
              alt={SITE.name}
              className="size-full object-contain brightness-0 invert"
            />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              {SITE.name}
            </span>
            <span className="block text-xs font-medium text-primary-200/80">
              لوحة تحكم الإدارة والعمليات
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-900/60 px-3.5 py-1 text-xs font-semibold text-primary-200 backdrop-blur-md">
            <Sparkles className="size-3.5 text-secondary-400" />
            <span>المنصة المعتمدة لتوثيق العقود الإيجارية</span>
          </div>
          <h2 className="text-2xl font-bold leading-tight text-white xl:text-3xl">
            إدارة وتوثيق العقود بكل سهولة وموثوقية
          </h2>
          <p className="text-sm leading-relaxed text-primary-100/75">
            بوابة الإدارة المركزية لمتابعة وتوثيق عقود الإيجار السكنية والتجارية
            المتصلة بشبكة إيجار والجهات التنظيمية الرسمية في المملكة.
          </p>
        </div>
      </div>

      {/* Highlights section */}
      <div className="relative z-10 my-8 space-y-4">
        {HIGHLIGHTS.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-800/80 text-primary-200">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <h3 className="text-sm font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-primary-100/70">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer certifications */}
      <div className="relative z-10 space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary-200">
          <CheckCircle2 className="size-4 text-tertiary-400" />
          <span>اعتمادات وتكاملات المنصة الرسمية</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {BADGES.map((b, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-center backdrop-blur-sm"
            >
              <p className="text-xs font-bold text-white">{b.label}</p>
              <p className="text-[10px] text-primary-200/70">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
