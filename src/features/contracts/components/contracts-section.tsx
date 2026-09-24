import { FileText } from "lucide-react";
import { useSearchParams } from "react-router";
import FeaturePage from "@/components/layout/feature-page";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CONTRACT_TYPE_PARAM,
  CONTRACT_TYPE_TABS,
  parseContractType,
} from "@/features/contracts/constants";

export default function ContractsSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeType = parseContractType(searchParams.get(CONTRACT_TYPE_PARAM));
  const activeTab =
    CONTRACT_TYPE_TABS.find((tab) => tab.value === activeType) ??
    CONTRACT_TYPE_TABS[0];

  function handleTypeChange(value: string | null) {
    const nextType = parseContractType(value);

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);

        if (nextType === "all") {
          next.delete(CONTRACT_TYPE_PARAM);
        } else {
          next.set(CONTRACT_TYPE_PARAM, nextType);
        }

        return next;
      },
      { replace: true },
    );
  }

  return (
    <FeaturePage
      title="العقود"
      description="إدارة عقود الإيجار الإلكترونية السكنية والتجارية ومتابعة حالة التوثيق."
      icon={FileText}
      emptyTitle={activeTab.emptyTitle}
      emptyDescription={activeTab.emptyDescription}
      toolbar={
        <Tabs value={activeType} onValueChange={handleTypeChange}>
          <TabsList className="w-full sm:w-auto" aria-label="نوع العقد">
            {CONTRACT_TYPE_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      }
    />
  );
}
