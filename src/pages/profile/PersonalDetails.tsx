import { useState } from "react";
import { Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { ProfileSidebarCard } from "@/components/profile/ProfileSidebarCard";
import { GeneralTab } from "@/components/profile/GeneralTab";
import { ContactTab } from "@/components/profile/ContactTab";
import { EmailTab } from "@/components/profile/EmailTab";
import { AddressesTab } from "@/components/profile/AddressesTab";
import { EmergencyContactsTab } from "@/components/profile/EmergencyContactsTab";
import { OfficeLocationsTab } from "@/components/profile/OfficeLocationsTab";
import { ActiveMarketsTab } from "@/components/profile/ActiveMarketsTab";
import { OrganizationsTab } from "@/components/profile/OrganizationsTab";
import { TeamsTab } from "@/components/profile/TeamsTab";
import { LicensesTab } from "@/components/profile/LicensesTab";
import { EditProfileSheet } from "@/components/profile/EditProfileSheet";
import { ProfilePageLayout } from "@/components/profile/ProfilePageLayout";
import { userProfile } from "@/data/mockData";

export default function PersonalDetails() {
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  return (
    <ProfilePageLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileSidebarCard />

        <div className="flex-1 min-w-0">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditSheetOpen(true)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>

              <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="addresses">Addresses</TabsTrigger>
                  <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-0"><GeneralTab /></TabsContent>
                <TabsContent value="contact" className="mt-0"><ContactTab /></TabsContent>
                <TabsContent value="email" className="mt-0"><EmailTab /></TabsContent>
                <TabsContent value="addresses" className="mt-0"><AddressesTab /></TabsContent>
                <TabsContent value="emergency" className="mt-0"><EmergencyContactsTab /></TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Accordion layout */}
      <Card className="mt-6">
        <CardContent className="p-4 md:p-6">
          <Accordion type="single" collapsible defaultValue="office-locations">
            <AccordionItem value="office-locations">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-2">
                  Office Locations
                  <Badge variant="secondary" className="text-xs font-normal">{userProfile.officeLocations.length}</Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent><OfficeLocationsTab /></AccordionContent>
            </AccordionItem>

            <AccordionItem value="active-markets">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-2">
                  Active Markets
                  <Badge variant="secondary" className="text-xs font-normal">{userProfile.activeMarkets.length}</Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent><ActiveMarketsTab /></AccordionContent>
            </AccordionItem>

            <AccordionItem value="organizations">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-2">
                  Organizations
                  <Badge variant="secondary" className="text-xs font-normal">{userProfile.organizations.length}</Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent><OrganizationsTab /></AccordionContent>
            </AccordionItem>

            <AccordionItem value="teams">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-2">
                  Teams
                  <Badge variant="secondary" className="text-xs font-normal">{userProfile.teams.length}</Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent><TeamsTab /></AccordionContent>
            </AccordionItem>

            <AccordionItem value="licenses">
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-2">
                  Licenses
                  <Badge variant="secondary" className="text-xs font-normal">{userProfile.licenses.length}</Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent><LicensesTab /></AccordionContent>
            </AccordionItem>

            <AccordionItem value="preferences">
              <AccordionTrigger className="hover:no-underline">
                Preferences & Other
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="splitCheckPreference" checked={userProfile.transactionPreferences.splitCheckPreference} disabled />
                    <Label htmlFor="splitCheckPreference" className="text-sm text-muted-foreground">Split Check Preference</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="partnerAgent" checked={userProfile.isPartnerAgent} disabled />
                    <Label htmlFor="partnerAgent" className="text-sm text-muted-foreground">Partner Agent</Label>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Mentor Participation</Label>
                    <RadioGroup value={userProfile.mentorParticipation} disabled className="flex gap-4">
                      <div className="flex items-center space-x-1.5">
                        <RadioGroupItem value="Mentor" id="mentor" disabled />
                        <Label htmlFor="mentor" className="text-sm text-muted-foreground">Mentor</Label>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <RadioGroupItem value="Mentee" id="mentee" disabled />
                        <Label htmlFor="mentee" className="text-sm text-muted-foreground">Mentee</Label>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <RadioGroupItem value="None" id="none" disabled />
                        <Label htmlFor="none" className="text-sm text-muted-foreground">None</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <EditProfileSheet open={editSheetOpen} onOpenChange={setEditSheetOpen} />
    </ProfilePageLayout>
  );
}
