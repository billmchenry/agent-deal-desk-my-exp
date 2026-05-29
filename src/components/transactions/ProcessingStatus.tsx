import { useEffect, useState } from "react";
import { FileSearch, Brain, ShieldCheck, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProcessingStatusProps {
  isProcessing: boolean;
  onComplete?: () => void;
  documentType?: "listing" | "contract";
}

const listingStages = [
  { id: "upload", label: "Uploading document...", icon: FileSearch, progress: 20 },
  { id: "read", label: "Reading contract...", icon: FileSearch, progress: 45 },
  { id: "extract", label: "Extracting data...", icon: Brain, progress: 75 },
  { id: "audit", label: "Running compliance audit...", icon: ShieldCheck, progress: 100 },
];

const contractStages = [
  { id: "upload", label: "Receiving document...", icon: FileSearch, progress: 20 },
  { id: "read", label: "Reading text...", icon: FileSearch, progress: 40 },
  { id: "extract", label: "Extracting buyer info...", icon: Brain, progress: 65 },
  { id: "financials", label: "Parsing financials...", icon: Brain, progress: 85 },
  { id: "audit", label: "Identifying key dates...", icon: ShieldCheck, progress: 100 },
];

export function ProcessingStatus({
  isProcessing,
  onComplete,
  documentType = "listing",
}: ProcessingStatusProps) {
  const stages = documentType === "contract" ? contractStages : listingStages;
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setCurrentStage(0);
      setProgress(0);
      return;
    }

    const stageTimings = stages.map(() => 700);
    let totalTime = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    stageTimings.forEach((timing, index) => {
      totalTime += timing;
      const t = setTimeout(() => {
        setCurrentStage(index);
        setProgress(stages[index].progress);
        if (index === stages.length - 1) {
          setTimeout(() => onComplete?.(), 400);
        }
      }, totalTime - timing);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessing, documentType]);

  if (!isProcessing) return null;

  const CurrentIcon = stages[currentStage]?.icon || Sparkles;

  return (
    <div className="p-4 rounded-2xl border border-border bg-card animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-exp-slate-blue flex items-center justify-center animate-pulse">
          <CurrentIcon className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">{stages[currentStage]?.label}</p>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="flex justify-between mt-3">
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            className={cn(
              "flex items-center gap-1 text-[11px] transition-colors",
              index <= currentStage ? "text-primary" : "text-muted-foreground",
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
