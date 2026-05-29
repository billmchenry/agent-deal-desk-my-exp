import { useEffect, useState } from 'react';
import { FileSearch, Brain, ShieldCheck, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProcessingStatusProps {
  isProcessing: boolean;
  onComplete?: () => void;
}

const stages = [
  { id: 'upload', label: 'Uploading document...', icon: FileSearch, progress: 20 },
  { id: 'read', label: 'Reading contract...', icon: FileSearch, progress: 45 },
  { id: 'extract', label: 'Extracting data...', icon: Brain, progress: 75 },
  { id: 'audit', label: 'Running compliance audit...', icon: ShieldCheck, progress: 100 },
];

export function ProcessingStatus({ isProcessing, onComplete }: ProcessingStatusProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStage(0);
      setProgress(0);
      return;
    }

    // Progress through stages
    const stageTimings = [800, 1200, 1000, 500]; // Time for each stage
    let totalTime = 0;
    
    const timeouts: NodeJS.Timeout[] = [];
    
    stageTimings.forEach((timing, index) => {
      totalTime += timing;
      const timeout = setTimeout(() => {
        setCurrentStage(index);
        setProgress(stages[index].progress);
        
        if (index === stages.length - 1) {
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
  }, [isProcessing, onComplete]);

  if (!isProcessing) return null;

  const CurrentIcon = stages[currentStage]?.icon || Sparkles;

  return (
    <div className="p-4 rounded-xl border border-border bg-card animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center animate-pulse">
          <CurrentIcon className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">
            {stages[currentStage]?.label}
          </p>
        </div>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      <div className="flex justify-between mt-2">
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            className={cn(
              'flex items-center gap-1 text-xs transition-colors',
              index <= currentStage ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <stage.icon className="w-3 h-3" />
            <span className="hidden sm:inline">{stage.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
