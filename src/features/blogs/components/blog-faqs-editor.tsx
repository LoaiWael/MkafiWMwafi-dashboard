import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  HelpCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { BlogFaq } from "../types";

interface BlogFaqsEditorProps {
  faqs: BlogFaq[];
  onChange: (faqs: BlogFaq[]) => void;
  errors?: Record<string, string>;
}

export default function BlogFaqsEditor({
  faqs,
  onChange,
  errors,
}: BlogFaqsEditorProps) {
  const [highlightedFaqId, setHighlightedFaqId] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!highlightedFaqId) return;

    const el = document.getElementById(`faq-card-${highlightedFaqId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const inputEl = document.getElementById(
        `faq-question-${highlightedFaqId}`,
      );
      if (inputEl) {
        inputEl.focus({ preventScroll: true });
      }
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setHighlightedFaqId(null);
    }, 3200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [highlightedFaqId]);

  function handleAddFaq() {
    const newFaq: BlogFaq = {
      id: `faq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      question: "",
      answer: "",
    };
    onChange([...faqs, newFaq]);
    setHighlightedFaqId(newFaq.id);
  }

  function handleRemoveFaq(index: number) {
    const next = faqs.filter((_, i) => i !== index);
    onChange(next);
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const next = [...faqs];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    onChange(next);
  }

  function handleMoveDown(index: number) {
    if (index === faqs.length - 1) return;
    const next = [...faqs];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    onChange(next);
  }

  function handleQuestionChange(index: number, question: string) {
    const next = [...faqs];
    next[index] = { ...next[index], question };
    onChange(next);
  }

  function handleAnswerChange(index: number, answer: string) {
    const next = [...faqs];
    next[index] = { ...next[index], answer };
    onChange(next);
  }

  return (
    <TooltipProvider delay={150}>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-bold text-foreground sm:text-lg flex items-center gap-2">
            <HelpCircle className="size-5 text-secondary" />
            <span>الأسئلة الشائعة الخاصة بالمقال ({faqs.length})</span>
          </h3>

          <Button
            type="button"
            onClick={handleAddFaq}
            variant="outline"
            className="h-10 gap-1.5 border-secondary/30 text-secondary hover:bg-secondary-50 hover:text-secondary-800"
          >
            <Plus className="size-4" />
            <span>إضافة سؤال شائع</span>
          </Button>
        </div>

        {faqs.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-secondary-50 text-secondary mb-3">
              <HelpCircle className="size-6" />
            </div>
            <p className="text-sm font-bold text-foreground">
              لم يتم إضافة أي أسئلة شائعة لهذا المقال
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              تساعد الأسئلة الشائعة في تحسين ظهور المقال في نتائج محركات البحث (Rich Snippets).
            </p>
            <Button
              type="button"
              onClick={handleAddFaq}
              variant="outline"
              className="mt-4 gap-1.5 border-secondary/40 text-secondary hover:bg-secondary-50"
            >
              <Plus className="size-4" />
              <span>إضافة أول سؤال شائع</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const questionError = errors?.[`faqs.${index}.question`];
              const answerError = errors?.[`faqs.${index}.answer`];

              return (
                <Card
                  id={`faq-card-${faq.id}`}
                  key={faq.id}
                  className={cn(
                    "scroll-mt-24 overflow-hidden border bg-card shadow-xs transition-all hover:border-secondary-200",
                    questionError || answerError
                      ? "border-destructive/80"
                      : "border-border",
                    highlightedFaqId === faq.id && "animate-flash-secondary",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/40 px-4 py-2.5 sm:px-6">
                    <div className="flex items-center gap-2">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-bold text-secondary-foreground shadow-xs">
                        س{index + 1}
                      </span>
                      <span className="text-xs font-bold text-foreground sm:text-sm">
                        سؤال وجواب #{index + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={index === 0}
                              onClick={() => handleMoveUp(index)}
                              className="size-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
                              aria-label="تحريك السؤال لأعلى"
                            />
                          }
                        >
                          <ArrowUp className="size-3.5" />
                        </TooltipTrigger>
                        <TooltipContent side="top">تحريك السؤال لأعلى</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={index === faqs.length - 1}
                              onClick={() => handleMoveDown(index)}
                              className="size-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
                              aria-label="تحريك السؤال لأسفل"
                            />
                          }
                        >
                          <ArrowDown className="size-3.5" />
                        </TooltipTrigger>
                        <TooltipContent side="top">تحريك السؤال لأسفل</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveFaq(index)}
                              className="size-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                              aria-label="حذف السؤال"
                            />
                          }
                        >
                          <Trash2 className="size-3.5" />
                        </TooltipTrigger>
                        <TooltipContent side="top">حذف هذا السؤال</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <CardContent className="space-y-4 p-4 sm:p-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor={`faq-question-${faq.id}`}
                        className="text-xs font-bold text-foreground sm:text-sm"
                      >
                        نص السؤال *
                      </Label>
                      <Input
                        id={`faq-question-${faq.id}`}
                        value={faq.question}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        placeholder="مثال: هل تنطبق ضريبة القيمة المضافة على جميع العقود التجارية؟"
                        aria-invalid={Boolean(questionError)}
                        className={`h-11 rounded-xl bg-background ${
                          questionError ? "border-destructive focus-visible:ring-destructive/30" : ""
                        }`}
                      />
                      {questionError && (
                        <p className="text-[11px] font-medium text-destructive">
                          {questionError}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor={`faq-answer-${faq.id}`}
                        className="text-xs font-bold text-foreground sm:text-sm"
                      >
                        نص الإجابة *
                      </Label>
                      <Textarea
                        id={`faq-answer-${faq.id}`}
                        value={faq.answer}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder="اكتب الإجابة التوضيحية الدقيقة لهذا السؤال..."
                        rows={3}
                        aria-invalid={Boolean(answerError)}
                        className={`rounded-xl bg-background leading-relaxed ${
                          answerError ? "border-destructive focus-visible:ring-destructive/30" : ""
                        }`}
                      />
                      {answerError && (
                        <p className="text-[11px] font-medium text-destructive">
                          {answerError}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <div className="flex justify-center pt-2">
              <Button
                type="button"
                onClick={handleAddFaq}
                variant="outline"
                className="gap-2 rounded-xl border-dashed border-2 border-secondary/40 px-5 py-4 text-xs font-bold text-secondary hover:bg-secondary-50 sm:text-sm"
              >
                <Plus className="size-4" />
                <span>إضافة سؤال شائع آخر</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
