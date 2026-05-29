import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { contractProcessingStages } from '@/lib/mockContractExtraction';

interface ContractProcessingStatusProps {
  isProcessing: boolean;
  onComplete?: () => void;
}

export function ContractProcessingStatus({ isProcessing, onComplete }: ContractProcessingStatusProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStage(0);
      setProgress(0);
      return;
    }

    const stages = contractProcessingStages;
    let stageIndex = 0;

    const interval = setInterval(() => {
      if (stageIndex < stages.length - 1) {
        stageIndex++;
        setCurrentStage(stageIndex);
        setProgress(stages[stageIndex].progress);
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 700);

    // Start with first stage
    setCurrentStage(0);
    setProgress(stages[0].progress);

    return () => clearInterval(interval);
  }, [isProcessing, onComplete]);

  if (!isProcessing) return null;

  const stages = contractProcessingStages;
  const current = stages[currentStage];

  return (
    <div className="bg-card border border-border rounded-xl p-4 animate-fade-in">
      {/* Progress bar */}
      <Progress value={progress} className="h-1.5 mb-4" />

      {/* Stages */}
      <div className="space-y-2">
        {stages.slice(0, -1).map((stage, index) => (
          <div
            key={stage.id}
            className={cn(
              "flex items-center gap-3 text-sm transition-all duration-300",
              index < currentStage && "text-success",
              index === currentStage && "text-foreground",
              index > currentStage && "text-muted-foreground/50"
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300",
              index < currentStage && "bg-success/10",
              index === currentStage && "bg-primary/10 animate-pulse",
              index > currentStage && "bg-muted"
            )}>
              {index < currentStage ? (
                <Check className="w-3 h-3 text-success" />
              ) : (
                <span>{stage.icon}</span>
              )}
            </div>
            <span className={cn(
              index === currentStage && "font-medium"
            )}>
              {stage.label}
            </span>
          </div>
        ))}
      </div>

      {/* Current stage highlight */}
      <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
        <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center animate-pulse">
          <span className="text-xs">{current.icon}</span>
        </div>
        <span className="text-sm font-medium text-foreground">{current.label}</span>
      </div>
    </div>
  );
}
