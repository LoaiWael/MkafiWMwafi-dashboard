import { cn } from "@/lib/utils";

interface SeoLengthMeterProps {
  value: string;
  limit: number;
}

export default function SeoLengthMeter({ value, limit }: SeoLengthMeterProps) {
  const length = value.trim().length;
  const over = length > limit;

  return (
    <p className={cn("text-xs", over ? "text-destructive" : "text-muted-foreground")}>
      <bdi dir="ltr">
        {length} / {limit}
      </bdi>
      {over ? " — أطول من الحد الموصى به" : null}
    </p>
  );
}
