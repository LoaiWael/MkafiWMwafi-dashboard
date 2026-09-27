import { useState, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { FadeIn } from "@/components/animations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  /** Main title of the page */
  title: ReactNode;
  /** Optional descriptive subtitle */
  description?: ReactNode;
  /** Optional badge or status indicator displayed next to the title */
  badge?: ReactNode;
  /** Whether to show the refresh / update data button */
  showRefresh?: boolean;
  /** Callback fired when the refresh button is clicked */
  onRefresh?: () => void | Promise<void>;
  /** Controlled refreshing state for the spinner */
  isRefreshing?: boolean;
  /** Custom tooltip text for the refresh button (defaults to "تحديث البيانات") */
  refreshTooltip?: string;
  /** Custom aria-label for the refresh button */
  refreshAriaLabel?: string;
  /** Optional action buttons or controls (e.g. primary CTAs, filters, exports) */
  actions?: ReactNode;
  /** Custom children rendered in the actions area alongside actions */
  children?: ReactNode;
  /** Additional container styling */
  className?: string;
  /** Whether to wrap the header with an entrance animation (default: true) */
  animate?: boolean;
}

export default function PageHeader({
  title,
  description,
  badge,
  showRefresh = false,
  onRefresh,
  isRefreshing: controlledIsRefreshing,
  refreshTooltip = "تحديث البيانات",
  refreshAriaLabel = "تحديث البيانات ومزامنتها",
  actions,
  children,
  className,
  animate = true,
}: PageHeaderProps) {
  const [internalIsRefreshing, setInternalIsRefreshing] = useState(false);

  const isRefreshing =
    controlledIsRefreshing !== undefined
      ? controlledIsRefreshing
      : internalIsRefreshing;

  const shouldRenderRefresh = showRefresh || Boolean(onRefresh);

  async function handleRefreshClick() {
    if (isRefreshing) return;

    if (onRefresh) {
      const res = onRefresh();
      if (res instanceof Promise) {
        setInternalIsRefreshing(true);
        try {
          await res;
        } finally {
          setInternalIsRefreshing(false);
        }
      }
    } else {
      setInternalIsRefreshing(true);
      setTimeout(() => {
        setInternalIsRefreshing(false);
      }, 600);
    }
  }

  const content = (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 md:flex-row md:items-center",
        className,
      )}
    >
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          {typeof title === "string" ? (
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
          ) : (
            title
          )}
          {badge}
        </div>
        {description ? (
          typeof description === "string" ? (
            <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : (
            description
          )
        ) : null}
      </div>

      {shouldRenderRefresh || actions || children ? (
        <div className="flex flex-wrap items-center gap-2.5">
          {shouldRenderRefresh && (
            <TooltipProvider delay={150}>
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  onClick={handleRefreshClick}
                  disabled={isRefreshing}
                  className="flex size-9 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-muted cursor-pointer"
                  aria-label={refreshAriaLabel}
                >
                  <RefreshCw
                    className={cn("size-4", isRefreshing && "animate-spin")}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                  {refreshTooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {actions}
          {children}
        </div>
      ) : null}
    </div>
  );

  if (!animate) {
    return content;
  }

  return (
    <FadeIn direction="down" duration={0.4}>
      {content}
    </FadeIn>
  );
}
