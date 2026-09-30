import { useRef, useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContentField } from "@/features/content/components/content-draft-provider";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  defaultValue: string;
  label: string;
  className?: string;
  inputClassName?: string;
  dir?: "auto" | "ltr";
  fullWidth?: boolean;
  alignStart?: boolean;
  onCommit?: (value: string) => void;
}

export default function EditableText({
  defaultValue,
  label,
  className,
  inputClassName,
  dir = "auto",
  fullWidth = false,
  onCommit,
}: EditableTextProps) {
  const [value, setValue] = useState(defaultValue);
  const [draft, setDraft] = useState(defaultValue);
  const [isEditing, setIsEditing] = useState(false);
  const valueRef = useRef(value);
  const draftRef = useRef(draft);
  const editingRef = useRef(isEditing);
  valueRef.current = value;
  draftRef.current = draft;
  editingRef.current = isEditing;

  const markDirty = useContentField(
    () => (editingRef.current ? draftRef.current : valueRef.current),
    (next: string) => {
      valueRef.current = next;
      draftRef.current = next;
      editingRef.current = false;
      setValue(next);
      setDraft(next);
      setIsEditing(false);
    },
  );

  function startEditing() {
    setDraft(value);
    setIsEditing(true);
  }

  function commitEditing() {
    const next = draft;
    valueRef.current = next;
    editingRef.current = false;
    setValue(next);
    setIsEditing(false);
    if (next === value) return;
    onCommit?.(next);
    markDirty();
  }

  function cancelEditing() {
    setDraft(value);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <span
        className={cn(
          "inline-flex max-w-full items-center gap-1 sm:gap-1.5",
          fullWidth ? "w-full" : "w-auto",
        )}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <Input
          value={draft}
          dir={dir}
          autoFocus
          aria-label={label}
          className={cn(
            "h-9 bg-background text-xs text-foreground sm:h-10 sm:text-sm md:text-base",
            fullWidth && "min-w-0 flex-1",
            inputClassName,
          )}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitEditing();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              cancelEditing();
            }
          }}
          onFocus={(event) => {
            const field = event.currentTarget;
            const end = field.value.length;
            field.setSelectionRange(end, end);
          }}
        />
        <span className="inline-flex shrink-0 items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  size="icon"
                  className="size-8 sm:size-9"
                  aria-label="حفظ"
                  onClick={commitEditing}
                />
              }
            >
              <Check className="size-3.5 sm:size-4" />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
              حفظ
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-8 sm:size-9"
                  aria-label="إلغاء"
                  onClick={cancelEditing}
                />
              }
            >
              <X className="size-3.5 sm:size-4" />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
              إلغاء
            </TooltipContent>
          </Tooltip>
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline items-center", className)}>
      <span dir={dir} className="break-words">
        {value}
      </span>
      <span className="inline-flex ms-1.5 align-middle sm:ms-2">
        <Tooltip>
          <TooltipTrigger
            type="button"
            aria-label={label}
            onClick={(event) => {
              event.stopPropagation();
              startEditing();
            }}
            onPointerDown={(event) => event.stopPropagation()}
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-xs transition-colors hover:bg-primary-soft sm:size-7 md:size-8"
          >
            <Pencil className="size-3 sm:size-3.5 md:size-4" />
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      </span>
    </span>
  );
}
