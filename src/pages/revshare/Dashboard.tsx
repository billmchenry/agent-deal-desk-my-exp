import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Info, ChevronRight, Clock, Calendar, CheckCircle2, TrendingUp,
  Users, DollarSign, ExternalLink, Target,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  PieChart, Pie, Cell, ResponsiveContainer, ComposedChart,
  Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
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
  { name: "Canada", agents: 1125, color: "hsl(142, 71%, 45%)" },
  { name: "Germany", agents: 980, color: "hsl(45, 93%, 47%)" },
  { name: "Australia", agents: 890, color: "hsl(0, 84%, 60%)" },
  { name: "Brazil", agents: 820, color: "hsl(220, 45%, 30%)" },
  { name: "France", agents: 720, color: "hsl(210, 40%, 75%)" },
];

const revenueComparisonData = [
  { name: "2024", revenue: 1.0, growth: 0.8 },
  { name: "2025", revenue: 3.8, growth: 3.2 },
  { name: "2026", revenue: 0.285, growth: 0.4 },
];

const TOTAL_AGENTS = 17816;

/* ── Component ─────────────────────────────────────────── */

export default function RevShareDashboard() {
  const isMobile = useIsMobile();
  useDocumentTitle("Revenue Share");
  const { formatNumber, formatCurrency } = useFormatters();
  const { t } = useTranslation();
  return (
    <DashboardLayout>
      <div className="space-y-4 pb-20">
        {/* ═══ Page Header ═══ */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-foreground">{t("revshare.revenueShare")}</h1>
          <Select defaultValue="ytd">
            <SelectTrigger className="w-[140px] h-8 min-h-[44px] sm:min-h-0 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd">{t("revshare.yearToDate")}</SelectItem>
              <SelectItem value="q1">Q1</SelectItem>
              <SelectItem value="q2">Q2</SelectItem>
              <SelectItem value="monthly">{t("revshare.monthly")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ═══ Section 1: Hero Banner ═══ */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-exp-navy via-exp-navy-light to-exp-blue p-4 sm:p-6 text-white">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
            <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-white" />
            <div className="absolute right-20 bottom-4 h-20 w-20 rounded-full bg-exp-gold" />
          </div>

          <div className="relative z-10">
            <div className="mb-4">
              <Badge className="bg-exp-gold/20 text-exp-gold-light border-exp-gold/30 hover:bg-exp-gold/30">
                <Target className="mr-1 h-3 w-3" />
                {t("revshare.revenueShare").toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3.5 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-md p-1.5 shrink-0 bg-exp-green/20 text-exp-green-light">
                    <DollarSign className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-white">{t("revshare.revenueShare")}</span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <p className="text-2xl font-bold text-white">{formatCurrency(264138.52)} <span className="text-sm font-medium text-white/70">USD</span></p>
                  <span className="text-xs text-white/70">After Adj.</span>
                </div>
                <div className="mt-1 space-y-1 text-xs text-white/70">
                  <p>Before Adj. {formatCurrency(242857.04)} USD</p>
                  <p>Adjustment +{formatCurrency(21281.48)} USD</p>
                </div>
              </div>

              <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3.5 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-md p-1.5 shrink-0 bg-white/15 text-white">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white">FLA · Front Line Agents</span>
                    <p className="text-xs text-white/70 leading-tight">Before and after concession adjustments</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mb-2">{formatNumber(24)}</p>
                <button className="mt-1 inline-flex items-center gap-1 rounded-md bg-white/15 hover:bg-white/25 px-3 py-2.5 min-h-[44px] sm:min-h-0 sm:py-1 text-xs font-medium text-white transition-colors">
                  View FLA List <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3.5 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-md p-1.5 shrink-0 bg-exp-gold/20 text-exp-gold-light">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white">FLQA · Front Line Qualifying Agents</span>
                    <p className="text-xs text-white/70 leading-tight">Before and after concession adjustments</p>
                  </div>
                </div>
                <div className="flex gap-4 mb-2">
                  <div>
                    <p className="text-2xl font-bold text-white leading-none">{formatNumber(18)}</p>
                    <p className="text-xs text-white/70">Actual</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white leading-none">{formatNumber(30)}</p>
                    <p className="text-xs text-white/70">After Bonus</p>
                  </div>
                </div>
                <p className="text-xs text-exp-gold-light mt-2">You are in level 3. Add 2 more agents to reach level 4</p>
                <button className="mt-2 inline-flex items-center gap-1 rounded-md bg-white/15 hover:bg-white/25 px-3 py-2.5 min-h-[44px] sm:min-h-0 sm:py-1 text-xs font-medium text-white transition-colors">
                  View FLQA List <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* ═══ Section 2: Current Payout Status ═══ */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">{t("revshare.currentPayoutStatus")}</h2>
                <p className="text-xs text-muted-foreground">Overview of your revenue share payout status and history</p>
              </div>
              <button className="text-xs text-exp-blue hover:underline flex items-center gap-1 min-h-[44px] sm:min-h-0">
                View Periodic Overview <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            <div className="bg-muted/50 rounded-md p-2.5 mb-3 flex items-start gap-2">
              <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                Pay Now requests may take up to 2 business days to process. Payouts are subject to minimum thresholds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-lg border border-exp-gold/30 bg-exp-gold/5 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-exp-gold" />
                  <span className="text-xs font-semibold text-foreground">{t("revshare.unpaid")}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Calculated but not paid out</p>
                <p className="text-lg font-bold text-foreground mb-2">{formatCurrency(1869.20)} <span className="text-xs font-medium text-muted-foreground">USD</span></p>
                <button className="inline-flex items-center gap-1 rounded-md border border-border hover:bg-muted px-3 py-2.5 min-h-[44px] sm:min-h-0 sm:py-1 text-xs font-medium text-foreground transition-colors">
                  {t("revshare.viewDetails")} <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div className="rounded-lg border border-exp-blue/30 bg-exp-blue/5 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-exp-blue" />
                  <span className="text-xs font-semibold text-foreground">{t("revshare.expectedNext")}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Estimated next scheduled payout</p>
                <p className="text-lg font-bold text-foreground mb-2">{formatCurrency(1869.20)} <span className="text-xs font-medium text-muted-foreground">USD</span></p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-2">
                  <button className="inline-flex items-center gap-1 rounded-md border border-border hover:bg-muted px-3 py-2.5 min-h-[44px] sm:min-h-0 sm:py-1 text-xs font-medium text-foreground transition-colors">
                    {t("revshare.viewDetails")} <ChevronRight className="h-3 w-3" />
                  </button>
                  <Button size="sm" className="h-11 sm:h-7 text-xs px-3">{t("revshare.getPaidNow")}</Button>
                </div>
              </div>

              <div className="rounded-lg border border-exp-green/30 bg-exp-green/5 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-exp-green" />
                  <span className="text-xs font-semibold text-foreground">{t("revshare.lastPaid")}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Most recent payout amount</p>
                <p className="text-lg font-bold text-foreground mb-2">{formatCurrency(986.92)} <span className="text-xs font-medium text-muted-foreground">USD</span></p>
                <button className="inline-flex items-center gap-1 rounded-md border border-border hover:bg-muted px-3 py-2.5 min-h-[44px] sm:min-h-0 sm:py-1 text-xs font-medium text-foreground transition-colors">
                  {t("revshare.viewDetails")} <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ═══ Section 3: RevShare Group Distribution ═══ */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-3">
              <h2 className="text-sm font-semibold text-foreground">{t("revshare.groupDistribution")}</h2>
              <p className="text-xs text-muted-foreground">Agent distribution across levels (1-7) and regions</p>
            </div>

            {isMobile ? (
              <Tabs defaultValue="level">
                <div className="flex items-center justify-between mb-3">
                  <TabsList className="h-9">
                    <TabsTrigger value="level" className="text-xs px-3 min-h-[44px]">{t("revshare.byLevel")}</TabsTrigger>
                    <TabsTrigger value="country" className="text-xs px-3 min-h-[44px]">{t("revshare.byCountry")}</TabsTrigger>
                  </TabsList>
                  <Tabs defaultValue="agents">
                    <TabsList className="h-9">
                      <TabsTrigger value="agents" className="text-xs px-2 min-h-[44px]">{t("revshare.agents")}</TabsTrigger>
                      <TabsTrigger value="revshare" className="text-xs px-2 min-h-[44px]">{t("revshare.revenueShare")}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <TabsContent value="level">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-28 h-28 relative shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={levelDistribution} cx="50%" cy="50%" innerRadius={32} outerRadius={48} dataKey="value" strokeWidth={2} stroke="hsl(var(--card))">
                            {levelDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-foreground">{formatNumber(TOTAL_AGENTS)}</span>
                        <span className="text-xs text-muted-foreground">{t("revshare.agents")}</span>
                      </div>
                    </div>
                    <div className="w-full space-y-0.5">
                      {levelDistribution.map((level) => (
                        <div key={level.name} className="flex items-center justify-between text-xs group cursor-pointer hover:bg-muted/50 rounded px-1 py-2 -mx-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: level.color }} />
                            <span className="text-foreground">{level.name}</span>
                            <span className="text-muted-foreground">({level.value}%)</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <span>{formatNumber(level.agents)}</span>
                            <ChevronRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="country">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-28 h-28 relative shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={countryDistribution} cx="50%" cy="50%" innerRadius={32} outerRadius={48} dataKey="agents" strokeWidth={2} stroke="hsl(var(--card))">
                            {countryDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-foreground">{formatNumber(TOTAL_AGENTS)}</span>
                        <span className="text-xs text-muted-foreground">{t("revshare.agents")}</span>
                      </div>
                    </div>
                    <div className="w-full space-y-0.5">
                      {countryDistribution.map((country) => (
                        <div key={country.name} className="flex items-center justify-between text-xs group cursor-pointer hover:bg-muted/50 rounded px-1 py-2 -mx-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: country.color }} />
                            <span className="text-foreground">{country.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <span>{formatNumber(country.agents)}</span>
                            <ChevronRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">{t("revshare.byLevel")}</span>
                    <Tabs defaultValue="agents">
                      <TabsList className="h-7">
                        <TabsTrigger value="agents" className="text-xs px-2 py-0.5 h-6">{t("revshare.agents")}</TabsTrigger>
                        <TabsTrigger value="revshare" className="text-xs px-2 py-0.5 h-6">{t("revshare.revenueShare")}</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32 relative shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={levelDistribution} cx="50%" cy="50%" innerRadius={38} outerRadius={56} dataKey="value" strokeWidth={2} stroke="hsl(var(--card))">
                            {levelDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-foreground">{formatNumber(TOTAL_AGENTS)}</span>
                        <span className="text-xs text-muted-foreground">{t("revshare.agents")}</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-0.5">
                      {levelDistribution.map((level) => (
                        <div key={level.name} className="flex items-center justify-between text-xs group cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 -mx-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: level.color }} />
                            <span className="text-foreground">{level.name}</span>
                            <span className="text-muted-foreground">({level.value}%)</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <span>{formatNumber(level.agents)}</span>
                            <ChevronRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-4 border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">{t("revshare.byCountry")}</span>
                    <Tabs defaultValue="agents">
                      <TabsList className="h-7">
                        <TabsTrigger value="agents" className="text-xs px-2 py-0.5 h-6">{t("revshare.agents")}</TabsTrigger>
                        <TabsTrigger value="revshare" className="text-xs px-2 py-0.5 h-6">{t("revshare.revenueShare")}</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-32 relative shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={countryDistribution} cx="50%" cy="50%" innerRadius={38} outerRadius={56} dataKey="agents" strokeWidth={2} stroke="hsl(var(--card))">
                            {countryDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-foreground">{formatNumber(TOTAL_AGENTS)}</span>
                        <span className="text-xs text-muted-foreground">{t("revshare.agents")}</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-0.5">
                      {countryDistribution.map((country) => (
                        <div key={country.name} className="flex items-center justify-between text-xs group cursor-pointer hover:bg-muted/50 rounded px-1 py-2 sm:py-0.5 -mx-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: country.color }} />
                            <span className="text-foreground">{country.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <span>{formatNumber(country.agents)}</span>
                            <ChevronRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ═══ Section 4: Revenue Share Comparison ═══ */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-exp-blue" />
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{t("revshare.revenueShareComparison")}</h2>
                  <p className="text-xs text-muted-foreground">Compare revenue share earnings across different time periods</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <button className="text-xs text-exp-blue hover:underline flex items-center gap-1 min-h-[44px] sm:min-h-0">
                    {t("revshare.viewTrends")} <ExternalLink className="h-3 w-3" />
                  </button>
                  <Tabs defaultValue="yearly">
                    <TabsList className="h-9 sm:h-7">
                      <TabsTrigger value="yearly" className="text-xs px-2 py-0.5 h-8 sm:h-6 min-h-[44px] sm:min-h-0">{t("revshare.yearly")}</TabsTrigger>
                      <TabsTrigger value="quarterly" className="text-xs px-2 py-0.5 h-8 sm:h-6 min-h-[44px] sm:min-h-0">{t("revshare.quarterly")}</TabsTrigger>
                      <TabsTrigger value="monthly" className="text-xs px-2 py-0.5 h-8 sm:h-6 min-h-[44px] sm:min-h-0">{t("revshare.monthly")}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm bg-exp-navy inline-block" />
                    Revenue
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-exp-green inline-block" />
                    Growth
                  </span>
                </div>
              </div>
            </div>
            <div className="h-[200px] sm:h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueComparisonData} margin={{ top: 15, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickFormatter={(v) => formatCurrency(v, { compact: true, decimals: 1 })}
                  domain={[0, 4]}
                  width={50}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value, { compact: true }),
                    name === "revenue" ? "Revenue" : "Growth",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--exp-navy))"
                  radius={[4, 4, 0, 0]}
                  barSize={48}
                  label={({ x, y, width, value }: any) =>
                    value < 1 ? (
                      <text x={x + width / 2} y={y - 6} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={12} fontWeight={600}>
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
                  dot={{ r: 3, fill: "hsl(var(--exp-green))" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
