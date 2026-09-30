import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id?: string;
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  align?: "center" | "start";
}

export default function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "flex max-w-xl flex-col",
        isCenter ? "mx-auto items-center text-center" : "items-start text-start",
      )}
    >
      <p className="flex items-center gap-2 text-xs font-medium text-primary">
        <span className="h-px w-6 bg-secondary" aria-hidden="true" />
        {eyebrow}
        {isCenter ? (
          <span className="h-px w-6 bg-secondary" aria-hidden="true" />
        ) : null}
      </p>
      <h2
        id={id}
        className="mt-3 text-2xl leading-snug font-bold text-foreground sm:text-3xl lg:text-4xl"
      >
        {title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
