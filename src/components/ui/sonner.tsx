'use client';

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
        success: <CircleCheck className="size-5 text-tertiary shrink-0" />,
        info: <Info className="size-5 text-primary shrink-0" />,
        warning: <CircleAlert className="size-5 text-secondary shrink-0" />,
        error: <CircleX className="size-5 text-destructive shrink-0" />,
        loading: <Loader2 className="size-5 animate-spin text-primary shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:!bg-dark-gradient group-[.toaster]:!text-white group-[.toaster]:!border group-[.toaster]:!border-white/25 group-[.toaster]:!shadow-2xl group-[.toaster]:!shadow-black/50 group-[.toaster]:!rounded-[24px] group-[.toaster]:font-sans group-[.toaster]:p-4 group-[.toaster]:gap-3.5 group-[.toaster]:!backdrop-blur-md',
          description:
            'group-[.toast]:!text-white/80 group-[.toast]:!text-xs group-[.toast]:mt-0.5 group-[.toast]:font-normal',
          title:
            'group-[.toast]:!font-bold group-[.toast]:!text-sm group-[.toast]:!text-white',
          actionButton:
            'group-[.toast]:!bg-primary group-[.toast]:!text-primary-foreground group-[.toast]:!font-semibold group-[.toast]:!rounded-xl group-[.toast]:px-3.5 group-[.toast]:py-1.5 group-[.toast]:!text-xs hover:group-[.toast]:opacity-90 transition-opacity',
          cancelButton:
            'group-[.toast]:!bg-white/15 group-[.toast]:!text-white group-[.toast]:!border group-[.toast]:!border-white/20 group-[.toast]:!rounded-xl group-[.toast]:px-3.5 group-[.toast]:py-1.5 group-[.toast]:!text-xs hover:group-[.toast]:!bg-white/25 transition-colors',
          closeButton:
            'group-[.toast]:!bg-white/10 group-[.toast]:!border-white/20 group-[.toast]:!text-white/70 hover:group-[.toast]:!text-white hover:group-[.toast]:!bg-white/20',
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
