"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        primary:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40",
        secondary:
          "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25 hover:bg-secondary/90 hover:shadow-secondary/40",
        ghost:
          "text-foreground hover:bg-card hover:text-foreground",
        destructive:
          "bg-danger text-danger-foreground shadow-lg shadow-danger/25 hover:bg-danger/90",
        outline:
          "border border-border bg-transparent hover:bg-card hover:text-accent hover:border-accent",
        "game-primary":
          "bg-primary text-primary-foreground shadow-lg shadow-primary/30 animate-pulse hover:animate-none border border-primary/50 hover:border-primary hover:shadow-primary/60 hover:shadow-[0_0_20px_-5px]",
        "game-secondary":
          "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/30 border border-secondary/50 hover:border-secondary hover:shadow-secondary/60 hover:shadow-[0_0_20px_-5px]",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 rounded-md px-6 text-base",
        xl: "h-14 rounded-lg px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
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
