import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UniversalFilterBar } from "@/components/filters";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type ColumnDef } from "@/components/shared/DataTable";
import { Briefcase, ExternalLink, Plus, Home as HomeIcon, DollarSign as DollarIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ListingDetailSheet } from "./components/ListingDetailSheet";

interface ListingRow {
  id: string;
  mlsNumber: string;
  propertyAddress: string;
  propertyCity: string;
  status: "Active" | "Expired" | "Incomplete" | "Canceled/Pend";
  listingAgent: string;
  office: string;
  expirationDate: string;
  listingPrice: number;
  stage: string;
  stageVariant: "default" | "warning" | "danger";
}

const LISTINGS: ListingRow[] = [
  { id: "1", mlsNumber: "MLS-2024-001", propertyAddress: "1234 Oak Street", propertyCity: "Austin, TX 78701",  status: "Expired",       listingAgent: "John & Mary Smith",        office: "Main Office",  expirationDate: "2024-07-14", listingPrice: 485000,  stage: "Active",            stageVariant: "default" },
  { id: "2", mlsNumber: "MLS-2024-002", propertyAddress: "567 Riverside Dr", propertyCity: "Round Rock, TX 78664", status: "Expired",    listingAgent: "Robert Davis",             office: "Main Office",  expirationDate: "2024-07-31", listingPrice: 325000,  stage: "Pending Review",    stageVariant: "warning" },
  { id: "3", mlsNumber: "N/A",          propertyAddress: "890 Summit View",  propertyCity: "Cedar Park, TX 78613", status: "Expired",    listingAgent: "Amanda Wilson",            office: "Main Office",  expirationDate: "2024-08-09", listingPrice: 575000,  stage: "Missing Signatures",stageVariant: "warning" },
  { id: "4", mlsNumber: "MLS-2024-004", propertyAddress: "2100 Lakefront Blvd", propertyCity: "Lakeway, TX 78734", status: "Expired",    listingAgent: "Michael & Jennifer Brown", office: "Main Office",  expirationDate: "2024-07-19", listingPrice: 1250000, stage: "Active",            stageVariant: "default" },
  { id: "5", mlsNumber: "MLS-001",      propertyAddress: "1234 Oak Street",  propertyCity: "Austin, TX 78701",     status: "Active",     listingAgent: "John Smith",               office: "Main Office",  expirationDate: "2025-06-29", listingPrice: 485000,  stage: "Active",            stageVariant: "default" },
  { id: "6", mlsNumber: "MLS-002",      propertyAddress: "567 Riverside Dr", propertyCity: "Round Rock, TX 78664", status: "Incomplete", listingAgent: "Sarah Johnson",            office: "North Office", expirationDate: "2025-05-14", listingPrice: 325000,  stage: "Missing Documents", stageVariant: "danger" },
  { id: "7", mlsNumber: "MLS-003",      propertyAddress: "890 Summit View",  propertyCity: "Cedar Park, TX 78613", status: "Canceled/Pend", listingAgent: "Michael Brown",         office: "Main Office",  expirationDate: "2025-04-19", listingPrice: 575000,  stage: "Awaiting Approval", stageVariant: "default" },
  { id: "8", mlsNumber: "MLS-004",      propertyAddress: "2100 Lakefront Blvd", propertyCity: "Lakeway, TX 78734", status: "Active",     listingAgent: "Jennifer Brown",           office: "Main Office",  expirationDate: "2025-08-22", listingPrice: 1250000, stage: "Active",            stageVariant: "default" },
  { id: "9", mlsNumber: "MLS-005",      propertyAddress: "455 Maple Ave",    propertyCity: "Austin, TX 78704",     status: "Active",     listingAgent: "Carlos Reyes",             office: "South Office", expirationDate: "2025-09-30", listingPrice: 695000,  stage: "Active",            stageVariant: "default" },
];

type StatusFilter = "all" | "active" | "pending" | "closed";
type SourceTab = "listings" | "transactions";


type Period = "monthly" | "quarterly" | "yearly";

const PIPELINE_BY_PERIOD: Record<Period, { inProgress: number; closed: number; paid: number; canceled: number }> = {
  monthly:   { inProgress: 1, closed: 1, paid: 1, canceled: 0 },
  quarterly: { inProgress: 1, closed: 1, paid: 1, canceled: 0 },
  yearly:    { inProgress: 4, closed: 9, paid: 8, canceled: 1 },
};

export default function BusinessTransactions() {
  const { t } = useTranslation();
  const { formatNumber } = useFormatters();
  useDocumentTitle(t("nav.transactions"));

  const [period, setPeriod] = useState<Period>("quarterly");
  const d = PIPELINE_BY_PERIOD[period];
  const total = d.inProgress + d.closed + d.paid + d.canceled;

  const [sourceTab, setSourceTab] = useState<SourceTab>("listings");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filteredListings = useMemo(() => {
    return LISTINGS.filter((row) => {
      if (statusFilter !== "all") {
        const s = row.status.toLowerCase();
        if (statusFilter === "active" && s !== "active") return false;
        if (statusFilter === "pending" && !["incomplete", "canceled/pend"].includes(s)) return false;
        if (statusFilter === "closed" && s !== "expired") return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return (
          row.mlsNumber.toLowerCase().includes(q) ||
          row.propertyAddress.toLowerCase().includes(q) ||
          row.propertyCity.toLowerCase().includes(q) ||
          row.listingAgent.toLowerCase().includes(q) ||
          row.office.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [statusFilter, search]);

  const listingStatusBadge = (status: ListingRow["status"]) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-muted text-muted-foreground hover:bg-muted">Active</Badge>;
      case "Expired":
        return <Badge className="bg-exp-red/10 text-exp-red border-exp-red/20 hover:bg-exp-red/10">Expired</Badge>;
      case "Incomplete":
        return <Badge className="bg-exp-purple/10 text-exp-purple border-exp-purple/20 hover:bg-exp-purple/10">Incomplete</Badge>;
      case "Canceled/Pend":
        return <Badge className="bg-muted text-muted-foreground hover:bg-muted">Canceled/Pend</Badge>;
    }
  };

  const stageBadge = (stage: string, variant: ListingRow["stageVariant"]) => {
    if (variant === "warning") {
      return <Badge className="bg-exp-gold/10 text-exp-gold border-exp-gold/20 hover:bg-exp-gold/10">{stage}</Badge>;
    }
    if (variant === "danger") {
      return <Badge className="bg-exp-red/10 text-exp-red border-exp-red/20 hover:bg-exp-red/10">{stage}</Badge>;
    }
    return <span className="text-sm text-muted-foreground">{stage}</span>;
  };

  const columns: ColumnDef<ListingRow>[] = [
    { key: "mlsNumber", header: "transactions.mlsNumber", type: "string", sortable: true },
    {
      key: "propertyAddress",
      header: "transactions.propertyAddress",
      type: "string",
      sortable: true,
      render: (_v, row) => (
        <div className="min-w-0">
          <p className="text-sm text-foreground truncate">{row.propertyAddress}</p>
          <p className="text-xs text-muted-foreground truncate">{row.propertyCity}</p>
        </div>
      ),
    },
    { key: "status", header: "transactions.statusCol", type: "badge", sortable: true, render: (_v, row) => listingStatusBadge(row.status) },
    { key: "listingAgent", header: "transactions.listingAgent", type: "string", sortable: true },
    { key: "office", header: "transactions.office", type: "string", sortable: true },
    { key: "expirationDate", header: "transactions.expirationDate", type: "date", sortable: true },
    { key: "listingPrice", header: "transactions.listingPrice", type: "currency", sortable: true },
    { key: "stage", header: "transactions.stage", type: "string", sortable: true, render: (_v, row) => stageBadge(row.stage, row.stageVariant) },
    {
      id: "actions",
      key: "id" as keyof ListingRow,
      header: "transactions.actions",
      type: "string",
      sortable: false,
      stickyRight: true,
      render: (_v, row) => (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label={t("transactions.openInSkySlope")}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open("https://exp.skyslope.com", "_blank", "noopener,noreferrer");
                }}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("transactions.openInSkySlope")}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
  ];

  const segments = [
    { key: "inProgress", label: t("transactions.inProgress"), value: d.inProgress, color: "hsl(var(--exp-purple))" },
    { key: "closed",     label: t("transactions.closed"),     value: d.closed,     color: "hsl(var(--exp-green))" },
    { key: "paid",       label: t("transactions.paid"),       value: d.paid,       color: "hsl(var(--exp-blue-light))" },
    { key: "canceled",   label: t("transactions.canceled"),   value: d.canceled,   color: "hsl(var(--exp-light-grey))" },
  ];

  const chartData = total === 0
    ? [{ key: "empty", value: 1, color: "hsl(var(--muted))" }]
    : segments.filter((s) => s.value > 0);

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-20">
        <UniversalFilterBar title={t("nav.transactions")} subtitle={t("transactions.subtitle")}>
          <Button
            variant="outline"
            className="rounded-[51px] gap-2 min-h-[44px]"
            onClick={() => window.open("https://exp.skyslope.com", "_blank", "noopener,noreferrer")}
          >
            <ExternalLink className="h-4 w-4" />
            SkySlope
          </Button>
          <Button className="rounded-[51px] gap-2 min-h-[44px] bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            {t("transactions.create")}
          </Button>
        </UniversalFilterBar>

        {/* Active Pipeline Hero — donut + legend */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-exp-dark-navy via-exp-charcoal-blue to-exp-slate-blue p-4 sm:p-6 text-white">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
            <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-exp-frosted-blue" />
            <div className="absolute right-20 bottom-4 h-20 w-20 rounded-full bg-white" />
          </div>

          <div className="relative z-10">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20">
                <Briefcase className="me-1 h-3 w-3" />
                {t("transactions.activePipeline").toUpperCase()}
              </Badge>
              <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
                <TabsList className="h-10 bg-white/10 border border-white/15 p-1">
                  <TabsTrigger value="monthly" className="rounded-[51px] px-3 py-1.5 text-xs data-[state=active]:bg-white data-[state=active]:text-exp-dark-navy text-white/80">
                    {t("transactions.monthly")}
                  </TabsTrigger>
                  <TabsTrigger value="quarterly" className="rounded-[51px] px-3 py-1.5 text-xs data-[state=active]:bg-white data-[state=active]:text-exp-dark-navy text-white/80">
                    {t("transactions.quarterly")}
                  </TabsTrigger>
                  <TabsTrigger value="yearly" className="rounded-[51px] px-3 py-1.5 text-xs data-[state=active]:bg-white data-[state=active]:text-exp-dark-navy text-white/80">
                    {t("transactions.yearly")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Donut with center total */}
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {chartData.map((s, i) => (
                        <radialGradient
                          key={`grad-${s.key}`}
                          id={`donutGrad-${s.key}-${i}`}
                          cx="50%"
                          cy="50%"
                          r="65%"
                          fx="50%"
                          fy="50%"
                        >
                          <stop offset="55%" stopColor={s.color} stopOpacity={1} />
                          <stop offset="100%" stopColor={s.color} stopOpacity={0.55} />
                        </radialGradient>
                      ))}
                      <filter id="donutShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
                        <feOffset dx="0" dy="2" result="offsetblur" />
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="0.25" />
                        </feComponentTransfer>
                        <feMerge>
                          <feMergeNode />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <radialGradient id="donutInnerShade" cx="50%" cy="50%" r="50%">
                        <stop offset="60%" stopColor="hsl(var(--exp-dark-navy))" stopOpacity={0} />
                        <stop offset="100%" stopColor="#000" stopOpacity={0.2} />
                      </radialGradient>
                      <radialGradient id="donutHighlight" cx="50%" cy="35%" r="55%">
                        <stop offset="0%" stopColor="#fff" stopOpacity={0.18} />
                        <stop offset="70%" stopColor="#fff" stopOpacity={0} />
                      </radialGradient>
                    </defs>

                    {/* Subtle base track for depth */}
                    <Pie
                      data={[{ value: 1 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius="64%"
                      outerRadius="100%"
                      dataKey="value"
                      stroke="none"
                      fill="hsl(var(--exp-dark-navy))"
                      isAnimationActive={false}
                    />
                    {/* Main colored ring with radial gradients + shadow */}
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius="66%"
                      outerRadius="100%"
                      dataKey="value"
                      stroke="hsl(var(--exp-dark-navy))"
                      strokeWidth={3}
                      paddingAngle={total > 1 ? 3 : 0}
                      cornerRadius={6}
                      startAngle={90}
                      endAngle={-270}
                      filter="url(#donutShadow)"
                    >
                      {chartData.map((s, i) => (
                        <Cell key={s.key} fill={`url(#donutGrad-${s.key}-${i})`} />
                      ))}
                    </Pie>
                    {/* Inner edge shading for bevel illusion */}
                    <Pie
                      data={[{ value: 1 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius="66%"
                      outerRadius="100%"
                      dataKey="value"
                      stroke="none"
                      fill="url(#donutInnerShade)"
                      isAnimationActive={false}
                    />
                    {/* Top-light highlight */}
                    <Pie
                      data={[{ value: 1 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius="66%"
                      outerRadius="100%"
                      dataKey="value"
                      stroke="none"
                      fill="url(#donutHighlight)"
                      isAnimationActive={false}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="font-secondary font-bold text-4xl sm:text-5xl text-white leading-none tabular-nums">
                    {formatNumber(total)}
                  </p>
                  <p className="text-xs text-white/70 mt-1">{t("transactions.totalDeals")}</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 w-full grid grid-cols-2 gap-3">
                {segments.map((s) => {
                  const pct = total ? Math.round((s.value / total) * 100) : 0;
                  return (
                    <div key={s.key} className="rounded-lg bg-white/10 backdrop-blur-sm px-3 py-2.5 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-xs font-semibold text-white truncate">{s.label}</span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <p className="font-secondary font-bold text-2xl text-white leading-none tabular-nums">
                          {formatNumber(s.value)}
                        </p>
                        <span className="text-xs text-white/60 tabular-nums">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Toolbar: tabs (left) + search + status pills (right) */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Tabs value={sourceTab} onValueChange={(v) => setSourceTab(v as SourceTab)}>
            <TabsList className="h-10 p-1">
              <TabsTrigger value="listings" className="rounded-[51px] px-3 py-1.5 gap-2 font-normal data-[state=active]:font-medium">
                <HomeIcon className="h-4 w-4" />
                {t("transactions.tabListings")}
                <Badge variant="secondary" className="ms-1 px-2 font-normal">{LISTINGS.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="rounded-[51px] px-3 py-1.5 gap-2 font-normal data-[state=active]:font-medium">
                <DollarIcon className="h-4 w-4" />
                {t("transactions.tabTransactions")}
                <Badge variant="secondary" className="ms-1 px-2 font-normal">{total}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("transactions.searchProperties")}
              className="h-11 w-full sm:w-72 rounded-[51px] border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label={t("transactions.searchProperties")}
            />
            {(["all", "active", "pending", "closed"] as StatusFilter[]).map((key) => (
              <Button
                key={key}
                variant={statusFilter === key ? "default" : "outline"}
                onClick={() => setStatusFilter(key)}
                className={`rounded-[51px] min-h-[44px] px-4 ${statusFilter === key ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}`}
              >
                {t(`transactions.filter.${key}`)}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        {/* Table */}
        <DataTable<ListingRow>
          data={filteredListings}
          columns={columns}
          defaultPageSize={25}
        />
      </div>
    </DashboardLayout>
  );
}
