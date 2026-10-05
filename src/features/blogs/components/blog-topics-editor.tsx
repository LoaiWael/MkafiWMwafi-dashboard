import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";
import RichTextEditor from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { BlogTopic } from "../types";

interface BlogTopicsEditorProps {
  topics: BlogTopic[];
  onChange: (topics: BlogTopic[]) => void;
  errors?: Record<string, string>;
}

export default function BlogTopicsEditor({
  topics,
  onChange,
  errors,
}: BlogTopicsEditorProps) {
  const [highlightedTopicId, setHighlightedTopicId] = useState<string | null>(
    null,
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!highlightedTopicId) return;

    const el = document.getElementById(`topic-card-${highlightedTopicId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const inputEl = document.getElementById(
        `topic-headline-${highlightedTopicId}`,
      );
      if (inputEl) {
        inputEl.focus({ preventScroll: true });
      }
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setHighlightedTopicId(null);
    }, 3200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [highlightedTopicId]);

  function handleAddTopic() {
    const newTopic: BlogTopic = {
      id: `topic-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      headline: `المحور ${topics.length + 1}`,
      content: "<p>اكتب تفاصيل ومحتوى هذا المحور هنا...</p>",
    };
    onChange([...topics, newTopic]);
    setHighlightedTopicId(newTopic.id);
  }

  function handleRemoveTopic(index: number) {
    if (topics.length <= 1) {
      onChange([
        {
          id: `topic-${Date.now()}`,
          headline: "المحور الأول",
          content: "<p></p>",
        },
      ]);
      return;
    }
    const next = topics.filter((_, i) => i !== index);
    onChange(next);
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const next = [...topics];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    onChange(next);
  }

  function handleMoveDown(index: number) {
    if (index === topics.length - 1) return;
    const next = [...topics];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    onChange(next);
  }

  function handleHeadlineChange(index: number, headline: string) {
    const next = [...topics];
    next[index] = { ...next[index], headline };
    onChange(next);
  }

  function handleContentChange(index: number, content: string) {
    const next = [...topics];
    next[index] = { ...next[index], content };
    onChange(next);
  }

  return (
    <TooltipProvider delay={150}>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-bold text-foreground sm:text-lg flex items-center gap-2">
            <Layers className="size-5 text-primary" />
            <span>محاور ومحتوى المقال ({topics.length})</span>
          </h3>

          <Button
            type="button"
            onClick={handleAddTopic}
            variant="outline"
            className="h-10 gap-1.5 border-primary/30 text-primary hover:bg-primary-50 hover:text-primary-800"
          >
            <Plus className="size-4" />
            <span>إضافة محور جديد</span>
          </Button>
        </div>

        {errors?.topics && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-semibold text-destructive">
            {errors.topics}
          </div>
        )}

        <div className="space-y-6">
          {topics.map((topic, index) => {
            const headlineError = errors?.[`topics.${index}.headline`];
            const contentError = errors?.[`topics.${index}.content`];

            return (
              <Card
                id={`topic-card-${topic.id}`}
                key={topic.id}
                className={cn(
                  "scroll-mt-24 overflow-hidden border bg-card shadow-xs transition-all hover:border-primary-200",
                  headlineError || contentError
                    ? "border-destructive/80"
                    : "border-border",
                  highlightedTopicId === topic.id && "animate-flash-primary",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/40 px-4 py-3 sm:px-6">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-xs">
                      {index + 1}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      المحور #{index + 1}
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
                            aria-label="تحريك المحور لأعلى"
                          />
                        }
                      >
                        <ArrowUp className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent side="top">تحريك المحور لأعلى</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={index === topics.length - 1}
                            onClick={() => handleMoveDown(index)}
                            className="size-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30 cursor-pointer"
                            aria-label="تحريك المحور لأسفل"
                          />
                        }
                      >
                        <ArrowDown className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent side="top">تحريك المحور لأسفل</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTopic(index)}
                            className="size-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                            aria-label="حذف المحور"
                          />
                        }
                      >
                        <Trash2 className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent side="top">حذف هذا المحور</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <CardContent className="space-y-4 p-4 sm:p-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`topic-headline-${topic.id}`}
                      className="text-xs font-bold text-foreground sm:text-sm"
                    >
                      عنوان المحور (العنوان الفرعي) *
                    </Label>
                    <Input
                      id={`topic-headline-${topic.id}`}
                      value={topic.headline}
                      onChange={(e) => handleHeadlineChange(index, e.target.value)}
                      placeholder="مثال: الفروقات الجوهرية بين العقود السكنية والتجارية"
                      aria-invalid={Boolean(headlineError)}
                      className={`h-11 rounded-xl bg-background ${
                        headlineError ? "border-destructive focus-visible:ring-destructive/30" : ""
                      }`}
                    />
                    {headlineError && (
                      <p className="text-[11px] font-medium text-destructive">
                        {headlineError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-foreground sm:text-sm">
                      محتوى وتفاصيل المحور (نص منسق غني) *
                    </Label>
                    <div
                      className={`overflow-hidden rounded-xl border bg-background ${
                        contentError ? "border-destructive focus-within:ring-2 focus-within:ring-destructive/30" : "border-border"
                      }`}
                    >
                      <RichTextEditor
                        id={`topic-editor-${topic.id}`}
                        value={topic.content}
                        onChange={(html) => handleContentChange(index, html)}
                        placeholder="اكتب تفاصيل المحور، يمكنك استخدام العناوين، القوائم، التمييز العريض والمائل..."
                      />
                    </div>
                    {contentError && (
                      <p className="text-[11px] font-medium text-destructive">
                        {contentError}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {topics.length > 0 && (
          <div className="flex justify-center pt-2">
            <Button
              type="button"
              onClick={handleAddTopic}
              variant="outline"
              className="gap-2 rounded-xl border-dashed border-2 border-primary/40 px-6 py-5 text-sm font-bold text-primary hover:bg-primary-50"
            >
              <Plus className="size-4" />
              <span>إضافة محور جديد للمقال</span>
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
