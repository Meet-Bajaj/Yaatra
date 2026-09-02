import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          "disabled:pointer-events-none disabled:opacity-40",
          "active:scale-[0.97] active:transition-transform active:duration-100",
          "select-none cursor-pointer",
          {
            "bg-white text-black hover:bg-white/90 shadow-lg shadow-white/5": variant === "default",
            "border border-white/20 bg-transparent text-white hover:bg-white/10":
              variant === "outline",
            "bg-transparent text-white hover:bg-white/10": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20": variant === "destructive",
          },
          {
            "h-10 px-4 text-sm": size === "sm",
            "h-12 px-6 text-sm md:h-11": size === "md",
            "h-14 px-8 text-base md:h-13": size === "lg",
            "h-11 w-11 p-0": size === "icon",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
