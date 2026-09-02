import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-white/70">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white md:h-11",
              "placeholder:text-white/40",
              "transition-colors duration-200",
              "focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "touch-target",
              icon && "pl-10",
              error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
