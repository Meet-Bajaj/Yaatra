import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
        {icon || <Inbox className="h-8 w-8 text-white/30" />}
      </div>
      <h3 className="mb-1 text-lg font-medium text-white">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-white/50">{description}</p>
      )}
      {action}
    </div>
  );
}

export { EmptyState };
