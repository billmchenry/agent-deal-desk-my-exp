import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Info,
  ChevronRight,
  Clock,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Users,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

/* ── Mock Data ─────────────────────────────────────────── */

const levelDistribution = [
  { name: "Level 1", value: 0.7, agents: 129, color: "hsl(220, 56%, 20%)" },
  { name: "Level 2", value: 2.1, agents: 374, color: "hsl(220, 45%, 30%)" },
  { name: "Level 3", value: 5.4, agents: 962, color: "hsl(217, 91%, 60%)" },
  { name: "Level 4", value: 12.3, agents: 2190, color: "hsl(217, 91%, 70%)" },
  { name: "Level 5", value: 20.8, agents: 3704, color: "hsl(210, 40%, 75%)" },
  { name: "Level 6", value: 28.9, agents: 5146, color: "hsl(210, 40%, 85%)" },
  { name: "Level 7", value: 29.8, agents: 5311, color: "hsl(214, 32%, 91%)" },
];

const countryDistribution = [
  { name: "United States", agents: 4850, color: "hsl(262, 83%, 58%)" },
  { name: "United Kingdom", agents: 1450, color: "hsl(217, 91%, 60%)" },
  { name: "Canada", agents: 1125, color: "hsl(172, 66%, 50%)" },
  { name: "Germany", agents: 980, color: "hsl(25, 95%, 53%)" },
  { name: "Australia", agents: 890, color: "hsl(340, 82%, 52%)" },
  { name: "Brazil", agents: 820, color: "hsl(45, 93%, 47%)" },
  { name: "France", agents: 720, color: "hsl(240, 60%, 60%)" },
];

const revenueComparisonData = [
  { name: "2024", revenue: 1.0, growth: 0.8 },
  { name: "2025", revenue: 3.8, growth: 3.2 },
  { name: "2026", revenue: 0.285, growth: 0.4 },
];

const TOTAL_AGENTS = 17816;

/* ── Component ─────────────────────────────────────────── */

export default function RevShareDashboard() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-8">
        <h1 className="text-2xl font-bold text-foreground">RevShare Dashboard</h1>

        {/* ═══ Section 1: Revenue Share & Agent Metrics ═══ */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-lg font-semibold text-foreground">Revenue Share & Agent Metrics</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing metrics for selected period</span>
              <Select defaultValue="ytd">
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="q1">Q1</SelectItem>
                  <SelectItem value="q2">Q2</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Revenue Share Card */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-semibold text-base">Revenue Share</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-primary-foreground/80">
                    <span>Before Adjustment</span>
                    <span>242,857.04 USD</span>
                  </div>
                  <div className="flex justify-between text-sm text-primary-foreground/80">
                    <span>Adjustment</span>
                    <span>+ 21,281.48 USD</span>
                  </div>
                  <div className="border-t border-primary-foreground/20 pt-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-medium">After Adjustment</span>
                      <span className="text-2xl font-bold">264,138.52 USD</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FLA Card */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-base text-foreground">FLA</span>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">Front Line Agents</p>
                <p className="text-4xl font-bold text-foreground mb-4">24</p>
                <button className="text-sm text-primary hover:underline flex items-center gap-1">
                  View FLA list <ChevronRight className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>

            {/* FLQA Card */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-base text-foreground">FLQA</span>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Front Line Qualifying Agents</p>
                <p className="text-sm text-primary font-medium mb-3">You are progressing to Level 5</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Actual</p>
                    <p className="text-2xl font-bold text-foreground">18</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">After Bonus</p>
                    <p className="text-2xl font-bold text-foreground">30</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-sm text-primary hover:underline flex items-center gap-1">
                    View FLQA list <ChevronRight className="h-3 w-3" />
                  </button>
                  <button className="text-sm text-primary hover:underline flex items-center gap-1">
                    Levels <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ═══ Section 2: Current Payout Status ═══ */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">Current Payout Status</h2>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
            <button className="text-sm text-primary hover:underline flex items-center gap-1">
              View Periodic Overview <ExternalLink className="h-3 w-3" />
            </button>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mb-4 flex items-start gap-3">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              Pay Now requests may take up to 2 business days to process. Payouts are subject to minimum thresholds and verification requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Unpaid */}
            <Card className="border-l-4 border-l-amber-400">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold text-foreground">Unpaid</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Calculated but not paid out</p>
                <p className="text-3xl font-bold text-foreground mb-4">$1,869.20</p>
                <button className="text-sm text-primary hover:underline flex items-center gap-1">
                  View details <ChevronRight className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>

            {/* Expected Next */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold text-foreground">Expected Next</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Due to be paid in February</p>
                <p className="text-3xl font-bold text-foreground mb-4">$1,869.20</p>
                <div className="flex items-center gap-3">
                  <button className="text-sm text-primary hover:underline flex items-center gap-1">
                    View details <ChevronRight className="h-3 w-3" />
                  </button>
                  <Button size="sm">Get Paid Now</Button>
                </div>
              </CardContent>
            </Card>

            {/* Last Paid */}
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-foreground">Last Paid</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Paid to you</p>
                <p className="text-3xl font-bold text-foreground mb-4">$986.92</p>
                <button className="text-sm text-primary hover:underline flex items-center gap-1">
                  View details <ChevronRight className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ═══ Section 3: RevShare Group Distribution ═══ */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-foreground">RevShare Group Distribution</h2>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Level */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">By Level</CardTitle>
                  <Tabs defaultValue="agents">
                    <TabsList className="h-8">
                      <TabsTrigger value="agents" className="text-xs px-3 py-1">Agents</TabsTrigger>
                      <TabsTrigger value="revshare" className="text-xs px-3 py-1">RevShare</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="w-44 h-44 relative shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={levelDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          dataKey="value"
                          strokeWidth={2}
                          stroke="hsl(var(--card))"
                        >
                          {levelDistribution.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-foreground">{TOTAL_AGENTS.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">Agents</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    {levelDistribution.map((level) => (
                      <div key={level.name} className="flex items-center justify-between text-sm group cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 -mx-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: level.color }} />
                          <span className="text-foreground">{level.name}</span>
                          <span className="text-muted-foreground text-xs">({level.value}%)</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          <span>{level.agents.toLocaleString()}</span>
                          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* By Country */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">By Country</CardTitle>
                  <Tabs defaultValue="agents">
                    <TabsList className="h-8">
                      <TabsTrigger value="agents" className="text-xs px-3 py-1">Agents</TabsTrigger>
                      <TabsTrigger value="revshare" className="text-xs px-3 py-1">RevShare</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="w-44 h-44 relative shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={countryDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={75}
                          dataKey="agents"
                          strokeWidth={2}
                          stroke="hsl(var(--card))"
                        >
                          {countryDistribution.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-foreground">{TOTAL_AGENTS.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">Agents</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    {countryDistribution.map((country) => (
                      <div key={country.name} className="flex items-center justify-between text-sm group cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 -mx-1">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: country.color }} />
                          <span className="text-foreground">{country.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          <span>{country.agents.toLocaleString()}</span>
                          <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ═══ Section 4: Revenue Share Comparison ═══ */}
        <section>
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-medium">Revenue Share Comparison</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <button className="text-sm text-primary hover:underline flex items-center gap-1">
                    View Trends Report <ExternalLink className="h-3 w-3" />
                  </button>
                  <Tabs defaultValue="yearly">
                    <TabsList className="h-8">
                      <TabsTrigger value="yearly" className="text-xs px-3 py-1">Yearly</TabsTrigger>
                      <TabsTrigger value="quarterly" className="text-xs px-3 py-1">Quarterly</TabsTrigger>
                      <TabsTrigger value="monthly" className="text-xs px-3 py-1">Monthly</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-exp-navy inline-block" />
                      Revenue
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-exp-green inline-block" />
                      Growth
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={revenueComparisonData} margin={{ top: 20, right: 20, bottom: 0, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(v) => `$${v.toFixed(1)}M`}
                    domain={[0, 4]}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === "revenue" ? `$${value.toFixed(2)}M` : `$${value.toFixed(2)}M`,
                      name === "revenue" ? "Revenue" : "Growth",
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: 8,
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--exp-navy))"
                    radius={[4, 4, 0, 0]}
                    barSize={60}
                    label={({ x, y, width, value }: any) =>
                      value < 1 ? (
                        <text x={x + width / 2} y={y - 8} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={12} fontWeight={600}>
                          ${Math.round(value * 1000)}K
                        </text>
                      ) : null
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="growth"
                    stroke="hsl(var(--exp-green))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--exp-green))" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
