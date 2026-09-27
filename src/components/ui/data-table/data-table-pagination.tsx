import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
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
  const startItem = totalItems === 0 ? 0 : pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  const canPrevious = pageIndex > 0;
  const canNext = pageIndex < pageCount - 1;

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-border px-4 py-3 sm:flex-row">
      <div className="flex items-center gap-3 text-xs text-muted-foreground sm:text-sm">
        <span>
          عرض <strong className="font-semibold text-foreground">{startItem}</strong> إلى{" "}
          <strong className="font-semibold text-foreground">{endItem}</strong> من إجمالي{" "}
          <strong className="font-semibold text-foreground">{totalItems}</strong> عنصر
        </span>

        <div className="flex items-center gap-1.5 ms-2 border-s border-border ps-3">
          <label htmlFor="data-table-page-size" className="text-xs text-muted-foreground">
            لكل صفحة:
          </label>
          <select
            id="data-table-page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <span className="me-2 text-xs text-muted-foreground sm:text-sm">
          الصفحة <strong className="font-semibold text-foreground">{pageIndex + 1}</strong> من{" "}
          <strong className="font-semibold text-foreground">{pageCount}</strong>
        </span>

        <TooltipProvider delay={150}>
          <Tooltip>
            <TooltipTrigger
              type="button"
              aria-label="الصفحة الأولى"
              className="inline-flex size-8 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
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
              className="inline-flex size-8 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              disabled={!canPrevious}
              onClick={() => onPageChange(pageIndex - 1)}
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
              className="inline-flex size-8 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
              disabled={!canNext}
              onClick={() => onPageChange(pageIndex + 1)}
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
              className="inline-flex size-8 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
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
