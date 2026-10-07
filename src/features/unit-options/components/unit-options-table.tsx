import { useState } from "react";
import { type LucideIcon, Edit2, Plus, Trash2 } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilterConfig,
} from "@/components/ui/data-table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WarningDialog from "@/components/warning-dialog";
import type { UnitOptionItem } from "../types";

interface UnitOptionsTableProps {
  items: UnitOptionItem[];
  tableId: string;
  title: string;
  subtitle: string;
  nameHeader: string;
  entityLabel: string;
  icon?: LucideIcon;
  isLoading?: boolean;
  onAdd?: () => void;
  onEdit: (item: UnitOptionItem) => void;
  onDelete: (id: number) => void;
  onToggleActive: (item: UnitOptionItem) => void;
}

export default function UnitOptionsTable({
  items,
  tableId,
  title,
  subtitle,
  nameHeader,
  entityLabel,
  icon: Icon,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
  onToggleActive,
}: UnitOptionsTableProps) {
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const deleteItem = items.find((item) => item.id === deleteItemId);

  const columns: DataTableColumn<UnitOptionItem>[] = [
    {
      id: "index",
      header: "#",
      align: "center",
      minWidth: "45px",
      cell: (_, index) => (
        <span className="text-xs font-semibold text-muted-foreground">
          {index + 1}
        </span>
      ),
    },
    {
      id: "name",
      header: nameHeader,
      accessorKey: "name",
      minWidth: "160px",
      cell: (item) => (
        <span
          className={
            item.isActive
              ? "text-xs sm:text-sm font-bold text-foreground"
              : "text-xs sm:text-sm font-bold text-muted-foreground line-through opacity-75"
          }
        >
          {item.name}
        </span>
      ),
    },
    {
      id: "sortOrder",
      header: "ترتيب العرض",
      accessorKey: "sortOrder",
      align: "center",
      minWidth: "90px",
      cell: (item) => (
        <Badge variant="outline" className="px-2 py-0.5 text-xs font-mono">
          {item.sortOrder}
        </Badge>
      ),
    },
    {
      id: "isActive",
      header: "الظهور بالموقع",
      align: "center",
      minWidth: "120px",
      cell: (item) => (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <Switch
            checked={item.isActive}
            onCheckedChange={() => onToggleActive(item)}
            aria-label={`تفعيل أو تعطيل ظهور ${item.name}`}
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
      minWidth: "85px",
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
                    aria-label={`تعديل ${item.name}`}
                  />
                }
              >
                <Edit2 className="size-3 sm:size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                تعديل {entityLabel}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeleteItemId(item.id)}
                    className="size-7 sm:size-8 text-destructive hover:bg-destructive/10 cursor-pointer"
                    aria-label={`حذف ${item.name}`}
                  />
                }
              >
                <Trash2 className="size-3 sm:size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                حذف {entityLabel}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  const filters: DataTableFilterConfig<UnitOptionItem>[] = [
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
    <>
      <WarningDialog
        open={!!deleteItemId}
        onOpenChange={(open) => {
          if (!open) setDeleteItemId(null);
        }}
        title={`حذف ${entityLabel}`}
        description={`هل أنت متأكد من رغبتك في حذف ${entityLabel} "${deleteItem?.name}"؟ سيتم حذفه نهائياً من قاعدة البيانات.`}
        confirmLabel="حذف نهائي"
        onConfirm={() => {
          if (deleteItemId !== null) {
            onDelete(deleteItemId);
            setDeleteItemId(null);
          }
        }}
      />

      <FadeIn duration={0.3} delay={0.05}>
        {isLoading && items.length === 0 ? (
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-72" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="space-y-2 pt-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        ) : items.length === 0 ? (
          <Empty className="border border-dashed border-border bg-card py-14 sm:py-20 shadow-2xs">
            <EmptyHeader>
              {Icon && (
                <EmptyMedia variant="icon" className="size-12 rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6 text-primary" />
                </EmptyMedia>
              )}
              <EmptyTitle className="text-base sm:text-lg font-bold">
                لا توجد {title} مسجلة حالياً
              </EmptyTitle>
              <EmptyDescription className="text-xs sm:text-sm max-w-md">
                لم يتم إضافة أي عناصر في {title} بعد. يمكنك إضافة أول {entityLabel} ليظهر مباشرة للمستخدمين في القوائم المنسدلة بالموقع.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {onAdd && (
                <Button
                  onClick={onAdd}
                  className="gap-2 font-bold cursor-pointer"
                  size="sm"
                >
                  <Plus className="size-4" />
                  <span>إضافة {entityLabel} جديد</span>
                </Button>
              )}
            </EmptyContent>
          </Empty>
        ) : (
          <DataTable
            data={items}
            columns={columns}
            title={title}
            subtitle={subtitle}
            searchPlaceholder={`بحث في ${title}...`}
            searchKeys={["name"]}
            searchParamKey={`q-${tableId}`}
            filters={filters}
            pageSize={10}
            pageSizeOptions={[5, 10, 20, 50]}
            emptyTitle="لا توجد نتائج مطابقة"
            emptyDescription={`لم يتم العثور على أي عناصر تطابق البحث أو التصفية الحالية في ${title}.`}
          />
        )}
      </FadeIn>
    </>
  );
}
