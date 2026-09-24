"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showHandle?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthMap = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
};

export default function ResponsiveModal({
  isOpen,
  onClose,
  children,
  className,
  showHandle = true,
  maxWidth = "lg",
}: ResponsiveModalProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Prevent background scrolling when modal is open & listen for Escape
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex",
            isDesktop
              ? "items-center justify-center p-4"
              : "flex-col justify-end p-0",
          )}
          dir="rtl"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/50 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Container: Bottom sheet with drag gesture on mobile, centered dialog on desktop */}
          {isDesktop ? (
            <motion.div
              key="desktop-modal"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "relative z-10 w-full rounded-3xl border border-border bg-card p-7 shadow-2xl max-h-[90vh] overflow-y-auto",
                maxWidthMap[maxWidth],
                className,
              )}
            >
              {children}
            </motion.div>
          ) : (
            <motion.div
              key="mobile-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 60 || info.velocity.y > 250) {
                  onClose();
                }
              }}
              className={cn(
                "relative z-10 w-full rounded-t-3xl border-t border-border bg-card p-5 shadow-2xl max-h-[85vh] overflow-y-auto",
                className,
              )}
            >
              {/* Drag Handle Bar for mobile */}
              {showHandle && (
                <div className="flex justify-center pb-2 pt-0">
                  <div className="h-1.5 w-14 rounded-full bg-muted-foreground/30 cursor-grab active:cursor-grabbing" />
                </div>
              )}

              {children}
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
