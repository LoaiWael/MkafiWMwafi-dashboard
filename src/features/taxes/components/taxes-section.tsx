import { AlertCircle, Percent, Plus, Receipt } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import { useUrlTab } from "@/hooks/use-url-tab";
import { TAXES_METADATA } from "@/features/taxes/constants";
import InvoicePreviewCard from "@/features/taxes/components/invoice-preview-card";
import TaxRuleDialog from "@/features/taxes/components/tax-rule-dialog";
import TaxRulesTable from "@/features/taxes/components/tax-rules-table";
import { useTaxRules } from "@/features/taxes/hooks/use-tax-rules";

const TAXES_TABS = ["overview", "simulator"] as const;
type TaxesTab = (typeof TAXES_TABS)[number];

export default function TaxesSection() {
  const [activeTab, setActiveTab] = useUrlTab<TaxesTab>({
    paramKey: "tab",
    defaultValue: "overview",
    validValues: TAXES_TABS,
  });

  const {
    taxes,
    isLoading,
    isSaving,
    error,
    refetch,
    isDialogOpen,
    setIsDialogOpen,
    editingTax,
    openAdd,
    openEdit,
    saveRule,
    toggleActive,
    deleteRule,
  } = useTaxRules();

  const filterTabs: FilterTabItem<TaxesTab>[] = [
    {
      id: "overview",
      label: "إدارة الضرائب",
      icon: Percent,
    },
    {
      id: "simulator",
      label: "محاكي الفواتير",
      icon: Receipt,
    },
  ];

  return (
    <div className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-8">
      <FadeIn duration={0.3}>
        <PageHeader
          title={TAXES_METADATA.title}
          description={TAXES_METADATA.description}
          actions={
            <Button
              onClick={openAdd}
              size="sm"
              className="gap-1.5 cursor-pointer font-bold shadow-xs shrink-0"
            >
              <Plus className="size-4" />
              <span>إضافة ضريبة / رسم</span>
            </Button>
          }
        />
      </FadeIn>

      {/* API Error Notification if fetch failed completely and no rules */}
      {error && taxes.length === 0 && (
        <FadeIn duration={0.3}>
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 flex items-center justify-between gap-3 text-destructive text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>فشل تحميل القواعد الضريبية من الخادم. يرجى إعادة المحاولة.</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/15 cursor-pointer"
            >
              إعادة المحاولة
            </Button>
          </div>
        </FadeIn>
      )}

      {/* Filter Tabs */}
      <FadeIn duration={0.3} delay={0.06}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterTabs
            items={filterTabs}
            value={activeTab}
            onValueChange={setActiveTab}
            layout="grid"
            gridColsClass="grid-cols-2"
            className="w-full sm:w-auto sm:min-w-96"
            ariaLabel="تبويبات الضرائب"
            idPrefix="taxes-tab"
          />
        </div>
      </FadeIn>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="space-y-6"
        >
          {activeTab === "overview" ? (
            <TaxRulesTable
              taxes={taxes}
              isLoading={isLoading}
              onToggleActive={toggleActive}
              onEdit={openEdit}
              onDelete={deleteRule}
            />
          ) : (
            <div className="mx-auto max-w-3xl">
              <InvoicePreviewCard taxes={taxes} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Add / Edit Tax Dialog */}
      <TaxRuleDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        tax={editingTax}
        onSave={saveRule}
        isSaving={isSaving}
      />
    </div>
  );
}
