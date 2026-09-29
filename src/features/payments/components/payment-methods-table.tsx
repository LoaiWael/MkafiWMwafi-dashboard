import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilterConfig,
} from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import type { PaymentMethodOption } from "@/features/payments/constants";

interface PaymentMethodsTableProps {
  methods: PaymentMethodOption[];
  onMethodsChange: (
    updater:
      | PaymentMethodOption[]
      | ((prev: PaymentMethodOption[]) => PaymentMethodOption[]),
  ) => void;
}

export default function PaymentMethodsTable({
  methods,
  onMethodsChange,
}: PaymentMethodsTableProps) {
  const handleToggleActive = (id: string) => {
    const target = methods.find((m) => m.id === id);
    const nextState = !target?.isActive;
    onMethodsChange((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m)),
    );
    if (nextState) {
      toast.success(`تم تفعيل قناة الدفع "${target?.nameAr || ""}"`);
    } else {
      toast.info(`تم تعطيل قناة الدفع "${target?.nameAr || ""}"`);
    }
  };

  const columns: DataTableColumn<PaymentMethodOption>[] = [
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
      header: "طريقة / قناة الدفع",
      accessorKey: "nameAr",
      sortable: true,
      minWidth: "200px",
      cell: (item) => (
        <div className="flex items-center gap-2.5 text-start">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard className="size-4" />
          </div>
          <span className="font-bold text-sm text-foreground">
            {item.nameAr}
          </span>
        </div>
      ),
    },
    {
      id: "code",
      header: "الرمز البرمجي",
      accessorKey: "code",
      sortable: true,
      minWidth: "120px",
      cell: (item) => (
        <Badge variant="outline" className="font-mono font-bold text-xs">
          {item.code}
        </Badge>
      ),
    },
    {
      id: "description",
      header: "الوصف والتوضيح",
      accessorKey: "description",
      minWidth: "250px",
      cell: (item) => (
        <p className="text-xs text-muted-foreground text-start leading-relaxed">
          {item.description}
        </p>
      ),
    },
    {
      id: "isActive",
      header: "الحالة والظهور",
      align: "center",
      minWidth: "130px",
      cell: (item) => (
        <div className="flex items-center justify-center gap-2">
          <Switch
            checked={item.isActive}
            onCheckedChange={() => handleToggleActive(item.id)}
            aria-label={`تفعيل أو تعطيل قناة ${item.nameAr}`}
            className="cursor-pointer"
          />
          <span className="text-xs font-medium text-muted-foreground">
            {item.isActive ? "مفعّل" : "معطّل"}
          </span>
        </div>
      ),
    },
  ];

  const filterConfigs: DataTableFilterConfig<PaymentMethodOption>[] = [
    {
      id: "status",
      title: "حالة التفعيل",
      options: [
        { value: "active", label: "مفعّلة" },
        { value: "inactive", label: "معطّلة" },
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
    <DataTable
      data={methods}
      columns={columns}
      title="قنوات وطرق الدفع الإلكتروني"
      subtitle="بوابات وطرق الدفع المعتمدة لسداد رسوم توثيق العقود السكنية والتجارية عبر المنصة."
      searchPlaceholder="بحث باسم القناة، الرمز، أو الوصف..."
      searchKeys={["nameAr", "code", "description"]}
      filters={filterConfigs}
      pageSize={10}
      pageSizeOptions={[5, 10, 20]}
    />
  );
}
