import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface NpsSurveyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NpsSurveyModal({ open, onOpenChange }: NpsSurveyModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [score, setScore] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [improvement, setImprovement] = useState("");

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setStep(1);
      setScore(null);
      setReason("");
      setImprovement("");
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = () => {
    onOpenChange(false);
    toast.success("Thank you for your feedback!");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-lg p-5">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle>Instant NPS Survey</DialogTitle>
            <span className="text-xs text-muted-foreground">
              {step === 1 ? "0" : "1"} of 2 complete
            </span>
          </div>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-2">
            <p className="text-sm whitespace-normal overflow-visible">
              Based on your experience so far, how likely are you to recommend eXp to a friend or colleague?
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs text-muted-foreground">Not Likely</span>
                <span className="text-xs text-muted-foreground">Extremely Likely</span>
              </div>
              <div className="flex gap-2 flex-nowrap overflow-x-auto pb-2 scrollbar-none">
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setScore(i)}
                    className={cn(
                      "h-10 w-10 shrink-0 rounded-md border text-sm font-medium transition-all",
                      score === i
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/45 hover:bg-muted"
                    )}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                What most influenced you to give us this score?
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Share your thoughts..."
                className="min-h-[80px] resize-none"
                maxLength={4000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {reason.length} / 4000
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Is there anything we could have done to make your experience more exceptional?
              </label>
              <Textarea
                value={improvement}
                onChange={(e) => setImprovement(e.target.value)}
                placeholder="Share your thoughts..."
                className="min-h-[80px] resize-none"
                maxLength={4000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {improvement.length} / 4000
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">eXp Email Address</p>
              <p className="text-sm text-muted-foreground">clifford.thompson@exprealty.com</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 w-full">
          {step === 1 ? (
            <Button
              className="h-11 w-full"
              onClick={() => { if (score !== null) setStep(2); }}
              disabled={score === null}
            >
              Continue
            </Button>
          ) : (
            <Button className="h-11 w-full" onClick={handleSubmit}>
              Submit
            </Button>
          )}
          <Button
            variant="outline"
            className="h-11 w-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
