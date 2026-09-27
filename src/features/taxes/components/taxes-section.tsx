import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  FileCheck2,
  Home,
  Percent,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  INITIAL_TAX_SETTINGS,
  TAX_STORAGE_KEYS,
  TAXES_METADATA,
  type TaxSetting,
} from "@/features/taxes/constants";
import InvoicePreviewCard from "@/features/taxes/components/invoice-preview-card";
import TaxRulesTable from "@/features/taxes/components/tax-rules-table";

export default function TaxesSection() {
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Load taxes with localStorage persistence
  const [taxes, setTaxes] = useState<TaxSetting[]>(() => {
    const saved = localStorage.getItem(TAX_STORAGE_KEYS.taxes);
    return saved ? JSON.parse(saved) : [...INITIAL_TAX_SETTINGS];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(TAX_STORAGE_KEYS.taxes, JSON.stringify(taxes));
  }, [taxes]);

  const handleResetTaxes = () => {
    setTaxes([...INITIAL_TAX_SETTINGS]);
    localStorage.setItem(
      TAX_STORAGE_KEYS.taxes,
      JSON.stringify(INITIAL_TAX_SETTINGS)
    );
  };

  const vatTax = taxes.find((t) => t.category === "vat" && t.isActive);
  const residentialTax = taxes.find(
    (t) => t.appliesTo === "residential" && t.isActive
  );
  const commercialTax = taxes.find(
    (t) => t.appliesTo === "commercial" && t.isActive
  );

  return (
    <div className="page-shell space-y-6 py-8">
      <PageHeader
        title={TAXES_METADATA.title}
        description={TAXES_METADATA.description}
        badge={
          <Badge variant="secondary" className="gap-1.5 font-medium">
            <Percent className="size-3.5" />
            <span>{TAXES_METADATA.subtitle}</span>
          </Badge>
        }
      />

      {/* Quick Status KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* VAT Rate */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                ضريبة القيمة المضافة
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-foreground">
                  {vatTax ? `${vatTax.ratePercent}%` : "معطلة"}
                </span>
              </div>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <Percent className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Residential Status */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                عقود الإيجار السكني
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-primary">
                  {residentialTax?.isExempt ? "معفى نظامياً" : "خاضع للضريبة"}
                </span>
              </div>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <Home className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Commercial Status */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                عقود الإيجار التجاري
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-foreground">
                  {commercialTax ? `${commercialTax.ratePercent}%` : "0%"}
                </span>
              </div>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <Building2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card className="border-border/80 bg-card shadow-xs">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                حالة الامتثال والربط
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <ShieldCheck className="size-4" />
                <span>إيجار & ZATCA</span>
              </div>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <FileCheck2 className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="overview" className="gap-2">
              <Percent className="size-3.5" />
              <span>إدارة الضرائب والمعاينة المباشرة</span>
            </TabsTrigger>
            <TabsTrigger value="simulator" className="gap-2">
              <Receipt className="size-3.5" />
              <span>حاسبة ومحاكي الفواتير المعتمدة</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileCheck2 className="size-4 text-primary" />
            <span>متوافق مع منصة إيجار وحساب المواطن</span>
          </div>
        </div>

        {/* Tab 1: Management + Side-by-side preview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Tax Rules Table (7 cols) */}
            <div className="lg:col-span-7">
              <TaxRulesTable
                taxes={taxes}
                onTaxesChange={setTaxes}
                onResetDefaults={handleResetTaxes}
              />
            </div>

            {/* Live Invoice Preview (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-6">
                <InvoicePreviewCard taxes={taxes} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Full Simulator */}
        <TabsContent value="simulator" className="space-y-6">
          <div className="mx-auto max-w-3xl">
            <InvoicePreviewCard taxes={taxes} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Notice Banner */}
      <div className="flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary-50/50 p-4 text-center text-sm font-medium text-foreground">
        <Sparkles className="size-4 text-primary shrink-0" />
        <span>{TAXES_METADATA.note}</span>
        <CheckCircle2 className="size-4 text-primary shrink-0" />
      </div>
    </div>
  );
}
