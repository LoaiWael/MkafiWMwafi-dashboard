import { useRef, useState, type ChangeEvent } from "react";
import { ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MAX_SETTINGS_IMAGE_BYTES } from "@/features/settings/constants";
import { cn } from "@/lib/utils";

interface SettingsImageFieldProps {
  id: string;
  label: string;
  value: string;
  accept: string;
  hint: string;
  error?: string;
  shape?: "square" | "wide";
  onChange: (src: string) => void;
}

function fileMatchesAccept(file: File, accept: string) {
  return accept.split(",").some((part) => {
    const token = part.trim().toLowerCase();
    if (!token) return false;
    if (token.startsWith(".")) return file.name.toLowerCase().endsWith(token);
    return file.type === token;
  });
}

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("read"));
    };
    reader.onerror = () => reject(new Error("read"));
    reader.readAsDataURL(file);
  });
}

export default function SettingsImageField({
  id,
  label,
  value,
  accept,
  hint,
  error,
  shape = "wide",
  onChange,
}: SettingsImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState("");
  const message = localError || error;

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!fileMatchesAccept(file, accept) || file.size > MAX_SETTINGS_IMAGE_BYTES) {
      setLocalError(
        file.size > MAX_SETTINGS_IMAGE_BYTES
          ? "حجم الصورة أكبر من الحد المسموح"
          : "صيغة الصورة غير مدعومة",
      );
      return;
    }

    try {
      const src = await readImageFile(file);
      setLocalError("");
      onChange(src);
    } catch {
      setLocalError("تعذّر قراءة الصورة");
    }
  }

  function clearImage() {
    setLocalError("");
    onChange("");
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <Label id={id} className="text-xs sm:text-sm font-medium">{label}</Label>
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden rounded-xl border border-border bg-muted",
          shape === "square" ? "aspect-square max-w-32 sm:max-w-40" : "aspect-video w-full",
        )}
      >
        {value ? (
          <img
            src={value}
            alt=""
            className={cn(
              "size-full",
              shape === "square" ? "object-contain p-2.5 sm:p-3" : "object-cover",
            )}
          />
        ) : (
          <p className="px-4 text-center text-xs text-muted-foreground">لم تُختر صورة بعد</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm h-8 sm:h-9"
          onClick={() => inputRef.current?.click()}
        >
          <ImageUp className="size-3.5 sm:size-4" />
          {value ? "استبدال الصورة" : "رفع صورة"}
        </Button>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs sm:text-sm h-8 sm:h-9"
            onClick={clearImage}
          >
            إزالة
          </Button>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={onFileChange}
        />
      </div>

      {message ? (
        <p className="text-xs text-destructive">{message}</p>
      ) : (
        <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>
      )}
    </div>
  );
}
