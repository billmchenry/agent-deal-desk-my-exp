import { useState, useEffect } from "react";
import { Clock, HelpCircle, Settings, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChooseMentorSheet } from "@/components/mentor/ChooseMentorSheet";
import { toast } from "sonner";

interface MentorProgramWidgetProps {
  status: "needs_mentor" | "pairing_underway";
  onStatusChange: (status: "needs_mentor" | "pairing_underway") => void;
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      };
    };
    setTimeLeft(calculate());
    const interval = setInterval(() => setTimeLeft(calculate()), 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export function MentorProgramWidget({ status, onStatusChange }: MentorProgramWidgetProps) {
  const [chooseMentorOpen, setChooseMentorOpen] = useState(false);

  // Countdown: 14 days from now (mock)
  const [targetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    d.setHours(d.getHours() + 3);
    d.setMinutes(d.getMinutes() + 22);
    return d;
  });
  const { days, hours, minutes } = useCountdown(targetDate);

  const handleMentorChosen = () => {
    setChooseMentorOpen(false);
    onStatusChange("pairing_underway");
    toast.success("Mentor pairing request submitted!");
  };

  if (status === "pairing_underway") {
    return (
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6 flex items-center gap-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Settings className="h-8 w-8 text-primary animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">Pairing Underway</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your mentor pairing request has been submitted. You will be notified once your mentor has been confirmed.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.info("Our support team will assist you shortly.")}>
            <HelpCircle className="h-4 w-4 mr-1.5" />
            Get Help
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.85)] to-[hsl(220,80%,55%)] text-white">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-stretch">
            {/* Left: Info */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center gap-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Users className="h-3 w-3 mr-1" />
                  Mentor Program
                </Badge>
              </div>
              <div>
                <h3 className="text-page-title font-bold">Find Your Mentor</h3>
                <p className="text-sm text-white/80 mt-1 max-w-md">
                  You have a limited time to choose a mentor. If you don't select one, a mentor will be assigned to you automatically.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold"
                  onClick={() => setChooseMentorOpen(true)}
                >
                  Choose a Mentor
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => toast.info("Our support team will assist you shortly.")}
                >
                  Get Help
                </Button>
              </div>
            </div>

            {/* Right: Countdown */}
            <div className="flex items-center justify-center p-6 md:p-8 md:border-l border-white/20">
              <div className="flex items-center gap-4 md:gap-6">
                <CountdownUnit value={days} label="Days" />
                <span className="text-2xl font-light text-white/60">:</span>
                <CountdownUnit value={hours} label="Hours" />
                <span className="text-2xl font-light text-white/60">:</span>
                <CountdownUnit value={minutes} label="Minutes" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ChooseMentorSheet
        open={chooseMentorOpen}
        onOpenChange={setChooseMentorOpen}
        onMentorChosen={handleMentorChosen}
      />
    </>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[3.5rem] text-center">
        <span className="text-3xl md:text-4xl font-bold tabular-nums">{String(value).padStart(2, "0")}</span>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-white/70 mt-1.5">{label}</span>
    </div>
  );
}
