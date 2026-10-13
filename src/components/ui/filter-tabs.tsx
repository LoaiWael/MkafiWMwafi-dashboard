import type { ComponentType, ReactNode } from "react";
import { useUrlTab } from "@/hooks/use-url-tab";
import { cn } from "@/lib/utils";

export interface FilterTabItem<T extends string = string> {
  id: T;
  label: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  count?: number | string;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface FilterTabsProps<T extends string = string> {
  /** Array of tab items */
  items: readonly FilterTabItem<T>[] | FilterTabItem<T>[];
  /** Currently active tab (when in controlled mode) */
  value?: T;
  /** Callback when the selected tab changes */
  onValueChange?: (value: T) => void;
  /** URL search parameter key (defaults to "tab") */
  paramKey?: string;
  /** Default fallback tab value */
  defaultValue?: T;
  /** Whether to clear the param from the URL if it matches defaultValue */
  clearDefaultFromUrl?: boolean;
  /** Layout mode */
  layout?: "auto" | "scroll" | "grid" | "wrap";
  /** Grid columns class when using grid or auto layout (e.g. "sm:grid-cols-4 lg:grid-cols-7" or "grid-cols-2 md:grid-cols-4") */
  gridColsClass?: string;
  /** Outer container class */
  className?: string;
  /** Inner nav element class */
  navClassName?: string;
  /** Per-item class */
  itemClassName?: string;
  /** Active item custom class */
  activeItemClassName?: string;
  /** Inactive item custom class */
  inactiveItemClassName?: string;
  /** Accessible label for the tablist */
  ariaLabel?: string;
  /** Prefix for tab element IDs */
  idPrefix?: string;
}

export function FilterTabs<T extends string = string>({
  items,
  value,
  onValueChange,
  paramKey = "tab",
  defaultValue,
  clearDefaultFromUrl = false,
  layout = "auto",
  gridColsClass,
  className,
  navClassName,
  itemClassName,
  activeItemClassName,
  inactiveItemClassName,
  ariaLabel = "تبويبات الفلترة",
  idPrefix = "tab",
}: FilterTabsProps<T>) {
  const fallbackDefault = defaultValue ?? items[0]?.id ?? ("" as T);
  const validValues = items.map((item) => item.id);

  const [urlTab, setUrlTab] = useUrlTab<T>({
    paramKey,
    defaultValue: fallbackDefault,
    validValues,
    clearDefaultFromUrl,
  });

  const isControlled = value !== undefined;
  const activeTab = isControlled ? value : urlTab;

  function handleTabClick(itemId: T) {
    if (isControlled) {
      onValueChange?.(itemId);
    } else {
      setUrlTab(itemId);
      onValueChange?.(itemId);
    }
  }

  let layoutClasses = "";
  if (layout === "scroll") {
    layoutClasses =
      "flex w-full min-w-0 items-center overflow-x-auto no-scrollbar scroll-smooth gap-1 sm:gap-1.5 snap-x snap-mandatory touch-pan-x overscroll-x-contain";
  } else if (layout === "grid") {
    layoutClasses = cn(
      "grid w-full min-w-0 gap-1 sm:gap-1.5",
      gridColsClass || "grid-cols-2 md:grid-cols-4",
    );
  } else if (layout === "wrap") {
    layoutClasses = "flex flex-wrap items-center gap-1.5 sm:gap-2";
  } else {
    // "auto" responsive scroll-on-mobile, grid-on-larger screens
    layoutClasses = cn(
      "flex w-full min-w-0 items-center overflow-x-auto no-scrollbar scroll-smooth gap-1 sm:gap-1.5 snap-x snap-mandatory touch-pan-x overscroll-x-contain",
      gridColsClass
        ? `sm:grid ${gridColsClass}`
        : "sm:grid sm:grid-cols-2 md:grid-cols-4",
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-1 sm:p-1.5 shadow-xs overflow-hidden",
        className,
      )}
    >
      <nav
        className={cn(layoutClasses, navClassName)}
        role="tablist"
        aria-label={ariaLabel}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isScrollLayout = layout === "scroll" || layout === "auto";

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${idPrefix}-${item.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${item.id}`}
              aria-label={item.ariaLabel}
              disabled={item.disabled}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                "flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-2.5 py-2 sm:px-3.5 sm:py-2.5 text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer select-none whitespace-nowrap active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed",
                isScrollLayout ? "shrink-0 min-w-fit snap-start" : "w-full",
                isActive
                  ? cn(
                      "bg-linear-to-r from-primary-800 via-primary to-primary-400 text-primary-foreground shadow-md shadow-inner-primary hover:brightness-105 ring-1 ring-primary/40",
                      activeItemClassName,
                    )
                  : cn(
                      "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50 hover:border-border",
                      inactiveItemClassName,
                    ),
                itemClassName,
              )}
            >
              {Icon && <Icon className="size-3.5 sm:size-4 shrink-0" />}
              <span className="truncate">{item.label}</span>
              {item.count !== undefined && (
                <span
                  className={cn(
                    "ms-1 inline-flex shrink-0 items-center justify-center min-w-5 h-5 rounded-full px-1.5 text-[10px] font-extrabold tabular-nums",
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-muted-foreground/15 text-muted-foreground",
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
