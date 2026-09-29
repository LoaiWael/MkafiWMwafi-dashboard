import { useState } from "react";
import { toast } from "sonner";
import { Check, Edit2, Plus, RotateCcw, Trash2, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilterConfig,
} from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  INITIAL_PAYMENT_FREQUENCIES,
  PAYMENTS_STORAGE_KEYS,
  type PaymentFrequencyOption,
} from "@/features/payments/constants";

interface PaymentFrequenciesTableProps {
  frequencies: PaymentFrequencyOption[];
  onFrequenciesChange: (
    updater:
      | PaymentFrequencyOption[]
      | ((prev: PaymentFrequencyOption[]) => PaymentFrequencyOption[]),
  ) => void;
  onResetDefaults?: () => void;
}

export default function PaymentFrequenciesTable({
  frequencies,
  onFrequenciesChange,
  onResetDefaults,
}: PaymentFrequenciesTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [editingFrequency, setEditingFrequency] =
    useState<PaymentFrequencyOption | null>(null);

  const [formState, setFormState] = useState<{
    nameAr: string;
    installmentCount: number;
    periodAr: string;
    description: string;
    isActive: boolean;
  }>({
    nameAr: "",
    installmentCount: 1,
    periodAr: "سنوي",
    description: "",
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingFrequency(null);
    setFormState({
      nameAr: "",
      installmentCount: 1,
      periodAr: "سنوي",
      description: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: PaymentFrequencyOption) => {
    setEditingFrequency(item);
    setFormState({
      nameAr: item.nameAr,
      installmentCount: item.installmentCount,
      periodAr: item.periodAr,
      description: item.description,
      isActive: item.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formState.nameAr.trim()) {
      toast.error("يرجى إدخال مسمى دورية الدفع");
      return;
    }

    if (editingFrequency) {
      onFrequenciesChange((prev) =>
        prev.map((f) =>
          f.id === editingFrequency.id
            ? {
                ...f,
                nameAr: formState.nameAr.trim(),
                installmentCount: Number(formState.installmentCount),
                periodAr: formState.periodAr.trim(),
                description: formState.description.trim(),
                isActive: formState.isActive,
              }
            : f,
        ),
      );
      toast.success("تم تحديث دورية الدفع بنجاح");
    } else {
      const newItem: PaymentFrequencyOption = {
        id: `freq_${Date.now()}`,
        nameAr: formState.nameAr.trim(),
        installmentCount: Number(formState.installmentCount),
        periodAr: formState.periodAr.trim(),
        description: formState.description.trim(),
        isActive: formState.isActive,
      };
      onFrequenciesChange((prev) => [...prev, newItem]);
      toast.success("تمت إضافة دورية دفع جديدة بنجاح");
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    onFrequenciesChange((prev) => prev.filter((f) => f.id !== id));
    toast.success("تم حذف دورية الدفع بنجاح");
  };

  const handleToggleActive = (id: string) => {
    const target = frequencies.find((f) => f.id === id);
    const nextState = !target?.isActive;
    onFrequenciesChange((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f)),
    );
    if (nextState) {
      toast.success(`تم تفعيل دورية "${target?.nameAr || ""}"`);
    } else {
      toast.info(`تم تعطيل دورية "${target?.nameAr || ""}"`);
    }
  };

  const handleResetDefaults = () => {
    if (onResetDefaults) {
      onResetDefaults();
      return;
    }
    if (
      window.confirm(
        "هل ترغب بإعادة تعيين خيارات طريقة الدفعات إلى الافتراضي؟",
      )
    ) {
      onFrequenciesChange([...INITIAL_PAYMENT_FREQUENCIES]);
      localStorage.removeItem(PAYMENTS_STORAGE_KEYS.frequencies);
      toast.success("تمت استعادة خيارات طريقة الدفعات الافتراضية بنجاح");
    }
  };

  const columns: DataTableColumn<PaymentFrequencyOption>[] = [
    {
      id: "index",
      header: "#",
      align: "center",
      minWidth: "50px",
      cell: (_, index) => (
        <span className="text-xs font-semibold text-muted-foreground">
          {index + 1}
        </span>
      ),
    },
    {
      id: "nameAr",
      header: "طريقة الدفعات",
      accessorKey: "nameAr",
      sortable: true,
      minWidth: "180px",
      cell: (item) => (
        <div className="flex items-center gap-2 text-start">
          <div className="flex size-7.5 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wallet className="size-4" />
          </div>
          <span className="font-bold text-sm text-foreground">
            {item.nameAr}
          </span>
        </div>
      ),
    },
    {
      id: "installmentCount",
      header: "عدد الدفعات سنوياً",
      accessorKey: "installmentCount",
      sortable: true,
      minWidth: "140px",
      cell: (item) => (
        <Badge variant="secondary" className="font-bold text-xs">
          {item.installmentCount}{" "}
          {item.installmentCount === 1 ? "دفعة" : "دفعات"}
        </Badge>
      ),
    },
    {
      id: "periodAr",
      header: "التكرار",
      accessorKey: "periodAr",
      minWidth: "120px",
      cell: (item) => (
        <span className="text-xs text-muted-foreground">{item.periodAr}</span>
      ),
    },
    {
      id: "description",
      header: "الوصف والتوضيح",
      accessorKey: "description",
      minWidth: "220px",
      cell: (item) => (
        <p className="text-xs text-muted-foreground text-start leading-relaxed">
          {item.description || "—"}
        </p>
      ),
    },
    {
      id: "isActive",
      header: "الظهور بالموقع",
      align: "center",
      minWidth: "130px",
      cell: (item) => (
        <div className="flex items-center justify-center gap-2">
          <Switch
            checked={item.isActive}
            onCheckedChange={() => handleToggleActive(item.id)}
            aria-label={`تفعيل أو تعطيل ظهور ${item.nameAr}`}
            className="cursor-pointer"
          />
          <span className="text-xs font-medium text-muted-foreground">
            {item.isActive ? "مفعّل" : "معطّل"}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      align: "center",
      minWidth: "100px",
      cell: (item) => (
        <div className="flex items-center justify-center gap-1">
          <TooltipProvider delay={150}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleOpenEdit(item)}
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                    aria-label={`تعديل ${item.nameAr}`}
                  />
                }
              >
                <Edit2 className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="top">تعديل الخيار</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(item.id)}
                    className="cursor-pointer text-destructive hover:bg-destructive/10"
                    aria-label={`حذف ${item.nameAr}`}
                  />
                }
              >
                <Trash2 className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="top">حذف الخيار</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  const filterConfigs: DataTableFilterConfig<PaymentFrequencyOption>[] = [
    {
      id: "status",
      title: "الحالة والظهور",
      options: [
        { value: "active", label: "مفعّل بالموقع" },
        { value: "inactive", label: "معطّل" },
      ],
      filterFn: (item, val) => {
        if (!val || val === "all") return true;
        if (val === "active") return item.isActive;
        if (val === "inactive") return !item.isActive;
        return true;
      },
    },
  ];

  return (
    <>
      <DataTable
        data={frequencies}
        columns={columns}
        title="خيارات طريقة الدفعات (تكرار سداد الإيجار)"
        subtitle="الخيارات المتاحة لحقل (طريقة الدفعات) في استمارة بيانات العقد الإلكتروني بالموقع."
        searchPlaceholder="بحث باسم الخيار، التكرار، أو الوصف..."
        searchKeys={["nameAr", "periodAr", "description"]}
        filters={filterConfigs}
        pageSize={10}
        pageSizeOptions={[5, 10, 20]}
        toolbarActions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>استعادة الافتراضي</span>
            </Button>
            <Button
              onClick={handleOpenAdd}
              size="sm"
              className="gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="size-4" />
              <span>إضافة طريقة دفعات</span>
            </Button>
          </div>
        }
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingFrequency
                ? "تعديل خيار طريقة الدفعات"
                : "إضافة خيار طريقة دفعات جديد"}
            </DialogTitle>
            <DialogDescription>
              سيظهر هذا الخيار في القائمة المنسدلة لطريقة الدفعات في استمارة
              الموقع الرئيسي.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="freqName">اسم الخيار بالعربية *</Label>
              <Input
                id="freqName"
                value={formState.nameAr}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    nameAr: e.target.value,
                  }))
                }
                placeholder="مثال: دفعتان (نصف سنوي)"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="installmentCount">عدد الدفعات سنوياً</Label>
                <Input
                  id="installmentCount"
                  type="number"
                  min={1}
                  max={24}
                  value={formState.installmentCount}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      installmentCount: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="freqPeriod">التكرار</Label>
                <Input
                  id="freqPeriod"
                  value={formState.periodAr}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      periodAr: e.target.value,
                    }))
                  }
                  placeholder="مثال: كل 6 أشهر"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="freqDesc">الوصف والتوضيح</Label>
              <Input
                id="freqDesc"
                value={formState.description}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="توضيح آلية التقسيط أو السداد"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
              <div>
                <Label className="text-sm font-medium">
                  تفعيل الخيار مباشرة
                </Label>
                <p className="text-xs text-muted-foreground">
                  إتاحة هذا الخيار فوراً في القائمة المنسدلة بالموقع
                </p>
              </div>
              <Switch
                checked={formState.isActive}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({ ...prev, isActive: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter className="gap-2.5 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="cursor-pointer"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formState.nameAr.trim()}
              className="gap-1.5 cursor-pointer"
            >
              <Check className="size-4" />
              {editingFrequency ? "حفظ التعديلات" : "إضافة الخيار"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
