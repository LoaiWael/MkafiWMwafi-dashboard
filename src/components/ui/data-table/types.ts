import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc" | null;

export interface DataTableColumn<TData> {
  id: string;
  header: string | ReactNode;
  accessorKey?: keyof TData;
  sortValue?: (item: TData) => number | string | Date | null | undefined;
  cell?: (item: TData, index: number) => ReactNode;
  sortable?: boolean;
  align?: "start" | "center" | "end";
  className?: string;
  headerClassName?: string;
  minWidth?: string;
}

export interface DataTableFilterOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

export interface DataTableFilterConfig<TData> {
  id: string;
  title: string;
  options: DataTableFilterOption[];
  accessorKey?: keyof TData;
  filterFn?: (item: TData, selectedValue: string) => boolean;
  defaultValue?: string;
  icon?: LucideIcon;
}

export interface DataTableSortingState {
  columnId: string;
  direction: "asc" | "desc";
}

export interface DataTablePaginationState {
  pageIndex: number;
  pageSize: number;
}
