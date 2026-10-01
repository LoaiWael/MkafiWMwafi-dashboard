import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
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
  activeLabel?: string;
  actions?: ReactNode;
  className?: string;
}

export default function ProfileBanner({
  name,
  role,
  avatarUrl,
  active,
  activeLabel = "الحساب نشط",
  actions,
  className,
}: ProfileBannerProps) {
  const initials = profileInitials(name);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-shadow hover:shadow-sm sm:rounded-3xl",
        className,
      )}
    >
      <div className="relative h-28 w-full overflow-hidden bg-gradient-to-br from-primary-100/70 via-primary-50 to-secondary-50/60 dark:from-primary-950/40 dark:via-background dark:to-primary-900/20 sm:h-40 md:h-44">
        {/* Animated ambient mesh gradient accents */}
        <motion.div
          aria-hidden
          animate={{
            scale: [1, 1.08, 1],
            x: [0, 8, 0],
            y: [0, -6, 0],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-14 -start-10 size-72 rounded-full bg-primary-200/60 blur-3xl dark:bg-primary-800/30"
        />
        <motion.div
          aria-hidden
          animate={{
            scale: [1, 1.12, 1],
            x: [0, -10, 0],
            y: [0, 8, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="pointer-events-none absolute -top-10 -end-12 size-80 rounded-full bg-secondary-100/70 blur-3xl dark:bg-secondary-800/20"
        />
        <motion.div
          aria-hidden
          animate={{
            scale: [1, 1.06, 1],
            y: [0, -10, 0],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
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
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative -mt-10 mb-3 shrink-0 sm:-mt-14 sm:mb-0"
          >
            <Avatar className="size-20 select-none border-4 border-card bg-card shadow-md transition-transform duration-200 hover:scale-105 sm:size-28">
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
            {active ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.25, type: "spring", stiffness: 400, damping: 20 }}
                className="absolute bottom-1 end-1 z-10 flex size-4 items-center justify-center rounded-full border-2 border-card bg-emerald-500 shadow-xs sm:bottom-1.5 sm:end-1.5 sm:size-4.5"
                title={activeLabel}
                aria-label={activeLabel}
              >
                <span className="size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              </motion.span>
            ) : null}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18, duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="space-y-1 pb-0.5 text-center sm:space-y-1.5 sm:pb-1 sm:text-start"
          >
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {name}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <motion.div
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.15 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary-50 px-3 py-0.5 text-xs font-semibold text-primary shadow-2xs dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300"
              >
                <ShieldCheck className="size-3.5 shrink-0 text-primary dark:text-primary-300" />
                <span>{role}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {actions ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.22, duration: 0.3 }}
            className="mt-4 flex w-full flex-wrap items-center justify-center gap-2 sm:mt-0 sm:w-auto sm:justify-end sm:gap-2.5 [&>button]:w-full [&>button]:sm:w-auto"
          >
            {actions}
          </motion.div>
        ) : null}
      </div>
    </motion.section>
  );
}
