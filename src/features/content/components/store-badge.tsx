import { useRef, useState, type ReactNode } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContentField } from "@/features/content/components/content-draft-provider";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StoreBadgeProps {
  defaultHref: string;
  label: string;
  caption: string;
  name: string;
  icon: ReactNode;
  captionClassName?: string;
}

const badgeClassName =
  "flex min-h-11 min-w-32 flex-1 items-center justify-center gap-2 rounded-xl border border-primary-foreground/40 bg-black px-3 text-white shadow-md transition-all duration-300 hover:scale-105 hover:border-primary-foreground hover:shadow-lg focus-visible:outline-2 focus-visible:outline-primary sm:min-h-12 sm:min-w-36 sm:flex-initial sm:gap-2.5 sm:px-4";

export default function StoreBadge({
  defaultHref,
  label,
  caption,
  name,
  icon,
  captionClassName,
}: StoreBadgeProps) {
  const [href, setHref] = useState(defaultHref);
  const [draft, setDraft] = useState(defaultHref);
  const [isEditing, setIsEditing] = useState(false);
  const hrefRef = useRef(href);
  const draftRef = useRef(draft);
  const editingRef = useRef(isEditing);
  hrefRef.current = href;
  draftRef.current = draft;
  editingRef.current = isEditing;
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  const markDirty = useContentField(
    () => {
      const raw = editingRef.current ? draftRef.current : hrefRef.current;
      return raw.trim() || "#";
    },
    (next: string) => {
      hrefRef.current = next;
      draftRef.current = next;
      editingRef.current = false;
      setHref(next);
      setDraft(next);
      setIsEditing(false);
    },
  );

  function startEditing() {
    setDraft(href);
    setIsEditing(true);
  }

  function commitEditing() {
    const next = draft.trim() || "#";
    hrefRef.current = next;
    editingRef.current = false;
    setHref(next);
    setIsEditing(false);
    if (next === href) return;
    markDirty();
  }

  function cancelEditing() {
    setDraft(href);
    setIsEditing(false);
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-initial">
      <div className="flex items-center gap-1.5">
        <a
          href={href}
          dir="ltr"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className={badgeClassName}
        >
          {icon}
          <span className="flex flex-col text-start leading-none">
            <span className={captionClassName}>{caption}</span>
            <span className="mt-0.5 text-xs font-semibold tracking-tight sm:text-sm">
              {name}
            </span>
          </span>
        </a>
        {isEditing ? null : (
          <Tooltip>
            <TooltipTrigger
              type="button"
              aria-label={label}
              onClick={startEditing}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-xs transition-colors hover:bg-primary-soft sm:size-9"
            >
              <Pencil className="size-3.5 sm:size-4" />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
              {label}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {isEditing ? (
        <span className="flex items-center gap-1">
          <Input
            value={draft}
            dir="ltr"
            type="text"
            inputMode="url"
            autoFocus
            aria-label={label}
            placeholder="https://"
            className="h-9 min-w-0 flex-1 bg-background text-xs text-foreground sm:h-10 sm:w-52 sm:flex-none sm:text-sm"
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
          />
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
      ) : null}
    </div>
  );
}
