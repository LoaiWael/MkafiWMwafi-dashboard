import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface FeaturePageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: ReactNode;
  toolbar?: ReactNode;
  children?: ReactNode;
}

export default function FeaturePage({
  title,
  description,
  icon: Icon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  toolbar,
  children,
}: FeaturePageProps) {
  return (
    <div className="page-shell py-8">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      {toolbar ? <div className="mb-6">{toolbar}</div> : null}

      {children ?? (
        <Empty className="border border-dashed border-border bg-card py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icon />
            </EmptyMedia>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
          {emptyAction ? <EmptyContent>{emptyAction}</EmptyContent> : null}
        </Empty>
      )}
    </div>
  );
}
