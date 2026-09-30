import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function profileInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return "م";
  return parts.map((part) => part.charAt(0)).join("");
}

interface ProfileBannerProps {
  name: string;
  role: string;
  avatarUrl?: string;
  kindLabel?: string;
  active?: boolean;
  actions?: ReactNode;
  className?: string;
}

export default function ProfileBanner({
  name,
  role,
  avatarUrl,
  active,
  actions,
  className,
}: ProfileBannerProps) {
  const initials = profileInitials(name);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-shadow hover:shadow-sm sm:rounded-3xl",
        className,
      )}
    >
      <div className="relative h-28 w-full overflow-hidden bg-gradient-to-br from-primary-100/70 via-primary-50 to-secondary-50/60 dark:from-primary-950/40 dark:via-background dark:to-primary-900/20 sm:h-40 md:h-44">
        {/* Static Mesh Gradient Accents */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-14 -start-10 size-72 rounded-full bg-primary-200/60 blur-3xl dark:bg-primary-800/30"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -end-12 size-80 rounded-full bg-secondary-100/70 blur-3xl dark:bg-secondary-800/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-14 start-1/3 size-72 rounded-full bg-tertiary-100/60 blur-3xl dark:bg-tertiary-800/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -end-6 size-60 rounded-full bg-primary-100/70 blur-2xl dark:bg-primary-900/30"
        />

        {/* Subtle dot matrix texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay [background-image:radial-gradient(var(--foreground)_1px,transparent_1px)] [background-size:14px_14px]"
        />

        {/* Top ambient soft light */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/60 via-white/10 to-transparent dark:from-white/5"
        />

        {/* Deep, smooth bottom fade into the white card bar */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-card via-card/80 to-transparent"
        />
      </div>

      <div className="relative flex flex-col items-center px-4 pb-5 pt-0 text-center sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pb-6 sm:text-start">
        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-4">
          <div className="relative -mt-10 mb-3 shrink-0 sm:-mt-14 sm:mb-0">
            <Avatar className="size-20 select-none border-4 border-card bg-card shadow-md sm:size-28">
              {avatarUrl ? (
                <AvatarImage
                  src={avatarUrl}
                  alt={name}
                  draggable={false}
                  className="pointer-events-none select-none"
                />
              ) : null}
              <AvatarFallback className="select-none bg-primary/10 text-xl font-bold text-primary sm:text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            {active !== undefined ? (
              <span
                className={cn(
                  "absolute bottom-1 end-1 z-10 flex size-4 items-center justify-center rounded-full border-2 border-card shadow-xs sm:bottom-1.5 sm:end-1.5 sm:size-4.5",
                  active ? "bg-emerald-500" : "bg-muted-foreground/50",
                )}
                title={active ? "الحساب نشط" : "الحساب موقوف"}
                aria-label={active ? "الحساب نشط" : "الحساب موقوف"}
              >
                {active ? (
                  <span className="size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                ) : null}
              </span>
            ) : null}
          </div>

          <div className="space-y-1 pb-0.5 text-center sm:space-y-1.5 sm:pb-1 sm:text-start">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {name}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary-50 px-3 py-0.5 text-xs font-semibold text-primary shadow-2xs dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
                <ShieldCheck className="size-3.5 shrink-0 text-primary dark:text-primary-300" />
                <span>{role}</span>
              </div>
            </div>
          </div>
        </div>

        {actions ? (
          <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-2 sm:mt-0 sm:w-auto sm:justify-end sm:gap-2.5 [&>button]:w-full [&>button]:sm:w-auto">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}
