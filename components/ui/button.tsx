import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-novlyx-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-novlyx-black",
  {
    variants: {
      variant: {
        default:
          "bg-novlyx-white text-novlyx-black hover:bg-novlyx-white/85 active:scale-[0.98]",
        gold: "bg-gold-gradient text-novlyx-black font-semibold hover:brightness-110 active:scale-[0.98] shadow-lg shadow-novlyx-gold/10",
        secondary:
          "bg-white/10 text-novlyx-white backdrop-blur-md hover:bg-white/20 active:scale-[0.98]",
        outline:
          "border border-white/20 bg-transparent text-novlyx-white hover:bg-white/10",
        ghost: "bg-transparent text-novlyx-white hover:bg-white/10",
        link: "bg-transparent text-novlyx-gold underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
