import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Filter, MessageCircle, ChevronRight, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { topAgents, teamOverview, teamRequirements } from "@/data/mockData";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";

export default function TeamDashboard() {
  useDocumentTitle("My Team");
  const { t } = useTranslation();
  const { formatCurrency, formatNumber } = useFormatters();

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">{t("team.myTeam")}</h1>
          <Button variant="outline">{t("team.teamReport")}</Button>
        </div>

        <p className="text-lg font-medium text-foreground mb-6">
          {t("team.myTeam")}: New Vision Realty Group
        </p>

        {/* Overview Section */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">{t("team.overview")}</CardTitle>
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
                <p className="text-sm text-muted-foreground mb-1">{t("team.units")}</p>
                <p className="text-3xl font-bold text-foreground">
                  {formatNumber(13)} <span className="text-sm font-normal text-muted-foreground">{t("team.units")}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">{t("common.pending")} : {formatNumber(2)} {t("team.units")}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">{t("team.volume")}</p>
                <p className="text-3xl font-bold text-foreground">
                  {formatCurrency(5145000)} <span className="text-sm font-normal text-muted-foreground">USD</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">{t("common.pending")} : {formatCurrency(1659000)} USD</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">{t("team.teamLeadSplit")}</p>
                <p className="text-3xl font-bold text-foreground">
                  {formatCurrency(2669)} <span className="text-sm font-normal text-muted-foreground">USD</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">{t("common.pending")} : {formatCurrency(0)} USD</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">{t("team.onboardingAgents")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">{t("team.noReports")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">{t("team.topAgents")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="units" className="w-full">
                <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-4">
                  <TabsTrigger 
                    value="units" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-2"
                  >
                    {t("team.unitsClosed")}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="volume" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-2"
                  >
                    {t("team.highestVolume")}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="commission" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-2"
                  >
                    {t("team.commission")}
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
                          <span className="font-medium text-foreground">{agent.units} {t("team.units")}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full text-center text-primary hover:underline text-sm mt-4">
                    {t("team.viewAll")}
                  </button>
                </TabsContent>

                <TabsContent value="volume" className="mt-0">
                  <p className="text-center text-muted-foreground py-8">{t("common.comingSoon")}</p>
                </TabsContent>

                <TabsContent value="commission" className="mt-0">
                  <p className="text-center text-muted-foreground py-8">{t("common.comingSoon")}</p>
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
                  <h3 className="font-semibold text-foreground">{t("team.requalification")}</h3>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    🏆 Mega Team
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{t("team.capResetDate")}: 01/01/2027</p>
              </div>
              <Button className="gap-2">
                <MessageCircle className="h-4 w-4" />
                {t("team.contactTeamServices")}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
              <div className="font-medium text-foreground">{t("team.requirements")}</div>
              <div className="font-medium text-foreground">{t("team.progress")}</div>
              
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
              {t("team.viewDetails")}
            </button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
