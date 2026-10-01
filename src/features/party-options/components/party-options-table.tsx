import { toast } from "sonner";
import { Edit2, Trash2 } from "lucide-react";
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
import type { OptionItem } from "@/features/party-options/constants";

interface PartyOptionsTableProps {
  items: OptionItem[];
  onItemsChange: (
    updater: OptionItem[] | ((prev: OptionItem[]) => OptionItem[]),
  ) => void;
  onEdit: (item: OptionItem) => void;
}

export default function PartyOptionsTable({
  items,
  onItemsChange,
  onEdit,
}: PartyOptionsTableProps) {
  const categoryValues = [
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ] as string[];

  function deleteOption(id: string) {
    onItemsChange((prev) => prev.filter((item) => item.id !== id));
    toast.success("تم حذف الخيار بنجاح");
  }

  function toggleActive(id: string) {
    onItemsChange((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item,
      ),
    );
    toast.success("تم تحديث حالة تفعيل الخيار");
  }

  const columns: DataTableColumn<OptionItem>[] = [
    {
      id: "index",
      header: "#",
      align: "center",
      minWidth: "48px",
      cell: (_, index) => (
        <span className="text-xs font-semibold text-muted-foreground">
          {index + 1}
        </span>
      ),
    },
    {
      id: "nameAr",
      header: "صفة الطرف",
      accessorKey: "nameAr",
      minWidth: "160px",
      cell: (item) => (
        <span
          className={
            item.isActive
              ? "text-sm font-semibold text-foreground"
              : "text-sm font-semibold text-muted-foreground"
          }
        >
          {item.nameAr}
        </span>
      ),
    },
    {
      id: "category",
      header: "التصنيف",
      accessorKey: "category",
      minWidth: "120px",
      cell: (item) => (
        <Badge variant="secondary">{item.category || "عام"}</Badge>
      ),
    },
    {
      id: "description",
      header: "الوصف",
      accessorKey: "description",
      minWidth: "200px",
      cell: (item) => (
        <p className="text-start text-xs leading-relaxed text-muted-foreground">
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
            onCheckedChange={() => toggleActive(item.id)}
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
      minWidth: "88px",
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
                    aria-label={`تعديل ${item.nameAr}`}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  />
                }
              >
                <Edit2 className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                تعديل الخيار
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deleteOption(item.id)}
                    aria-label={`حذف ${item.nameAr}`}
                    className="text-destructive hover:bg-destructive/10 cursor-pointer"
                  />
                }
              >
                <Trash2 className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                حذف الخيار
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  const filters: DataTableFilterConfig<OptionItem>[] = [
    {
      id: "category",
      title: "التصنيف",
      options: categoryValues.map((value) => ({
        value,
        label: value,
      })),
      filterFn: (item, selectedValue) => {
        if (!selectedValue || selectedValue === "all") return true;
        return item.category === selectedValue;
      },
    },
    {
      id: "status",
      title: "الحالة والظهور",
      options: [
        { value: "active", label: "مفعّل بالموقع" },
        { value: "inactive", label: "معطّل" },
      ],
      filterFn: (item, selectedValue) => {
        if (!selectedValue || selectedValue === "all") return true;
        if (selectedValue === "active") return item.isActive;
        if (selectedValue === "inactive") return !item.isActive;
        return true;
      },
    },
  ];

  return (
    <DataTable
      data={items}
      columns={columns}
      searchPlaceholder="بحث في صفات الأطراف..."
      searchKeys={["nameAr", "category", "description"]}
      filters={filters}
      pageSize={10}
      pageSizeOptions={[5, 10, 20]}
      emptyTitle="لا توجد صفات مطابقة"
      emptyDescription="لم يتم العثور على صفات تطابق البحث أو التصفية."
    />
  );
}
