import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userProfile } from "@/data/mockData";

export function EmergencyContactsTab() {
  const { emergencyContacts } = userProfile;

  return (
    <div className="space-y-8">
      {/* Primary Contact */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4">Primary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="primaryName" className="text-sm text-muted-foreground">
              Name
            </Label>
            <Input
              id="primaryName"
              value={emergencyContacts.primary.name}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryRelationship" className="text-sm text-muted-foreground">
              Relationship
            </Label>
            <Input
              id="primaryRelationship"
              value={emergencyContacts.primary.relationship}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryPhone" className="text-sm text-muted-foreground">
              Phone Number
            </Label>
            <Input
              id="primaryPhone"
              value={emergencyContacts.primary.phoneNumber}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryEmail" className="text-sm text-muted-foreground">
              Email
            </Label>
            <Input
              id="primaryEmail"
              value={emergencyContacts.primary.email}
              disabled
              className="bg-muted"
            />
          </div>
        </div>
      </div>

      {/* Secondary Contact */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4">Secondary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="secondaryName" className="text-sm text-muted-foreground">
              Name
            </Label>
            <Input
              id="secondaryName"
              value={emergencyContacts.secondary.name}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryRelationship" className="text-sm text-muted-foreground">
              Relationship
            </Label>
            <Input
              id="secondaryRelationship"
              value={emergencyContacts.secondary.relationship}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryPhone" className="text-sm text-muted-foreground">
              Phone Number
            </Label>
            <Input
              id="secondaryPhone"
              value={emergencyContacts.secondary.phoneNumber}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryEmail" className="text-sm text-muted-foreground">
              Email
            </Label>
            <Input
              id="secondaryEmail"
              value={emergencyContacts.secondary.email}
              disabled
              className="bg-muted"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
