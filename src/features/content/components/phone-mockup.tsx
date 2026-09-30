import EditableImage from "@/features/content/components/editable-image";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  src: string;
  alt: string;
  label: string;
  width: number;
  height: number;
  className?: string;
}

export default function PhoneMockup({
  src,
  alt,
  label,
  width,
  height,
  className,
}: PhoneMockupProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto relative w-48 shrink-0 drop-shadow-2xl sm:w-56 md:w-64 lg:w-68",
        className,
      )}
    >
      <div className="relative rounded-4xl border-4 border-primary-foreground/80 bg-primary-foreground p-1.5 shadow-2xl sm:p-2">
        <div className="relative w-full" style={{ aspectRatio: "9 / 19.5" }}>
          <EditableImage
            defaultSrc={src}
            label={label}
            width={width}
            height={height}
            alt={alt}
            className="absolute inset-0 size-full"
            frameClassName="block size-full overflow-hidden rounded-3xl bg-black"
            imageClassName="size-full object-cover object-top"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-tr from-transparent via-primary-foreground/5 to-primary-foreground/10"
          />
        </div>
      </div>
    </div>
  );
}
