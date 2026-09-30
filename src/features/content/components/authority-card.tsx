import { useEffect, useRef, type ChangeEvent } from "react";
import { useTrackedState } from "@/features/content/components/content-draft-provider";
import { FileText, FileUp } from "lucide-react";
import EditableImage from "@/features/content/components/editable-image";
import EditableText from "@/features/content/components/editable-text";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AuthorityCardProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  certificate: string;
  certificateLabel: string;
}

export default function AuthorityCard({
  src,
  alt,
  width,
  height,
  certificate,
  certificateLabel,
}: AuthorityCardProps) {
  const [certificateSrc, setCertificateSrc, markDirty] = useTrackedState(certificate);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (certificateSrc.startsWith("blob:")) URL.revokeObjectURL(certificateSrc);
    };
  }, [certificateSrc]);

  function openPicker() {
    inputRef.current?.click();
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setCertificateSrc(URL.createObjectURL(file));
    markDirty();
  }

  return (
    <div className="group flex h-40 flex-col items-center justify-center gap-4 rounded-2xl bg-card px-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <EditableImage
        defaultSrc={src}
        alt={alt}
        label={`تعديل شعار ${alt}`}
        width={width}
        height={height}
        imageClassName="h-12 w-auto transition-transform duration-300 group-hover:scale-105 lg:h-14"
      />
      <span className="inline-flex flex-wrap items-center justify-center gap-1.5 text-xs font-semibold text-primary">
        <Tooltip>
          <TooltipTrigger
            render={
              <a
                href={certificateSrc}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`فتح شهادة ${alt}`}
                className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
            }
          >
            <FileText className="size-3.5" aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
            فتح الشهادة
          </TooltipContent>
        </Tooltip>
        <EditableText
          defaultValue={certificateLabel}
          label={`تعديل نص شهادة ${alt}`}
        />
        <Tooltip>
          <TooltipTrigger
            type="button"
            aria-label={`تعديل ملف شهادة ${alt}`}
            onClick={openPicker}
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-background text-primary shadow-xs transition-colors hover:bg-primary-soft sm:size-7"
          >
            <FileUp className="size-3 sm:size-3.5" />
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
            تعديل ملف الشهادة
          </TooltipContent>
        </Tooltip>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={onFileChange}
        />
      </span>
    </div>
  );
}
