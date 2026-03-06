import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const goals = [
  "Help new agents close their first transaction",
  "Share market knowledge and local expertise",
  "Develop leadership skills",
  "Give back to the eXp community",
  "Build a stronger organization",
  "Earn mentor fees",
];

const shadowing = [
  "Listing presentations",
  "Buyer consultations",
  "Open houses",
  "Negotiations",
  "Inspections",
  "Closing appointments",
];

interface StepGoalsProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function StepGoals({ data, onChange }: StepGoalsProps) {
  const set = (key: string, value: any) => onChange({ ...data, [key]: value });
  const toggleList = (key: string, item: string) => {
    const list: string[] = data[key] || [];
    set(key, list.includes(item) ? list.filter((x: string) => x !== item) : [...list, item]);
  };

  return (
    <Card>
      <CardContent className="p-5 space-y-5">
        <h3 className="text-sm font-semibold text-foreground">Goals & Intentions</h3>

        <div className="space-y-2">
          <Label className="text-xs font-medium">What are your goals as a mentor? (select all that apply)</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {goals.map((g) => (
              <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={(data.goals || []).includes(g)} onCheckedChange={() => toggleList("goals", g)} />
                {g}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Shadowing opportunities you can provide</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {shadowing.map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={(data.shadowing || []).includes(s)} onCheckedChange={() => toggleList("shadowing", s)} />
                {s}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">What do you hope your mentees will achieve?</Label>
          <Textarea
            value={data.menteeGoals || ""}
            onChange={(e) => set("menteeGoals", e.target.value.slice(0, 500))}
            className="min-h-[100px] resize-none"
            placeholder="Describe what success looks like for your mentees..."
          />
          <p className="text-[10px] text-muted-foreground text-right">
            {(data.menteeGoals || "").length}/500
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
