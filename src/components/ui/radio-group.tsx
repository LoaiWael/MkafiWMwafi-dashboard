"use client";

import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "peer relative inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-border bg-background transition-all duration-150 outline-none select-none",
        "hover:border-primary/60",
        "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
        "data-checked:border-primary data-checked:bg-background",
        "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-full items-center justify-center text-primary"
      >
        <Circle className="size-2.5 fill-primary stroke-none" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
