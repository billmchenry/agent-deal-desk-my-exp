import { cn } from "@/lib/utils";

interface MentorStepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function MentorStepIndicator({ currentStep, steps }: MentorStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-2xl mx-auto py-4">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isActive && "bg-primary border-primary text-primary-foreground",
                  !isActive && !isCompleted && "bg-muted border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {stepNum}
              </div>
              <span className={cn(
                "text-[10px] leading-tight text-center max-w-[80px] hidden sm:block",
                (isActive || isCompleted) ? "text-primary font-semibold" : "text-muted-foreground"
              )}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "h-0.5 flex-1 mx-1",
                isCompleted ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
