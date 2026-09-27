import type { ReactNode } from "react";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  /** Main title of the page */
  title: ReactNode;
  /** Optional descriptive subtitle */
  description?: ReactNode;
  /** Optional badge or status indicator displayed next to the title */
  badge?: ReactNode;
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
  actions,
  children,
  className,
  animate = true,
}: PageHeaderProps) {
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

      {actions || children ? (
        <div className="flex flex-wrap items-center gap-2.5">
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
