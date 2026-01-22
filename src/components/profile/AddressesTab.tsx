import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userProfile } from "@/data/mockData";

export function AddressesTab() {
  const { addresses } = userProfile;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="addressLine1" className="text-sm text-muted-foreground">
            Address Line 1*
          </Label>
          <Input
            id="addressLine1"
            value={addresses.addressLine1}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="addressLine2" className="text-sm text-muted-foreground">
            Address Line 2
          </Label>
          <Input
            id="addressLine2"
            value={addresses.addressLine2 || "-"}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm text-muted-foreground">
            City
          </Label>
          <Input
            id="city"
            value={addresses.city}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm text-muted-foreground">
            Country
          </Label>
          <Input
            id="country"
            value={addresses.country}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm text-muted-foreground">
            State
          </Label>
          <Input
            id="state"
            value={addresses.state}
            disabled
            className="bg-muted"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-sm text-muted-foreground">
            Zip / Postal Code*
          </Label>
          <Input
            id="zipCode"
            value={addresses.zipCode}
            disabled
            className="bg-muted"
          />
        </div>
      </div>
    </div>
  );
}
