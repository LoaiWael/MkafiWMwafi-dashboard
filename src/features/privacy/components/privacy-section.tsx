import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import RichTextEditor from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
export default function PrivacySection() {
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState(content);
  const [saved, setSaved] = useState(false);
  const isUnchanged = content === savedContent;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavedContent(content);
    setSaved(true);
  }

  function handleChange(html: string) {
    setContent(html);
    setSaved(false);
  }

  return (
    <div className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-8">
      <FadeIn duration={0.3}>
        <PageHeader
          title="سياسة الخصوصية"
          description="تحرير نص سياسة الخصوصية الذي يُعرض في الموقع."
        />
      </FadeIn>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FadeIn duration={0.3} delay={0.08}>
          <div className="overflow-hidden rounded-2xl border border-border bg-card p-1 shadow-xs sm:p-2">
            <RichTextEditor
              id="privacy-content"
              value={content}
              onChange={handleChange}
              placeholder="اكتب سياسة الخصوصية هنا"
            />
          </div>
        </FadeIn>

        <FadeIn duration={0.3} delay={0.12}>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <AnimatePresence>
              {saved ? (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 sm:text-sm"
                >
                  <CheckCircle2 className="size-4" />
                  <span>تم حفظ النص بنجاح</span>
                </motion.p>
              ) : null}
            </AnimatePresence>
            <Button type="submit" disabled={isUnchanged} className="w-full sm:w-auto">
              حفظ سياسة الخصوصية
            </Button>
          </div>
        </FadeIn>
      </form>
    </div>
  );
}

