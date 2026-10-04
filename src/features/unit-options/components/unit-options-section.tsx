import { useState } from "react";
import { toast } from "sonner";
import {
  Building,
  Home,
  ListOrdered,
  Plus,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import AmenitiesTab from "@/features/unit-options/components/amenities-tab";
import FloorsTab from "@/features/unit-options/components/floors-tab";
import PropertyTypesTab from "@/features/unit-options/components/property-types-tab";
import UnitTypesTab from "@/features/unit-options/components/unit-types-tab";
import {
  INITIAL_AMENITIES_CONFIG,
  INITIAL_FLOOR_OPTIONS,
  INITIAL_PROPERTY_TYPES,
  INITIAL_UNIT_TYPES,
  type AmenityCategory,
  type OptionItem,
} from "@/features/unit-options/constants";
import { useOptionItemEditor } from "@/features/unit-options/hooks/use-option-item-editor";
import { useUrlTab } from "@/hooks/use-url-tab";

const UNIT_OPTIONS_TABS = [
  "unit-types",
  "property-types",
  "floors",
  "amenities",
] as const;
type UnitOptionsTab = (typeof UNIT_OPTIONS_TABS)[number];

export default function UnitOptionsSection() {
  const [activeTab, setActiveTab] = useUrlTab<UnitOptionsTab>({
    paramKey: "tab",
    defaultValue: "unit-types",
    validValues: UNIT_OPTIONS_TABS,
  });

  const [unitTypes, setUnitTypes] = useState<OptionItem[]>(INITIAL_UNIT_TYPES);
  const [propertyTypes, setPropertyTypes] = useState<OptionItem[]>(INITIAL_PROPERTY_TYPES);
  const [floors, setFloors] = useState<OptionItem[]>(INITIAL_FLOOR_OPTIONS);
  const [amenities, setAmenities] = useState<AmenityCategory[]>(INITIAL_AMENITIES_CONFIG);

  // Editors for the option item tabs
  const unitTypesEditor = useOptionItemEditor({
    defaultCategory: "سكني",
    onItemsChange: setUnitTypes,
  });

  const propertyTypesEditor = useOptionItemEditor({
    defaultCategory: "تجاري",
    onItemsChange: setPropertyTypes,
  });

  const floorsEditor = useOptionItemEditor({
    defaultCategory: "سكني",
    onItemsChange: setFloors,
  });

  function handleResetDefaults() {
    if (
      window.confirm(
        "هل ترغب بإعادة تعيين كافة خيارات الوحدات إلى البيانات الافتراضية؟",
      )
    ) {
      setUnitTypes(INITIAL_UNIT_TYPES);
      setPropertyTypes(INITIAL_PROPERTY_TYPES);
      setFloors(INITIAL_FLOOR_OPTIONS);
      setAmenities(INITIAL_AMENITIES_CONFIG);
      toast.success("تمت استعادة خيارات الوحدات الافتراضية بنجاح");
    }
  }

  const filterTabs: FilterTabItem<UnitOptionsTab>[] = [
    {
      id: "unit-types",
      label: "أنواع الوحدات",
      icon: Home,
      count: unitTypes.length,
    },
    {
      id: "property-types",
      label: "أنواع المباني",
      icon: Building,
      count: propertyTypes.length,
    },
    {
      id: "floors",
      label: "الأدوار والطوابق",
      icon: ListOrdered,
      count: floors.length,
    },
    {
      id: "amenities",
      label: "المرافق والتجهيزات",
      icon: SlidersHorizontal,
      count: amenities.length,
    },
  ];

  return (
    <div className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-8">
      <FadeIn duration={0.3}>
        <PageHeader
          title="تخصيص بيانات وقوائم الوحدات"
          description="إدارة وتعديل وإضافة الخيارات المنسدلة التي تظهر للمستخدمين عند تسجيل الوحدات في الموقع الرئيسي."
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
              {activeTab === "unit-types" && (
                <Button
                  onClick={unitTypesEditor.openAdd}
                  size="sm"
                  className="gap-1.5 cursor-pointer font-bold shadow-xs shrink-0"
                >
                  <Plus className="size-4" />
                  <span>إضافة نوع وحدة</span>
                </Button>
              )}
              {activeTab === "property-types" && (
                <Button
                  onClick={propertyTypesEditor.openAdd}
                  size="sm"
                  className="gap-1.5 cursor-pointer font-bold shadow-xs shrink-0"
                >
                  <Plus className="size-4" />
                  <span>إضافة نوع مبنى</span>
                </Button>
              )}
              {activeTab === "floors" && (
                <Button
                  onClick={floorsEditor.openAdd}
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
          gridColsClass="sm:grid-cols-2 md:grid-cols-4"
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
            <UnitTypesTab items={unitTypes} editor={unitTypesEditor} />
          ) : null}
          {activeTab === "property-types" ? (
            <PropertyTypesTab
              items={propertyTypes}
              editor={propertyTypesEditor}
            />
          ) : null}
          {activeTab === "floors" ? (
            <FloorsTab items={floors} editor={floorsEditor} />
          ) : null}
          {activeTab === "amenities" ? (
            <AmenitiesTab
              amenities={amenities}
              onAmenitiesChange={setAmenities}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
