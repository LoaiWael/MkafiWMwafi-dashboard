import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[filter,opacity,background-color,color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-gradient text-primary-foreground shadow-inner-primary hover:brightness-110',
        secondary:
          'bg-secondary-gradient text-secondary-foreground shadow-inner-secondary hover:brightness-110',
        tertiary:
          'bg-tertiary-gradient text-tertiary-foreground shadow-inner-tertiary hover:brightness-110',
        ghost:
          'bg-transparent text-foreground shadow-none hover:bg-muted',
        outline:
          'border border-input bg-background text-foreground shadow-none hover:bg-muted',
        destructive:
          'bg-destructive text-white shadow-none hover:bg-destructive/90',
      },
      size: {
        sm: 'h-9 px-5 text-sm',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'size-8 p-0',
        'icon-sm': 'size-7 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonProps = React.ComponentProps<'button'> & ButtonVariantProps;

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

type ButtonLinkProps = React.ComponentProps<'a'> & ButtonVariantProps;

export function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export default Button;
