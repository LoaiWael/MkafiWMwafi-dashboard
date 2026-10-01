import { Link } from "react-router";
import { motion } from "motion/react";

export interface ProfileCrumb {
  label: string;
  to?: string;
}

interface ProfileBreadcrumbProps {
  items: readonly ProfileCrumb[];
}

export default function ProfileBreadcrumb({ items }: ProfileBreadcrumbProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      aria-label="مسار التنقل"
      className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          {item.to ? (
            <Link to={item.to} viewTransition className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </motion.nav>
  );
}

