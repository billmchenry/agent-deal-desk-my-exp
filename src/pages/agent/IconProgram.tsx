import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

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

          <TabsContent value="cultural">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">ICON Cultural requirements and progress will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Required events and attendance records will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stockgrants">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Stock grant information and history will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
