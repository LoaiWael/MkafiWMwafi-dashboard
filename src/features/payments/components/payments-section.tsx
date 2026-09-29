import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreditCard, Wallet } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import PageHeader from "@/components/layout/page-header";
import { FadeIn } from "@/components/animations";
import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import { useUrlTab } from "@/hooks/use-url-tab";
import {
  INITIAL_PAYMENT_FREQUENCIES,
  INITIAL_PAYMENT_METHODS,
  PAYMENTS_METADATA,
  PAYMENTS_STORAGE_KEYS,
  type PaymentFrequencyOption,
  type PaymentMethodOption,
} from "@/features/payments/constants";
import PaymentFrequenciesTable from "@/features/payments/components/payment-frequencies-table";
import PaymentMethodsTable from "@/features/payments/components/payment-methods-table";

const PAYMENTS_TABS = ["frequencies", "methods"] as const;
type PaymentsTab = (typeof PAYMENTS_TABS)[number];

export default function PaymentsSection() {
  const [activeTab, setActiveTab] = useUrlTab<PaymentsTab>({
    paramKey: "tab",
    defaultValue: "frequencies",
    validValues: PAYMENTS_TABS,
  });

  // Load from localStorage or defaults
  const [frequencies, setFrequencies] = useState<PaymentFrequencyOption[]>(
    () => {
      const saved = localStorage.getItem(PAYMENTS_STORAGE_KEYS.frequencies);
      return saved ? JSON.parse(saved) : [...INITIAL_PAYMENT_FREQUENCIES];
    },
  );

  const [methods, setMethods] = useState<PaymentMethodOption[]>(() => {
    const saved = localStorage.getItem(PAYMENTS_STORAGE_KEYS.methods);
    return saved ? JSON.parse(saved) : [...INITIAL_PAYMENT_METHODS];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      PAYMENTS_STORAGE_KEYS.frequencies,
      JSON.stringify(frequencies),
    );
  }, [frequencies]);

  useEffect(() => {
    localStorage.setItem(
      PAYMENTS_STORAGE_KEYS.methods,
      JSON.stringify(methods),
    );
  }, [methods]);

  const handleResetDefaults = () => {
    if (
      window.confirm(
        "هل ترغب بإعادة تعيين خيارات الدفع والبيانات المالية إلى الافتراضي؟",
      )
    ) {
      setFrequencies([...INITIAL_PAYMENT_FREQUENCIES]);
      setMethods([...INITIAL_PAYMENT_METHODS]);
      localStorage.removeItem(PAYMENTS_STORAGE_KEYS.frequencies);
      localStorage.removeItem(PAYMENTS_STORAGE_KEYS.methods);
      toast.success(
        "تمت استعادة خيارات الدفع والبيانات المالية الافتراضية بنجاح",
      );
    }
  };

  const filterTabs: FilterTabItem<PaymentsTab>[] = [
    {
      id: "frequencies",
      label: "طريقة وتكرار الدفعات",
      icon: Wallet,
      count: frequencies.length,
    },
    {
      id: "methods",
      label: "قنوات وطرق السداد",
      icon: CreditCard,
      count: methods.length,
    },
  ];

  return (
    <div className="page-shell space-y-4 sm:space-y-6 py-4 sm:py-8">
      <FadeIn duration={0.3}>
        <PageHeader
          title={PAYMENTS_METADATA.title}
          description={PAYMENTS_METADATA.description}
        />
      </FadeIn>

      {/* Filter Tabs Navigation */}
      <FadeIn duration={0.3} delay={0.04}>
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <FilterTabs
            items={filterTabs}
            value={activeTab}
            onValueChange={setActiveTab}
            layout="scroll"
            className="w-full sm:w-auto"
            ariaLabel="تبويبات خيارات الدفع"
            idPrefix="payments-tab"
          />
        </div>
      </FadeIn>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === "frequencies" ? (
          <motion.div
            key="frequencies"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <PaymentFrequenciesTable
              frequencies={frequencies}
              onFrequenciesChange={setFrequencies}
              onResetDefaults={handleResetDefaults}
            />
          </motion.div>
        ) : (
          <motion.div
            key="methods"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <PaymentMethodsTable
              methods={methods}
              onMethodsChange={setMethods}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
