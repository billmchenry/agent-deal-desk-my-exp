import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useDemoConfig, type MentorMode, type FlqaMode } from "@/contexts/DemoConfigContext";
import { Users, Target } from "lucide-react";

interface DemoConfigSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mentorOptions: { value: MentorMode; label: string; description: string }[] = [
  { value: "none", label: "No Mentor Widget", description: "Default homepage, no mentor features active" },
  { value: "needs_mentor", label: "Needs Mentor (Countdown)", description: "Homepage shows countdown banner to choose a mentor" },
  { value: "pairing_underway", label: "Pairing Underway", description: "Homepage shows mentor pairing in progress" },
  { value: "mentee", label: "Active Mentee", description: "Mentor page shows assigned mentor and transaction progress" },
  { value: "not_applied", label: "Mentor – Not Applied", description: "Mentor page shows CTA to apply as a mentor" },
  { value: "pending", label: "Mentor – Pending", description: "Mentor page shows application submitted status" },
  { value: "approved_certification", label: "Mentor – Certification", description: "Mentor page shows certification training required" },
  { value: "active_mentor", label: "Mentor – Active", description: "Mentor page shows mentee management dashboard" },
];

const flqaOptions: { value: FlqaMode; label: string; description: string }[] = [
  { value: "below_level4", label: "Below Level 4 (3 FLQA)", description: "Actual 3, no bonus — needs 2 more for Level 4" },
  { value: "at_level4", label: "At Level 4 (7 FLQA)", description: "Actual 5 + Bonus 2 — needs 3 more for Level 5" },
  { value: "at_level5", label: "At Level 5 (12 FLQA)", description: "Actual 10 + Bonus 2 — needs 3 more for Level 6" },
  { value: "at_level6", label: "At Level 6 (18 FLQA)", description: "Actual 18, no bonus — above Level 6 threshold" },
  { value: "maxed_out", label: "Maxed Out (30 FLQA)", description: "Actual 18 + Bonus 12 — all levels unlocked, green bar" },
];

export function DemoConfigSheet({ open, onOpenChange }: DemoConfigSheetProps) {
  const { config, setMentorMode, setFlqaMode } = useDemoConfig();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg">Demo Configuration</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Switch between different user scenarios for demonstration purposes.
          </p>
        </SheetHeader>

        <Separator className="my-4" />

        {/* Mentor Mode */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Mentor Mode</h3>
          </div>

          <RadioGroup
            value={config.mentorMode}
            onValueChange={(val) => setMentorMode(val as MentorMode)}
            className="space-y-2"
          >
            {mentorOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
              >
                <RadioGroupItem value={opt.value} className="mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>

        <Separator className="my-4" />

        {/* FLQA Mode */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">FLQA Scenario</h3>
          </div>

          <RadioGroup
            value={config.flqaMode}
            onValueChange={(val) => setFlqaMode(val as FlqaMode)}
            className="space-y-2"
          >
            {flqaOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
              >
                <RadioGroupItem value={opt.value} className="mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>
      </SheetContent>
    </Sheet>
  );
}
