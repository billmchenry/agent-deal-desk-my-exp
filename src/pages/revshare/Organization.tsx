import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { RevShareSubNav } from "@/components/revshare/RevShareSubNav";

const agentAreasData = [
  { name: "Residential", value: 93.1, color: "#1e3a5f" },
  { name: "Commercial", value: 5.2, color: "#60a5fa" },
  { name: "Referral", value: 1.7, color: "#e5e7eb" },
];

const influencerData = [
  { name: "BETA", value: 80.7, color: "#1e3a5f" },
  { name: "Leaders", value: 18, color: "#60a5fa" },
  { name: "Builders", value: 1.3, color: "#e5e7eb" },
];

const salesVolumeData = [
  { level: "1", volume: 4718000 },
  { level: "2", volume: 2100000 },
  { level: "3", volume: 1800000 },
  { level: "4", volume: 1500000 },
  { level: "5", volume: 1200000 },
  { level: "6", volume: 800000 },
];

export default function OrganizationReporting() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <RevShareSubNav />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Organization Reporting</h1>
        </div>

        <Tabs defaultValue="summary" className="w-full mb-6">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0">
              <TabsTrigger 
                value="summary" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3"
              >
                Summary
              </TabsTrigger>
              <TabsTrigger 
                value="offboarding" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3"
              >
                Offboarding Overview
              </TabsTrigger>
              <TabsTrigger 
                value="detail" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3"
              >
                Detail Report
              </TabsTrigger>
            </TabsList>
            <Select defaultValue="2026">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="summary">
            <h2 className="text-lg font-semibold text-foreground mb-4">Performance Snapshot</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-foreground">233</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Total Organization Size</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-foreground">5</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Agents who have joined the organization (year-to-date)</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-foreground">1</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Agents with ICON status</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-foreground">2</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Count of Team Leaders</p>
                </CardContent>
              </Card>
            </div>

            {/* Transaction Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <Card className="bg-primary text-primary-foreground lg:col-span-2">
                <CardContent className="p-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-4xl font-bold mb-2">24</p>
                    <p className="text-sm text-primary-foreground/80">
                      Total transactions for active agents in the organization (year-to-date)
                    </p>
                  </div>
                  <div className="border-l border-primary-foreground/20 pl-6">
                    <p className="text-4xl font-bold mb-2">0.10</p>
                    <p className="text-sm text-primary-foreground/80">
                      Transactions per agent (year-to-date)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-primary-foreground/80">Total Revenue Share (USD)</p>
                    <Info className="h-4 w-4 text-primary-foreground/60" />
                  </div>
                  <p className="text-4xl font-bold">$847.71</p>
                </CardContent>
              </Card>
            </div>

            {/* YTD Volume */}
            <Card className="mb-6">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">YTD Volume</p>
                  <p className="text-sm text-muted-foreground">USD</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">$10,774,400.00</span>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Agent Areas */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-medium">Agent Areas</CardTitle>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={agentAreasData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {agentAreasData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center mt-4">
                    {agentAreasData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Influencer Group */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-medium">Influencer Group by Category</CardTitle>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={influencerData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {influencerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center mt-4">
                    {influencerData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sales Volume Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-medium">Sales Volume by Agent Level</CardTitle>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Select defaultValue="usd">
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesVolumeData}>
                        <XAxis dataKey="level" />
                        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                        <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']} />
                        <Bar dataKey="volume" fill="#1e3a5f" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="offboarding">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground py-8">Offboarding overview coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detail">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground py-8">Detail report coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}