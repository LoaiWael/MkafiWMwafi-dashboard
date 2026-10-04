import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, ReceiptText, RotateCcw, Wallet } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import PageHeader from "@/components/layout/page-header";
import { FadeIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import { useUrlTab } from "@/hooks/use-url-tab";
import {
  INITIAL_PAYMENT_FREQUENCIES,
  MOCK_PAYMENT_REPORTS,
  PAYMENTS_METADATA,
  PAYMENTS_STORAGE_KEYS,
  type PaymentFrequencyOption,
  type PaymentReportRecord,
} from "@/features/payments/constants";
import PaymentFrequenciesTable from "@/features/payments/components/payment-frequencies-table";
import PaymentFrequencyDialog from "@/features/payments/components/payment-frequency-dialog";
import PaymentReportsTable from "@/features/payments/components/payment-reports-table";

const PAYMENTS_TABS = ["reports", "frequencies"] as const;
type PaymentsTab = (typeof PAYMENTS_TABS)[number];

export default function PaymentsSection() {
  const [activeTab, setActiveTab] = useUrlTab<PaymentsTab>({
    paramKey: "tab",
    defaultValue: "reports",
    clearDefaultFromUrl: true,
    validValues: PAYMENTS_TABS,
  });

  // Dialog state for adding/editing payment frequencies
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingFrequency, setEditingFrequency] =
    useState<PaymentFrequencyOption | null>(null);

  // Load frequencies from localStorage or defaults
  const [frequencies, setFrequencies] = useState<PaymentFrequencyOption[]>(
    () => {
      const saved = localStorage.getItem(PAYMENTS_STORAGE_KEYS.frequencies);
      return saved ? JSON.parse(saved) : [...INITIAL_PAYMENT_FREQUENCIES];
    },
  );

  // Load payment reports from localStorage or defaults
  const [reports, setReports] = useState<PaymentReportRecord[]>(() => {
    const saved = localStorage.getItem(PAYMENTS_STORAGE_KEYS.reports);
    return saved ? JSON.parse(saved) : [...MOCK_PAYMENT_REPORTS];
  });

  // Save frequencies to localStorage
  useEffect(() => {
    localStorage.setItem(
      PAYMENTS_STORAGE_KEYS.frequencies,
      JSON.stringify(frequencies),
    );
  }, [frequencies]);

  // Save reports to localStorage
  useEffect(() => {
    localStorage.setItem(
      PAYMENTS_STORAGE_KEYS.reports,
      JSON.stringify(reports),
    );
  }, [reports]);

  const handleOpenAddFrequency = () => {
    setEditingFrequency(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditFrequency = (item: PaymentFrequencyOption) => {
    setEditingFrequency(item);
    setIsDialogOpen(true);
  };

  const handleSaveFrequency = (
    data: Omit<PaymentFrequencyOption, "id">,
    id?: string,
  ) => {
    if (id) {
      setFrequencies((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...data } : f)),
      );
      toast.success("تم تحديث دورية الدفع بنجاح");
    } else {
      const newItem: PaymentFrequencyOption = {
        id: `freq_${Date.now()}`,
        ...data,
      };
      setFrequencies((prev) => [...prev, newItem]);
      toast.success("تمت إضافة دورية دفع جديدة بنجاح");
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        "هل ترغب بإعادة تعيين البيانات وسجلات المدفوعات إلى الافتراضي؟",
      )
    ) {
      setFrequencies([...INITIAL_PAYMENT_FREQUENCIES]);
      setReports([...MOCK_PAYMENT_REPORTS]);
      localStorage.removeItem(PAYMENTS_STORAGE_KEYS.frequencies);
      localStorage.removeItem(PAYMENTS_STORAGE_KEYS.reports);
      toast.success(
        "تمت استعادة خيارات وسجلات المدفوعات الافتراضية بنجاح",
      );
    }
  };

  const filterTabs: FilterTabItem<PaymentsTab>[] = [
    {
      id: "reports",
      label: "سجل وتقارير المدفوعات",
      icon: ReceiptText,
      count: reports.length,
    },
    {
      id: "frequencies",
      label: "طريقة وتكرار الدفعات",
      icon: Wallet,
      count: frequencies.length,
    },
  ];

  return (
    <div className="page-shell space-y-4 sm:space-y-6 py-4 sm:py-8">
      <FadeIn duration={0.3}>
        <PageHeader
          title={PAYMENTS_METADATA.title}
          description={PAYMENTS_METADATA.description}
          actions={
            <div className="flex w-full sm:w-auto items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetDefaults}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>استعادة الافتراضي</span>
              </Button>
              {activeTab === "frequencies" && (
                <Button
                  onClick={handleOpenAddFrequency}
                  size="sm"
                  className="gap-1.5 cursor-pointer font-bold shadow-xs shrink-0"
                >
                  <Plus className="size-4" />
                  <span>إضافة طريقة دفعات</span>
                </Button>
              )}
            </div>
          }
        />
      </FadeIn>

      {/* Main Section Navigation Tabs */}
      <FadeIn duration={0.3} delay={0.04}>
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          <FilterTabs
            items={filterTabs}
            value={activeTab}
            onValueChange={setActiveTab}
            layout="scroll"
            className="w-full sm:w-auto"
            ariaLabel="تبويبات إدارة وسجلات المدفوعات"
            idPrefix="payments-main-tab"
          />
        </div>
      </FadeIn>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === "reports" ? (
          <motion.div
            key="reports"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <PaymentReportsTable
              reports={reports}
              onReportsChange={setReports}
            />
          </motion.div>
        ) : (
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
              onEdit={handleOpenEditFrequency}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add / Edit Frequency Dialog */}
      <PaymentFrequencyDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        frequency={editingFrequency}
        onSave={handleSaveFrequency}
      />
    </div>
  );
}
