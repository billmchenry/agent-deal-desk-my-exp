import { useMemo, useRef, useState } from "react";
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
import { Briefcase, ExternalLink, Plus, MoreVertical, Home as HomeIcon, DollarSign as DollarIcon, Sparkles, UploadCloud, FileText, X, Loader2, MapPin, User as UserIcon, Calendar as CalendarIcon, CheckCircle2, Pencil, ArrowLeft, Maximize2, History, ZoomIn, ZoomOut, AlertCircle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  const [createOpen, setCreateOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [createStage, setCreateStage] = useState<"upload" | "processing" | "complete" | "verification">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  type CardKey = "office" | "propertyCore" | "listingTerms" | "seller" | "propertyDetails";
  const [editingCards, setEditingCards] = useState<Record<CardKey, boolean>>({
    office: false,
    propertyCore: false,
    listingTerms: false,
    seller: false,
    propertyDetails: false,
  });
  const toggleEdit = (key: CardKey) =>
    setEditingCards((prev) => ({ ...prev, [key]: !prev[key] }));
  const [verifyValues, setVerifyValues] = useState({
    office: "Connecticut",
    checklistType: "",
    streetNumber: "6096",
    streetAddress: "Energy Lane",
    city: "Dallas",
    state: "TX",
    zip: "75225",
    county: "Dallas",
    listingPrice: "$500,000",
    startDate: "Feb 13, 2026",
    expirationDate: "Mar 13, 2026",
    sellerName: "Bob Smith",
    sellerEmail: "bob.smith@example.com",
    sellerPhone: "(214) 555-5555",
    yearBuilt: "",
    propertyTypeId: "",
    propertySubtypeId: "",
    mlsNumber: "",
  });
  const setVerifyField = (key: keyof typeof verifyValues, value: string) =>
    setVerifyValues((prev) => ({ ...prev, [key]: value }));

  const renderEditToggle = (cardKey: CardKey) => {
    const isEditing = editingCards[cardKey];
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-7 gap-1.5 shrink-0"
        onClick={() => toggleEdit(cardKey)}
      >
        {isEditing ? <Check className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
        {isEditing ? "Done" : "Edit"}
      </Button>
    );
  };

  const renderField = (
    label: string,
    fieldKey: keyof typeof verifyValues,
    cardKey: CardKey,
    opts: { placeholder?: string; className?: string; numeric?: boolean } = {},
  ) => {
    const { placeholder = "—", className = "", numeric = false } = opts;
    const value = verifyValues[fieldKey];
    const isEditing = editingCards[cardKey];
    return (
      <div className={className} key={fieldKey}>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        {isEditing ? (
          <Input
            value={value}
            onChange={(e) => setVerifyField(fieldKey, e.target.value)}
            className={`h-9 rounded-lg ${numeric ? "tabular-nums" : ""}`}
            placeholder={placeholder}
          />
        ) : (
          <p
            className={`font-medium ${value ? "text-foreground" : "text-muted-foreground"} ${numeric ? "tabular-nums" : ""} truncate`}
          >
            {value || placeholder}
          </p>
        )}
      </div>
    );
  };

  const addFiles = (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    if (arr.length) setFiles((prev) => [...prev, ...arr]);
  };

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label={`Open actions for ${row.mlsNumber}`}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{t("transactions.viewDetails")}</DropdownMenuItem>
            <DropdownMenuItem>{t("transactions.editListing")}</DropdownMenuItem>
            <DropdownMenuItem>{t("transactions.openInSkySlope")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-[51px] gap-2 min-h-[44px] bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                {t("transactions.create")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-64 rounded-2xl border-border/60 bg-popover/95 backdrop-blur-sm shadow-lg p-2"
            >
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setCreateOpen(true);
                }}
                className="rounded-xl gap-3 px-3 py-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <HomeIcon className="h-4 w-4" />
                </span>
                <span className="font-medium">Create Listing</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open("https://exp.skyslope.com", "_blank", "noopener,noreferrer")}
                className="rounded-xl gap-3 px-3 py-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <DollarIcon className="h-4 w-4" />
                </span>
                <span className="font-medium">Create listing via form</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      <Dialog
        open={createOpen}
        onOpenChange={(o) => {
          setCreateOpen(o);
          if (!o) {
            setFiles([]);
            setIsDragging(false);
            setCreateStage("upload");
          }
        }}
      >
        <DialogContent className={`${createStage === "verification" ? "sm:max-w-[1280px] max-h-[92vh]" : "sm:max-w-md"} rounded-2xl border-border/60 p-0 overflow-hidden`}>
          <div className="bg-gradient-to-r from-exp-dark-navy via-exp-charcoal-blue to-exp-slate-blue px-5 py-4 text-white">
            <DialogHeader className="space-y-1 text-start">
              <DialogTitle className="flex items-center gap-2 text-white">
                {createStage === "verification" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 -ms-1 text-white hover:bg-white/15 hover:text-white"
                    aria-label="Back"
                    onClick={() => setCreateStage("complete")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                  <Sparkles className="h-4 w-4" />
                </span>
                {createStage === "complete"
                  ? "Extraction Complete"
                  : createStage === "verification"
                    ? "Listing Verification"
                    : "Create Listing"}
              </DialogTitle>
              <DialogDescription className="text-white/75">
                {createStage === "upload" &&
                  "Drop your Listing Agreement, disclosures, or any related docs — Mira will sort and process them automatically."}
                {createStage === "processing" &&
                  "Mira is reading your documents and extracting listing details. This usually takes a few seconds."}
                {createStage === "complete" &&
                  "Here's what Mira extracted from your PDF. Review the details and finish your listing."}
                {createStage === "verification" &&
                  "Review extracted data from the Listing Agreement and complete any required details."}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* UPLOAD STAGE */}
          {createStage === "upload" && (
            <div className="p-5 space-y-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
                }}
                className={`w-full rounded-2xl border-2 border-dashed transition-colors px-6 py-8 flex flex-col items-center justify-center gap-3 text-center ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/40"
                }`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UploadCloud className="h-6 w-6" />
                </span>
                <span className="font-medium text-foreground">Drop Documents</span>
                <span className="text-xs text-muted-foreground">
                  Drop multiple PDFs or click to browse
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </button>

              {files.length > 0 && (
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {files.map((f, i) => (
                    <li
                      key={`${f.name}-${i}`}
                      className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <FileText className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{f.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(f.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        aria-label={`Remove ${f.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={files.length === 0}
                  onClick={() => {
                    setCreateStage("processing");
                    window.setTimeout(() => setCreateStage("complete"), 2200);
                  }}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Process with Mira
                </Button>
              </div>
            </div>
          )}

          {/* PROCESSING STAGE */}
          {createStage === "processing" && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center justify-center text-center py-6 gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" aria-hidden />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Loader2 className="h-7 w-7 animate-spin" />
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Processing with Mira</p>
                  <p className="text-xs text-muted-foreground">
                    Extracting fields from {files.length} document{files.length === 1 ? "" : "s"}…
                  </p>
                </div>
              </div>

              <ul className="space-y-2" aria-live="polite">
                {[
                  "Reading document content",
                  "Identifying listing details",
                  "Validating fields",
                ].map((label, i) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-sm"
                  >
                    <Loader2
                      className="h-4 w-4 animate-spin text-primary"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                    <span className="text-foreground/80">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* COMPLETE STAGE */}
          {createStage === "complete" && (
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-semibold">Extraction Complete</span>
                <span className="ms-auto text-xs text-muted-foreground">Step 1 of 2</span>
              </div>

              <ul className="rounded-2xl border border-border/60 bg-card divide-y divide-border/60">
                {[
                  { icon: MapPin, label: "Property Address", value: "8160 Energy Lane, Dallas, TX 75225" },
                  { icon: UserIcon, label: "Seller", value: "Bob Smith" },
                  { icon: DollarIcon, label: "Listing Price", value: "500,000 USD" },
                  { icon: CalendarIcon, label: "Start Date", value: "02/13/2026" },
                ].map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-center gap-3 px-3 py-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium text-foreground truncate">{value}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl border border-border/60 bg-muted/30 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Final Details
                </p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Summary of key extracted fields. Please review the full extraction and complete
                  any required details in the next step.
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => setCreateStage("upload")}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Re-upload
                </Button>
                <Button
                  onClick={() => setCreateStage("verification")}
                  className="gap-2"
                >
                  Finish Listing
                </Button>
              </div>
            </div>
          )}

          {/* VERIFICATION STAGE */}
          {createStage === "verification" && (() => {
            const sections: { id: CardKey; label: string; required: boolean; incomplete: boolean }[] = [
              {
                id: "office",
                label: "Office & Checklist",
                required: true,
                incomplete: !verifyValues.office.trim() || !verifyValues.checklistType.trim(),
              },
              { id: "propertyCore", label: "Property Core", required: true, incomplete: false },
              { id: "listingTerms", label: "Listing Terms", required: true, incomplete: false },
              { id: "seller", label: "Seller Information", required: false, incomplete: false },
              { id: "propertyDetails", label: "Property details", required: false, incomplete: false },
            ];
            const incompleteCount = sections.filter((s) => s.required && s.incomplete).length;
            const canCreate = incompleteCount === 0;
            const scrollTo = (id: CardKey) => {
              document.getElementById(`verify-card-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
            };
            return (
              <div className="flex flex-col max-h-[calc(92vh-96px)]">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden min-h-[520px]">
                  {/* PDF Viewer */}
                  <section className="flex flex-col border-r border-border/60 bg-muted/30 overflow-hidden min-h-0">
                    <div className="shrink-0 flex items-center justify-between gap-2 px-4 py-2 border-b border-border/60 bg-card">
                      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Testing.pdf</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Zoom out">
                          <ZoomOut className="h-3.5 w-3.5" />
                        </Button>
                        <span className="tabular-nums font-medium tracking-wider uppercase">100%</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Zoom in">
                          <ZoomIn className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col items-center gap-4 bg-foreground/[0.04] dark:bg-background/40">
                      {[1, 2, 3].map((page) => (
                        <div
                          key={page}
                          className="w-full max-w-[460px] aspect-[1/1.35] bg-card rounded-md border border-border/60 shadow-md p-8 flex flex-col items-center justify-center text-center gap-2 shrink-0"
                        >
                          {page === 1 ? (
                            <>
                              <h3 className="text-base font-bold text-foreground tracking-tight">RESIDENTIAL LISTING AGREEMENT</h3>
                              <p className="text-xs font-medium text-muted-foreground">Exclusive Right to Sell</p>
                              <div className="w-3/4 h-px bg-border/60 my-1" />
                              <p className="text-xs italic text-muted-foreground">Document preview not available.</p>
                            </>
                          ) : (
                            <>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Page {page}</p>
                              <div className="w-3/4 h-px bg-border/60 my-1" />
                              <p className="text-xs italic text-muted-foreground">Continued content…</p>
                            </>
                          )}
                          <p className="text-[10px] text-muted-foreground mt-auto">Page {page} of 3</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Extraction details */}
                  <section className="relative flex flex-col overflow-hidden bg-background">
                    <div className="absolute start-2 top-6 bottom-6 w-8 hidden md:flex flex-col items-center gap-5 z-10 py-2">
                      {sections.map((s) => {
                        const active = s.required && s.incomplete;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => scrollTo(s.id)}
                            aria-label={`Jump to ${s.label}`}
                            className="group flex items-center justify-center min-h-[44px] min-w-[44px]"
                          >
                            <span
                              className={`h-2 w-2 rounded-full transition-all ${
                                active
                                  ? "bg-amber-500 ring-4 ring-amber-500/15"
                                  : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex-1 overflow-y-auto ps-12 pe-6 py-6 space-y-5">
                      {(() => {
                        const incomplete = sections[0].incomplete;
                        return (
                          <div
                            id="verify-card-office"
                            className={`rounded-2xl p-5 transition-colors ${
                              incomplete
                                ? "border-2 border-amber-400/60 bg-amber-50/60 dark:bg-amber-500/5"
                                : "border border-border/60 bg-card"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div>
                                <span className="inline-block bg-amber-200/80 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                                  Required
                                </span>
                                <h4 className="text-base font-bold text-foreground">Office & Checklist</h4>
                              </div>
                              {renderEditToggle("office")}
                            </div>
                            {incomplete && (
                              <div className="flex items-start gap-2 bg-amber-100/60 dark:bg-amber-500/10 p-3 rounded-lg border border-amber-200/80 dark:border-amber-500/20 mb-4">
                                <AlertCircle className="h-4 w-4 text-amber-700 dark:text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-xs font-medium text-amber-800 dark:text-amber-200 leading-snug">
                                  Required: These details were not found in the document. Please select manually.
                                </p>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                              {renderField("Office", "office", "office")}
                              {renderField("Checklist type", "checklistType", "office", { placeholder: "Not selected" })}
                            </div>
                          </div>
                        );
                      })()}

                      <div id="verify-card-propertyCore" className="rounded-2xl border border-border/60 bg-card p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                              Required
                            </span>
                            <h4 className="text-base font-bold text-foreground">Property Core</h4>
                          </div>
                          {renderEditToggle("propertyCore")}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                          {renderField("Street Number", "streetNumber", "propertyCore", { numeric: true })}
                          {renderField("Street Address", "streetAddress", "propertyCore")}
                          {renderField("City", "city", "propertyCore")}
                          {renderField("State", "state", "propertyCore")}
                          {renderField("ZIP", "zip", "propertyCore", { numeric: true })}
                          {renderField("County", "county", "propertyCore")}
                        </div>
                      </div>

                      <div id="verify-card-listingTerms" className="rounded-2xl border border-border/60 bg-card p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                              Required
                            </span>
                            <h4 className="text-base font-bold text-foreground">Listing Terms</h4>
                          </div>
                          {renderEditToggle("listingTerms")}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                          {renderField("Listing Price", "listingPrice", "listingTerms", { numeric: true })}
                          {renderField("Start Date", "startDate", "listingTerms")}
                          {renderField("Expiration Date", "expirationDate", "listingTerms")}
                        </div>
                      </div>

                      <div id="verify-card-seller" className="rounded-2xl border border-border/60 bg-card p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="inline-block bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                              Optional
                            </span>
                            <h4 className="text-base font-bold text-foreground">Seller Information</h4>
                          </div>
                          {renderEditToggle("seller")}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                          {renderField("Name", "sellerName", "seller")}
                          {renderField("Email", "sellerEmail", "seller")}
                          {renderField("Phone", "sellerPhone", "seller", { numeric: true })}
                        </div>
                      </div>

                      <div id="verify-card-propertyDetails" className="rounded-2xl border border-border/60 bg-card p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="inline-block bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                              Optional
                            </span>
                            <h4 className="text-base font-bold text-foreground">Property details</h4>
                          </div>
                          {renderEditToggle("propertyDetails")}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                          {renderField("Year Built", "yearBuilt", "propertyDetails", { numeric: true })}
                          {renderField("Property Type ID", "propertyTypeId", "propertyDetails")}
                          {renderField("Property Subtype ID", "propertySubtypeId", "propertyDetails")}
                          {renderField("MLS Number", "mlsNumber", "propertyDetails")}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Footer */}
                <div className="shrink-0 flex items-center justify-between gap-3 px-6 py-4 border-t border-border/60 bg-card">
                  {canCreate ? (
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      <Check className="h-4 w-4" />
                      All required fields complete
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="tabular-nums">{incompleteCount}</span>{" "}
                      {incompleteCount === 1 ? "section" : "sections"} remaining
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setCreateOpen(false)}>
                      Save as Draft
                    </Button>
                    <Button onClick={() => setCreateOpen(false)} disabled={!canCreate}>
                      Create Listing
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
