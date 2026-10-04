import { useState } from "react";
import { toast } from "sonner";
import { Edit2, Trash2, Wallet } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilterConfig,
} from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WarningDialog from "@/components/warning-dialog";
import type { PaymentFrequencyOption } from "@/features/payments/constants";

interface PaymentFrequenciesTableProps {
  frequencies: PaymentFrequencyOption[];
  onFrequenciesChange: (
    updater:
      | PaymentFrequencyOption[]
      | ((prev: PaymentFrequencyOption[]) => PaymentFrequencyOption[]),
  ) => void;
  onEdit: (item: PaymentFrequencyOption) => void;
}

export default function PaymentFrequenciesTable({
  frequencies,
  onFrequenciesChange,
  onEdit,
}: PaymentFrequenciesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (deleteId) {
      onFrequenciesChange((prev) => prev.filter((f) => f.id !== deleteId));
      toast.success("تم حذف دورية الدفع بنجاح");
      setDeleteId(null);
    }
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
                    onClick={() => onEdit(item)}
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
                    onClick={() => setDeleteId(item.id)}
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
      <FadeIn duration={0.3} delay={0.05}>
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
        />
      </FadeIn>
      <WarningDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="تأكيد الحذف"
        description="هل أنت متأكد من رغبتك في حذف دورية الدفع هذه؟ لا يمكن التراجع عن هذا الإجراء."
        confirmLabel="حذف"
        onConfirm={confirmDelete}
      />
    </>
  );
}
