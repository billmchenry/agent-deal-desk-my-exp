import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userProfile } from "@/data/mockData";

export function EmailTab() {
  const { email } = userProfile;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="secondEmail" className="text-sm text-muted-foreground">
            Second Email
          </Label>
          <Input
            id="secondEmail"
            value={email.secondEmail}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="forwardingAddress" className="text-sm text-muted-foreground">
            Forwarding Address
          </Label>
          <Input
            id="forwardingAddress"
            value={email.forwardingAddress}
            disabled
            className="bg-muted"
          />
        </div>
      </div>
    </div>
  );
}
