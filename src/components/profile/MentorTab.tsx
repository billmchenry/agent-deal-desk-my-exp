import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { userProfile } from "@/data/mockData";

export function MentorTab() {
  return (
    <div className="space-y-4">
      <RadioGroup
        value={userProfile.mentorParticipation}
        disabled
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Mentor" id="mentor" disabled />
          <Label htmlFor="mentor" className="text-sm text-muted-foreground">
            Mentor
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Mentee" id="mentee" disabled />
          <Label htmlFor="mentee" className="text-sm text-muted-foreground">
            Mentee
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="None" id="none" disabled />
          <Label htmlFor="none" className="text-sm text-muted-foreground">
            None
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
