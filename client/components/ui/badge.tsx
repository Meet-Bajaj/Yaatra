import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "carpool" | "pro" | "women" | "success" | "warning" | "destructive";
  className?: string;
}

function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        {
          "bg-white/10 text-white/70": variant === "default",
          "bg-emerald-500/15 text-emerald-400": variant === "carpool",
          "bg-blue-500/15 text-blue-400": variant === "pro",
          "bg-pink-500/15 text-pink-400": variant === "women",
          "bg-green-500/15 text-green-400": variant === "success",
          "bg-yellow-500/15 text-yellow-400": variant === "warning",
          "bg-red-500/15 text-red-400": variant === "destructive",
        },
        className
      )}
    >
      {children}
    </span>
  );
}

export { Badge };
