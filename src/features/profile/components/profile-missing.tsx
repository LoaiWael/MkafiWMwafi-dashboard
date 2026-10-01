import { ArrowRight, UserX } from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Float, ScaleIn } from "@/components/animations";
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
    <ScaleIn initialScale={0.94} duration={0.4}>
      <Empty className="border border-dashed border-border bg-card py-16">
        <EmptyHeader>
          <Float distance={6} duration={3}>
            <EmptyMedia variant="icon">
              <UserX />
            </EmptyMedia>
          </Float>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link
            to={backTo}
            viewTransition
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <ArrowRight className="size-4" />
            {backLabel}
          </Link>
        </motion.div>
      </Empty>
    </ScaleIn>
  );
}

