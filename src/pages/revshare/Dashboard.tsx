import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Info, ChevronRight, Clock, Calendar, CheckCircle2, TrendingUp,
  Users, DollarSign, ExternalLink, Target,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";
import { useDemoConfig } from "@/contexts/DemoConfigContext";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { UniversalFilterBar } from "@/components/filters";
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import {
  HoverCard, HoverCardContent, HoverCardTrigger,
} from "@/components/ui/hover-card";
import { DistributionDonut } from "@/components/revshare/DistributionDonut";

/* ── Mock Data ─────────────────────────────────────────── */

const levelDistribution = [
  { name: "Level 1", value: 0.7, agents: 129, color: "hsl(244, 14%, 22%)" },
  { name: "Level 2", value: 2.1, agents: 374, color: "hsl(230, 25%, 32%)" },
  { name: "Level 3", value: 5.4, agents: 962, color: "hsl(218, 35%, 42%)" },
  { name: "Level 4", value: 12.3, agents: 2190, color: "hsl(210, 40%, 52%)" },
  { name: "Level 5", value: 20.8, agents: 3704, color: "hsl(200, 35%, 62%)" },
  { name: "Level 6", value: 28.9, agents: 5146, color: "hsl(215, 30%, 76%)" },
  { name: "Level 7", value: 29.8, agents: 5311, color: "hsl(220, 25%, 88%)" },
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

// Yearly: single line showing total revshare per year
const revenueYearlyGrouped = [
  { name: "2024", value: 1.0 },
  { name: "2025", value: 3.8 },
  { name: "2026", value: 0.285 },
];

// Quarterly: each line = a year, x-axis = quarters
const revenueQuarterlyGrouped = [
  { name: "Q1", y2024: 0.18, y2025: 0.82, y2026: 0.285 },
  { name: "Q2", y2024: 0.22, y2025: 1.05 },
  { name: "Q3", y2024: 0.28, y2025: 1.12 },
  { name: "Q4", y2024: 0.32, y2025: 0.81 },
];

// Monthly: each line = a year, x-axis = months
const revenueMonthlyGrouped = [
  { name: "Jan", y2024: 0.05, y2025: 0.25, y2026: 0.15 },
  { name: "Feb", y2024: 0.05, y2025: 0.28, y2026: 0.135 },
  { name: "Mar", y2024: 0.06, y2025: 0.3 },
  { name: "Apr", y2024: 0.07, y2025: 0.35 },
  { name: "May", y2024: 0.08, y2025: 0.36 },
  { name: "Jun", y2024: 0.08, y2025: 0.38 },
  { name: "Jul", y2024: 0.1, y2025: 0.4 },
  { name: "Aug", y2024: 0.09, y2025: 0.37 },
  { name: "Sep", y2024: 0.1, y2025: 0.35 },
  { name: "Oct", y2024: 0.11, y2025: 0.28 },
  { name: "Nov", y2024: 0.1, y2025: 0.25 },
  { name: "Dec", y2024: 0.11, y2025: 0.28 },
];

const TOTAL_AGENTS = 17816;
const TOTAL_REVSHARE = 285400;

const levelRevShare = [
  { name: "Level 1", value: 1998, color: "hsl(244, 14%, 22%)" },
  { name: "Level 2", value: 5993, color: "hsl(230, 25%, 32%)" },
  { name: "Level 3", value: 15412, color: "hsl(218, 35%, 42%)" },
  { name: "Level 4", value: 35104, color: "hsl(210, 40%, 52%)" },
  { name: "Level 5", value: 59363, color: "hsl(200, 35%, 62%)" },
  { name: "Level 6", value: 82481, color: "hsl(215, 30%, 76%)" },
  { name: "Level 7", value: 85049, color: "hsl(220, 25%, 88%)" },
];

const countryRevShare = [
  { name: "United States", value: 77710, color: "hsl(262, 83%, 58%)" },
  { name: "United Kingdom", value: 23117, color: "hsl(217, 91%, 60%)" },
  { name: "Canada", value: 17980, color: "hsl(142, 71%, 45%)" },
  { name: "Germany", value: 15697, color: "hsl(45, 93%, 47%)" },
  { name: "Australia", value: 14270, color: "hsl(0, 84%, 60%)" },
  { name: "Brazil", value: 13132, color: "hsl(220, 45%, 30%)" },
  { name: "France", value: 11494, color: "hsl(210, 40%, 75%)" },
];

const chartTickStyle = {
  fill: "hsl(var(--muted-foreground))",
  fontSize: 11,
  fontFamily: "var(--font-secondary)",
};

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  borderColor: "hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
  fontFamily: "var(--font-secondary)",
};

export default function RevShareDashboard() {
  const isMobile = useIsMobile();
  const [compPeriod, setCompPeriod] = useState("yearly");
  const [selectedMonth, setSelectedMonth] = useState<Record<string, unknown> | null>(null);
  const [distMode, setDistMode] = useState<"agents" | "revshare">("agents");
  const { formatNumber, formatCurrency } = useFormatters();
  const { t } = useTranslation();
  const { config } = useDemoConfig();
  useDocumentTitle(t("revshare.revenueShare"));

  /* ── FLQA scenario data ── */
  const flqaScenarios = {
    low:  { actual: 5, bonus: 0 },
    mid:  { actual: 18, bonus: 12 },
    high: { actual: 25, bonus: 5 },
    max:  { actual: 30, bonus: 0 },
    over: { actual: 28, bonus: 7 },
  };

  const flqaData = flqaScenarios[config.flqaMode];
  const flqaTotal = flqaData.actual + flqaData.bonus;

  // Level thresholds: L1-3 = 0, L4 = 5, L5 = 10, L6 = 15, max goal = 30
  const levelThresholds = [
    { level: 4, flqa: 5 },
    { level: 5, flqa: 10 },
    { level: 6, flqa: 15 },
  ];

  const currentLevel = (() => {
    if (flqaTotal >= 15) return 6;
    if (flqaTotal >= 10) return 5;
    if (flqaTotal >= 5) return 4;
    return 3; // levels 1-3 all unlock at 0
  })();

  const isMaxed = flqaTotal >= 30;
  const nextLevelInfo = levelThresholds.find((lt) => lt.flqa > flqaTotal);
  const flqaGoal = 30;
  const progressPercent = Math.min((flqaTotal / flqaGoal) * 100, 100);

  const levelDonutData =
    distMode === "agents"
      ? levelDistribution.map((l) => ({ name: l.name, value: l.agents, color: l.color, label: l.name }))
      : levelRevShare.map((l) => ({ name: l.name, value: l.value, color: l.color, label: l.name }));

  const countryDonutData =
    distMode === "agents"
      ? countryDistribution.map((c) => ({ name: c.name, value: c.agents, color: c.color }))
      : countryRevShare.map((c) => ({ name: c.name, value: c.value, color: c.color }));

  const donutTotal = distMode === "agents" ? TOTAL_AGENTS : TOTAL_REVSHARE;
  const donutFormat = (v: number) =>
    distMode === "agents" ? formatNumber(v) : formatCurrency(v);
  const donutCenterLabel = distMode === "agents" ? t("revshare.agents") : t("revshare.revShareLabel");

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-20">

        {/* ═══ Page Header ═══ */}
        <UniversalFilterBar title={t("revshare.revenueShare")}>
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
        </UniversalFilterBar>

        {/* ═══ Section 1: Hero Banner ═══ */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-exp-navy via-exp-navy-light to-exp-blue p-4 sm:p-6 text-white">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
            <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-white" />
            <div className="absolute right-20 bottom-4 h-20 w-20 rounded-full bg-exp-gold" />
          </div>

          <div className="relative z-10">
            <div className="mb-4">
              <Badge className="bg-exp-gold/20 text-exp-gold-light border-exp-gold/30 hover:bg-exp-gold/30">
                <Target className="me-1 h-3 w-3" />
                {t("revshare.revenueShare").toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">

              {/* Revenue Share */}
              <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3.5 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-md p-1.5 shrink-0 bg-exp-green/20 text-exp-green-light">
                    <DollarSign className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-white">{t("revshare.revenueShare")}</span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-1">
                <p className="text-stat-value font-bold font-secondary text-white">
                    {formatNumber(264138.52, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-medium text-white/70">USD</span>
                  </p>
                  <span className="text-xs text-white/70">{t("revshare.afterAdj")}</span>
                </div>
                <div className="mt-2 space-y-1.5 text-sm text-white/80">
                  <p>{t("revshare.beforeAdj")} <span className="font-secondary font-semibold">{formatNumber(242857.04, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> USD</p>
                  <p>{t("revshare.adjustment")} <span className="font-secondary font-semibold">+{formatNumber(21281.48, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> USD</p>
                </div>
              </div>

              {/* FLA */}
              <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3.5 min-w-0 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-md p-1.5 shrink-0 bg-white/15 text-white">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-white">{t("revshare.flaTitle")}</span>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Info className="h-3 w-3 text-white/50 cursor-help" aria-label="FLA information" />
                    </HoverCardTrigger>
                    <HoverCardContent className="text-xs w-64">
                      {t("revshare.flaInfo")}
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <p className="text-stat-value font-bold font-secondary text-white">{formatNumber(24)}</p>
                <div className="flex-1" />
                <button className="mt-2 inline-flex items-center gap-1 rounded-md bg-white/15 hover:bg-white/25 px-3 py-2.5 min-h-[44px] sm:min-h-0 sm:py-1 text-xs font-medium text-white transition-colors self-start" aria-label={t("revshare.viewFLAList")}>
                  {t("revshare.viewFLAList")} <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* FLQA */}
              <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3.5 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-md p-1.5 shrink-0 bg-exp-gold/20 text-exp-gold-light">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-white">{t("revshare.flqaTitle")}</span>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Info className="h-3 w-3 text-white/50 cursor-help" aria-label="FLQA information" />
                    </HoverCardTrigger>
                    <HoverCardContent className="text-xs w-64">
                      {t("revshare.flqaInfo")}
                    </HoverCardContent>
                  </HoverCard>
                </div>

                <div className="flex items-end gap-4 mb-2">
                  <div>
                    <p className="text-stat-value font-bold font-secondary text-white leading-none">{formatNumber(flqaData.actual)}</p>
                    <p className="text-xs text-white/70">{t("revshare.actual")}</p>
                  </div>
                  {flqaData.bonus > 0 && (
                    <div>
                      <Badge className="bg-exp-green/20 text-exp-green-light border-exp-green/30 px-2 py-0.5">
                        <span className="text-stat-value font-bold font-secondary leading-none">+ {flqaData.bonus}</span>
                      </Badge>
                      <p className="text-xs text-white/70">{t("revshare.bonus")}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-stat-value font-bold font-secondary text-exp-gold-light leading-none">{formatNumber(flqaTotal)}</p>
                    <p className="text-xs text-white/70">Total</p>
                  </div>
                </div>

                {isMaxed ? (
                  <p className="text-xs text-exp-green-light font-semibold">
                    ✓ All levels unlocked
                  </p>
                ) : nextLevelInfo ? (
                  <p className="text-xs text-exp-gold-light">
                    Level {currentLevel}. <span className="font-semibold">{nextLevelInfo.flqa - flqaTotal} more agents</span> for{" "}
                    <span className="font-semibold">Level {nextLevelInfo.level}</span>.
                  </p>
                ) : (
                  <p className="text-xs text-exp-gold-light">
                    Level {currentLevel}.
                  </p>
                )}

                <div className="mt-2 mb-2">
                  <Progress
                    value={progressPercent}
                    className={`h-2 bg-white/20 ${isMaxed ? "[&>div]:bg-exp-green" : "[&>div]:bg-exp-gold"}`}
                  />
                  <div className="flex justify-between mt-1 text-xs text-white/50 font-secondary">
                    <span>0</span>
                    <span>{flqaTotal} ({t("revshare.current")})</span>
                    <span>{flqaGoal} ({t("revshare.goalLabel")})</span>
                  </div>
                </div>

                <button className="mt-1 inline-flex items-center gap-1 rounded-md bg-white/15 hover:bg-white/25 px-3 py-2.5 min-h-[44px] sm:min-h-0 sm:py-1 text-xs font-medium text-white transition-colors" aria-label="View FLQA List">
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
                <p className="text-xs text-muted-foreground">{t("revshare.payoutOverview")}</p>
              </div>
              <button className="text-xs text-exp-blue hover:underline flex items-center gap-1 min-h-[44px] sm:min-h-0" aria-label={t("revshare.viewPeriodicOverview")}>
                {t("revshare.viewPeriodicOverview")} <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            <div className="bg-muted/50 rounded-md p-2.5 mb-3 flex items-start gap-2">
              <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                {t("revshare.payNowInfo")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {/* Unpaid */}
              <div className="rounded-lg border border-exp-gold/30 bg-exp-gold/5 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-exp-gold" />
                  <span className="text-xs font-semibold text-foreground">{t("revshare.unpaid")}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{t("revshare.calculatedNotPaid")}</p>
                <p className="text-section-title font-bold font-secondary text-foreground mb-2">
                  {formatCurrency(1869.20)} <span className="text-xs font-medium text-muted-foreground">USD</span>
                </p>
                <button className="inline-flex items-center gap-1 rounded-md border border-border hover:bg-muted px-3 py-2.5 min-h-[44px] sm:min-h-0 sm:py-1 text-xs font-medium text-foreground transition-colors">
                  {t("revshare.viewDetails")} <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Expected Next */}
              <div className="rounded-lg border border-exp-blue/30 bg-exp-blue/5 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-exp-blue" />
                  <span className="text-xs font-semibold text-foreground">{t("revshare.expectedNext")}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{t("revshare.estimatedNextPayout")}</p>
                <p className="text-section-title font-bold font-secondary text-foreground mb-2">
                  {formatCurrency(1869.20)} <span className="text-xs font-medium text-muted-foreground">USD</span>
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-2">
                  <button className="inline-flex items-center gap-1 rounded-md border border-border hover:bg-muted px-3 py-2.5 min-h-[44px] sm:min-h-0 sm:py-1 text-xs font-medium text-foreground transition-colors">
                    {t("revshare.viewDetails")} <ChevronRight className="h-3 w-3" />
                  </button>
                  <Button size="sm" className="h-11 sm:h-7 text-xs px-3">{t("revshare.getPaidNow")}</Button>
                </div>
              </div>

              {/* Last Paid */}
              <div className="rounded-lg border border-exp-green/30 bg-exp-green/5 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-exp-green" />
                  <span className="text-xs font-semibold text-foreground">{t("revshare.lastPaid")}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{t("revshare.mostRecentPayout")}</p>
                <p className="text-section-title font-bold font-secondary text-foreground mb-2">
                  {formatCurrency(986.92)} <span className="text-xs font-medium text-muted-foreground">USD</span>
                </p>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div>
                <h2 className="text-sm font-semibold text-foreground">{t("revshare.groupDistribution")}</h2>
                <p className="text-xs text-muted-foreground">
                  {distMode === "agents"
                    ? t("revshare.agentDistDesc")
                    : t("revshare.revShareDistDesc")}
                </p>
              </div>
              <Tabs value={distMode} onValueChange={(v) => setDistMode(v as "agents" | "revshare")}>
                <TabsList className="h-9 sm:h-7">
                  <TabsTrigger value="agents" className="text-xs px-3 min-h-[44px] sm:min-h-0 sm:h-6">{t("revshare.agents")}</TabsTrigger>
                  <TabsTrigger value="revshare" className="text-xs px-3 min-h-[44px] sm:min-h-0 sm:h-6">{t("revshare.revShareLabel")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-medium text-muted-foreground mb-2 block">{t("revshare.byLevel")}</span>
                <DistributionDonut
                  data={levelDonutData}
                  total={donutTotal}
                  formatValue={donutFormat}
                  centerLabel={donutCenterLabel}
                />
              </div>
              <div className="border-t pt-4 lg:border-t-0 lg:pt-0 lg:border-s lg:ps-4 border-border">
                <span className="text-xs font-medium text-muted-foreground mb-2 block">{t("revshare.byCountry")}</span>
                <DistributionDonut
                  data={countryDonutData}
                  total={donutTotal}
                  formatValue={donutFormat}
                  centerLabel={donutCenterLabel}
                  showPercentage={false}
                />
              </div>
            </div>
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
                  <p className="text-xs text-muted-foreground">{t("revshare.compareDesc")}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <button className="text-xs text-exp-blue hover:underline flex items-center gap-1 min-h-[44px] sm:min-h-0" aria-label={t("revshare.viewTrends")}>
                    {t("revshare.viewTrends")} <ExternalLink className="h-3 w-3" />
                  </button>
                  <Tabs value={compPeriod} onValueChange={(v) => { setCompPeriod(v); setSelectedMonth(null); }}>
                    <TabsList className="h-9 sm:h-7">
                      <TabsTrigger value="yearly" className="text-xs px-2 py-0.5 h-8 sm:h-6 min-h-[44px] sm:min-h-0">{t("revshare.yearly")}</TabsTrigger>
                      <TabsTrigger value="quarterly" className="text-xs px-2 py-0.5 h-8 sm:h-6 min-h-[44px] sm:min-h-0">{t("revshare.quarterly")}</TabsTrigger>
                      <TabsTrigger value="monthly" className="text-xs px-2 py-0.5 h-8 sm:h-6 min-h-[44px] sm:min-h-0">{t("revshare.monthly")}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                {compPeriod === "yearly" ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-exp-blue inline-block" /> Revenue Share</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-exp-gold inline-block" /> 2024</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-exp-blue inline-block" /> 2025</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-exp-green inline-block" /> 2026</span>
                  </div>
                )}
              </div>
            </div>

            {/* Yearly: single line showing total per year */}
            {compPeriod === "yearly" && (
              <div className="h-[200px] sm:h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueYearlyGrouped} margin={{ top: 15, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={chartTickStyle} />
                    <YAxis axisLine={false} tickLine={false} tick={chartTickStyle} tickFormatter={(v) => formatCurrency(v * 1_000_000, { compact: true, decimals: 1 })} domain={[0, "auto"]} width={50} />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value * 1_000_000, { compact: true, decimals: value < 1 ? 0 : 2 }), "Revenue Share"]}
                      contentStyle={tooltipStyle}
                    />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--exp-blue))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--exp-blue))" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Quarterly: multi-line */}
            {compPeriod !== "yearly" && compPeriod !== "monthly" && (
              <div className="h-[200px] sm:h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueQuarterlyGrouped} margin={{ top: 15, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={chartTickStyle} />
    <YAxis axisLine={false} tickLine={false} tick={chartTickStyle} tickFormatter={(v) => formatCurrency(v * 1_000, { compact: true, decimals: 0 })} domain={[0, 1.5]} width={50} />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        const label = name === "y2024" ? "2024" : name === "y2025" ? "2025" : "2026";
                        return [formatCurrency(value * 1_000, { compact: true, decimals: 0 }), label];
                      }}
                      contentStyle={tooltipStyle}
                    />
                    <Line type="monotone" dataKey="y2024" stroke="hsl(var(--exp-gold))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--exp-gold))" }} connectNulls />
                    <Line type="monotone" dataKey="y2025" stroke="hsl(var(--exp-blue))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--exp-blue))" }} connectNulls />
                    <Line type="monotone" dataKey="y2026" stroke="hsl(var(--exp-green))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--exp-green))" }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Monthly */}
            {compPeriod === "monthly" && (
              <>
                <div className={isMobile ? "overflow-x-auto -mx-4 px-4" : ""}>
                  <div className={isMobile ? "min-w-[600px]" : ""} style={{ height: isMobile ? 200 : 240 }}>
                    {isMobile ? (
                      <LineChart
                        data={revenueMonthlyGrouped}
                        width={600}
                        height={200}
                        margin={{ top: 15, right: 10, bottom: 0, left: 0 }}
                        onClick={(e) => {
                          if (e?.activePayload?.[0]?.payload) {
                            setSelectedMonth(e.activePayload[0].payload);
                          }
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={chartTickStyle} />
    <YAxis axisLine={false} tickLine={false} tick={chartTickStyle} tickFormatter={(v) => formatCurrency(v * 1_000, { compact: true, decimals: 0 })} domain={[0, 0.5]} width={50} />
                        <Tooltip
                          formatter={(value: number, name: string) => {
                            const label = name === "y2024" ? "2024" : name === "y2025" ? "2025" : "2026";
                            return [formatCurrency(value * 1_000, { compact: true, decimals: 0 }), label];
                          }}
                          contentStyle={tooltipStyle}
                        />
                        <Line type="monotone" dataKey="y2024" stroke="hsl(var(--exp-gold))" strokeWidth={2} dot={{ r: 5, fill: "hsl(var(--exp-gold))" }} connectNulls />
                        <Line type="monotone" dataKey="y2025" stroke="hsl(var(--exp-blue))" strokeWidth={2} dot={{ r: 5, fill: "hsl(var(--exp-blue))" }} connectNulls />
                        <Line type="monotone" dataKey="y2026" stroke="hsl(var(--exp-green))" strokeWidth={2} dot={{ r: 5, fill: "hsl(var(--exp-green))" }} connectNulls />
                      </LineChart>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueMonthlyGrouped} margin={{ top: 15, right: 10, bottom: 0, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={chartTickStyle} />
    <YAxis axisLine={false} tickLine={false} tick={chartTickStyle} tickFormatter={(v) => formatCurrency(v * 1_000, { compact: true, decimals: 0 })} domain={[0, 0.5]} width={50} />
                          <Tooltip
                            formatter={(value: number, name: string) => {
                              const label = name === "y2024" ? "2024" : name === "y2025" ? "2025" : "2026";
                              return [formatCurrency(value * 1_000, { compact: true, decimals: 0 }), label];
                            }}
                            contentStyle={tooltipStyle}
                          />
                          <Line type="monotone" dataKey="y2024" stroke="hsl(var(--exp-navy))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--exp-navy))" }} connectNulls />
                          <Line type="monotone" dataKey="y2025" stroke="hsl(var(--exp-blue))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--exp-blue))" }} connectNulls />
                          <Line type="monotone" dataKey="y2026" stroke="hsl(var(--exp-green))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--exp-green))" }} connectNulls />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {isMobile && selectedMonth && (
                  <div className="mt-2 rounded-md bg-muted/50 px-3 py-2 flex items-center gap-3 text-xs">
                    <span className="font-semibold text-foreground">{selectedMonth.name as string}</span>
                    <div className="flex gap-3 font-secondary">
                      {selectedMonth.y2024 != null && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-exp-navy inline-block" />
                          {formatCurrency((selectedMonth.y2024 as number) * 1000, { compact: true, decimals: 0 })}
                        </span>
                      )}
                      {selectedMonth.y2025 != null && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-exp-blue inline-block" />
                          {formatCurrency((selectedMonth.y2025 as number) * 1000, { compact: true, decimals: 0 })}
                        </span>
                      )}
                      {selectedMonth.y2026 != null && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-exp-green inline-block" />
                          {formatCurrency((selectedMonth.y2026 as number) * 1000, { compact: true, decimals: 0 })}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {isMobile && !selectedMonth && (
                  <p className="text-xs text-muted-foreground text-center mt-2">{t("revshare.swipeForDetails")}</p>
                )}
              </>
            )}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
