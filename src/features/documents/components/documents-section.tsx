import { useState } from "react";
import { ScrollText } from "lucide-react";
import FeaturePage from "@/components/layout/feature-page";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CONTRACT_TYPES,
  type ContractType,
} from "@/features/documents/constants";

export default function DocumentsSection() {
  const [activeContractType, setActiveContractType] =
    useState<ContractType>("residential");

  const currentType =
    CONTRACT_TYPES.find((type) => type.id === activeContractType) ??
    CONTRACT_TYPES[0];

  return (
    <FeaturePage
      title="الصكوك"
      description="إدارة صكوك الملكية (إلكتروني، ورقي، صك ملكية، حجة استحكام) وبيانات الصكوك المعتمدة للعقود السكنية والتجارية."
      icon={ScrollText}
      emptyTitle={`لا توجد صكوك مسجلة في ${currentType.label}`}
      emptyDescription={`ستظهر هنا بيانات ووثائق الصكوك المرفوعة ضمن ${currentType.label}.`}
      toolbar={
        <Tabs
          value={activeContractType}
          onValueChange={(val) => setActiveContractType(val as ContractType)}
        >
          <TabsList className="w-full sm:w-auto" aria-label="نوع العقد">
            {CONTRACT_TYPES.map((type) => (
              <TabsTrigger key={type.id} value={type.id}>
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      }
    />
  );
}
