import { useEffect, useState } from 'react';
import { Check, FileSearch, Brain, ShieldCheck, Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface ProcessingStage {
  id: string;
  label: string;
  icon: React.ReactNode;
  progress: number;
}

interface UnifiedProcessingStatusProps {
  isProcessing: boolean;
  onComplete?: () => void;
  stages?: ProcessingStage[];
  variant?: 'listing' | 'contract';
}

const defaultListingStages: ProcessingStage[] = [
  { id: 'upload', label: 'Receiving document...', icon: <Upload className="w-3 h-3" />, progress: 20 },
  { id: 'read', label: 'Reading text...', icon: <FileSearch className="w-3 h-3" />, progress: 40 },
  { id: 'extract', label: 'Extracting data...', icon: <Brain className="w-3 h-3" />, progress: 70 },
  { id: 'audit', label: 'Running compliance audit...', icon: <ShieldCheck className="w-3 h-3" />, progress: 100 },
];

const defaultContractStages: ProcessingStage[] = [
  { id: 'upload', label: 'Receiving document...', icon: <Upload className="w-3 h-3" />, progress: 20 },
  { id: 'read', label: 'Reading text...', icon: <FileSearch className="w-3 h-3" />, progress: 40 },
  { id: 'extract', label: 'Extracting data...', icon: <Brain className="w-3 h-3" />, progress: 70 },
  { id: 'verify', label: 'Verifying details...', icon: <ShieldCheck className="w-3 h-3" />, progress: 100 },
];

export function UnifiedProcessingStatus({ 
  isProcessing, 
  onComplete, 
  stages,
  variant = 'listing'
}: UnifiedProcessingStatusProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const processingStages = stages || (variant === 'contract' ? defaultContractStages : defaultListingStages);

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStage(0);
      setProgress(0);
      return;
    }

    // Progress through stages with varying timings
    const stageTimings = processingStages.map(() => 600 + Math.random() * 400);
    let totalTime = 0;
    
    const timeouts: NodeJS.Timeout[] = [];
    
    stageTimings.forEach((timing, index) => {
      totalTime += timing;
      const timeout = setTimeout(() => {
        setCurrentStage(index);
        setProgress(processingStages[index].progress);
        
        if (index === processingStages.length - 1) {
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }
      }, totalTime - timing);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isProcessing, onComplete, processingStages]);

  if (!isProcessing) return null;

  const current = processingStages[currentStage];

  return (
    <div className="bg-card border border-border rounded-xl p-4 animate-fade-in">
      {/* Current stage with pulsing icon */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <span className="text-primary">{current.icon}</span>
        </div>
        <span className="text-sm font-medium text-foreground">{current.label}</span>
      </div>

      {/* Progress bar */}
      <Progress value={progress} className="h-1.5 mb-3" />

      {/* Horizontal stage indicators */}
      <div className="flex items-center justify-between">
        {processingStages.map((stage, index) => (
          <div
            key={stage.id}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              index <= currentStage ? "text-primary" : "text-muted-foreground/50"
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
              index < currentStage && "bg-success/10",
              index === currentStage && "bg-primary/10",
              index > currentStage && "bg-muted"
            )}>
              {index < currentStage ? (
                <Check className="w-3 h-3 text-success" />
              ) : (
                <span className={cn(
                  index === currentStage ? "text-primary" : "text-muted-foreground"
                )}>
                  {stage.icon}
                </span>
              )}
            </div>
            <span className={cn(
              "text-[10px] capitalize",
              index <= currentStage ? "text-foreground" : "text-muted-foreground/50"
            )}>
              {stage.id}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
