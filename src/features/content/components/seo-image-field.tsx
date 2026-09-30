import { useRef, type ChangeEvent } from "react";
import { ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SeoImageFieldProps {
  label: string;
  value: string;
  alt?: string;
  altId?: string;
  altError?: string;
  onChange: (src: string) => void;
  onAltChange?: (alt: string) => void;
}

export default function SeoImageField({
  label,
  value,
  alt,
  altId,
  altError,
  onChange,
  onAltChange,
}: SeoImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    onChange(URL.createObjectURL(file));
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
        {value ? (
          <img src={value} alt={alt} className="size-full object-cover" />
        ) : (
          <p className="px-4 text-center text-xs text-muted-foreground">
            لم تُرفع صورة بعد. المقاس الموصى به 1200×630.
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          <ImageUp className="size-4" />
          {value ? "استبدال الصورة" : "رفع صورة"}
        </Button>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={() => onChange("")}
          >
            إزالة
          </Button>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={onFileChange}
        />
      </div>

      {onAltChange && altId ? (
        <div className="space-y-1.5">
          <Label htmlFor={altId}>النص البديل للصورة</Label>
          <Input
            id={altId}
            dir="auto"
            value={alt ?? ""}
            aria-invalid={Boolean(altError)}
            onChange={(event) => onAltChange(event.target.value)}
          />
          {altError ? (
            <p className="text-xs text-destructive">{altError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              يصف الصورة عند تعذر عرضها.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
