import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const skills = [
  "Lead Generation",
  "Listing Presentations",
  "Buyer Consultations",
  "Negotiation",
  "Contract Writing",
  "Market Analysis (CMA)",
  "Marketing & Branding",
  "Technology & CRM",
  "Time Management",
  "Client Communication",
  "Transaction Coordination",
];

const ratings = Array.from({ length: 10 }, (_, i) => String(i + 1));

interface StepSkillsProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function StepSkills({ data, onChange }: StepSkillsProps) {
  const set = (key: string, value: string) => onChange({ ...data, [key]: value });

  return (
    <Card>
      <CardContent className="p-5 space-y-5">
        <h3 className="text-sm font-semibold text-foreground">Skills Assessment</h3>
        <p className="text-xs text-muted-foreground">Rate your proficiency in each area (1 = Beginner, 10 = Expert)</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill) => {
            const key = `skill_${skill.replace(/[^a-zA-Z]/g, "")}`;
            return (
              <div key={skill} className="space-y-1.5">
                <Label className="text-xs">{skill}</Label>
                <Select value={data[key] || ""} onValueChange={(v) => set(key, v)}>
                  <SelectTrigger><SelectValue placeholder="1-10" /></SelectTrigger>
                  <SelectContent>
                    {ratings.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
