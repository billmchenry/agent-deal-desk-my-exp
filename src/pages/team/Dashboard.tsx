import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Filter, MessageCircle, ChevronRight, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { topAgents, teamOverview, teamRequirements } from "@/data/mockData";

export default function TeamDashboard() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">My Team</h1>
          <Button variant="outline">Team Report</Button>
        </div>

        <p className="text-lg font-medium text-foreground mb-6">
          My Team: New Vision Realty Group
        </p>

        {/* Overview Section */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Overview</CardTitle>
            <Select defaultValue="jan2026">
              <SelectTrigger className="w-[220px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>01/01/2026 - 01/22/2026</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jan2026">01/01/2026 - 01/22/2026</SelectItem>
                <SelectItem value="dec2025">12/01/2025 - 12/31/2025</SelectItem>
                <SelectItem value="q42025">Q4 2025</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Units</p>
                <p className="text-3xl font-bold text-foreground">
                  13 <span className="text-sm font-normal text-muted-foreground">Units</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">Pending : 2 Units</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Volume</p>
                <p className="text-3xl font-bold text-foreground">
                  $5,145,000.00 <span className="text-sm font-normal text-muted-foreground">USD</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">Pending : $1,659,000.00 USD</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Team Lead Split</p>
                <p className="text-3xl font-bold text-foreground">
                  $2,669.00 <span className="text-sm font-normal text-muted-foreground">USD</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">Pending : $0.00 USD</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Onboarding Agents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Onboarding Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">No reports available.</p>
            </CardContent>
          </Card>

          {/* Top Agents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Top Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="units" className="w-full">
                <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-4">
                  <TabsTrigger 
                    value="units" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-2"
                  >
                    Units Closed
                  </TabsTrigger>
                  <TabsTrigger 
                    value="volume" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-2"
                  >
                    Highest Volume
                  </TabsTrigger>
                  <TabsTrigger 
                    value="commission" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-2"
                  >
                    Commission
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="units" className="mt-0">
                  <div className="space-y-3">
                    {topAgents.map((agent) => (
                      <div 
                        key={agent.name} 
                        className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 rounded-lg px-2 -mx-2"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 bg-primary">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {agent.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{agent.name}</p>
                            <p className="text-sm text-muted-foreground">{agent.rank}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{agent.units} Units</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full text-center text-primary hover:underline text-sm mt-4">
                    View All
                  </button>
                </TabsContent>

                <TabsContent value="volume" className="mt-0">
                  <p className="text-center text-muted-foreground py-8">Volume data coming soon.</p>
                </TabsContent>

                <TabsContent value="commission" className="mt-0">
                  <p className="text-center text-muted-foreground py-8">Commission data coming soon.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Re-qualification Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground">Re-qualification</h3>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    🏆 Mega Team
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Cap Reset Date: 01/01/2027</p>
              </div>
              <Button className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Contact Team Services
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
              <div className="font-medium text-foreground">Requirements</div>
              <div className="font-medium text-foreground">Progress</div>
              
              {teamRequirements.map((req) => (
                <>
                  <div key={`label-${req.label}`} className="flex items-center gap-2 text-sm text-muted-foreground">
                    {req.label}
                    {req.hasInfo && <Info className="h-4 w-4" />}
                  </div>
                  <div key={`progress-${req.label}`} className="space-y-1">
                    <p className="text-sm text-foreground">{req.value}</p>
                    <Progress 
                      value={req.progress} 
                      className={`h-2 ${req.isWarning ? '[&>div]:bg-yellow-500' : req.progress === 100 ? '[&>div]:bg-green-500' : ''}`}
                    />
                  </div>
                </>
              ))}
            </div>

            <button className="text-primary hover:underline text-sm mt-6">
              View Details
            </button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}