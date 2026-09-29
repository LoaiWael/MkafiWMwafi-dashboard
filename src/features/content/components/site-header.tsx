import {
  CONTENT_PAGES,
  SITE_PREVIEW_NAV,
  type ContentPageId,
} from "@/features/content/constants";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  activePage: ContentPageId;
  onNavigate: (page: ContentPageId) => void;
}

export default function SiteHeader({ activePage, onNavigate }: SiteHeaderProps) {
  return (
    <header className="border-b border-border bg-background shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-3 sm:px-6 lg:h-20 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4 lg:px-8 lg:py-0">
        <button
          type="button"
          onClick={() => onNavigate(CONTENT_PAGES.home)}
          className="flex w-fit shrink-0 items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:gap-2.5"
        >
          <img
            src={SITE.logo}
            alt=""
            width={48}
            height={48}
            className="size-9 shrink-0 object-contain sm:size-11 md:size-12"
          />
          <span className="flex min-w-0 flex-col gap-0.5 text-start">
            <span className="text-sm font-bold leading-snug text-foreground sm:text-base md:text-lg">
              {SITE.name}
            </span>
            <span className="text-2xs font-medium leading-snug text-muted-foreground sm:text-xs">
              {SITE.tagline}
            </span>
          </span>
        </button>

        <nav aria-label="القائمة الرئيسية" className="shrink-0 lg:w-auto">
          <ul className="flex items-center justify-center gap-3 sm:gap-6 lg:gap-8">
            {SITE_PREVIEW_NAV.map((link) => {
              const isActive = activePage === link.id;

              return (
                <li key={link.id} className="shrink-0">
                  <button
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => onNavigate(link.id)}
                    className={cn(
                      "relative inline-flex h-9 items-center py-1 text-xs font-semibold transition-colors sm:h-10 sm:py-1.5 sm:text-sm lg:text-base",
                      isActive
                        ? "text-secondary"
                        : "text-foreground hover:text-secondary",
                    )}
                  >
                    {link.label}
                    {isActive ? (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-secondary" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <span className="hidden lg:block" aria-hidden="true" />
      </div>
    </header>
  );
}
