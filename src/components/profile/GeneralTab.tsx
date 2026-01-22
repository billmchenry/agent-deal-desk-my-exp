import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userProfile } from "@/data/mockData";

export function GeneralTab() {
  const { general } = userProfile;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="legalFirstName" className="text-sm text-muted-foreground">
            Legal First Name*
          </Label>
          <Input
            id="legalFirstName"
            value={general.legalFirstName}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="legalMiddleName" className="text-sm text-muted-foreground">
            Legal Middle Name
          </Label>
          <Input
            id="legalMiddleName"
            value={general.legalMiddleName}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="legalLastName" className="text-sm text-muted-foreground">
            Legal Last Name*
          </Label>
          <Input
            id="legalLastName"
            value={general.legalLastName}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredName" className="text-sm text-muted-foreground">
            Preferred Name
          </Label>
          <Input
            id="preferredName"
            value={general.preferredName}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="expEmail" className="text-sm text-muted-foreground">
            eXp Email*
          </Label>
          <Input
            id="expEmail"
            value={general.expEmail}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthday" className="text-sm text-muted-foreground">
            Birthday
          </Label>
          <Input
            id="birthday"
            value={general.birthday}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="anniversaryDate" className="text-sm text-muted-foreground">
            Anniversary Date
          </Label>
          <Input
            id="anniversaryDate"
            value={general.anniversaryDate}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="region" className="text-sm text-muted-foreground">
            Region
          </Label>
          <Input
            id="region"
            value={general.region}
            disabled
            className="bg-muted"
          />
        </div>
      </div>
    </div>
  );
}
