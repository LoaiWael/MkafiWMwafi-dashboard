import { Plus, Trash2 } from "lucide-react";
import {
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditableText from "@/features/content/components/editable-text";

interface FaqItemProps {
  id: string;
  question: string;
  answer: string;
  onRemove: () => void;
}

export default function FaqItem({
  id,
  question,
  answer,
  onRemove,
}: FaqItemProps) {
  return (
    <AccordionItem
      value={id}
      className="rounded-xl border border-border bg-card transition-colors duration-200 hover:border-border/80 data-open:border-primary/40 data-open:bg-primary-soft data-open:shadow-xs sm:rounded-2xl"
    >
      <AccordionTrigger
        nativeButton={false}
        render={<div />}
        className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3.5 py-3 text-start text-xs font-semibold text-foreground sm:min-h-14 sm:gap-3 sm:px-5 sm:py-4 sm:text-sm"
      >
        <p className="min-w-0 flex-1">
          <EditableText
            defaultValue={question}
            label="تعديل السؤال"
            fullWidth
          />
        </p>

        <span
          className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors duration-200 group-data-panel-open:bg-primary/15 group-data-panel-open:text-primary sm:size-6"
          aria-hidden="true"
        >
          <Plus className="size-3.5 transition-transform duration-200 ease-out group-data-panel-open:rotate-45 sm:size-4" />
        </span>

        <Tooltip>
          <TooltipTrigger
            type="button"
            aria-label="حذف السؤال"
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
            onPointerDown={(event) => event.stopPropagation()}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-destructive shadow-xs transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5" />
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
            حذف السؤال
          </TooltipContent>
        </Tooltip>
      </AccordionTrigger>

      <AccordionPanel>
        <p className="px-3.5 pb-3.5 text-xs leading-6 text-muted-foreground sm:px-5 sm:pb-5 sm:text-sm sm:leading-7">
          <EditableText
            defaultValue={answer}
            label="تعديل الإجابة"
            fullWidth
          />
        </p>
      </AccordionPanel>
    </AccordionItem>
  );
}
