import { useState } from "react";
import { toast } from "sonner";
import { Plus, RotateCcw } from "lucide-react";
import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import PartyOptionDialog, {
  type PartyOptionFormValues,
} from "@/features/party-options/components/party-option-dialog";
import PartyOptionsTable from "@/features/party-options/components/party-options-table";
import {
  INITIAL_PARTY_CAPACITIES,
  PARTY_OPTIONS_METADATA,
  type OptionItem,
} from "@/features/party-options/constants";
import { partyOptionSchema } from "../schemas/party-option-schema";

const EMPTY_FORM: PartyOptionFormValues = {
  nameAr: "",
  category: "أفراد",
  description: "",
  isActive: true,
};

export default function PartyOptionsSection() {
  const [capacities, setCapacities] = useState<OptionItem[]>([
    ...INITIAL_PARTY_CAPACITIES,
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OptionItem | null>(null);
  const [formData, setFormData] = useState<PartyOptionFormValues>(EMPTY_FORM);

  function handleOpenAdd() {
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setIsDialogOpen(true);
  }

  function handleOpenEdit(item: OptionItem) {
    setEditingItem(item);
    setFormData({
      nameAr: item.nameAr,
      category: item.category || EMPTY_FORM.category,
      description: item.description || "",
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  }

  function handleSaveOption() {
    const result = partyOptionSchema.safeParse(formData);
    if (!result.success) {
      toast.error(
        result.error.issues[0]?.message || "يرجى التحقق من صحة البيانات المدخلة",
      );
      return;
    }

    const validData = result.data;

    if (editingItem) {
      const updated: OptionItem = {
        ...editingItem,
        nameAr: validData.nameAr,
        category: validData.category,
        description: validData.description,
        isActive: validData.isActive,
      };
      setCapacities((prev) =>
        prev.map((item) => (item.id === editingItem.id ? updated : item)),
      );
      toast.success("تم تحديث بيانات الخيار بنجاح");
    } else {
      const newItem: OptionItem = {
        id: `custom_${Date.now()}`,
        nameAr: validData.nameAr,
        category: validData.category,
        description: validData.description,
        isActive: validData.isActive,
      };
      setCapacities((prev) => [...prev, newItem]);
      toast.success("تمت إضافة الخيار الجديد بنجاح");
    }

    setIsDialogOpen(false);
  }

  function handleResetDefaults() {
    if (
      window.confirm(
        "هل ترغب بإعادة تعيين صفة المستأجر والمؤجر إلى البيانات الافتراضية؟",
      )
    ) {
      setCapacities([...INITIAL_PARTY_CAPACITIES]);
      toast.success("تمت استعادة صفة أطراف العقد الافتراضية بنجاح");
    }
  }

  return (
    <div className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-8">
      <FadeIn duration={0.3}>
        <PageHeader
          title={PARTY_OPTIONS_METADATA.title}
          description={PARTY_OPTIONS_METADATA.description}
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
              <Button
                onClick={handleOpenAdd}
                size="sm"
                className="gap-1.5 cursor-pointer font-bold shadow-xs shrink-0"
              >
                <Plus className="size-4" />
                <span>إضافة صفة جديدة</span>
              </Button>
            </div>
          }
        />
      </FadeIn>
      <FadeIn duration={0.3} delay={0.08}>
        <PartyOptionsTable
          items={capacities}
          onItemsChange={setCapacities}
          onEdit={handleOpenEdit}
        />
      </FadeIn>

      <PartyOptionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingItem={editingItem}
        formData={formData}
        onFormDataChange={setFormData}
        onSave={handleSaveOption}
      />
    </div>
  );
}
