import { useState } from "react";
import { toast } from "sonner";
import { Percent, Plus, Receipt, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import { useUrlTab } from "@/hooks/use-url-tab";
import {
  INITIAL_TAX_SETTINGS,
  TAXES_METADATA,
  type TaxSetting,
} from "@/features/taxes/constants";
import InvoicePreviewCard from "@/features/taxes/components/invoice-preview-card";
import TaxRuleDialog from "@/features/taxes/components/tax-rule-dialog";
import TaxRulesTable from "@/features/taxes/components/tax-rules-table";

const TAXES_TABS = ["overview", "simulator"] as const;
type TaxesTab = (typeof TAXES_TABS)[number];

export default function TaxesSection() {
  const [activeTab, setActiveTab] = useUrlTab<TaxesTab>({
    paramKey: "tab",
    defaultValue: "overview",
    validValues: TAXES_TABS,
  });

  // Dialog state for adding/editing taxes
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingTax, setEditingTax] = useState<TaxSetting | null>(null);

  const [taxes, setTaxes] = useState<TaxSetting[]>([...INITIAL_TAX_SETTINGS]);

  const handleOpenAddTax = () => {
    setEditingTax(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditTax = (tax: TaxSetting) => {
    setEditingTax(tax);
    setIsDialogOpen(true);
  };

  const handleSaveTax = (
    taxData: Partial<TaxSetting>,
    id?: string,
  ) => {
    if (id) {
      setTaxes((prev) =>
        prev.map((t) =>
          t.id === id
            ? ({
                ...t,
                ...taxData,
              } as TaxSetting)
            : t,
        ),
      );
      toast.success("تم تحديث بند الضريبة بنجاح");
    } else {
      const newTax: TaxSetting = {
        id: `tax_${Date.now()}`,
        nameAr: taxData.nameAr || "ضريبة جديدة",
        category: taxData.category || "custom",
        description: taxData.description || "",
        ratePercent: Number(taxData.ratePercent) || 0,
        isExempt: !!taxData.isExempt,
        exemptionLabel: taxData.exemptionLabel || "معفى",
        appliesTo: taxData.appliesTo || "all",
        calculationType: taxData.calculationType || "percentage",
        fixedAmount: Number(taxData.fixedAmount) || 0,
        isActive: taxData.isActive !== false,
        order: taxes.length + 1,
      };
      setTaxes((prev) => [...prev, newTax]);
      toast.success("تمت إضافة بند ضريبي جديد بنجاح");
    }
  };

  const handleResetTaxes = () => {
    if (
      window.confirm(
        "هل ترغب بإعادة تعيين القواعد والنسب الضريبية إلى الإعدادات الافتراضية؟",
      )
    ) {
      setTaxes([...INITIAL_TAX_SETTINGS]);
      toast.success("تمت استعادة الإعدادات والنسب الضريبية الافتراضية بنجاح");
    }
  };

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
            <div className="flex w-full sm:w-auto items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetTaxes}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>استعادة الافتراضي</span>
              </Button>
              <Button
                onClick={handleOpenAddTax}
                size="sm"
                className="gap-1.5 cursor-pointer font-bold shadow-xs shrink-0"
              >
                <Plus className="size-4" />
                <span>إضافة ضريبة / رسم</span>
              </Button>
            </div>
          }
        />
      </FadeIn>

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
              onTaxesChange={setTaxes}
              onEdit={handleOpenEditTax}
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
        onSave={handleSaveTax}
      />
    </div>
  );
}
