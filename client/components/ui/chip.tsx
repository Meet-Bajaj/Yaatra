import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  variant?: "default" | "outline";
  className?: string;
}

function Chip({ children, active, onClick, variant = "default", className }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
        {
          "bg-white text-black": active && variant === "default",
          "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white/80":
            !active && variant === "default",
          "border border-white/20 text-white/60 hover:border-white/40 hover:text-white":
            variant === "outline",
        },
        className
      )}
    >
      {children}
    </button>
  );
}

export { Chip };
