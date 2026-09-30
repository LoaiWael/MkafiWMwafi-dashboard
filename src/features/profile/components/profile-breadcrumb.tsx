import { Link } from "react-router";

export interface ProfileCrumb {
  label: string;
  to?: string;
}

interface ProfileBreadcrumbProps {
  items: readonly ProfileCrumb[];
}

export default function ProfileBreadcrumb({ items }: ProfileBreadcrumbProps) {
  return (
    <nav
      aria-label="مسار التنقل"
      className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          {item.to ? (
            <Link to={item.to} viewTransition className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
