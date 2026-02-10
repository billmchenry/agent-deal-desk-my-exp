import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Info, CheckCircle, ExternalLink, Check, Award } from "lucide-react";
import { IconStatusBanner } from "@/components/agent/IconStatusBanner";

export default function IconProgram() {
  const [activeTab, setActiveTab] = useState("production");

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        {/* Unified Header with Year Selector */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">ICON Program</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Year</span>
            <Select defaultValue="2026">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">01/01/2026 - 12/31/2026</SelectItem>
                <SelectItem value="2025">01/01/2025 - 12/31/2025</SelectItem>
                <SelectItem value="2024">01/01/2024 - 12/31/2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Summary Banner */}
        <IconStatusBanner activeTab={activeTab} onTabChange={setActiveTab} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          {/* ICON Production Tab */}
          <TabsContent value="production">
            <h2 className="text-lg font-semibold text-foreground mb-6">ICON Production Overview</h2>

            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Company Commission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Individual Cap */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">Individual Cap</h3>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">
                          In Progress
                        </Badge>
                      </div>
                    </div>
                    <Progress value={3.01} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">$481.90 earned</span>
                      <span className="text-sm font-medium text-foreground">3.01%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Note: Complete $16K to achieve the company commission goal
                    </p>
                  </div>

                  {/* Team Cap */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">Team Cap</h3>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">
                          In Progress
                        </Badge>
                      </div>
                    </div>
                    <Progress value={31.17} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">$12,469.00 earned</span>
                      <span className="text-sm font-medium text-foreground">31.17%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Note: Complete $40K to achieve the team commission goal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Note Banner */}
            <div className="bg-muted/50 border border-border rounded-lg p-4 flex gap-3">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span> A representative of the ICON Program will notify qualified agents of their ICON status by the 25th of the month following achievement of the Production Award Requirement ("Production Requirement"). If an agent believes they have qualified for ICON status and have not received an email notification by the 25th of the following month, that agent should email{" "}
                <a href="mailto:iconaward@exprealty.net" className="text-primary hover:underline">
                  iconaward@exprealty.net
                </a>{" "}
                to inquire.
              </p>
            </div>
          </TabsContent>

          {/* ICON Cultural Tab */}
          <TabsContent value="cultural">
            <h2 className="text-lg font-semibold text-foreground mb-6">ICON Cultural Commitment Points</h2>

            {/* Compact success banner */}
            <div className="bg-[hsl(var(--exp-green))]/10 border border-[hsl(var(--exp-green))]/20 rounded-lg p-4 flex items-center gap-3 mb-6">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--exp-green))] flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">
                You have achieved your ICON Cultural goal for 2025 – 2026
              </span>
            </div>

            {/* Note Banner */}
            <div className="bg-muted/50 border border-border rounded-lg p-4 flex gap-3">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span> In the month following completion of the Cultural Requirements during the ICON Cultural Benefit Year, a final audit will be completed to verify if the ICON agent has met the Cultural Commitment points requirements to earn the additional stock award.
              </p>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <h2 className="text-lg font-semibold text-foreground mb-6">Event Overview</h2>

            {/* Compact success banner */}
            <div className="bg-[hsl(var(--exp-green))]/10 border border-[hsl(var(--exp-green))]/20 rounded-lg p-4 flex items-center gap-3 mb-6">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--exp-green))] flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">
                You have achieved your events goal for 2025 – 2026
              </span>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Events Attended</h3>
                  <span className="text-2xl font-bold text-foreground">02</span>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-muted-foreground">Goal</span>
                  <div className="flex-1">
                    <Progress value={100} className="h-2" />
                  </div>
                  <span className="text-sm font-medium text-foreground">100%</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Attend 2 events to achieve the goal</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <span className="text-sm text-foreground">
                      <span className="font-medium">Event 1</span>: Regional Rally Spring 2025
                    </span>
                    <Badge className="bg-[hsl(var(--exp-green))] hover:bg-[hsl(var(--exp-green))] text-white gap-1">
                      <Check className="h-3 w-3" />
                      Attended
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <span className="text-sm text-foreground">
                      <span className="font-medium">Event 2</span>: EXPCON 2025
                    </span>
                    <Badge className="bg-[hsl(var(--exp-green))] hover:bg-[hsl(var(--exp-green))] text-white gap-1">
                      <Check className="h-3 w-3" />
                      Attended
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Note Banner */}
            <div className="bg-muted/50 border border-border rounded-lg p-4 flex gap-3">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span> ICON agents have the opportunity to earn a stock award of up to an additional $4,000 worth of EXPI common stock in the month following attendance of eXp approved events; a stock award of $2,000 worth of EXPI common stock will be issued for each event attended, for a maximum of two events per ICON Cultural Benefit Year.
              </p>
            </div>
          </TabsContent>

          {/* Stock Grants Tab */}
          <TabsContent value="stockgrants">
            <h2 className="text-lg font-semibold text-foreground mb-6">Grants Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { title: "Production", amount: "$8,000" },
                { title: "Cultural", amount: "$4,000" },
                { title: "Event 1", amount: "$2,000" },
                { title: "Event 2", amount: "$2,000" },
              ].map((grant) => (
                <Card key={grant.title} className="text-center">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-3">{grant.title}</h3>
                    <div className="w-14 h-14 rounded-full bg-[hsl(var(--exp-green))]/10 flex items-center justify-center mx-auto mb-3">
                      <Award className="w-7 h-7 text-[hsl(var(--exp-green))]" />
                    </div>
                    <p className="text-lg font-bold text-foreground mb-2">{grant.amount}</p>
                    <Badge className="bg-[hsl(var(--exp-green))] hover:bg-[hsl(var(--exp-green))] text-white gap-1">
                      <Check className="h-3 w-3" />
                      Awarded
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mb-6">
              <a
                href="https://www.morganstanley.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Open Morgan Stanley at Work
              </a>
            </div>

            {/* Note Banner */}
            <div className="bg-muted/50 border border-border rounded-lg p-4 flex gap-3">
              <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span> All stock awards are subject to a one month delay, and will be posted by the last day of the month following the award date.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
