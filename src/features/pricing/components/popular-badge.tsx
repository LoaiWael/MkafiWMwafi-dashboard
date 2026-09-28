import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PopularBadgeProps {
  className?: string;
  label?: string;
}

export function PopularBadge({
  className,
  label = "الأكثر طلباً",
}: PopularBadgeProps) {
  return (
    <Badge
      className={cn(
        "border-0 border-none shadow-none gap-1 bg-linear-to-r from-primary-800 via-primary to-primary-400 text-primary-foreground text-[10px] font-extrabold px-2.5 py-0.5 select-none",
        className,
      )}
    >
      <Sparkles className="size-3 shrink-0" />
      <span>{label}</span>
    </Badge>
  );
}

export default PopularBadge;
