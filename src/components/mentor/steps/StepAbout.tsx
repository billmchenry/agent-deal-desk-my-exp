import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const textareas = [
  { key: "bio", label: "Tell us about yourself and your real estate journey", max: 500 },
  { key: "achievements", label: "What are your biggest professional achievements?", max: 500 },
  { key: "additionalInfo", label: "Is there anything else you'd like us to know?", max: 500 },
];

interface StepAboutProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export function StepAbout({ data, onChange }: StepAboutProps) {
  const set = (key: string, value: any) => onChange({ ...data, [key]: value });

  return (
    <Card>
      <CardContent className="p-5 space-y-5">
        <h3 className="text-sm font-semibold text-foreground">About the Mentor</h3>

        {textareas.map((ta) => (
          <div key={ta.key} className="space-y-1.5">
            <Label className="text-xs">{ta.label}</Label>
            <Textarea
              value={data[ta.key] || ""}
              onChange={(e) => set(ta.key, e.target.value.slice(0, ta.max))}
              className="min-h-[100px] resize-none"
              placeholder="Type here..."
            />
            <p className="text-[10px] text-muted-foreground text-right">
              {(data[ta.key] || "").length}/{ta.max}
            </p>
          </div>
        ))}

        <label className="flex items-start gap-3 cursor-pointer pt-2">
          <Checkbox
            checked={data.acknowledgment || false}
            onCheckedChange={(v) => set("acknowledgment", !!v)}
            className="mt-0.5"
          />
          <span className="text-xs text-muted-foreground leading-relaxed">
            I acknowledge that by submitting this application, I am expressing my interest in becoming a mentor with eXp Realty. 
            I understand that approval is subject to broker review and that I will need to complete certification training upon acceptance.
          </span>
        </label>
      </CardContent>
    </Card>
  );
}
