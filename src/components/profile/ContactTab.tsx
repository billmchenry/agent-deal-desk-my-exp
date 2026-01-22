import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { userProfile } from "@/data/mockData";

export function ContactTab() {
  const { contact } = userProfile;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-sm text-muted-foreground">
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            value={contact.phoneNumber}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Receive Text</Label>
          <RadioGroup
            value={contact.receiveText ? "yes" : "no"}
            disabled
            className="flex gap-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="receive-yes" disabled />
              <Label htmlFor="receive-yes" className="text-sm text-muted-foreground">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="receive-no" disabled />
              <Label htmlFor="receive-no" className="text-sm text-muted-foreground">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fax" className="text-sm text-muted-foreground">
            Fax
          </Label>
          <Input
            id="fax"
            value={contact.fax}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalPhone" className="text-sm text-muted-foreground">
            Additional Phone Numbers
          </Label>
          <Input
            id="additionalPhone"
            value={contact.additionalPhoneNumbers}
            disabled
            className="bg-muted"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-md">
        By selecting 'Yes' above you are granting eXp Realty permission to send you
        helpful updates, and reminders, via text message. Standard message and data
        rates may apply.
      </p>
    </div>
  );
}
