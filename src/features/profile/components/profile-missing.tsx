import { ArrowRight, UserX } from "lucide-react";
import { Link } from "react-router";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface ProfileMissingProps {
  title: string;
  description: string;
  backTo: string;
  backLabel: string;
}

export default function ProfileMissing({
  title,
  description,
  backTo,
  backLabel,
}: ProfileMissingProps) {
  return (
    <Empty className="border border-dashed border-border bg-card py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserX />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <Link
        to={backTo}
        viewTransition
        className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground hover:bg-muted"
      >
        <ArrowRight className="size-4" />
        {backLabel}
      </Link>
    </Empty>
  );
}
