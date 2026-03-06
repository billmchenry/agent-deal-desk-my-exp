import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import { Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";

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
  useDocumentTitle("Organization Reporting");
  const { formatCurrency, formatNumber } = useFormatters();
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{t("revshare.organizationReporting")}</h1>
        </div>

        <div className="flex items-center justify-end mb-4">
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

            <h2 className="text-lg font-semibold text-foreground mb-4">{t("org.performanceSnapshot")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-foreground">{formatNumber(233)}</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{t("org.totalOrgSize")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-foreground">{formatNumber(5)}</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{t("org.agentsJoined")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-foreground">{formatNumber(1)}</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{t("org.agentsWithIcon")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl font-bold text-foreground">{formatNumber(2)}</span>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{t("org.countTeamLeaders")}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <Card className="bg-primary text-primary-foreground lg:col-span-2">
                <CardContent className="p-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-4xl font-bold mb-2">{formatNumber(24)}</p>
                    <p className="text-sm text-primary-foreground/80">
                      {t("org.totalTransactions")}
                    </p>
                  </div>
                  <div className="border-l border-primary-foreground/20 pl-6">
                    <p className="text-4xl font-bold mb-2">0.10</p>
                    <p className="text-sm text-primary-foreground/80">
                      {t("org.transactionsPerAgent")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-primary-foreground/80">{t("org.totalRevShare")}</p>
                    <Info className="h-4 w-4 text-primary-foreground/60" />
                  </div>
                  <p className="text-4xl font-bold">{formatCurrency(847.71)}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{t("org.ytdVolume")}</p>
                  <p className="text-sm text-muted-foreground">USD</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">{formatCurrency(10774400)}</span>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-medium">{t("org.agentAreas")}</CardTitle>
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
                    <CardTitle className="text-base font-medium">{t("org.influencerGroup")}</CardTitle>
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
                      <CardTitle className="text-base font-medium">{t("org.salesVolumeByLevel")}</CardTitle>
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
