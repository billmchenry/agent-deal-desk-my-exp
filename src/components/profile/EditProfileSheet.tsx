import { useState } from "react";
import { CalendarIcon, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { currentUser, userProfile } from "@/data/mockData";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";

interface EditProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileSheet({ open, onOpenChange }: EditProfileSheetProps) {
  const { formatDate } = useFormatters();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    preferredName: userProfile.general.preferredName,
    birthday: userProfile.general.birthday,
    nrdsId: userProfile.nrdsId,
    phoneNumber: userProfile.contact.phoneNumber,
    fax: userProfile.contact.fax === "-" ? "" : userProfile.contact.fax,
    receiveText: userProfile.contact.receiveText,
    forwardingAddress: userProfile.email.forwardingAddress,
    primaryEmergency: {
      name: userProfile.emergencyContacts.primary.name,
      relationship: userProfile.emergencyContacts.primary.relationship,
      phoneNumber: userProfile.emergencyContacts.primary.phoneNumber,
      email: userProfile.emergencyContacts.primary.email,
    },
    secondaryEmergency: {
      name: userProfile.emergencyContacts.secondary.name,
      relationship: userProfile.emergencyContacts.secondary.relationship,
      phoneNumber: userProfile.emergencyContacts.secondary.phoneNumber,
      email: userProfile.emergencyContacts.secondary.email,
    },
  });

  const [birthdayDate, setBirthdayDate] = useState<Date | undefined>(undefined);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmergencyChange = (
    type: "primaryEmergency" | "secondaryEmergency",
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const handleSave = () => {
    toast.success("Profile updated successfully");
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="text-xl font-semibold">{t("profile.editProfile")}</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 py-6">
            {/* Avatar Section */}
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* General Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">{t("profile.general")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredName">Preferred First Name</Label>
                  <Input
                    id="preferredName"
                    value={formData.preferredName}
                    onChange={(e) => handleInputChange("preferredName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthday">Birthday</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="birthday"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !birthdayDate && !formData.birthday && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {birthdayDate
                          ? formatDate(birthdayDate)
                          : formData.birthday || "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={birthdayDate}
                        onSelect={setBirthdayDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nrdsId">NRDS Number</Label>
                <Input
                  id="nrdsId"
                  value={formData.nrdsId}
                  onChange={(e) => handleInputChange("nrdsId", e.target.value)}
                />
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">{t("profile.contact")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fax">Fax</Label>
                  <Input
                    id="fax"
                    placeholder="Enter fax number"
                    value={formData.fax}
                    onChange={(e) => handleInputChange("fax", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Receive Text</Label>
                <RadioGroup
                  value={formData.receiveText ? "yes" : "no"}
                  onValueChange={(value) => handleInputChange("receiveText", value === "yes")}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="receiveTextYes" />
                    <Label htmlFor="receiveTextYes" className="font-normal cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="receiveTextNo" />
                    <Label htmlFor="receiveTextNo" className="font-normal cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  By selecting yes, I consent to receiving text messages from eXp Realty. Message
                  and data rates may apply.
                </p>
              </div>
            </div>

            {/* Email Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">{t("profile.email")}</h3>
              <div className="space-y-2">
                <Label htmlFor="forwardingAddress">Forwarding Address</Label>
                <Input
                  id="forwardingAddress"
                  type="email"
                  value={formData.forwardingAddress}
                  onChange={(e) => handleInputChange("forwardingAddress", e.target.value)}
                />
              </div>
            </div>

            {/* Emergency Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Emergency Contact Information</h3>

              {/* Primary */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Primary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryName">Name</Label>
                    <Input id="primaryName" value={formData.primaryEmergency.name} onChange={(e) => handleEmergencyChange("primaryEmergency", "name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryRelationship">Relationship</Label>
                    <Input id="primaryRelationship" value={formData.primaryEmergency.relationship} onChange={(e) => handleEmergencyChange("primaryEmergency", "relationship", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryPhone">Phone Number</Label>
                    <Input id="primaryPhone" value={formData.primaryEmergency.phoneNumber} onChange={(e) => handleEmergencyChange("primaryEmergency", "phoneNumber", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryEmail">Email</Label>
                    <Input id="primaryEmail" type="email" value={formData.primaryEmergency.email} onChange={(e) => handleEmergencyChange("primaryEmergency", "email", e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Secondary */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Secondary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secondaryName">Name</Label>
                    <Input id="secondaryName" value={formData.secondaryEmergency.name} onChange={(e) => handleEmergencyChange("secondaryEmergency", "name", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryRelationship">Relationship</Label>
                    <Input id="secondaryRelationship" value={formData.secondaryEmergency.relationship} onChange={(e) => handleEmergencyChange("secondaryEmergency", "relationship", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secondaryPhone">Phone Number</Label>
                    <Input id="secondaryPhone" value={formData.secondaryEmergency.phoneNumber} onChange={(e) => handleEmergencyChange("secondaryEmergency", "phoneNumber", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryEmail">Email</Label>
                    <Input id="secondaryEmail" type="email" value={formData.secondaryEmergency.email} onChange={(e) => handleEmergencyChange("secondaryEmergency", "email", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="flex-col gap-3 p-6 pt-4 border-t">
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              {t("profile.cancel")}
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-primary">
              {t("profile.save")}
            </Button>
          </div>
          <div className="flex items-start gap-2 p-3 bg-muted rounded-md">
            <span className="text-muted-foreground text-xs">ⓘ</span>
            <p className="text-xs text-muted-foreground">
              Please allow sometime for your updates to reflect across all systems.
            </p>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
