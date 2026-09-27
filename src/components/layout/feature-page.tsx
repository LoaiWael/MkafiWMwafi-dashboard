import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import PageHeader from "@/components/layout/page-header";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface FeaturePageProps {
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
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
  badge,
  actions,
  icon: Icon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  toolbar,
  children,
}: FeaturePageProps) {
  return (
    <div className="page-shell space-y-6 py-8">
      <PageHeader
        title={title}
        description={description}
        badge={badge}
        actions={actions}
      />

      {toolbar ? <div>{toolbar}</div> : null}

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

