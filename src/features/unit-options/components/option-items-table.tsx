import { Edit2, Trash2 } from "lucide-react";
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
import type { OptionItem } from "@/features/unit-options/constants";

interface OptionItemsTableProps {
  items: OptionItem[];
  tableId: string;
  title: string;
  subtitle: string;
  nameHeader: string;
  descriptionHeader: string;
  showCategory: boolean;
  onEdit: (item: OptionItem) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

function categoryVariant(category?: string) {
  if (category === "سكني") return "default" as const;
  if (category === "تجاري") return "secondary" as const;
  return "outline" as const;
}

export default function OptionItemsTable({
  items,
  tableId,
  title,
  subtitle,
  nameHeader,
  descriptionHeader,
  showCategory,
  onEdit,
  onDelete,
  onToggleActive,
}: OptionItemsTableProps) {
  const categoryValues = [
    ...new Set(items.map((item) => item.category).filter(Boolean)),
  ] as string[];

  const columns: DataTableColumn<OptionItem>[] = [
    {
      id: "index",
      header: "#",
      align: "center",
      minWidth: "40px",
      cell: (_, index) => (
        <span className="text-xs font-semibold text-muted-foreground">
          {index + 1}
        </span>
      ),
    },
    {
      id: "nameAr",
      header: nameHeader,
      accessorKey: "nameAr",
      minWidth: "140px",
      cell: (item) => (
        <span
          className={
            item.isActive
              ? "text-xs sm:text-sm font-bold text-foreground"
              : "text-xs sm:text-sm font-bold text-muted-foreground"
          }
        >
          {item.nameAr}
        </span>
      ),
    },
    ...(showCategory
      ? [
          {
            id: "category",
            header: "التصنيف",
            accessorKey: "category",
            minWidth: "90px",
            cell: (item: OptionItem) => (
              <Badge
                variant={categoryVariant(item.category)}
                className="px-1.5 py-0.5 text-[10px] sm:text-xs"
              >
                {item.category || "—"}
              </Badge>
            ),
          } satisfies DataTableColumn<OptionItem>,
        ]
      : []),
    {
      id: "description",
      header: descriptionHeader,
      accessorKey: "description",
      minWidth: "160px",
      cell: (item) => (
        <p className="text-start text-[11px] sm:text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {item.description || "—"}
        </p>
      ),
    },
    {
      id: "isActive",
      header: "الظهور بالموقع",
      align: "center",
      minWidth: "110px",
      cell: (item) => (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <Switch
            checked={item.isActive}
            onCheckedChange={() => onToggleActive(item.id)}
            aria-label={`تفعيل أو تعطيل ظهور ${item.nameAr}`}
            className="scale-90 sm:scale-100 cursor-pointer"
          />
          <span className="text-[11px] sm:text-xs font-medium text-muted-foreground">
            {item.isActive ? "مفعّل" : "معطّل"}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      align: "center",
      minWidth: "75px",
      cell: (item) => (
        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
          <TooltipProvider delay={150}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(item)}
                    className="size-7 sm:size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label={`تعديل ${item.nameAr}`}
                  />
                }
              >
                <Edit2 className="size-3 sm:size-3.5" />
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
                    onClick={() => onDelete(item.id)}
                    className="size-7 sm:size-8 text-destructive hover:bg-destructive/10 cursor-pointer"
                    aria-label={`حذف ${item.nameAr}`}
                  />
                }
              >
                <Trash2 className="size-3 sm:size-3.5" />
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
    ...(showCategory
      ? [
          {
            id: `${tableId}-category`,
            title: "التصنيف",
            options: categoryValues.map((value) => ({
              value,
              label: value,
            })),
            filterFn: (item: OptionItem, selectedValue: string) => {
              if (!selectedValue || selectedValue === "all") return true;
              return item.category === selectedValue;
            },
          } satisfies DataTableFilterConfig<OptionItem>,
        ]
      : []),
    {
      id: `${tableId}-status`,
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
    <FadeIn duration={0.3} delay={0.05}>
      <DataTable
        data={items}
        columns={columns}
        title={title}
        subtitle={subtitle}
        searchPlaceholder="بحث في الخيارات..."
        searchKeys={
          showCategory ? ["nameAr", "category", "description"] : ["nameAr", "description"]
        }
        searchParamKey={`q-${tableId}`}
        filters={filters}
        pageSize={10}
        pageSizeOptions={[5, 10, 20]}
        emptyTitle="لا توجد نتائج مطابقة"
        emptyDescription="لم يتم العثور على خيارات تطابق البحث أو التصفية."
      />
    </FadeIn>
  );
}
