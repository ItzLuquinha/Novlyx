import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-novlyx-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-novlyx-black",
  {
    variants: {
      variant: {
        default:
          "bg-novlyx-white text-novlyx-black hover:bg-novlyx-white/90",
        accent:
          "bg-novlyx-accent text-white font-semibold hover:bg-novlyx-accent-soft shadow-md shadow-novlyx-accent/15",
        secondary:
          "bg-novlyx-graphite-light text-novlyx-white hover:bg-white/12 border border-white/8",
        outline:
          "border border-white/12 bg-transparent text-novlyx-white hover:bg-white/6",
        ghost: "bg-transparent text-novlyx-white hover:bg-white/6",
        link: "bg-transparent text-novlyx-accent underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-6 text-sm",
        icon: "h-9 w-9 rounded-md",
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
