import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { userProfile } from "@/data/mockData";

export function TransactionPrefsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="splitCheckPreference"
          checked={userProfile.transactionPreferences.splitCheckPreference}
          disabled
        />
        <Label
          htmlFor="splitCheckPreference"
          className="text-sm text-muted-foreground"
        >
          Split Check Preference
        </Label>
      </div>
    </div>
  );
}
