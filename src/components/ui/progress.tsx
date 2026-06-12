"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils/cn";

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-muted",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all duration-500 ease-out"
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

const ProgressGame = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: "primary" | "secondary" | "accent" | "success" | "danger";
  }
>(({ className, value, variant = "primary", ...props }, ref) => {
  const variantStyles = {
    primary: "bg-primary shadow-[0_0_10px_-2px] shadow-primary/60",
    secondary: "bg-secondary shadow-[0_0_10px_-2px] shadow-secondary/60",
    accent: "bg-accent shadow-[0_0_10px_-2px] shadow-accent/60",
    success: "bg-success shadow-[0_0_10px_-2px] shadow-success/60",
    danger: "bg-danger shadow-[0_0_10px_-2px] shadow-danger/60",
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-muted border border-border",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 rounded-full transition-all duration-700 ease-out",
          variantStyles[variant]
        )}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
ProgressGame.displayName = "ProgressGame";

export { Progress, ProgressGame };
