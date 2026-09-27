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
  className,
  headerSlot,
  striped = true,
  syncWithUrl = true,
  searchParamKey = "q",
  onStateChange,
}: DataTableProps<TData>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => {
    if (syncWithUrl && searchParams.has(searchParamKey)) {
      return searchParams.get(searchParamKey) ?? "";
    }
    return "";
  });

  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(() => {
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
  });

  const [sorting, setSorting] = useState<DataTableSortingState | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Sync state with URL params changes (e.g. browser navigation or external link clicks)
  useEffect(() => {
    if (!syncWithUrl) return;

    const urlSearch = searchParams.get(searchParamKey) ?? "";
    setSearchQuery((prev) => (prev !== urlSearch ? urlSearch : prev));

    const urlFilters: Record<string, string> = {};
    for (const f of filters) {
      const val = searchParams.get(f.id);
      if (val && val !== "all") {
        urlFilters[f.id] = val;
      }
    }

    setActiveFilters((prev) => {
      const allKeys = new Set([...Object.keys(prev), ...Object.keys(urlFilters)]);
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
    if (!column || !column.accessorKey) return filteredData;

    const key = column.accessorKey;

    return [...filteredData].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      let comparison = 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal), "ar");
      }

      return sorting.direction === "asc" ? comparison : -comparison;
    });
  })();

  // Pagination
  const paginatedData = sortedData.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize,
  );

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
      <div className="relative w-full overflow-x-auto bg-muted/15">
        <Table>
          <TableHeader className="border-b border-border bg-muted/70 backdrop-blur-xs">
            <TableRow className="border-b border-border/80 hover:bg-transparent">
              {columns.map((column) => {
                const isSortable = Boolean(column.sortable && column.accessorKey);
                const isSorted = sorting?.columnId === column.id;
                const sortDir = isSorted ? sorting.direction : null;

                return (
                  <TableHead
                    key={column.id}
                    style={{ minWidth: column.minWidth }}
                    className={cn(
                      "py-3.5 font-semibold text-foreground/90",
                      column.align === "center" && "text-center",
                      column.align === "end" && "text-end",
                      column.headerClassName,
                    )}
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(column.id)}
                        className="inline-flex items-center gap-1.5 font-semibold text-foreground/90 transition-colors hover:text-primary"
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
                    striped && (rIndex % 2 === 1 ? "bg-muted/40 dark:bg-muted/20" : "bg-card dark:bg-card"),
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
                  className={cn(
                    "border-b border-border/50 transition-colors duration-150",
                    striped && (rIndex % 2 === 1 ? "bg-muted/40 dark:bg-muted/20" : "bg-card dark:bg-card"),
                    !striped && "bg-card",
                    onRowClick
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
                <TableCell
                  colSpan={columns.length}
                  className="h-48 text-center"
                >
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
      </div>

      {/* Pagination */}
      {!isLoading && sortedData.length > 0 && (
        <DataTablePagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalItems={sortedData.length}
          pageSizeOptions={pageSizeOptions}
          onPageChange={(newIdx) => setPageIndex(newIdx)}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setPageIndex(0);
          }}
        />
      )}
    </div>
  );
}
