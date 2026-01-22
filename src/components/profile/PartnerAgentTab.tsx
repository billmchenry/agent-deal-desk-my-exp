import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { userProfile } from "@/data/mockData";

export function PartnerAgentTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="partnerAgent"
          checked={userProfile.isPartnerAgent}
          disabled
        />
        <Label
          htmlFor="partnerAgent"
          className="text-sm text-muted-foreground"
        >
          Partner Agent
        </Label>
      </div>
    </div>
  );
}
