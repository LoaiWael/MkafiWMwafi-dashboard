import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Percent, Receipt } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { AnimatedPanel } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import { useUrlTab } from "@/hooks/use-url-tab";
import {
  INITIAL_TAX_SETTINGS,
  TAX_STORAGE_KEYS,
  TAXES_METADATA,
  type TaxSetting,
} from "@/features/taxes/constants";
import InvoicePreviewCard from "@/features/taxes/components/invoice-preview-card";
import TaxRulesTable from "@/features/taxes/components/tax-rules-table";

const TAXES_TABS = ["overview", "simulator"] as const;
type TaxesTab = (typeof TAXES_TABS)[number];

export default function TaxesSection() {
  const [activeTab, setActiveTab] = useUrlTab<TaxesTab>({
    paramKey: "tab",
    defaultValue: "overview",
    validValues: TAXES_TABS,
  });

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
      JSON.stringify(INITIAL_TAX_SETTINGS),
    );
    toast.success("تمت استعادة الإعدادات والنسب الضريبية الافتراضية بنجاح");
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
      <PageHeader
        title={TAXES_METADATA.title}
        description={TAXES_METADATA.description}
      />

      {/* Filter Tabs */}
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

      <AnimatePresence mode="wait" initial={false}>
        <AnimatedPanel key={activeTab} className="space-y-6">
          {activeTab === "overview" ? (
            <TaxRulesTable
              taxes={taxes}
              onTaxesChange={setTaxes}
              onResetDefaults={handleResetTaxes}
            />
          ) : (
            <div className="mx-auto max-w-3xl">
              <InvoicePreviewCard taxes={taxes} />
            </div>
          )}
        </AnimatedPanel>
      </AnimatePresence>
    </div>
  );
}
