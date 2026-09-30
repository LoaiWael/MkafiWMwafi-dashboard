import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useContentDraft } from "@/features/content/components/content-draft-provider";

export default function ContentSaveBar() {
  const { isDirty, save, cancel } = useContentDraft();
  const { isMobile, state } = useSidebar();
  const sidebarGap = isMobile
    ? undefined
    : state === "collapsed"
      ? "var(--sidebar-width-icon)"
      : "var(--sidebar-width)";

  return (
    <>
      {isDirty ? <div className="h-24" aria-hidden="true" /> : null}
      <AnimatePresence>
        {isDirty ? (
          <motion.div
            key="content-save-bar"
            role="region"
            aria-label="حفظ المحتوى"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
            style={{ marginInlineStart: sidebarGap }}
          >
            <div className="pointer-events-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-10 rounded-full border border-border bg-card px-4 py-3 shadow-lg">
              <p className="text-sm text-muted-foreground">تعديلات غير محفوظة</p>
              <div className="flex shrink-0 items-center gap-2">
                <Button type="button" variant="outline" onClick={cancel}>
                  إلغاء
                </Button>
                <Button type="button" onClick={save}>
                  حفظ
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
