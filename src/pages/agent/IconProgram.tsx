import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CircleAlert, CheckCircle, ExternalLink, Check, Target } from "lucide-react";
import { IconStatusBanner } from "@/components/agent/IconStatusBanner";

export default function IconProgram() {
  const [activeTab, setActiveTab] = useState("production");

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-20">
        {/* Page Title */}
        <h1 className="text-lg font-semibold text-foreground">ICON Program</h1>

        {/* Compact Hero Banner */}
        <Card className="overflow-hidden bg-gradient-to-br from-[hsl(var(--exp-navy))] via-[hsl(var(--exp-navy-light))] to-[hsl(var(--exp-blue))] p-3 sm:p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-[hsl(var(--exp-gold))]/20 text-[hsl(var(--exp-gold-light))] border-[hsl(var(--exp-gold))]/30 hover:bg-[hsl(var(--exp-gold))]/30">
              <Target className="mr-1 h-3 w-3" />
              ICON PROGRAM
            </Badge>
          </div>
          <p className="text-sm text-white/70">3 of 4 pillars complete — Keep going!</p>
        </Card>

        {/* Status Summary Banner */}
        <IconStatusBanner activeTab={activeTab} onTabChange={setActiveTab} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

          {/* ICON Production Tab */}
          <TabsContent value="production">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">ICON Production Overview</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Capping Year</span>
                <Select defaultValue="2026">
                  <SelectTrigger className="w-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">01/01/2026 - 12/31/2026</SelectItem>
                    <SelectItem value="2025">01/01/2025 - 12/31/2025</SelectItem>
                    <SelectItem value="2024">01/01/2024 - 12/31/2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>


            {/* Top Row: Company Commission + Capped Transaction Fees */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-foreground">Company Commission</h3>
                  <Progress value={26.16} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">$4,186.17</span>
                    <span className="text-sm font-medium text-foreground">26.16%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete $16K to achieve the company commission goal
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-medium text-foreground">Capped Transaction Fees</h3>
                  <Progress value={0} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">$0.00</span>
                    <span className="text-sm font-medium text-foreground">0%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Complete $5K to achieve the capped transaction fees goal
                  </p>
                </CardContent>
              </Card>
            </div>


            {/* Qualify - Option 2 */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Qualify - Option 2</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Company Commission */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Company Commission</h4>
                    <Progress value={26.16} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">$4,186.17</span>
                      <span className="text-sm font-medium text-foreground">26.16%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Goal: $16K</p>
                  </div>

                  {/* GCI */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">GCI</h4>
                    <Progress value={4.19} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">$20,930.87</span>
                      <span className="text-sm font-medium text-foreground">4.19%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Goal: $500K</p>
                  </div>

                  {/* Closed Transactions */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">Closed Transactions</h4>
                    <Progress value={50} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">5 of 10</span>
                      <span className="text-sm font-medium text-foreground">50%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Close 10 transactions</p>
                  </div>

                  {/* ICON Qualifying Fee */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">ICON Qualifying Fee</h4>
                    <Badge variant="destructive" className="mt-1">Not Paid</Badge>
                    <p className="text-xs text-muted-foreground">
                      A one-time qualifying fee must be paid to complete ICON qualification.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Note Banner */}
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex gap-3">
              <CircleAlert className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
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
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">ICON Cultural Commitment Points</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Benefit Year</span>
                <Select defaultValue="2025-2026">
                  <SelectTrigger className="w-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-2026">06/01/2025 - 05/31/2026</SelectItem>
                    <SelectItem value="2024-2025">06/01/2024 - 05/31/2025</SelectItem>
                    <SelectItem value="2023-2024">06/01/2023 - 05/31/2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Compact success banner */}
            <div className="bg-[hsl(var(--exp-green))]/10 border border-[hsl(var(--exp-green))]/20 rounded-lg p-3 flex items-center gap-3 mb-4">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--exp-green))] flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">
                You have achieved your ICON Cultural goal for 2025 – 2026
              </span>
            </div>

            {/* Note Banner */}
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex gap-3">
              <CircleAlert className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span> In the month following completion of the Cultural Requirements during the ICON Cultural Benefit Year, a final audit will be completed to verify if the ICON agent has met the Cultural Commitment points requirements to earn the additional stock award.
              </p>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Event Overview</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Benefit Year</span>
                <Select defaultValue="2025-2026">
                  <SelectTrigger className="w-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-2026">06/01/2025 - 05/31/2026</SelectItem>
                    <SelectItem value="2024-2025">06/01/2024 - 05/31/2025</SelectItem>
                    <SelectItem value="2023-2024">06/01/2023 - 05/31/2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Compact success banner */}
            <div className="bg-[hsl(var(--exp-green))]/10 border border-[hsl(var(--exp-green))]/20 rounded-lg p-3 flex items-center gap-3 mb-4">
              <CheckCircle className="h-5 w-5 text-[hsl(var(--exp-green))] flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">
                You have achieved your events goal for 2025 – 2026
              </span>
            </div>

            <Card className="mb-4">
              <CardContent className="p-4">
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
                <p className="text-sm text-muted-foreground mb-4">Attend 2 events to achieve the goal</p>

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
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex gap-3">
              <CircleAlert className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span> ICON agents have the opportunity to earn a stock award of up to an additional $4,000 worth of EXPI common stock in the month following attendance of eXp approved events; a stock award of $2,000 worth of EXPI common stock will be issued for each event attended, for a maximum of two events per ICON Cultural Benefit Year.
              </p>
            </div>
          </TabsContent>

          {/* Stock Grants Tab */}
          <TabsContent value="stockgrants">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Grants Overview</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Benefit Year</span>
                <Select defaultValue="2025-2026">
                  <SelectTrigger className="w-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-2026">06/01/2025 - 05/31/2026</SelectItem>
                    <SelectItem value="2024-2025">06/01/2024 - 05/31/2025</SelectItem>
                    <SelectItem value="2023-2024">06/01/2023 - 05/31/2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {[
                { title: "Production", amount: "$8,000" },
                { title: "Cultural", amount: "$4,000" },
                { title: "Event 1", amount: "$2,000" },
                { title: "Event 2", amount: "$2,000" },
              ].map((grant) => (
                <Card key={grant.title} className="border-t-2 border-t-[hsl(var(--exp-green))]">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{grant.title}</h3>
                      <p className="text-lg font-bold text-foreground mt-1">{grant.amount}</p>
                    </div>
                    <Badge className="bg-[hsl(var(--exp-green))] hover:bg-[hsl(var(--exp-green))] text-white gap-1">
                      <Check className="h-3 w-3" />
                      Awarded
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mb-4">
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
            <div className="bg-muted/50 border border-border rounded-lg p-3 flex gap-3">
              <CircleAlert className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
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
