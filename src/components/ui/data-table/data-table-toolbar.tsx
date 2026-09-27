import { Filter, Search, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { DataTableFilterConfig } from "./types";

interface DataTableToolbarProps<TData> {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: DataTableFilterConfig<TData>[];
  activeFilters: Record<string, string>;
  onFilterChange: (filterId: string, value: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  actions?: ReactNode;
  children?: ReactNode;
}

export function DataTableToolbar<TData>({
  searchValue,
  onSearchChange,
  searchPlaceholder = "بحث...",
  filters = [],
  activeFilters,
  onFilterChange,
  onResetFilters,
  hasActiveFilters,
  actions,
  children,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex flex-col gap-2.5 border-b border-border px-4 py-2.5 sm:py-3">
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="relative flex-1 sm:max-w-xs md:max-w-sm">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 w-full pe-8 ps-9 text-sm"
          />
          <AnimatePresence>
            {searchValue ? (
              <motion.button
                key="clear-search-btn"
                type="button"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
                onClick={() => onSearchChange("")}
                aria-label="مسح البحث"
                className="absolute end-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-3.5" />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Filter controls & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const currentValue = activeFilters[filter.id] ?? "all";
            const selectedOption = filter.options.find(
              (opt) => opt.value === currentValue,
            );
            const selectedLabel =
              currentValue === "all" || !currentValue
                ? `كل ${filter.title}`
                : (selectedOption?.label ?? currentValue);

            return (
              <div key={filter.id} className="flex items-center">
                <Select
                  value={currentValue}
                  onValueChange={(val) => onFilterChange(filter.id, val ?? "all")}
                >
                  <SelectTrigger
                    className="h-9 min-w-36 gap-2 rounded-lg border-input bg-background px-3 text-xs font-medium text-foreground hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                    aria-label={filter.title}
                  >
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      {Icon ? (
                        <Icon className="size-3.5" />
                      ) : (
                        <Filter className="size-3.5" />
                      )}
                    </div>
                    <SelectValue placeholder={`كل ${filter.title}`}>
                      {() => <span>{selectedLabel}</span>}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent
                    side="bottom"
                    sideOffset={4}
                    align="start"
                    alignItemWithTrigger={false}
                    className="min-w-40"
                  >
                    <SelectItem value="all">
                      <span>كل {filter.title}</span>
                    </SelectItem>
                    {filter.options.map((option) => {
                      const OptionIcon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {OptionIcon ? (
                              <OptionIcon className="size-3.5 text-muted-foreground" />
                            ) : null}
                            <span>{option.label}</span>
                            {option.count !== undefined ? (
                              <span className="ms-auto text-[11px] text-muted-foreground">
                                ({option.count})
                              </span>
                            ) : null}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            );
          })}

          <AnimatePresence>
            {hasActiveFilters ? (
              <motion.div
                key="clear-filters-btn"
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <TooltipProvider delay={150}>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={onResetFilters}
                          aria-label="مسح جميع الفلاتر"
                          className="size-9 shrink-0 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive active:scale-95"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      }
                    />
                    <TooltipContent side="top" sideOffset={4}>
                      مسح جميع الفلاتر
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {actions ? <div className="ms-auto sm:ms-0">{actions}</div> : null}
        </div>
      </div>

      {children}
    </div>
  );
}
