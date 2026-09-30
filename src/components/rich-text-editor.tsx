import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { MountFade } from "@/components/animations";
import RichTextToolbar from "@/components/rich-text-toolbar";

const EMPTY_HTML = "<p></p>";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  id?: string;
}

function htmlMatches(current: string, value: string) {
  if (current === value) return true;
  const currentEmpty = current === "" || current === EMPTY_HTML;
  const valueEmpty = value === "" || value === EMPTY_HTML;
  return currentEmpty && valueEmpty;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  id,
}: RichTextEditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder ?? "",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        class:
          "min-h-80 px-4 py-3 text-sm leading-7 text-foreground focus:outline-none",
      },
    },
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      onChangeRef.current(html === EMPTY_HTML ? "" : html);
    },
  });

  useEffect(() => {
    if (htmlMatches(editor.getHTML(), value)) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  return (
    <MountFade
      distance={12}
      duration={0.4}
      className="rich-text-editor overflow-hidden rounded-xl border border-border bg-card focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary"
    >
      <RichTextToolbar editor={editor} />
      <EditorContent editor={editor} />
    </MountFade>
  );
}
