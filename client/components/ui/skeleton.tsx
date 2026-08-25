import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-shimmer rounded-xl bg-white/5", className)}
      aria-hidden="true"
    />
  );
}

export { Skeleton };
