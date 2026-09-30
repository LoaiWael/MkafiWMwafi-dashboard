import { useState } from "react";
import { Plus } from "lucide-react";
import { FadeIn } from "@/components/animations";
import { Accordion } from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditableText from "@/features/content/components/editable-text";
import FaqItem from "@/features/content/components/faq-item";
import SectionHeading from "@/features/content/components/section-heading";
import { useTrackedState } from "@/features/content/components/content-draft-provider";
import { FAQ_COPY, FAQS } from "@/features/content/constants";

interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [items, setItems, markDirty] = useTrackedState<FaqEntry[]>(() =>
    FAQS.map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
    })),
  );
  const [openValues, setOpenValues] = useState<string[]>(() => {
    const openFaq = FAQS.find((faq) => faq.open);
    return openFaq ? [openFaq.id] : [];
  });

  function addFaq() {
    const id = crypto.randomUUID();
    setItems((current) => [
      ...current,
      { id, question: "سؤال جديد", answer: "إجابة جديدة" },
    ]);
    setOpenValues([id]);
    markDirty();
  }

  function removeFaq(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    setOpenValues((current) => current.filter((value) => value !== id));
    markDirty();
  }

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="overflow-hidden bg-background py-8 sm:py-16 lg:py-24"
    >
      <div className="page-shell">
        <FadeIn direction="up" distance={20}>
          <SectionHeading
            id="faq-title"
            eyebrow={
              <EditableText
                defaultValue={FAQ_COPY.eyebrow}
                label="تعديل التسمية"
              />
            }
            title={
              <EditableText
                defaultValue={FAQ_COPY.title}
                label="تعديل العنوان"
                fullWidth
              />
            }
            description={
              <EditableText
                defaultValue={FAQ_COPY.description}
                label="تعديل الوصف"
                fullWidth
              />
            }
          />
        </FadeIn>

        <div className="mx-auto mt-6 max-w-3xl sm:mt-10 lg:mt-12">
          <Accordion
            value={openValues}
            onValueChange={setOpenValues}
            className="space-y-2.5 sm:space-y-4"
          >
            {items.map((item) => (
              <FaqItem
                key={item.id}
                id={item.id}
                question={item.question}
                answer={item.answer}
                onRemove={() => removeFaq(item.id)}
              />
            ))}
          </Accordion>

          <Tooltip>
            <TooltipTrigger
              type="button"
              aria-label="إضافة سؤال"
              onClick={addFaq}
              className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-border px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary-soft sm:mt-4"
            >
              <Plus className="size-4" />
              إضافة سؤال
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
              إضافة سؤال
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </section>
  );
}
