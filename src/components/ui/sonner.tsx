import type { ComponentProps } from 'react';
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Info,
  Loader2,
} from 'lucide-react';
import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      position="top-center"
      dir="rtl"
      className="toaster group font-sans"
      icons={{
        success: <CircleCheck className="size-5 text-tertiary-600 dark:text-tertiary-400 shrink-0" />,
        info: <Info className="size-5 text-primary-600 dark:text-primary-400 shrink-0" />,
        warning: <CircleAlert className="size-5 text-secondary-600 dark:text-secondary-400 shrink-0" />,
        error: <CircleX className="size-5 text-destructive shrink-0" />,
        loading: <Loader2 className="size-5 animate-spin text-primary shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:shadow-black/10 dark:group-[.toaster]:shadow-black/50 group-[.toaster]:rounded-2xl group-[.toaster]:font-sans group-[.toaster]:p-4 group-[.toaster]:gap-3.5 group-[.toaster]:backdrop-blur-md',
          description:
            'group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:mt-0.5 group-[.toast]:font-normal',
          title:
            'group-[.toast]:font-bold group-[.toast]:text-sm group-[.toast]:text-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-semibold group-[.toast]:rounded-xl group-[.toast]:px-3.5 group-[.toast]:py-1.5 group-[.toast]:text-xs hover:group-[.toast]:opacity-90 transition-opacity',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:border group-[.toast]:border-border group-[.toast]:rounded-xl group-[.toast]:px-3.5 group-[.toast]:py-1.5 group-[.toast]:text-xs hover:group-[.toast]:bg-muted/80 transition-colors',
          closeButton:
            'group-[.toast]:bg-muted/60 group-[.toast]:border-border group-[.toast]:text-muted-foreground hover:group-[.toast]:text-foreground hover:group-[.toast]:bg-muted',
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
