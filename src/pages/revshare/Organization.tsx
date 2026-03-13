import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import { Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { UniversalFilterBar } from "@/components/filters";

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

const countryProductionData = [
  { country: "United States", flag: "🇺🇸", activeAgents: 198, totalTransactions: 21, totalRevShare: 724.30 },
  { country: "Canada", flag: "🇨🇦", activeAgents: 27, totalTransactions: 2, totalRevShare: 98.41 },
  { country: "United Kingdom", flag: "🇬🇧", activeAgents: 5, totalTransactions: 1, totalRevShare: 18.50 },
  { country: "Australia", flag: "🇦🇺", activeAgents: 3, totalTransactions: 0, totalRevShare: 6.50 },
];

export default function OrganizationReporting() {
  const { formatCurrency, formatNumber } = useFormatters();
  const { t } = useTranslation();
  useDocumentTitle(t("nav.orgReporting"));
  const isMobile = useIsMobile();

  const totals = {
    activeAgents: countryProductionData.reduce((s, r) => s + r.activeAgents, 0),
    totalTransactions: countryProductionData.reduce((s, r) => s + r.totalTransactions, 0),
    totalRevShare: countryProductionData.reduce((s, r) => s + r.totalRevShare, 0),
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <UniversalFilterBar title={t("revshare.organizationReporting")}>
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
        </UniversalFilterBar>

        {/* Performance Snapshot — Frosted Hero Banner */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-exp-dark-navy via-exp-charcoal-blue to-exp-slate-blue text-white p-4 sm:p-6 mb-6">
          {/* Decorative background */}
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
            <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-exp-frosted-blue" />
            <div className="absolute right-20 bottom-4 h-20 w-20 rounded-full bg-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20">
                <Info className="me-1 h-3 w-3" />
                {t("org.performanceSnapshot")}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2.5 min-w-0">
                <div className="min-w-0">
                  <p className="text-section-title font-bold text-white truncate">{formatNumber(233)}</p>
                  <p className="text-xs sm:text-[11px] text-white/60">{t("org.totalOrgSize")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2.5 min-w-0">
                <div className="min-w-0">
                  <p className="text-section-title font-bold text-white truncate">{formatNumber(5)}</p>
                  <p className="text-xs sm:text-[11px] text-white/60">{t("org.agentsJoined")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2.5 min-w-0">
                <div className="min-w-0">
                  <p className="text-section-title font-bold text-white truncate">{formatNumber(1)}</p>
                  <p className="text-xs sm:text-[11px] text-white/60">{t("org.agentsWithIcon")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2.5 min-w-0">
                <div className="min-w-0">
                  <p className="text-section-title font-bold text-white truncate">{formatNumber(2)}</p>
                  <p className="text-xs sm:text-[11px] text-white/60">{t("org.countTeamLeaders")}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

            {/* Country Production Grid — Last 12 Months */}
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-section-title font-medium">{t("org.countryProduction")}</CardTitle>
                  <span className="text-xs text-muted-foreground">{t("org.last12Months")}</span>
                </div>
              </CardHeader>
              <CardContent className={isMobile ? "p-3" : "p-0"}>
                {isMobile ? (
                  <div className="space-y-3">
                    {countryProductionData.map((row) => (
                      <div key={row.country} className="rounded-lg border bg-card p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{row.flag}</span>
                          <span className="font-semibold text-foreground">{row.country}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                          <span className="text-muted-foreground">{t("org.activeAgents")}</span>
                          <span className="text-right font-semibold text-foreground">{formatNumber(row.activeAgents)}</span>
                          <span className="text-muted-foreground">{t("org.totalTransactions")}</span>
                          <span className="text-right font-semibold text-foreground">{formatNumber(row.totalTransactions)}</span>
                          <span className="text-muted-foreground">{t("org.productivityPerPerson")}</span>
                          <span className="text-right font-semibold text-foreground">{formatNumber(row.totalTransactions / row.activeAgents, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span className="text-muted-foreground">{t("org.totalRevShare")}</span>
                          <span className="text-right font-semibold text-foreground">{formatCurrency(row.totalRevShare)}</span>
                        </div>
                      </div>
                    ))}
                    {/* Totals card */}
                    <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-3">
                      <span className="font-bold text-foreground text-sm">{t("org.total")}</span>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm mt-2">
                        <span className="text-muted-foreground">{t("org.activeAgents")}</span>
                        <span className="text-right font-bold text-foreground">{formatNumber(totals.activeAgents)}</span>
                        <span className="text-muted-foreground">{t("org.totalTransactions")}</span>
                        <span className="text-right font-bold text-foreground">{formatNumber(totals.totalTransactions)}</span>
                        <span className="text-muted-foreground">{t("org.productivityPerPerson")}</span>
                        <span className="text-right font-bold text-foreground">{formatNumber(totals.totalTransactions / totals.activeAgents, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span className="text-muted-foreground">{t("org.totalRevShare")}</span>
                        <span className="text-right font-bold text-foreground">{formatCurrency(totals.totalRevShare)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-start px-4 py-3 font-semibold text-muted-foreground">{t("org.country")}</th>
                          <th className="text-right px-4 py-3 font-semibold text-muted-foreground">{t("org.activeAgents")}</th>
                          <th className="text-right px-4 py-3 font-semibold text-muted-foreground">{t("org.totalTransactions")}</th>
                          <th className="text-right px-4 py-3 font-semibold text-muted-foreground">{t("org.productivityPerPerson")}</th>
                          <th className="text-right px-4 py-3 font-semibold text-muted-foreground">{t("org.totalRevShare")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {countryProductionData.map((row, i) => (
                          <tr key={row.country} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/30"}`}>
                            <td className="px-4 py-3 font-medium text-foreground flex items-center gap-2">
                              <span className="text-lg">{row.flag}</span>
                              {row.country}
                            </td>
                            <td className="px-4 py-3 text-right text-foreground font-semibold">{formatNumber(row.activeAgents)}</td>
                            <td className="px-4 py-3 text-right text-foreground font-semibold">{formatNumber(row.totalTransactions)}</td>
                            <td className="px-4 py-3 text-right text-foreground font-semibold">{formatNumber(row.totalTransactions / row.activeAgents, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className="px-4 py-3 text-right text-foreground font-semibold">{formatCurrency(row.totalRevShare)}</td>
                          </tr>
                        ))}
                        <tr className="bg-primary/5 border-t-2 border-primary/20">
                          <td className="px-4 py-3 font-bold text-foreground">{t("org.total")}</td>
                          <td className="px-4 py-3 text-right font-bold text-foreground">{formatNumber(totals.activeAgents)}</td>
                          <td className="px-4 py-3 text-right font-bold text-foreground">{formatNumber(totals.totalTransactions)}</td>
                          <td className="px-4 py-3 text-right font-bold text-foreground">{formatNumber(totals.totalTransactions / totals.activeAgents, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 text-right font-bold text-foreground">{formatCurrency(totals.totalRevShare)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-section-title font-medium">{t("org.agentAreas")}</CardTitle>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={agentAreasData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
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

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-section-title font-medium">{t("org.influencerGroup")}</CardTitle>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={influencerData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
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

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-section-title font-medium">{t("org.salesVolumeByLevel")}</CardTitle>
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
                        <YAxis tickFormatter={(value) => formatCurrency(value, { compact: true, decimals: 1 })} />
                        <Tooltip formatter={(value: number) => [formatCurrency(value), t("team.volume")]} />
                        <Bar dataKey="volume" fill="#1e3a5f" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
      </div>
    </DashboardLayout>
  );
}
