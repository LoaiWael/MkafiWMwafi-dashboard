import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SeoDocumentFields from "@/features/content/components/seo-document-fields";
import SeoPreview from "@/features/content/components/seo-preview";
import SeoShareFields from "@/features/content/components/seo-share-fields";
import {
  hasSeoErrors,
  trimPageSeo,
  validatePageSeo,
  type SeoFieldErrors,
} from "@/features/content/seo";
import type { PageSeo } from "@/features/content/types";

interface SeoDialogProps {
  open: boolean;
  value: PageSeo;
  onOpenChange: (open: boolean) => void;
  onSave: (value: PageSeo) => void;
}

export default function SeoDialog({
  open,
  value,
  onOpenChange,
  onSave,
}: SeoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <SeoDialogForm
          value={value}
          onClose={() => onOpenChange(false)}
          onSave={onSave}
        />
      ) : null}
    </Dialog>
  );
}

function SeoDialogForm({
  value,
  onClose,
  onSave,
}: {
  value: PageSeo;
  onClose: () => void;
  onSave: (value: PageSeo) => void;
}) {
  const [draft, setDraft] = useState<PageSeo>(value);
  const [errors, setErrors] = useState<SeoFieldErrors>({});
  const ownedBlobs = useRef<string[]>([]);
  const savedRef = useRef(false);

  useEffect(() => {
    const blobs = ownedBlobs.current;
    return () => {
      if (savedRef.current) return;
      for (const url of blobs) URL.revokeObjectURL(url);
    };
  }, []);

  function onChange<K extends keyof PageSeo>(key: K, fieldValue: PageSeo[K]) {
    setDraft((current) => ({ ...current, [key]: fieldValue }));
    if (key in errors) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  function onImage(key: "ogImage" | "twitterImage", next: string) {
    const previous = draft[key];
    if (
      previous.startsWith("blob:") &&
      previous !== value.ogImage &&
      previous !== value.twitterImage &&
      previous !== next
    ) {
      URL.revokeObjectURL(previous);
    }
    if (next.startsWith("blob:")) ownedBlobs.current.push(next);
    setDraft((current) => ({ ...current, [key]: next }));
    if (key === "ogImage") {
      setErrors((current) => ({ ...current, ogImageAlt: undefined }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = trimPageSeo(draft);
    const nextErrors = validatePageSeo(next);
    setErrors(nextErrors);
    if (hasSeoErrors(nextErrors)) {
      toast.error("يرجى مراجعة الحقول وتصحيح الأخطاء");
      return;
    }

    // After the page SEO API is wired, replace this local save with toast.promise
    // so loading, success, and error share one toast:
    // toast.promise(savePageSeo(next), {
    //   loading: "جاري حفظ بيانات الظهور",
    //   success: "تم حفظ بيانات الظهور",
    //   error: "تعذّر حفظ بيانات الظهور",
    // });
    savedRef.current = true;
    onSave(next);
    toast.success("تم حفظ بيانات الظهور");
    onClose();
  }

  return (
    <DialogContent className="max-h-dvh overflow-y-auto sm:max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <DialogHeader className="text-start">
          <DialogTitle>بيانات الظهور في البحث</DialogTitle>
          <DialogDescription>
            عنوان الصفحة، الوصف، صورة المشاركة، وإعدادات الفهرسة.
          </DialogDescription>
        </DialogHeader>

        <SeoPreview seo={draft} />
        <SeoDocumentFields draft={draft} errors={errors} onChange={onChange} />
        <SeoShareFields
          draft={draft}
          errors={errors}
          onChange={onChange}
          onImage={onImage}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={onClose}
          >
            إلغاء
          </Button>
          <Button type="submit" className="cursor-pointer">
            حفظ
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
