import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import type {
  DataTableColumn,
  DataTableFilterConfig,
  DataTableSortingState,
} from "./types";

export interface DataTableProps<TData> {
  data: TData[];
  columns: DataTableColumn<TData>[];
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof TData)[];
  searchFilter?: (item: TData, query: string) => boolean;
  filters?: DataTableFilterConfig<TData>[];
  toolbarActions?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  emptyAction?: ReactNode;
  pageSize?: number;
  pageSizeOptions?: number[];
  onRowClick?: (item: TData) => void;
  onRowDoubleClick?: (item: TData) => void;
  className?: string;
  headerSlot?: ReactNode;
  /**
   * Whether to apply zebra-striped alternating background colors to table rows (defaults to true).
   */
  striped?: boolean;
  /**
   * Sync search and filter values with URL search parameters (defaults to true).
   */
  syncWithUrl?: boolean;
  /**
   * The query parameter key to use for table search in the URL (defaults to "q").
   */
  searchParamKey?: string;
  /**
   * The query parameter key to use for page number in the URL (defaults to "page").
   */
  pageParamKey?: string;
  /**
   * The query parameter key to use for page size in the URL (defaults to "per_page").
   */
  pageSizeParamKey?: string;
  /**
   * Whether pagination is handled externally/server-side.
   */
  manualPagination?: boolean;
  /**
   * Total number of items across all pages when using server-side pagination.
   */
  totalCount?: number;
  /**
   * Callback fired when page index changes.
   */
  onPageChange?: (pageIndex: number) => void;
  /**
   * Callback fired when page size changes.
   */
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * Callback fired when search or active filters state change.
   */
  onStateChange?: (state: {
    searchQuery: string;
    activeFilters: Record<string, string>;
  }) => void;
}

export function DataTable<TData>({
  data,
  columns,
  title,
  subtitle,
  badge,
  isLoading = false,
  searchPlaceholder = "البحث في الجدول...",
  searchKeys,
  searchFilter,
  filters = [],
  toolbarActions,
  emptyTitle = "لا توجد بيانات متاحة",
  emptyDescription = "لم يتم العثور على أي نتائج تطابق معايير البحث والفلترة.",
  emptyIcon: EmptyIcon = Inbox,
  emptyAction,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  onRowClick,
  onRowDoubleClick,
  className,
  headerSlot,
  striped = true,
  syncWithUrl = true,
  searchParamKey = "q",
  pageParamKey = "page",
  pageSizeParamKey = "per_page",
  manualPagination = false,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onStateChange,
}: DataTableProps<TData>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => {
    if (syncWithUrl && searchParams.has(searchParamKey)) {
      return searchParams.get(searchParamKey) ?? "";
    }
    return "";
  });

  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      for (const f of filters) {
        if (syncWithUrl && searchParams.has(f.id)) {
          const val = searchParams.get(f.id);
          if (val) initial[f.id] = val;
        } else if (f.defaultValue) {
          initial[f.id] = f.defaultValue;
        }
      }
      return initial;
    },
  );

  const [sorting, setSorting] = useState<DataTableSortingState | null>(null);

  const [pageIndex, setPageIndex] = useState(() => {
    if (syncWithUrl && searchParams.has(pageParamKey)) {
      const p = Number(searchParams.get(pageParamKey));
      if (!Number.isNaN(p) && p > 0) return p - 1;
    }
    return 0;
  });

  const [pageSize, setPageSize] = useState(() => {
    if (syncWithUrl && searchParams.has(pageSizeParamKey)) {
      const ps = Number(searchParams.get(pageSizeParamKey));
      if (!Number.isNaN(ps) && ps > 0) return ps;
    }
    return initialPageSize;
  });

  // Sync state with URL params changes (e.g. browser navigation or external link clicks)
  useEffect(() => {
    if (!syncWithUrl) return;

    const urlSearch = searchParams.get(searchParamKey) ?? "";
    setSearchQuery((prev) => (prev !== urlSearch ? urlSearch : prev));

    const urlPage = searchParams.has(pageParamKey)
      ? Math.max(0, Number(searchParams.get(pageParamKey)) - 1)
      : 0;
    setPageIndex((prev) => (prev !== urlPage ? urlPage : prev));

    const urlPageSize = searchParams.has(pageSizeParamKey)
      ? Number(searchParams.get(pageSizeParamKey)) || initialPageSize
      : initialPageSize;
    setPageSize((prev) => (prev !== urlPageSize ? urlPageSize : prev));

    const urlFilters: Record<string, string> = {};
    for (const f of filters) {
      const val = searchParams.get(f.id);
      if (val && val !== "all") {
        urlFilters[f.id] = val;
      }
    }

    setActiveFilters((prev) => {
      const allKeys = new Set([
        ...Object.keys(prev),
        ...Object.keys(urlFilters),
      ]);
      let changed = false;
      for (const key of allKeys) {
        if ((prev[key] ?? "all") !== (urlFilters[key] ?? "all")) {
          changed = true;
          break;
        }
      }
      return changed ? urlFilters : prev;
    });
  }, [searchParams, syncWithUrl, searchParamKey, filters]);

  // Filter & Search
  const filteredData = data.filter((item) => {
    // 1. Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      if (searchFilter) {
        if (!searchFilter(item, query)) return false;
      } else if (searchKeys && searchKeys.length > 0) {
        const match = searchKeys.some((key) => {
          const val = item[key];
          if (val === undefined || val === null) return false;
          return String(val).toLowerCase().includes(query);
        });
        if (!match) return false;
      } else {
        // Default: Search across all values in the object
        const match = Object.values(item as Record<string, unknown>).some(
          (val) => {
            if (val === undefined || val === null) return false;
            if (typeof val === "object") return false;
            return String(val).toLowerCase().includes(query);
          },
        );
        if (!match) return false;
      }
    }

    // 2. Custom filters
    for (const filter of filters) {
      const selectedValue = activeFilters[filter.id] ?? "all";
      if (selectedValue === "all" || !selectedValue) continue;

      if (filter.filterFn) {
        if (!filter.filterFn(item, selectedValue)) return false;
      } else if (filter.accessorKey) {
        const val = String(item[filter.accessorKey]);
        if (val !== selectedValue) return false;
      }
    }

    return true;
  });

  // Sorting
  const sortedData = (() => {
    if (!sorting) return filteredData;

    const column = columns.find((c) => c.id === sorting.columnId);
    if (!column || (!column.sortValue && !column.accessorKey))
      return filteredData;

    const sortFn = column.sortValue;
    const key = column.accessorKey;

    return [...filteredData].sort((a, b) => {
      const aVal = sortFn ? sortFn(a) : key ? a[key] : undefined;
      const bVal = sortFn ? sortFn(b) : key ? b[key] : undefined;

      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      let comparison = 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      } else if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime();
      } else {
        comparison = String(aVal).localeCompare(String(bVal), "ar");
      }

      return sorting.direction === "asc" ? comparison : -comparison;
    });
  })();

  // Pagination
  const isServerPagination = manualPagination || totalCount !== undefined;
  const totalItems = isServerPagination ? (totalCount ?? data.length) : sortedData.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePageIndex = Math.min(Math.max(0, pageIndex), pageCount - 1);
  const paginatedData = isServerPagination
    ? data
    : sortedData.slice(
        safePageIndex * pageSize,
        safePageIndex * pageSize + pageSize,
      );

  const handlePageChange = (newIdx: number) => {
    const clamped = Math.min(Math.max(0, newIdx), pageCount - 1);
    setPageIndex(clamped);

    if (syncWithUrl) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (clamped > 0) {
            next.set(pageParamKey, String(clamped + 1));
          } else {
            next.delete(pageParamKey);
          }
          return next;
        },
        { replace: true },
      );
    }

    onPageChange?.(clamped);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageIndex(0);

    if (syncWithUrl) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete(pageParamKey);
          next.set(pageSizeParamKey, String(newSize));
          return next;
        },
        { replace: true },
      );
    }

    onPageSizeChange?.(newSize);
  };

  // Filter management handlers
  const handleFilterChange = (filterId: string, value: string) => {
    const nextFilters = {
      ...activeFilters,
      [filterId]: value,
    };
    setActiveFilters(nextFilters);
    setPageIndex(0);

    if (syncWithUrl) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete(pageParamKey);
          if (value && value !== "all") {
            next.set(filterId, value);
          } else {
            next.delete(filterId);
          }
          return next;
        },
        { replace: true },
      );
    }

    onStateChange?.({ searchQuery, activeFilters: nextFilters });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPageIndex(0);

    if (syncWithUrl) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete(pageParamKey);
          if (value.trim()) {
            next.set(searchParamKey, value.trim());
          } else {
            next.delete(searchParamKey);
          }
          return next;
        },
        { replace: true },
      );
    }

    onStateChange?.({ searchQuery: value, activeFilters });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveFilters({});
    setSorting(null);
    setPageIndex(0);

    if (syncWithUrl) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete(searchParamKey);
          next.delete(pageParamKey);
          for (const f of filters) {
            next.delete(f.id);
          }
          return next;
        },
        { replace: true },
      );
    }

    onStateChange?.({ searchQuery: "", activeFilters: {} });
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    Object.values(activeFilters).some((v) => v !== "all" && Boolean(v));

  const handleSort = (columnId: string) => {
    setSorting((current) => {
      if (!current || current.columnId !== columnId) {
        return { columnId, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { columnId, direction: "desc" };
      }
      return null;
    });
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-xl border border-border bg-card shadow-xs",
        className,
      )}
    >
      {/* Header section (title + toolbar) */}
      {(title || subtitle || headerSlot) && (
        <div className="flex flex-col justify-between gap-2 border-b border-border p-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              {title ? (
                <h3 className="text-base font-semibold text-foreground sm:text-lg">
                  {title}
                </h3>
              ) : null}
              {badge}
            </div>
            {subtitle ? (
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                {subtitle}
              </p>
            ) : null}
          </div>
          {headerSlot}
        </div>
      )}

      {/* Toolbar (Search + Filters + Actions) */}
      <DataTableToolbar
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        actions={toolbarActions}
      />

      {/* Table Content */}
      <Table>
        <TableHeader className="sticky top-0 z-10 border-b border-border bg-card shadow-xs">
          <TableRow className="border-b border-border/80 hover:bg-transparent">
            {columns.map((column) => {
              const isSortable = Boolean(
                column.sortable && (column.accessorKey || column.sortValue),
              );
              const isSorted = sorting?.columnId === column.id;
              const sortDir = isSorted ? sorting.direction : null;

              return (
                <TableHead
                  key={column.id}
                  style={{ minWidth: column.minWidth }}
                  className={cn(
                    "bg-muted/60 py-3.5 font-semibold text-foreground border-b border-border whitespace-nowrap",
                    column.align === "center" && "text-center",
                    column.align === "end" && "text-end",
                    column.headerClassName,
                  )}
                >
                  {isSortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 font-semibold text-foreground/90 transition-colors hover:text-primary cursor-pointer",
                        column.align === "center" && "justify-center",
                        column.align === "end" && "justify-end",
                      )}
                    >
                      <span>{column.header}</span>
                      {sortDir === "asc" ? (
                        <ArrowUp className="size-3.5 text-primary" />
                      ) : sortDir === "desc" ? (
                        <ArrowDown className="size-3.5 text-primary" />
                      ) : (
                        <ArrowUpDown className="size-3.5 text-muted-foreground/60" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, rIndex) => (
              <TableRow
                key={rIndex}
                className={cn(
                  "border-b border-border/50",
                  striped &&
                    (rIndex % 2 === 1
                      ? "bg-muted/40 dark:bg-muted/20"
                      : "bg-card dark:bg-card"),
                )}
              >
                {columns.map((col) => (
                  <TableCell key={col.id} className="py-3.5">
                    <Skeleton className="h-5 w-full max-w-28" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : paginatedData.length > 0 ? (
            paginatedData.map((item, rIndex) => (
              <TableRow
                key={rIndex}
                onClick={() => onRowClick?.(item)}
                onDoubleClick={() => onRowDoubleClick?.(item)}
                className={cn(
                  "border-b border-border/50 transition-colors duration-150",
                  striped &&
                    (rIndex % 2 === 1
                      ? "bg-muted/40 dark:bg-muted/20"
                      : "bg-card dark:bg-card"),
                  !striped && "bg-card",
                  onRowClick || onRowDoubleClick
                    ? "cursor-pointer hover:bg-primary-50/50 dark:hover:bg-primary-950/40"
                    : "hover:bg-muted/70 dark:hover:bg-muted/40",
                )}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    className={cn(
                      "py-3.5 align-middle",
                      column.align === "center" && "text-center",
                      column.align === "end" && "text-end",
                      column.className,
                    )}
                  >
                    {column.cell
                      ? column.cell(item, rIndex)
                      : column.accessorKey
                        ? (item[column.accessorKey] as ReactNode)
                        : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-48 text-center">
                <Empty className="py-8">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <EmptyIcon className="size-6 text-muted-foreground" />
                    </EmptyMedia>
                    <EmptyTitle className="text-base">{emptyTitle}</EmptyTitle>
                    <EmptyDescription className="text-xs">
                      {emptyDescription}
                    </EmptyDescription>
                  </EmptyHeader>
                  {emptyAction}
                </Empty>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {!isLoading && totalItems > 0 && (
        <DataTablePagination
          pageIndex={safePageIndex}
          pageSize={pageSize}
          totalItems={totalItems}
          pageSizeOptions={pageSizeOptions}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}
