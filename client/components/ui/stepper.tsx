import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: { label: string; description?: string }[];
  currentStep: number;
  className?: string;
}

function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      {steps.map((step, index) => (
        <div key={step.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                index < currentStep
                  ? "border-white bg-white text-black"
                  : index === currentStep
                  ? "border-white bg-white/10 text-white"
                  : "border-white/20 text-white/30"
              )}
            >
              {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-0.5 flex-1 my-1",
                  index < currentStep ? "bg-white" : "bg-white/20"
                )}
              />
            )}
          </div>
          <div className="pb-6">
            <p
              className={cn(
                "text-sm font-medium",
                index <= currentStep ? "text-white" : "text-white/40"
              )}
            >
              {step.label}
            </p>
            {step.description && (
              <p className="text-xs text-white/40">{step.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export { Stepper };
