import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Info, CheckCircle, BarChart3, ExternalLink, Check } from "lucide-react";

// Success illustration component
const SuccessIllustration = () => (
  <div className="flex flex-col items-center py-8">
    <div className="relative mb-6">
      <div className="w-24 h-24 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
        <CheckCircle className="w-12 h-12 text-green-500" />
      </div>
      <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-primary/20" />
      <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-primary/30" />
      <div className="absolute top-1/2 -right-4 w-2 h-2 text-muted-foreground/40">×</div>
      <div className="absolute top-0 -left-3 w-2 h-2 text-muted-foreground/40">×</div>
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">Congratulations!</h3>
  </div>
);

// Stock grant card illustration
const StockGrantIllustration = () => (
  <div className="flex justify-center py-4">
    <div className="relative">
      <div className="w-20 h-20 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
        <BarChart3 className="w-10 h-10 text-muted-foreground/60" />
      </div>
      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary/20" />
      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-primary/30" />
      <div className="absolute top-1/2 -right-3 text-xs text-muted-foreground/40">×</div>
    </div>
  </div>
);

export default function IconProgram() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">ICON Program</h1>

        <Tabs defaultValue="production" className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6">
            <TabsTrigger 
              value="production" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3"
            >
              ICON Production
            </TabsTrigger>
            <TabsTrigger 
              value="cultural" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3"
            >
              ICON Cultural
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3"
            >
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="stockgrants" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3"
            >
              Stock Grants
            </TabsTrigger>
          </TabsList>

          {/* ICON Production Tab */}
          <TabsContent value="production">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">ICON Production Overview</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Capping Year</span>
                <Select defaultValue="2026">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">01/01/2026 - 01/01/...</SelectItem>
                    <SelectItem value="2025">01/01/2025 - 12/31/2025</SelectItem>
                    <SelectItem value="2024">01/01/2024 - 12/31/2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                        <span className="text-sm text-muted-foreground">3.01%</span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={3.01} className="h-2" />
                      <div 
                        className="absolute -top-8 bg-foreground text-background text-xs px-2 py-1 rounded"
                        style={{ left: '3%', transform: 'translateX(-50%)' }}
                      >
                        $481.90
                      </div>
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
                        <span className="text-sm text-muted-foreground">31.17%</span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress value={31.17} className="h-2" />
                      <div 
                        className="absolute -top-8 bg-foreground text-background text-xs px-2 py-1 rounded"
                        style={{ left: '31%', transform: 'translateX(-50%)' }}
                      >
                        $12,469.00
                      </div>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">ICON Cultural Commitment Points</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Benefit Year</span>
                <Select defaultValue="2025">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">06/01/2025 - 06/30/...</SelectItem>
                    <SelectItem value="2024">06/01/2024 - 05/31/2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <SuccessIllustration />
            <p className="text-center text-muted-foreground mb-8">
              You have achieved your ICON Cultural goal for 2025 - 2026
            </p>

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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Event Overview</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Benefit Year</span>
                <Select defaultValue="2025">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">06/01/2025 - 06/30/...</SelectItem>
                    <SelectItem value="2024">06/01/2024 - 05/31/2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <SuccessIllustration />
            <p className="text-center text-muted-foreground mb-8">
              You have achieved your events goal for 2025 - 2026
            </p>

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
                    <Badge className="bg-green-500 hover:bg-green-500 text-white gap-1">
                      <Check className="h-3 w-3" />
                      Attended
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <span className="text-sm text-foreground">
                      <span className="font-medium">Event 2</span>: EXPCON 2025
                    </span>
                    <Badge className="bg-green-500 hover:bg-green-500 text-white gap-1">
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Grants Overview</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Benefit Year</span>
                <Select defaultValue="2025">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">06/01/2025 - 06/30/...</SelectItem>
                    <SelectItem value="2024">06/01/2024 - 05/31/2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {["Production", "Cultural", "Event 1", "Event 2"].map((title) => (
                <Card key={title} className="text-center">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                    <StockGrantIllustration />
                    <Badge className="bg-green-500 hover:bg-green-500 text-white gap-1 mt-4">
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
