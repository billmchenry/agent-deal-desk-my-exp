import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const tools = [
  "eXp World", "kvCORE", "Skyslope", "Workplace by Meta",
  "eXp Enterprise", "Social Media", "CRM Systems",
];
const availability = [
  "Weekday Mornings", "Weekday Afternoons", "Weekday Evenings",
  "Weekends", "Flexible",
];

interface StepMentorshipProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function StepMentorship({ data, onChange }: StepMentorshipProps) {
  const set = (key: string, value: any) => onChange({ ...data, [key]: value });
  const toggleList = (key: string, item: string) => {
    const list: string[] = data[key] || [];
    set(key, list.includes(item) ? list.filter((x: string) => x !== item) : [...list, item]);
  };

  const textareas = [
    { key: "interest", label: "Why are you interested in becoming a mentor?", max: 500 },
    { key: "whyMentor", label: "Why would you make a good mentor?", max: 500 },
    { key: "teachingStyle", label: "Describe your teaching style", max: 500 },
    { key: "programPlan", label: "How do you plan to structure your mentoring program?", max: 500 },
  ];

  return (
    <Card>
      <CardContent className="p-5 space-y-5">
        <h3 className="text-sm font-semibold text-foreground">Mentorship/Coaching Experience</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: "mentoringExp", label: "Do you have mentoring experience?", opts: ["Yes", "No"] },
            { key: "coachingExp", label: "Do you have coaching experience?", opts: ["Yes", "No"] },
            { key: "commMethod", label: "Preferred communication method", opts: ["Phone", "Email", "Video Call", "In Person", "Text"] },
            { key: "frequency", label: "How often would you meet with a mentee?", opts: ["Weekly", "Bi-Weekly", "Monthly", "As Needed"] },
          ].map((d) => (
            <div key={d.key} className="space-y-1.5">
              <Label className="text-xs">{d.label}</Label>
              <Select value={data[d.key] || ""} onValueChange={(v) => set(d.key, v)}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {d.opts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {textareas.map((ta) => (
          <div key={ta.key} className="space-y-1.5">
            <Label className="text-xs">{ta.label}</Label>
            <Textarea
              value={data[ta.key] || ""}
              onChange={(e) => set(ta.key, e.target.value.slice(0, ta.max))}
              className="min-h-[80px] resize-none"
              placeholder="Type here..."
            />
            <p className="text-[10px] text-muted-foreground text-end">
              {(data[ta.key] || "").length}/{ta.max}
            </p>
          </div>
        ))}

        <div className="space-y-2">
          <Label className="text-xs font-medium">Tools & strategies you use</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tools.map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={(data.tools || []).includes(t)} onCheckedChange={() => toggleList("tools", t)} />
                {t}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Availability</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availability.map((a) => (
              <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={(data.availability || []).includes(a)} onCheckedChange={() => toggleList("availability", a)} />
                {a}
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
