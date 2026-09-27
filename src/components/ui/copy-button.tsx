import { Check, Copy } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useClipboard } from "@/hooks/use-clipboard";
import { cn } from "@/lib/utils";

export interface CopyButtonProps {
  /**
   * The text value to copy to clipboard.
   */
  value: string;
  /**
   * Optional unique identifier for tracking multiple copy buttons.
   */
  itemId?: string;
  /**
   * Label displayed in tooltip before copying.
   * @default "نسخ"
   */
  label?: string;
  /**
   * Success message displayed on click and during copied state.
   * @default "تم النسخ بنجاح!"
   */
  successMessage?: string;
  /**
   * Additional classes for the button.
   */
  className?: string;
  /**
   * Timeout in milliseconds for the copied confirmation.
   * @default 2000
   */
  timeout?: number;
  /**
   * Callback fired after successful copy.
   */
  onCopySuccess?: (copiedValue: string) => void;
  /**
   * Optional inline text to render beside icon.
   */
  children?: React.ReactNode;
}

export function CopyButton({
  value,
  itemId,
  label = "نسخ",
  successMessage = "تم النسخ بنجاح!",
  className,
  timeout = 2000,
  onCopySuccess,
  children,
}: CopyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { copy, isCopied } = useClipboard({
    timeout,
    onSuccess: (val) => {
      onCopySuccess?.(val);
    },
  });

  const copied = isCopied(itemId);

  // Automatically reset open state when copied state resets to prevent stuck tooltips
  useEffect(() => {
    if (!copied) {
      setIsOpen(false);
    }
  }, [copied]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    copy(value, itemId);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <TooltipProvider delay={100}>
      <Tooltip open={copied ? true : isOpen} onOpenChange={handleOpenChange}>
        <TooltipTrigger
          type="button"
          aria-label={copied ? successMessage : label}
          onClick={handleClick}
          className={cn(
            "relative inline-flex items-center justify-center gap-1.5 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary",
            copied && "text-tertiary-600 dark:text-tertiary-400 bg-tertiary-50 dark:bg-tertiary-950/60",
            className,
          )}
        >
          {copied ? (
            <Check className="size-3.5 text-tertiary-600 dark:text-tertiary-400 animate-in zoom-in-75 duration-150" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {children}
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={5}
          variant={copied ? "tertiary" : "dark"}
          className={cn(
            "text-xs font-medium duration-150",
            copied && "bg-tertiary-700 text-white font-semibold shadow-md",
          )}
        >
          {copied ? successMessage : label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
