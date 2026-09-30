import { useEffect, useRef, type ChangeEvent, type ReactNode } from "react";
import { ImageUp } from "lucide-react";
import { useTrackedState } from "@/features/content/components/content-draft-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface EditableImageProps {
  defaultSrc: string;
  label: string;
  width: number;
  height: number;
  alt?: string;
  className?: string;
  imageClassName?: string;
  frameClassName?: string;
  controlClassName?: string;
  children?: ReactNode;
  wrapImage?: (image: ReactNode) => ReactNode;
}

export default function EditableImage({
  defaultSrc,
  label,
  width,
  height,
  alt = "",
  className,
  imageClassName,
  frameClassName,
  controlClassName,
  children,
  wrapImage,
}: EditableImageProps) {
  const [src, setSrc, markDirty] = useTrackedState(defaultSrc);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (src.startsWith("blob:")) URL.revokeObjectURL(src);
    };
  }, [src]);

  function openPicker() {
    inputRef.current?.click();
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setSrc(URL.createObjectURL(file));
    markDirty();
  }

  const image = (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("object-contain", imageClassName)}
    />
  );

  return (
    <span
      className={cn(
        "relative",
        children ? "block w-full min-w-0" : "inline-flex shrink-0",
        className,
      )}
    >
      <span className={frameClassName}>{wrapImage ? wrapImage(image) : image}</span>
      {children}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.svg"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={onFileChange}
      />
      <span
        className={cn(
          "pointer-events-auto absolute z-30",
          controlClassName ?? "-top-1.5 -inset-e-1.5",
        )}
      >
        <Tooltip>
          <TooltipTrigger
            type="button"
            aria-label={label}
            onClick={openPicker}
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-xs transition-colors hover:bg-primary-soft sm:size-7"
          >
            <ImageUp className="size-3 sm:size-3.5" />
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
            {label}
          </TooltipContent>
        </Tooltip>
      </span>
    </span>
  );
}
