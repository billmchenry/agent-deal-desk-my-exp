import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Info, Phone, Mail, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const levelData = [
  { name: "Level 1", value: 15, agents: 35, color: "#e5e7eb" },
  { name: "Level 2", value: 21.9, agents: 51, color: "#d1d5db" },
  { name: "Level 3", value: 19.7, agents: 46, color: "#9ca3af" },
  { name: "Level 4", value: 18.9, agents: 44, color: "#6b7280" },
  { name: "Level 5", value: 15, agents: 35, color: "#1e3a5f" },
  { name: "Level 6", value: 6.4, agents: 15, color: "#1e3a5f" },
  { name: "Level 7", value: 3, agents: 7, color: "#e5e7eb" },
];

const coSponsees = [
  { name: "Emily Chen", initials: "E", status: "active" },
  { name: "Marcus Davis", initials: "M", status: "active" },
  { name: "Victoria Palmer", initials: "V", status: "active" },
];

export default function RevShareDashboard() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">RevShare Dashboard</h1>

        {/* CTA Banner */}
        <Card className="bg-primary text-primary-foreground mb-6">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Want to Grow Your Rev Share?</h2>
              <p className="text-primary-foreground/80">We've got your back! Schedule a call with the Growth Team!</p>
            </div>
            <Button variant="outline" className="bg-background text-foreground hover:bg-muted">
              <ChevronRight className="h-4 w-4 mr-1" />
              Learn more here!
            </Button>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">FLA</span>
                <Info className="h-4 w-4" />
              </div>
              <p className="text-sm text-primary-foreground/80 mb-4">Front-Line Agents</p>
              <p className="text-3xl font-bold">36</p>
            </CardContent>
          </Card>

          <Card className="bg-primary/90 text-primary-foreground">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">FLQA</span>
                <Info className="h-4 w-4" />
              </div>
              <p className="text-sm text-primary-foreground/80 mb-1">Front-Line Qualifying Agents.</p>
              <p className="text-sm text-primary-foreground/80 mb-2">You are in level 7</p>
              <p className="text-3xl font-bold">30</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-foreground">New Agents</span>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">Showing last 30 days</p>
              <p className="text-3xl font-bold text-foreground">6</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-foreground">Prospective Agents</span>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">Track agents currently in the joining process.</p>
              <p className="text-3xl font-bold text-foreground">6</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Share Group */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-medium">Revenue Share Group</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <Select defaultValue="levels1-7">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="View levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="levels1-7">Viewing Levels 1-7 (Default)</SelectItem>
                  <SelectItem value="levels1-3">Viewing Levels 1-3</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="contributor" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="lineage">Lineage</TabsTrigger>
                  <TabsTrigger value="contributor">Contributor View</TabsTrigger>
                </TabsList>

                <TabsContent value="contributor">
                  <p className="text-sm text-muted-foreground mb-4">
                    Agent placement reflects revenue share structure, including system-applied spacer tiers. These spacers may shift agents between levels compared to their direct sponsor lineage.
                  </p>
                  
                  <div className="bg-muted/50 rounded-lg p-3 mb-6 flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Spacers are system-applied tiers used to align payout levels based on onboarding configuration, sponsor availability, or country pairing. They may cause agents to appear at a different level than their direct sponsor relationship.
                    </p>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="w-40 h-40 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={levelData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            dataKey="value"
                          >
                            {levelData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">233</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      {levelData.map((level) => (
                        <div key={level.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-sm" 
                              style={{ backgroundColor: level.color }}
                            />
                            <span className="text-foreground font-medium">{level.name}</span>
                            <span className="text-muted-foreground">({level.value}%)</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <span>{level.agents} Agents</span>
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="lineage">
                  <p className="text-center text-muted-foreground py-8">Lineage view coming soon.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Payout Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-medium">Payout Details</CardTitle>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Unpaid</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Calculated but not paid out <Info className="h-3 w-3" />
                  </p>
                </div>
                <span className="text-xl font-bold text-foreground">$1,869.20</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Expected Next</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Due to be paid in February <Info className="h-3 w-3" />
                  </p>
                </div>
                <span className="text-xl font-bold text-foreground">$1,869.20</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">Last Paid</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Paid to you <Info className="h-3 w-3" />
                  </p>
                </div>
                <span className="text-xl font-bold text-foreground">$986.92</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Co Sponsees */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Co Sponsees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {coSponsees.map((sponsee) => (
                <div key={sponsee.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 bg-muted">
                        <AvatarFallback>{sponsee.initials}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                    <span className="font-medium text-foreground">{sponsee.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-primary hover:underline text-sm mt-4">
              View Details
            </button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}