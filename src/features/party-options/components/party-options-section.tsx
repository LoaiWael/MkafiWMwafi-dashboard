import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MountFade } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import PartyOptionsTable from "@/features/party-options/components/party-options-table";
import {
  INITIAL_PARTY_CAPACITIES,
  PARTY_OPTIONS_METADATA,
  PARTY_OPTIONS_STORAGE_KEY,
  type OptionItem,
} from "@/features/party-options/constants";

function readStoredCapacities(): OptionItem[] {
  const saved = localStorage.getItem(PARTY_OPTIONS_STORAGE_KEY);
  if (!saved) return [...INITIAL_PARTY_CAPACITIES];

  try {
    const parsed = JSON.parse(saved) as OptionItem[];
    return Array.isArray(parsed) ? parsed : [...INITIAL_PARTY_CAPACITIES];
  } catch {
    return [...INITIAL_PARTY_CAPACITIES];
  }
}

export default function PartyOptionsSection() {
  const [capacities, setCapacities] = useState<OptionItem[]>(readStoredCapacities);

  useEffect(() => {
    localStorage.setItem(
      PARTY_OPTIONS_STORAGE_KEY,
      JSON.stringify(capacities),
    );
  }, [capacities]);

  function handleResetDefaults() {
    if (
      window.confirm(
        "هل ترغب بإعادة تعيين صفة المستأجر والمؤجر إلى البيانات الافتراضية؟",
      )
    ) {
      setCapacities([...INITIAL_PARTY_CAPACITIES]);
      localStorage.removeItem(PARTY_OPTIONS_STORAGE_KEY);
      toast.success("تمت استعادة صفة أطراف العقد الافتراضية بنجاح");
    }
  }

  return (
    <div className="page-shell space-y-6 py-8">
      <PageHeader
        title={PARTY_OPTIONS_METADATA.title}
        description={PARTY_OPTIONS_METADATA.description}
      />
      <MountFade>
        <PartyOptionsTable
          items={capacities}
          onItemsChange={setCapacities}
          onResetDefaults={handleResetDefaults}
        />
      </MountFade>
    </div>
  );
}
