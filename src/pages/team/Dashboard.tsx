import { useState, useEffect } from "react";
import { TopAgentsSheet } from "@/components/team/TopAgentsSheet";
import { AgentDetailsSheet } from "@/components/team/AgentDetailsSheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Building2, DollarSign } from "lucide-react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, ChevronRight, ChevronLeft, Info, Phone, Mail, MapPin, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeFilter, type DateRange } from "@/components/filters/DateRangeFilter";
import { DataTable, type ColumnDef } from "@/components/shared/DataTable";
import { topAgents, teamOverview, teamRequirements, onboardingAgents, agentDetails, type OnboardingAgent, type TopAgent, type AgentDetail } from "@/data/mockData";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { UniversalFilterBar } from "@/components/filters";
import { CanadianDisclaimer } from "@/components/shared/CanadianDisclaimer";
import { useDemoConfig } from "@/contexts/DemoConfigContext";

type View = "overview" | "agentDetails" | "topAgents";

export default function TeamDashboard() {
  const { t } = useTranslation();
  useDocumentTitle(t("nav.myTeam"));
  const { formatCurrency, formatNumber } = useFormatters();
  const navigate = useNavigate();
  const { config } = useDemoConfig();
  const isCanada = config.countryMode === "canada";

  const [view, setView] = useState<View>("overview");
  const [selectedOnboardingAgent, setSelectedOnboardingAgent] = useState<OnboardingAgent | null>(null);
  const [topAgentsSheetOpen, setTopAgentsSheetOpen] = useState(false);
  const [topAgentsDefaultTab, setTopAgentsDefaultTab] = useState<"units" | "volume" | "commission">("units");
  const [agentDetailsSheetOpen, setAgentDetailsSheetOpen] = useState(false);
  const [overviewDateRange, setOverviewDateRange] = useState<DateRange>({
    from: new Date(2026, 0, 1),
    to: new Date(2026, 2, 5),
  });

  // --- Agent Details columns (requalification drill-down) ---
  const agentDetailColumns: ColumnDef<AgentDetail>[] = [
    { key: "agentName", header: t("team.agentName"), type: "string", sortable: true, filterable: true },
    { key: "active", header: t("team.active"), type: "string", sortable: true, filterable: true },
    { key: "teamMemberEffectiveDate", header: t("team.teamMemberEffectiveDate"), type: "string", sortable: true, filterable: true },
    { key: "capResetDate", header: t("team.capResetDateCol"), type: "string", sortable: true, filterable: true },
    { key: "closedTransactions", header: t("team.closedTransactions"), type: "number", sortable: true },
    { key: "salesVolume", header: t("team.salesVolume"), type: "currency", sortable: true },
    { key: "companyDollarPaidThrough", header: t("team.companyDollarPaidThrough"), type: "currency", sortable: true },
    { key: "capPercent", header: "Cap %", type: "number", sortable: true },
  ];

  // --- Top Agents columns ---
  const topAgentColumns: ColumnDef<TopAgent>[] = [
    { key: "name", header: t("team.agentName"), type: "string", sortable: true, filterable: true },
    { key: "units", header: t("team.unitsClosed"), type: "number", sortable: true },
    { key: "volume", header: t("team.salesVolume"), type: "currency", sortable: true },
    { key: "commission", header: t("team.gciSum"), type: "currency", sortable: true },
    { key: "currency", header: t("team.currency"), type: "string", sortable: true },
  ];

  // --- Agent Details drill-down ---
  if (view === "agentDetails") {
    return (
      <DashboardLayout>
        <div className="p-4 lg:p-6 space-y-4 pb-20">
          <UniversalFilterBar
            title={t("team.agentDetails")}
            titleExtra={
              <Button variant="ghost" className="gap-1 -ms-2" onClick={() => setView("overview")}>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                {t("team.backToTeam")}
              </Button>
            }
          />
          <div className="bg-muted/40 rounded-lg p-3 text-sm text-muted-foreground flex items-start gap-2">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />
            {t("team.agentNote")}
          </div>
          <DataTable
            data={agentDetails}
            columns={agentDetailColumns}
            csvFilename="agent-details"
            searchableKeys={["agentName"]}
            mobileCardRender={(row) => (
              <div className="space-y-1">
                <div className="flex justify-between gap-2">
                  <span className="font-semibold text-sm truncate">{row.agentName}</span>
                  <Badge variant={row.active === "Yes" ? "default" : "secondary"} className="shrink-0 text-xs">
                    {row.active}
                  </Badge>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Cap Reset: {row.capResetDate}</span>
                  <span className="font-medium text-foreground">Cap: {row.capPercent}%</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Closed: {row.closedTransactions}</span>
                  <span className="tabular-nums font-secondary">Vol: {formatCurrency(row.salesVolume)}</span>
                </div>
              </div>
            )}
          />
        </div>
      </DashboardLayout>
    );
  }

  // --- Top Agents drill-down ---
  if (view === "topAgents") {
    return (
      <DashboardLayout>
        <div className="p-4 lg:p-6 space-y-4 pb-20">
          <UniversalFilterBar
            title={t("team.topAgents")}
            titleExtra={
              <Button variant="ghost" className="gap-1 -ms-2" onClick={() => setView("overview")}>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                {t("team.backToTeam")}
              </Button>
            }
          />
          <DataTable
            data={topAgents}
            columns={topAgentColumns}
            csvFilename="top-agents"
            searchableKeys={["name", "uuid"]}
            defaultSort={{ key: "units", direction: "desc" }}
            mobileCardRender={(row) => (
              <div className="space-y-1">
                <div className="flex justify-between gap-2">
                  <span className="font-semibold text-sm truncate">{row.name}</span>
                  <span className="text-sm font-bold tabular-nums font-secondary shrink-0">{isCanada ? (row.units + 0.25).toFixed(2) : row.units} units</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="tabular-nums font-secondary">Vol: {formatCurrency(row.volume)}</span>
                  <span className="tabular-nums font-secondary">GCI: {formatCurrency(row.commission)}</span>
                </div>
              </div>
            )}
          />
        </div>
      </DashboardLayout>
    );
  }

  // --- Overview ---
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <UniversalFilterBar title={`${t("team.myTeam")}: ${teamOverview.name}`}>
          <UniversalFilterBar.DateRange value={overviewDateRange} onChange={setOverviewDateRange} />
        </UniversalFilterBar>
        <CanadianDisclaimer variant="teamLead" email="canada.support@exprealty.com" />

        {/* Overview Section - Hero Banner style */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-exp-frosted-blue via-exp-light-grey to-exp-frosted-blue p-4 sm:p-6 mb-6">
          {/* Decorative background */}
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
            <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-exp-slate-blue" />
            <div className="absolute right-20 bottom-4 h-20 w-20 rounded-full bg-exp-moss-grey" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-exp-charcoal-blue/10 text-exp-charcoal-blue border-exp-charcoal-blue/20">
                <Target className="me-1 h-3 w-3" />
                TEAM
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <button
                onClick={() => navigate("/team/reconciliation")}
                className="flex items-center gap-3 rounded-lg border border-exp-slate-blue/20 bg-exp-charcoal-blue/5 backdrop-blur-sm px-3 py-2.5 min-w-0 cursor-pointer hover:bg-exp-charcoal-blue/10 transition-colors focus-visible:ring-2 focus-visible:ring-ring text-left w-full"
              >
                <div className="rounded-full p-2 shrink-0 bg-exp-slate-blue/15 text-exp-slate-blue">
                  <Home className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-section-title font-bold text-exp-dark-navy truncate">
                    {formatNumber(isCanada ? 13.25 : teamOverview.units.total)}
                  </p>
                  <p className="text-xs sm:text-[11px] text-exp-moss-grey">{t("team.units")}</p>
                </div>
              </button>
              <button
                onClick={() => navigate("/team/reconciliation")}
                className="flex items-center gap-3 rounded-lg border border-exp-slate-blue/20 bg-exp-charcoal-blue/5 backdrop-blur-sm px-3 py-2.5 min-w-0 cursor-pointer hover:bg-exp-charcoal-blue/10 transition-colors focus-visible:ring-2 focus-visible:ring-ring text-left w-full"
              >
                <div className="rounded-full p-2 shrink-0 bg-exp-slate-blue/15 text-exp-slate-blue">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-section-title font-bold text-exp-dark-navy truncate">
                    {formatCurrency(teamOverview.volume.total, { compact: true })}
                  </p>
                  <p className="text-xs sm:text-[11px] text-exp-moss-grey">{t("team.volume")}</p>
                </div>
              </button>
              <button
                onClick={() => navigate("/team/reconciliation")}
                className="flex items-center gap-3 rounded-lg border border-exp-slate-blue/20 bg-exp-charcoal-blue/5 backdrop-blur-sm px-3 py-2.5 min-w-0 cursor-pointer hover:bg-exp-charcoal-blue/10 transition-colors focus-visible:ring-2 focus-visible:ring-ring text-left w-full"
              >
                <div className="rounded-full p-2 shrink-0 bg-exp-green/15 text-exp-green">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-section-title font-bold text-exp-dark-navy truncate">
                    {formatCurrency(teamOverview.teamLeadSplit.total, { compact: true })}
                  </p>
                  <p className="text-xs sm:text-[11px] text-exp-moss-grey">{t("team.teamLeadSplit")}</p>
                </div>
              </button>
            </div>
          </div>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Onboarding Agents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-section-title font-medium">{t("team.onboardingAgents")}</CardTitle>
              <span className="text-sm text-muted-foreground">
                {t("team.showingOf").replace("{count}", String(onboardingAgents.length)).replace("{total}", String(onboardingAgents.length))}
              </span>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {onboardingAgents.slice(0, 3).map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    className="w-full flex flex-col gap-2 py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors focus-visible:ring-2 focus-visible:ring-ring min-h-[48px]"
                    onClick={() => setSelectedOnboardingAgent(agent)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-primary">
                          <AvatarFallback className="bg-primary text-primary-foreground">{agent.initials}</AvatarFallback>
                        </Avatar>
                        <div className="text-start">
                          <p className="font-medium text-foreground text-body">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">{agent.joinDate}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                    <div className="w-full ps-[52px] pe-6">
                      <p className="text-xs text-muted-foreground mb-1 text-start">{agent.currentStep}</p>
                      <Progress value={agent.progress} className="h-2" />
                    </div>
                  </button>
                ))}
              </div>
              {onboardingAgents.length > 3 && (
                <button className="w-full text-center text-primary hover:underline text-sm mt-4">
                  {t("team.viewAll")}
                </button>
              )}
            </CardContent>
          </Card>

          {/* Top Agents */}
          <Card>
            <CardHeader>
              <CardTitle className="text-section-title font-medium">{t("team.topAgents")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="units" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="units">
                    {t("team.unitsClosed")}
                  </TabsTrigger>
                  <TabsTrigger value="volume">
                    {t("team.highestVolume")}
                  </TabsTrigger>
                  <TabsTrigger value="commission">
                    {t("team.commission")}
                  </TabsTrigger>
                </TabsList>

                {(["units", "volume", "commission"] as const).map((tab) => (
                  <TabsContent key={tab} value={tab} className="mt-0">
                    <div className="divide-y divide-border/50">
                      {[...topAgents]
                        .sort((a, b) =>
                          tab === "units" ? b.units - a.units :
                          tab === "volume" ? b.volume - a.volume :
                          b.commission - a.commission
                        )
                        .slice(0, 4)
                        .map((agent, idx) => (
                          <div
                            key={agent.id}
                            className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 rounded-lg px-2 -mx-2 min-h-[48px]"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 bg-primary">
                                <AvatarFallback className="bg-primary text-primary-foreground">{agent.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground text-body">{agent.name}</p>
                                <p className="text-sm text-muted-foreground">{idx + 1} of {topAgents.length}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground text-body tabular-nums font-secondary">
                                {tab === "units" ? `${isCanada ? (agent.units + 0.25).toFixed(2) : agent.units} ${t("team.units")}` :
                                 tab === "volume" ? formatCurrency(agent.volume) :
                                 formatCurrency(agent.commission)}
                              </span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4 rounded-full border-border text-primary"
                      onClick={() => {
                        setTopAgentsDefaultTab(tab);
                        setTopAgentsSheetOpen(true);
                      }}
                    >
                      {t("team.viewAll")}
                    </Button>
                  </TabsContent>
                ))}
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

            <div className="divide-y divide-border/50">
              {teamRequirements.map((req) => (
                <div key={req.label} className="py-3 first:pt-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      {req.label}
                      {req.hasInfo && <Info className="h-3.5 w-3.5" />}
                    </div>
                    <span className="text-sm font-medium text-foreground tabular-nums">{req.value}</span>
                  </div>
                  <Progress
                    value={req.progress}
                    className={`h-2 ${req.isWarning ? '[&>div]:bg-yellow-500' : req.progress === 100 ? '[&>div]:bg-green-500' : ''}`}
                  />
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="rounded-full mt-6 px-8"
              onClick={() => setAgentDetailsSheetOpen(true)}
            >
              {t("team.viewDetails")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Agent Detail Sheet */}
      <Sheet open={!!selectedOnboardingAgent} onOpenChange={() => setSelectedOnboardingAgent(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="sr-only">Agent Details</SheetTitle>
          </SheetHeader>
          {selectedOnboardingAgent && (
            <div className="mt-4 space-y-6">
              {/* Agent identity */}
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {selectedOnboardingAgent.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg font-bold text-foreground">{selectedOnboardingAgent.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("team.joinId")} : <span className="font-semibold text-foreground">{selectedOnboardingAgent.joinId}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("team.startDate")}: <span className="font-semibold text-foreground">{selectedOnboardingAgent.joinDate}</span>
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold text-foreground mb-3">{t("team.contact")}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{selectedOnboardingAgent.state}<br />{selectedOnboardingAgent.country}</span>
                </div>
                <div className="space-y-2">
                  <a
                    href={`tel:${selectedOnboardingAgent.phone}`}
                    className="flex items-center gap-3 rounded-lg bg-primary text-primary-foreground p-3 hover:bg-primary/90 transition-colors min-h-[48px]"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="font-medium">{selectedOnboardingAgent.phone}</span>
                  </a>
                  <a
                    href={`mailto:${selectedOnboardingAgent.email}`}
                    className="flex items-center gap-3 rounded-lg bg-primary text-primary-foreground p-3 hover:bg-primary/90 transition-colors min-h-[48px]"
                  >
                    <Mail className="h-5 w-5" />
                    <span className="font-medium">{selectedOnboardingAgent.email}</span>
                  </a>
                </div>
              </div>

              <Separator />

              {/* Prospective Agent Details */}
              <div>
                <h4 className="font-bold text-foreground mb-4">{t("team.prospectiveAgentDetails")}</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("team.sponsorName")}</p>
                    <p className="text-sm font-medium text-foreground">{selectedOnboardingAgent.sponsorName || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("team.teamId")}</p>
                    <p className="text-sm font-medium text-foreground">{selectedOnboardingAgent.teamId}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("team.teamName")}</p>
                  <p className="text-sm font-medium text-foreground">{selectedOnboardingAgent.teamName}</p>
                </div>
              </div>

              <Separator />

              {/* Process */}
              <div>
                <h4 className="font-bold text-foreground mb-4">{t("team.process")}</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("team.currentStep")}</p>
                    <p className="text-sm font-medium text-foreground">{selectedOnboardingAgent.currentStep}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("team.nextStep")}</p>
                    <p className="text-sm font-medium text-foreground">{selectedOnboardingAgent.nextStep}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("team.durationInStep")}</p>
                  <p className="text-sm font-medium text-foreground">{selectedOnboardingAgent.durationDays} {t("team.days")}</p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <TopAgentsSheet
        open={topAgentsSheetOpen}
        onOpenChange={setTopAgentsSheetOpen}
        defaultTab={topAgentsDefaultTab}
      />
      <AgentDetailsSheet
        open={agentDetailsSheetOpen}
        onOpenChange={setAgentDetailsSheetOpen}
      />
    </DashboardLayout>
  );
}
