
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export type TextVariant = "default" | "muted" | "primary" | "destructive" | "lead";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  as?: React.ElementType;
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant = "default", as: Component = "p", ...props }, ref) => {
    return (
      <Component
        className={cn(
          "text-base",
          variant === "muted" && "text-gray-500 dark:text-gray-400",
          variant === "primary" && "text-primary",
          variant === "lead" && "text-xl text-gray-600 dark:text-gray-400",
          variant === "destructive" && "text-red-500 dark:text-red-400",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Text.displayName = "Text";
