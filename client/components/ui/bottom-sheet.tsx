"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-safe">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-lg rounded-t-3xl bg-[#0a0a0a] border-t border-white/10 p-6 animate-slide-up",
          "max-h-[85dvh] overflow-y-auto",
          className
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="mx-auto h-1 w-10 rounded-full bg-white/20 md:hidden" />
        </div>
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
        )}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/15 hover:text-white transition-colors touch-target"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

export { BottomSheet };
