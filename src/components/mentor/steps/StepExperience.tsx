import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const yesNo = ["Yes", "No"];
const proficiencies = [
  "Residential", "Commercial", "Land", "New Construction",
  "Investment Properties", "Luxury", "REO/Foreclosures", "Short Sales",
  "Property Management", "Relocation",
];

interface StepExperienceProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function StepExperience({ data, onChange }: StepExperienceProps) {
  const set = (key: string, value: any) => onChange({ ...data, [key]: value });
  const toggleProf = (p: string) => {
    const list: string[] = data.proficiencies || [];
    set("proficiencies", list.includes(p) ? list.filter((x: string) => x !== p) : [...list, p]);
  };

  const dropdowns = [
    { key: "goodStanding", label: "Are you currently in good standing with eXp Realty?" },
    { key: "documentsAndFees", label: "Are all your documents and fees up to date?" },
    { key: "disciplinary", label: "Have you ever had any disciplinary actions?" },
    { key: "iconStatus", label: "Are you an ICON agent?" },
    { key: "teamLeader", label: "Are you a team leader?" },
    { key: "fullTime", label: "Do you practice real estate full-time or part-time?", options: ["Full-Time", "Part-Time"] },
  ];

  return (
    <Card>
      <CardContent className="p-5 space-y-5">
        <h3 className="text-sm font-semibold text-foreground">Real Estate Experience</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dropdowns.map((d) => (
            <div key={d.key} className="space-y-1.5">
              <Label className="text-xs">{d.label}</Label>
              <Select value={data[d.key] || ""} onValueChange={(v) => set(d.key, v)}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {(d.options || yesNo).map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <div className="space-y-1.5">
            <Label className="text-xs">Specialization</Label>
            <Select value={data.specialization || ""} onValueChange={(v) => set("specialization", v)}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {["Buyer's Agent", "Listing Agent", "Both"].map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Languages spoken</Label>
            <Input
              value={data.languages || ""}
              onChange={(e) => set("languages", e.target.value)}
              placeholder="e.g. English, Spanish"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Years selling real estate</Label>
            <Input
              type="number"
              value={data.yearsSelling || ""}
              onChange={(e) => set("yearsSelling", e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Total transactions closed</Label>
            <Input
              type="number"
              value={data.transactionsClosed || ""}
              onChange={(e) => set("transactionsClosed", e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium">Areas of proficiency</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {proficiencies.map((p) => (
              <label key={p} className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={(data.proficiencies || []).includes(p)}
                  onCheckedChange={() => toggleProf(p)}
                />
                {p}
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
