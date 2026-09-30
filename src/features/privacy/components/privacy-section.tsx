import { useState, type FormEvent } from "react";
import PageHeader from "@/components/layout/page-header";
import RichTextEditor from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { STORAGE_KEYS } from "@/lib/constants";

function readPrivacyHtml() {
  try {
    return localStorage.getItem(STORAGE_KEYS.privacyHtml) ?? "";
  } catch {
    return "";
  }
}

export default function PrivacySection() {
  const [content, setContent] = useState(readPrivacyHtml);
  const [savedContent, setSavedContent] = useState(content);
  const [saved, setSaved] = useState(false);
  const isUnchanged = content === savedContent;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEYS.privacyHtml, content);
    } catch {
      return;
    }
    setSavedContent(content);
    setSaved(true);
  }

  function handleChange(html: string) {
    setContent(html);
    setSaved(false);
  }

  return (
    <div className="page-shell space-y-6 py-8">
      <PageHeader
        title="سياسة الخصوصية"
        description="تحرير نص سياسة الخصوصية الذي يُعرض في الموقع."
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <RichTextEditor
          id="privacy-content"
          value={content}
          onChange={handleChange}
          placeholder="اكتب سياسة الخصوصية هنا"
        />

        <div className="flex flex-wrap items-center justify-end gap-3">
          {saved ? (
            <p className="text-sm text-muted-foreground">تم حفظ النص</p>
          ) : null}
          <Button type="submit" disabled={isUnchanged}>
            حفظ سياسة الخصوصية
          </Button>
        </div>
      </form>
    </div>
  );
}
