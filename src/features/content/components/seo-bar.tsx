import { useRef, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContentField } from "@/features/content/components/content-draft-provider";
import SeoDialog from "@/features/content/components/seo-dialog";
import {
  PAGE_SEO,
  type ContentPageId,
} from "@/features/content/constants";
import type { PageSeo } from "@/features/content/types";

const savedPageSeo: Partial<Record<ContentPageId, PageSeo>> = {};

interface SeoBarProps {
  pageId: ContentPageId;
}

export default function SeoBar({ pageId }: SeoBarProps) {
  const [value, setValue] = useState<PageSeo>(
    () => savedPageSeo[pageId] ?? { ...PAGE_SEO[pageId] },
  );
  const [open, setOpen] = useState(false);
  const valueRef = useRef(value);
  valueRef.current = value;

  const markDirty = useContentField(
    () => valueRef.current,
    (next: PageSeo) => {
      savedPageSeo[pageId] = next;
      valueRef.current = next;
      setValue(next);
    },
  );

  function handleSave(next: PageSeo) {
    const previous = [value.ogImage, value.twitterImage];
    const kept = new Set([next.ogImage, next.twitterImage]);
    for (const url of previous) {
      if (url.startsWith("blob:") && !kept.has(url)) URL.revokeObjectURL(url);
    }
    savedPageSeo[pageId] = next;
    valueRef.current = next;
    setValue(next);
    markDirty();
  }

  return (
    <div className="flex flex-col gap-3 border-b border-border bg-muted/40 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Search className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm font-semibold text-foreground">تحسين محركات البحث</p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full cursor-pointer sm:w-auto"
        onClick={() => setOpen(true)}
      >
        تعديل البيانات الوصفية
      </Button>

      <SeoDialog
        open={open}
        value={value}
        onOpenChange={setOpen}
        onSave={handleSave}
      />
    </div>
  );
}
