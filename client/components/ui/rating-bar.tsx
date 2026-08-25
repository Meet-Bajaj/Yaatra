import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

function RatingBar({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
}: RatingBarProps) {
  const sizeMap = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(i + 1)}
          className={cn(
            "transition-colors",
            interactive && "cursor-pointer hover:scale-110",
            !interactive && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizeMap[size],
              i < value ? "fill-white text-white" : "text-white/20"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export { RatingBar };
