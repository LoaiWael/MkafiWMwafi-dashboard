import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface RichTextToolbarProps {
  editor: Editor;
}

interface ToolbarAction {
  label: string;
  icon: LucideIcon;
  pressed?: boolean;
  disabled?: boolean;
  flip?: boolean;
  run: () => void;
}

export default function RichTextToolbar({ editor }: RichTextToolbarProps) {
  const active = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current.isActive("bold"),
      italic: current.isActive("italic"),
      strike: current.isActive("strike"),
      h1: current.isActive("heading", { level: 1 }),
      h2: current.isActive("heading", { level: 2 }),
      h3: current.isActive("heading", { level: 3 }),
      bullet: current.isActive("bulletList"),
      ordered: current.isActive("orderedList"),
      quote: current.isActive("blockquote"),
      undo: current.can().undo(),
      redo: current.can().redo(),
    }),
  });

  const groups: ToolbarAction[][] = [
    [
      {
        label: "عريض",
        icon: Bold,
        pressed: active.bold,
        run: () => editor.chain().focus().toggleBold().run(),
      },
      {
        label: "مائل",
        icon: Italic,
        pressed: active.italic,
        run: () => editor.chain().focus().toggleItalic().run(),
      },
      {
        label: "يتوسطه خط",
        icon: Strikethrough,
        pressed: active.strike,
        run: () => editor.chain().focus().toggleStrike().run(),
      },
    ],
    [
      {
        label: "عنوان ١",
        icon: Heading1,
        pressed: active.h1,
        run: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        label: "عنوان ٢",
        icon: Heading2,
        pressed: active.h2,
        run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        label: "عنوان ٣",
        icon: Heading3,
        pressed: active.h3,
        run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
    ],
    [
      {
        label: "قائمة نقطية",
        icon: List,
        pressed: active.bullet,
        run: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        label: "قائمة مرقمة",
        icon: ListOrdered,
        pressed: active.ordered,
        run: () => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        label: "اقتباس",
        icon: Quote,
        pressed: active.quote,
        run: () => editor.chain().focus().toggleBlockquote().run(),
      },
    ],
    [
      {
        label: "تراجع",
        icon: Undo2,
        disabled: !active.undo,
        flip: true,
        run: () => editor.chain().focus().undo().run(),
      },
      {
        label: "إعادة",
        icon: Redo2,
        disabled: !active.redo,
        flip: true,
        run: () => editor.chain().focus().redo().run(),
      },
    ],
  ];

  return (
    <TooltipProvider delay={100}>
      <div
        role="toolbar"
        aria-label="تنسيق النص"
        className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2"
      >
        {groups.map((group, groupIndex) => (
          <div key={group[0].label} className="flex items-center gap-1">
            {groupIndex > 0 ? (
              <Separator orientation="vertical" className="mx-1 h-6" />
            ) : null}
            {group.map((action) => (
              <Tooltip key={action.label}>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={action.label}
                      aria-pressed={action.pressed}
                      disabled={action.disabled}
                      onClick={action.run}
                      className={cn(
                        "size-10",
                        action.pressed &&
                          "bg-primary-soft text-primary hover:bg-primary-100",
                      )}
                    />
                  }
                >
                  <action.icon
                    size={16}
                    className={action.flip ? "rtl:-scale-x-100" : undefined}
                  />
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={6}
                  className="text-xs font-medium"
                >
                  {action.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
