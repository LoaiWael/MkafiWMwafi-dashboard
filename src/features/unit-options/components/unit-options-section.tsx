import { Home, Layers, ListOrdered, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import FloorsTab from "./floors-tab";
import UnitAmenitiesTab from "./unit-amenities-tab";
import UnitTypesTab from "./unit-types-tab";
import { useFloors } from "../hooks/use-floors";
import { useUnitAmenities } from "../hooks/use-unit-amenities";
import { useUnitTypes } from "../hooks/use-unit-types";
import { useUrlTab } from "@/hooks/use-url-tab";

const UNIT_OPTIONS_TABS = [
  "unit-types",
  "unit-amenities",
  "floors",
] as const;
type UnitOptionsTab = (typeof UNIT_OPTIONS_TABS)[number];

export default function UnitOptionsSection() {
  const [activeTab, setActiveTab] = useUrlTab<UnitOptionsTab>({
    paramKey: "tab",
    defaultValue: "unit-types",
    validValues: UNIT_OPTIONS_TABS,
  });

  const unitTypesController = useUnitTypes();
  const unitAmenitiesController = useUnitAmenities();
  const floorsController = useFloors();

  const filterTabs: FilterTabItem<UnitOptionsTab>[] = [
    {
      id: "unit-types",
      label: "أنواع الوحدات",
      icon: Home,
      count: unitTypesController.items.length,
    },
    {
      id: "unit-amenities",
      label: "مرافق ومميزات الوحدات",
      icon: Layers,
      count: unitAmenitiesController.items.length,
    },
    {
      id: "floors",
      label: "الأدوار والطوابق",
      icon: ListOrdered,
      count: floorsController.items.length,
    },
  ];

  return (
    <div className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-8">
      <FadeIn duration={0.3}>
        <PageHeader
          title="تخصيص بيانات وقوائم الوحدات"
          description="إدارة وتعديل وإضافة الخيارات المنسدلة للوحدات (الأنواع، المرافق، والأدوار) المرتبطة مباشرة بنظام عقود الإيجار."
          actions={
            <div className="flex w-full sm:w-auto items-center gap-2">
              {activeTab === "unit-types" && (
                <Button
                  onClick={unitTypesController.openAdd}
                  size="sm"
                  className="gap-1.5 cursor-pointer font-bold shadow-xs shrink-0"
                >
                  <Plus className="size-4" />
                  <span>إضافة نوع وحدة</span>
                </Button>
              )}

              {activeTab === "unit-amenities" && (
                <Button
                  onClick={unitAmenitiesController.openAdd}
                  size="sm"
                  className="gap-1.5 cursor-pointer font-bold shadow-xs shrink-0"
                >
                  <Plus className="size-4" />
                  <span>إضافة مرفق وحدة</span>
                </Button>
              )}

              {activeTab === "floors" && (
                <Button
                  onClick={floorsController.openAdd}
                  size="sm"
                  className="gap-1.5 cursor-pointer font-bold shadow-xs shrink-0"
                >
                  <Plus className="size-4" />
                  <span>إضافة دور / طابق</span>
                </Button>
              )}
            </div>
          }
        />
      </FadeIn>

      <FadeIn duration={0.3} delay={0.06}>
        <FilterTabs
          items={filterTabs}
          value={activeTab}
          onValueChange={setActiveTab}
          layout="auto"
          gridColsClass="sm:grid-cols-3"
          className="w-full md:w-fit max-w-full"
          ariaLabel="تبويبات خيارات الوحدات"
          idPrefix="unit-options-tab"
        />
      </FadeIn>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`unit-options-tab-${activeTab}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {activeTab === "unit-types" ? (
            <UnitTypesTab controller={unitTypesController} />
          ) : null}
          {activeTab === "unit-amenities" ? (
            <UnitAmenitiesTab controller={unitAmenitiesController} />
          ) : null}
          {activeTab === "floors" ? (
            <FloorsTab controller={floorsController} />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
