import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            // Variantes
            "bg-club-primary text-white hover:opacity-90 focus:ring-club-primary": variant === "primary",
            "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500": variant === "secondary",
            "border-2 border-club-primary text-club-primary hover:bg-club-primary hover:text-white focus:ring-club-primary": variant === "outline",
            "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500": variant === "ghost",
            // Tamaños
            "text-sm px-3 py-1.5": size === "sm",
            "text-base px-4 py-2": size === "md",
            "text-lg px-6 py-3": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
