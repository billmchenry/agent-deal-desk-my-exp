import { useState } from "react";
import { MessageCircleQuestion, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function NpsSurveyCard() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [score, setScore] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [improvement, setImprovement] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setStep(1);
    setScore(null);
    setReason("");
    setImprovement("");
  };

  const handleContinue = () => {
    if (score === null) return;
    setStep(2);
  };

  const handleSubmit = () => {
    setOpen(false);
    toast.success("Thank you for your feedback!");
  };

  return (
    <>
      <Card className="border">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageCircleQuestion className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold mb-1">Your Feedback is Important</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Fill out the agent eXp NPS survey today!
              </p>
              <Button size="sm" className="gap-2" onClick={handleOpen}>
                Take Survey
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Instant NPS Survey</DialogTitle>
              <span className="text-xs text-muted-foreground">
                {step === 1 ? "0" : "1"} of 2 complete
              </span>
            </div>
          </DialogHeader>

          {step === 1 ? (
            <div className="space-y-6 py-2">
              <p className="text-sm">
                Based on your experience so far, how likely are you to recommend eXp to a friend or colleague?
              </p>
              <div className="flex items-center gap-2 justify-center flex-wrap">
                <span className="text-xs text-muted-foreground mr-1">Not Likely</span>
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setScore(i)}
                    className={cn(
                      "h-9 w-9 rounded-md border text-sm font-medium transition-colors",
                      score === i
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted border-border"
                    )}
                  >
                    {i}
                  </button>
                ))}
                <span className="text-xs text-muted-foreground ml-1">Extremely Likely</span>
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

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            {step === 1 ? (
              <Button onClick={handleContinue} disabled={score === null}>
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                Submit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
