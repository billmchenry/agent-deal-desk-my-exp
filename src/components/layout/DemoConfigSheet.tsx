import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useDemoConfig, type MentorMode, type FlqaMode, type DistributionMode, type CountryMode } from "@/contexts/DemoConfigContext";
import { Users, Target, BarChart3, Globe } from "lucide-react";

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
  { value: "low", label: "Low (5 actual, 0 bonus)", description: "Total 5 — below Level 4 threshold" },
  { value: "mid", label: "Mid (18 actual, 12 bonus)", description: "Total 30 — all levels unlocked via bonus" },
  { value: "high", label: "High (25 actual, 5 bonus)", description: "Total 30 — all levels unlocked" },
  { value: "max", label: "Max (30 actual, 0 bonus)", description: "Total 30 — maxed out, no bonus needed" },
  { value: "over", label: "Over (28 actual, 7 bonus)", description: "Total 35 — exceeds 30 goal" },
];

const distributionOptions: { value: DistributionMode; label: string; description: string }[] = [
  { value: "full", label: "Full (7 levels, 7 countries)", description: "Default — all 7 levels and 7 countries shown" },
  { value: "few_levels", label: "Few Levels (3 levels)", description: "Only 3 levels — simulates a smaller org" },
  { value: "few_countries", label: "Few Countries (2 countries)", description: "Only 2 countries — domestic-focused agent" },
  { value: "many_countries", label: "Many Countries (10 countries)", description: "10 countries — global presence" },
];

export function DemoConfigSheet({ open, onOpenChange }: DemoConfigSheetProps) {
  const { config, setMentorMode, setFlqaMode, setDistributionMode } = useDemoConfig();

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

        <Separator className="my-4" />

        {/* Distribution Mode */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Distribution Scenario</h3>
          </div>

          <RadioGroup
            value={config.distributionMode}
            onValueChange={(val) => setDistributionMode(val as DistributionMode)}
            className="space-y-2"
          >
            {distributionOptions.map((opt) => (
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
