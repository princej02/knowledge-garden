import { ComponentChildren, JSX } from "preact";
import { forwardRef } from "preact/compat";
// import { IS_BROWSER } from "$fresh/runtime.ts";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils.ts";

// Define button variants using class-variance-authority
// const buttonVariants = cva(
//   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
//   {
//     variants: {
//       variant: {
//         default: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 shadow",
//         accent: "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]/90 shadow",
//         destructive: "bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/90 shadow",
//         outline: "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--muted-foreground)]",
//         ghost: "bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[var(--muted-foreground)]",
//         link: "text-[var(--primary)] underline-offset-4 hover:underline bg-transparent"
//       },
//       size: {
//         default: "h-9 px-4 py-2",
//         sm: "h-8 px-3 py-1 text-xs",
//         lg: "h-11 px-6 py-3 text-base",
//         icon: "h-9 w-9"
//       }
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default"
//     }
//   }
// );


const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:w-4 [&_svg]:h-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-muted text-foreground hover:bg-muted/80 border border-border",
        accent:
          "bg-accent text-accent-foreground hover:bg-accent/80 border border-border",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 border border-transparent",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted/60",
        ghost:
          "bg-transparent text-foreground hover:bg-muted/40",
        link:
          "text-primary underline-offset-4 hover:underline bg-transparent",
      },
      size: {
        default: "h-9 px-4 py-1.5",
        sm: "h-8 px-3 text-sm",
        lg: "h-10 px-6 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);


// Define component props interface

type ButtonHTMLAttributes = Omit<
    JSX.HTMLAttributes<HTMLButtonElement>,
    keyof VariantProps<typeof buttonVariants>
>;

export interface ButtonProps
    extends ButtonHTMLAttributes, VariantProps<typeof buttonVariants> {
    className?: string
    children?: ComponentChildren;
}

// Button component
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, disabled, children, ...props }, ref) => {
    return (
      <button
        {...props}
        disabled={disabled}
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };