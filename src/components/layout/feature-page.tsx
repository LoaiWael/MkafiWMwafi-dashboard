import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { FadeIn, Float, ScaleIn } from "@/components/animations";
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
    <div className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-8">
      <FadeIn duration={0.3}>
        <PageHeader
          title={title}
          description={description}
          badge={badge}
          actions={actions}
        />
      </FadeIn>

      {toolbar ? (
        <FadeIn duration={0.3} delay={0.06}>
          <div>{toolbar}</div>
        </FadeIn>
      ) : null}

      {children ?? (
        <ScaleIn initialScale={0.95} duration={0.4} delay={0.1}>
          <Empty className="border border-dashed border-border bg-card py-16">
            <EmptyHeader>
              <Float distance={6} duration={3}>
                <EmptyMedia variant="icon">
                  <Icon />
                </EmptyMedia>
              </Float>
              <EmptyTitle>{emptyTitle}</EmptyTitle>
              <EmptyDescription>{emptyDescription}</EmptyDescription>
            </EmptyHeader>
            {emptyAction ? <EmptyContent>{emptyAction}</EmptyContent> : null}
          </Empty>
        </ScaleIn>
      )}
    </div>
  );
}


