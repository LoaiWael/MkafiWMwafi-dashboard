import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange: (newPageIndex: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export function DataTablePagination({
  pageIndex,
  pageSize,
  totalItems,
  pageSizeOptions = [5, 10, 20, 50],
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePageIndex = Math.min(Math.max(0, pageIndex), pageCount - 1);
  const startItem = totalItems === 0 ? 0 : safePageIndex * pageSize + 1;
  const endItem = Math.min((safePageIndex + 1) * pageSize, totalItems);

  const canPrevious = safePageIndex > 0;
  const canNext = safePageIndex < pageCount - 1;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-3 sm:px-4 py-3 sm:flex-row">
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-xs text-muted-foreground sm:text-sm">
        <span>
          عرض <strong className="font-semibold text-foreground">{startItem}</strong> إلى{" "}
          <strong className="font-semibold text-foreground">{endItem}</strong> من إجمالي{" "}
          <strong className="font-semibold text-foreground">{totalItems}</strong> عنصر
        </span>

        <div className="flex items-center gap-1.5 sm:gap-2 ms-1 sm:ms-2 border-s border-border ps-2 sm:ps-3">
          <span className="text-xs text-muted-foreground">لكل صفحة:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              if (val) {
                onPageSizeChange(Number(val));
              }
            }}
          >
            <SelectTrigger
              aria-label="عدد العناصر لكل صفحة"
              className="h-8 min-w-18 bg-background text-xs font-medium"
            >
              <SelectValue placeholder={String(pageSize)} />
            </SelectTrigger>
            <SelectContent side="bottom" sideOffset={4} align="center" className="min-w-18">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)} className="text-xs">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <span className="me-2 text-xs text-muted-foreground sm:text-sm">
          الصفحة <strong className="font-semibold text-foreground">{safePageIndex + 1}</strong> من{" "}
          <strong className="font-semibold text-foreground">{pageCount}</strong>
        </span>

        <TooltipProvider delay={150}>
          <Tooltip>
            <TooltipTrigger
              type="button"
              aria-label="الصفحة الأولى"
              className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border/40 disabled:bg-muted/10 disabled:text-muted-foreground/30 disabled:opacity-30 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:border-border/40 data-disabled:bg-muted/10 data-disabled:text-muted-foreground/30 data-disabled:opacity-30 aria-disabled:pointer-events-none aria-disabled:opacity-30"
              disabled={!canPrevious}
              onClick={() => onPageChange(0)}
            >
              <ChevronsRight className="size-4" />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6}>
              الصفحة الأولى
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              type="button"
              aria-label="الصفحة السابقة"
              className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border/40 disabled:bg-muted/10 disabled:text-muted-foreground/30 disabled:opacity-30 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:border-border/40 data-disabled:bg-muted/10 data-disabled:text-muted-foreground/30 data-disabled:opacity-30 aria-disabled:pointer-events-none aria-disabled:opacity-30"
              disabled={!canPrevious}
              onClick={() => onPageChange(Math.max(0, safePageIndex - 1))}
            >
              <ChevronRight className="size-4" />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6}>
              الصفحة السابقة
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              type="button"
              aria-label="الصفحة التالية"
              className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border/40 disabled:bg-muted/10 disabled:text-muted-foreground/30 disabled:opacity-30 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:border-border/40 data-disabled:bg-muted/10 data-disabled:text-muted-foreground/30 data-disabled:opacity-30 aria-disabled:pointer-events-none aria-disabled:opacity-30"
              disabled={!canNext}
              onClick={() => {
                if (safePageIndex < pageCount - 1) {
                  onPageChange(Math.min(pageCount - 1, safePageIndex + 1));
                }
              }}
            >
              <ChevronLeft className="size-4" />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6}>
              الصفحة التالية
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              type="button"
              aria-label="الصفحة الأخيرة"
              className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border/40 disabled:bg-muted/10 disabled:text-muted-foreground/30 disabled:opacity-30 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:border-border/40 data-disabled:bg-muted/10 data-disabled:text-muted-foreground/30 data-disabled:opacity-30 aria-disabled:pointer-events-none aria-disabled:opacity-30"
              disabled={!canNext}
              onClick={() => onPageChange(pageCount - 1)}
            >
              <ChevronsLeft className="size-4" />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6}>
              الصفحة الأخيرة
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
