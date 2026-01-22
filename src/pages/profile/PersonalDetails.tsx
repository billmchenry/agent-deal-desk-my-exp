import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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
import { TransactionPrefsTab } from "@/components/profile/TransactionPrefsTab";
import { LicensesTab } from "@/components/profile/LicensesTab";
import { MentorTab } from "@/components/profile/MentorTab";
import { PartnerAgentTab } from "@/components/profile/PartnerAgentTab";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function PersonalDetails() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">My Profile</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <ProfileSidebarCard />

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            {/* Top Level Tabs */}
            <Tabs defaultValue="personal-details" className="w-full">
              <TabsList className="mb-4 bg-muted">
                <TabsTrigger
                  value="personal-details"
                  className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground"
                >
                  Personal Details
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal-details" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    {/* Upper Tabs */}
                    <Tabs defaultValue="general" className="w-full">
                      <TabsList className="mb-6 flex-wrap h-auto gap-1 bg-transparent p-0">
                        <TabsTrigger
                          value="general"
                          className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm"
                        >
                          General
                        </TabsTrigger>
                        <TabsTrigger
                          value="contact"
                          className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm"
                        >
                          Contact
                        </TabsTrigger>
                        <TabsTrigger
                          value="email"
                          className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm"
                        >
                          Email
                        </TabsTrigger>
                        <TabsTrigger
                          value="addresses"
                          className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm"
                        >
                          Addresses
                        </TabsTrigger>
                        <TabsTrigger
                          value="emergency"
                          className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm"
                        >
                          Emergency Contacts
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="general" className="mt-0">
                        <GeneralTab />
                      </TabsContent>
                      <TabsContent value="contact" className="mt-0">
                        <ContactTab />
                      </TabsContent>
                      <TabsContent value="email" className="mt-0">
                        <EmailTab />
                      </TabsContent>
                      <TabsContent value="addresses" className="mt-0">
                        <AddressesTab />
                      </TabsContent>
                      <TabsContent value="emergency" className="mt-0">
                        <EmergencyContactsTab />
                      </TabsContent>
                    </Tabs>

                    {/* Lower Tabs */}
                    <div className="mt-8 pt-6 border-t border-border">
                      <Tabs defaultValue="office-locations" className="w-full">
                        <TabsList className="mb-6 flex-wrap h-auto gap-1 bg-transparent p-0">
                          <TabsTrigger
                            value="office-locations"
                            className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm"
                          >
                            Office Locations
                          </TabsTrigger>
                          <TabsTrigger
                            value="active-markets"
                            className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm"
                          >
                            Active Markets
                          </TabsTrigger>
                          <TabsTrigger
                            value="organizations"
                            className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm"
                          >
                            Organizations
                          </TabsTrigger>
                          <TabsTrigger
                            value="teams"
                            className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm"
                          >
                            Teams
                          </TabsTrigger>
                          <TabsTrigger
                            value="transaction-prefs"
                            className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm"
                          >
                            Transaction preferences
                          </TabsTrigger>
                          <TabsTrigger
                            value="licenses"
                            className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm"
                          >
                            Licenses
                          </TabsTrigger>
                          <TabsTrigger
                            value="mentor"
                            className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm"
                          >
                            Mentor
                          </TabsTrigger>
                          <TabsTrigger
                            value="partner-agent"
                            className="data-[state=active]:bg-exp-navy data-[state=active]:text-primary-foreground rounded-full px-4 py-1.5 text-sm"
                          >
                            Partner Agent
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="office-locations" className="mt-0">
                          <OfficeLocationsTab />
                        </TabsContent>
                        <TabsContent value="active-markets" className="mt-0">
                          <ActiveMarketsTab />
                        </TabsContent>
                        <TabsContent value="organizations" className="mt-0">
                          <OrganizationsTab />
                        </TabsContent>
                        <TabsContent value="teams" className="mt-0">
                          <TeamsTab />
                        </TabsContent>
                        <TabsContent value="transaction-prefs" className="mt-0">
                          <TransactionPrefsTab />
                        </TabsContent>
                        <TabsContent value="licenses" className="mt-0">
                          <LicensesTab />
                        </TabsContent>
                        <TabsContent value="mentor" className="mt-0">
                          <MentorTab />
                        </TabsContent>
                        <TabsContent value="partner-agent" className="mt-0">
                          <PartnerAgentTab />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">Settings content coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
