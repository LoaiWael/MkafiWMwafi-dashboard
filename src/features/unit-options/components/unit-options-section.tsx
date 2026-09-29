import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Building, Home, ListOrdered, SlidersHorizontal } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { AnimatedPanel } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
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
import { useUrlTab } from "@/hooks/use-url-tab";

const UNIT_OPTIONS_TABS = [
  "unit-types",
  "property-types",
  "floors",
  "amenities",
] as const;
type UnitOptionsTab = (typeof UNIT_OPTIONS_TABS)[number];

const STORAGE_KEYS = {
  unitTypes: "makfiwamufi.unit-options.unit-types",
  propertyTypes: "makfiwamufi.unit-options.property-types",
  floors: "makfiwamufi.unit-options.floors",
  amenities: "makfiwamufi.unit-options.amenities",
};

export default function UnitOptionsSection() {
  const [activeTab, setActiveTab] = useUrlTab<UnitOptionsTab>({
    paramKey: "tab",
    defaultValue: "unit-types",
    validValues: UNIT_OPTIONS_TABS,
  });

  const [unitTypes, setUnitTypes] = useState<OptionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.unitTypes);
    return saved ? JSON.parse(saved) : INITIAL_UNIT_TYPES;
  });

  const [propertyTypes, setPropertyTypes] = useState<OptionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.propertyTypes);
    return saved ? JSON.parse(saved) : INITIAL_PROPERTY_TYPES;
  });

  const [floors, setFloors] = useState<OptionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.floors);
    return saved ? JSON.parse(saved) : INITIAL_FLOOR_OPTIONS;
  });

  const [amenities, setAmenities] = useState<AmenityCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.amenities);
    return saved ? JSON.parse(saved) : INITIAL_AMENITIES_CONFIG;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.unitTypes, JSON.stringify(unitTypes));
  }, [unitTypes]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.propertyTypes,
      JSON.stringify(propertyTypes),
    );
  }, [propertyTypes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.floors, JSON.stringify(floors));
  }, [floors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.amenities, JSON.stringify(amenities));
  }, [amenities]);

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
      localStorage.removeItem(STORAGE_KEYS.unitTypes);
      localStorage.removeItem(STORAGE_KEYS.propertyTypes);
      localStorage.removeItem(STORAGE_KEYS.floors);
      localStorage.removeItem(STORAGE_KEYS.amenities);
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
      <PageHeader
        title="تخصيص بيانات وقوائم الوحدات"
        description="إدارة وتعديل وإضافة الخيارات المنسدلة التي تظهر للمستخدمين عند تسجيل الوحدات في الموقع الرئيسي."
      />

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

      <AnimatePresence mode="wait" initial={false}>
        <AnimatedPanel
          key={activeTab}
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`unit-options-tab-${activeTab}`}
        >
          {activeTab === "unit-types" ? (
            <UnitTypesTab
              items={unitTypes}
              onItemsChange={setUnitTypes}
              onResetDefaults={handleResetDefaults}
            />
          ) : null}
          {activeTab === "property-types" ? (
            <PropertyTypesTab
              items={propertyTypes}
              onItemsChange={setPropertyTypes}
              onResetDefaults={handleResetDefaults}
            />
          ) : null}
          {activeTab === "floors" ? (
            <FloorsTab
              items={floors}
              onItemsChange={setFloors}
              onResetDefaults={handleResetDefaults}
            />
          ) : null}
          {activeTab === "amenities" ? (
            <AmenitiesTab
              amenities={amenities}
              onAmenitiesChange={setAmenities}
              onResetDefaults={handleResetDefaults}
            />
          ) : null}
        </AnimatedPanel>
      </AnimatePresence>
    </div>
  );
}
