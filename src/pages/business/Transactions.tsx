import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Briefcase, ExternalLink, Plus, MoreVertical, Home as HomeIcon, DollarSign as DollarIcon, Sparkles, UploadCloud, FileText, X, Loader2, MapPin, User as UserIcon, Calendar as CalendarIcon, CheckCircle2, Pencil, ArrowLeft, Maximize2, History, ZoomIn, ZoomOut, AlertCircle, Check, Send, CreditCard, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LabeledFilter } from "@/components/filters/LabeledFilter";
import { SearchFilter } from "@/components/filters/SearchFilter";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTransactions } from "@/contexts/TransactionsContext";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { mockExtractContract } from "@/data/mockContractExtraction";

const CHECKLIST_TYPES = ["Commercial Lease", "Lease", "Lot", "Resale", "New"] as const;

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

const INITIAL_LISTINGS: ListingRow[] = [
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

function parsePriceToNumber(s: string): number {
  const n = parseFloat(String(s).replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}
function formatDateMDY(s: string): string {
  const d = new Date(s);
  if (isNaN(d.getTime())) return s || "-";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${d.getFullYear()}`;
}

type StatusFilter = "all" | "active" | "pending" | "closed";
type SourceTab = "all" | "listings" | "transactions";


type Period = "monthly" | "quarterly" | "yearly";

const PIPELINE_BY_PERIOD: Record<Period, { inProgress: number; closed: number; paid: number; canceled: number }> = {
  monthly:   { inProgress: 1, closed: 1, paid: 1, canceled: 0 },
  quarterly: { inProgress: 1, closed: 1, paid: 1, canceled: 0 },
  yearly:    { inProgress: 4, closed: 9, paid: 8, canceled: 1 },
};

export default function BusinessTransactions() {
  const { t } = useTranslation();
  const { formatNumber } = useFormatters();
  const navigate = useNavigate();
  const { openChat } = useMiraChat();
  useDocumentTitle(t("nav.transactions"));

  const {
    listings: ctxListings,
    setPendingContract,
    setActiveListingForContract,
    setContractMode,
    startListingFlow,
    startTransactionFlow,
  } = useTransactions();
  const [pickListingOpen, setPickListingOpen] = useState(false);
  const [pickedListingId, setPickedListingId] = useState<string>("");

  const startContractForListing = async (listingId: string) => {
    const listing = ctxListings.find((l) => l.id === listingId);
    if (!listing) {
      toast.error("Listing not found");
      return;
    }
    toast.loading("Extracting contract...", { id: "extract-contract" });
    const contract = await mockExtractContract("Contract.pdf", listing);
    setActiveListingForContract(listing);
    setPendingContract(contract);
    setContractMode("verifying");
    toast.success("Contract ready for review", { id: "extract-contract" });
    navigate(`/business/new-contract/${listing.id}`);
  };

  const [period, setPeriod] = useState<Period>("quarterly");
  const d = PIPELINE_BY_PERIOD[period];
  const total = d.inProgress + d.closed + d.paid + d.canceled;

  // Mock summary metrics
  const pendingValue = 1290000;
  const pendingCommission = 38700;
  const readyToSend = 3;
  const daIssued = 2;
  const totalPotentialPayout = 110000;
  const pendingPayout = 67000;
  const payoutProgress = 25;
  const needDocsCount = 2;
  const processingCount = 1;

  const [sourceTab, setSourceTab] = useState<SourceTab>("listings");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [officeFilter, setOfficeFilter] = useState<string>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");
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
        <p className="text-[11px] text-muted-foreground mb-0.5">{label}</p>
        {isEditing ? (
          <Input
            value={value}
            onChange={(e) => setVerifyField(fieldKey, e.target.value)}
            className={`h-8 text-xs rounded-lg ${numeric ? "tabular-nums" : ""}`}
            placeholder={placeholder}
          />
        ) : (
          <p
            className={`text-xs font-medium ${value ? "text-foreground" : "text-muted-foreground"} ${numeric ? "tabular-nums" : ""} truncate`}
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

  const [listings, setListings] = useState<ListingRow[]>(INITIAL_LISTINGS);

  const handleCreateListing = () => {
    const address = `${verifyValues.streetNumber} ${verifyValues.streetAddress}`.trim();
    const city = [verifyValues.city, verifyValues.state].filter(Boolean).join(", ") +
      (verifyValues.zip ? ` ${verifyValues.zip}` : "");
    const newRow: ListingRow = {
      id: `new-${Date.now()}`,
      mlsNumber: verifyValues.mlsNumber || "N/A",
      propertyAddress: address || "New Listing",
      propertyCity: city.trim() || "—",
      status: "Active",
      listingAgent: verifyValues.sellerName || "—",
      office: verifyValues.office || "Main Office",
      expirationDate: formatDateMDY(verifyValues.expirationDate),
      listingPrice: parsePriceToNumber(verifyValues.listingPrice),
      stage: "Active",
      stageVariant: "default",
    };
    setListings((prev) => [newRow, ...prev]);
    setCreateOpen(false);
    setCreateStage("upload");
    setFiles([]);
    setSourceTab("listings");
    setStatusFilter("all");
    setVerifyValues((prev) => ({ ...prev, checklistType: "" }));
    toast.success("Listing created", { description: address || "New listing added to your dashboard." });
  };

  const filteredListings = useMemo(() => {
    return listings.filter((row) => {
      if (statusFilter !== "all") {
        const s = row.status.toLowerCase();
        if (statusFilter === "active" && s !== "active") return false;
        if (statusFilter === "pending" && !["incomplete", "canceled/pend"].includes(s)) return false;
        if (statusFilter === "closed" && s !== "expired") return false;
      }
      if (officeFilter !== "all" && row.office !== officeFilter) return false;
      if (agentFilter !== "all" && row.listingAgent !== agentFilter) return false;
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
  }, [listings, statusFilter, officeFilter, agentFilter, search]);

  const officeOptions = useMemo(
    () => Array.from(new Set(listings.map((l) => l.office))).sort(),
    [listings],
  );
  const agentOptions = useMemo(
    () => Array.from(new Set(listings.map((l) => l.listingAgent))).sort(),
    [listings],
  );

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
            <DropdownMenuItem onSelect={() => navigate(`/business/listings/${row.id}`, { state: { row } })}>{t("transactions.viewDetails")}</DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                void startContractForListing(row.id);
              }}
            >
              Convert to Transaction
            </DropdownMenuItem>
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
                onSelect={() => {
                  startListingFlow();
                  openChat();
                }}
                className="rounded-xl gap-3 px-3 py-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <HomeIcon className="h-4 w-4" />
                </span>
                <span className="font-medium">Create Listing</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  startTransactionFlow();
                  openChat();
                }}
                className="rounded-xl gap-3 px-3 py-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <DollarIcon className="h-4 w-4" />
                </span>
                <span className="font-medium">Create Transaction</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </UniversalFilterBar>


        {/* Pipeline / DA / Settlement stat row — Coming Soon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: t("transactions.activePipeline") ?? "Active Pipeline", className: "rounded-2xl bg-card" },
            { label: "Send DA", className: "rounded-2xl border-exp-gold/30 bg-exp-gold/5" },
            { label: "Settlement", className: "rounded-2xl border-exp-green/30 bg-exp-green/5" },
          ].map((c) => (
            <Card key={c.label} className={c.className}>
              <div className="p-5 min-h-[220px] flex flex-col items-center justify-center text-center gap-2">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {c.label}
                </span>
                <Badge variant="outline" className="rounded-[51px] text-[10px]">In Progress</Badge>
                <p className="text-sm text-muted-foreground max-w-[220px]">
                  Coming soon — this feature is currently in development.
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Single-row filter bar */}
        {(() => {
          const [dateFilter, setDateFilter] = [undefined, undefined] as any; // placeholder, real state below
          return null;
        })()}
        <div className="rounded-[32px] border border-border/60 bg-card p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex-1 min-w-[220px]">
              <SearchFilter
                value={search}
                onChange={setSearch}
                placeholder={t("transactions.searchProperties")}
              />
            </div>

            <div className="h-8 w-px bg-border mx-1 hidden md:block" />

            <Tabs value={sourceTab} onValueChange={(v) => setSourceTab(v as SourceTab)}>
              <TabsList className="h-11 p-1 rounded-[51px] bg-muted">
                <TabsTrigger value="all" className="rounded-[51px] px-4 py-1.5 font-normal data-[state=active]:font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  All
                </TabsTrigger>
                <TabsTrigger value="listings" className="rounded-[51px] px-4 py-1.5 gap-2 font-normal data-[state=active]:font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <HomeIcon className="h-4 w-4" />
                  {t("transactions.tabListings")}
                </TabsTrigger>
                <TabsTrigger value="transactions" className="rounded-[51px] px-4 py-1.5 gap-2 font-normal data-[state=active]:font-medium data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm">
                  <DollarIcon className="h-4 w-4" />
                  {t("transactions.tabTransactions")}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Inline pill dropdowns */}
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <SelectTrigger className={`rounded-[51px] h-11 px-4 w-auto gap-2 bg-background ${statusFilter !== "all" ? "border-primary text-primary" : ""}`}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {(["all", "active", "pending", "closed"] as StatusFilter[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {t(`transactions.filter.${key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={officeFilter} onValueChange={setOfficeFilter}>
              <SelectTrigger className={`rounded-[51px] h-11 px-4 w-auto gap-2 bg-background ${officeFilter !== "all" ? "border-primary text-primary" : ""}`}>
                <SelectValue placeholder="Office" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All offices</SelectItem>
                {officeOptions.map((o) => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className={`rounded-[51px] h-11 px-4 w-auto gap-2 bg-background ${agentFilter !== "all" ? "border-primary text-primary" : ""}`}>
                <SelectValue placeholder="Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All agents</SelectItem>
                {agentOptions.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-[51px] h-11 gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  More filters
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 rounded-2xl">
                <p className="text-sm text-muted-foreground">
                  Date range and additional filters — coming soon.
                </p>
              </PopoverContent>
            </Popover>
          </div>

          {/* Active filter chips */}
          {(statusFilter !== "all" || officeFilter !== "all" || agentFilter !== "all" || sourceTab !== "all") && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/60">
              {sourceTab !== "all" && (
                <Badge variant="secondary" className="rounded-[51px] h-8 px-3 gap-1.5 font-medium">
                  {sourceTab === "listings" ? t("transactions.tabListings") : t("transactions.tabTransactions")}
                  <button onClick={() => setSourceTab("all")} aria-label="Clear source filter" className="ms-1 -me-1 p-0.5 rounded-full hover:bg-background/60">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="rounded-[51px] h-8 px-3 gap-1.5 font-medium">
                  Status: {t(`transactions.filter.${statusFilter}`)}
                  <button onClick={() => setStatusFilter("all")} aria-label="Clear status filter" className="ms-1 -me-1 p-0.5 rounded-full hover:bg-background/60">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {officeFilter !== "all" && (
                <Badge variant="secondary" className="rounded-[51px] h-8 px-3 gap-1.5 font-medium">
                  Office: {officeFilter}
                  <button onClick={() => setOfficeFilter("all")} aria-label="Clear office filter" className="ms-1 -me-1 p-0.5 rounded-full hover:bg-background/60">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {agentFilter !== "all" && (
                <Badge variant="secondary" className="rounded-[51px] h-8 px-3 gap-1.5 font-medium">
                  Agent: {agentFilter}
                  <button onClick={() => setAgentFilter("all")} aria-label="Clear agent filter" className="ms-1 -me-1 p-0.5 rounded-full hover:bg-background/60">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="ms-auto h-8 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setSourceTab("all");
                  setStatusFilter("all");
                  setOfficeFilter("all");
                  setAgentFilter("all");
                }}
              >
                Clear all
              </Button>
            </div>
          )}
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
          if (o) {
            setVerifyValues((prev) => ({ ...prev, checklistType: "" }));
          }
          if (!o) {
            setFiles([]);
            setIsDragging(false);
            setCreateStage("upload");
          }
        }}
      >
        <DialogContent className={`${createStage === "verification" ? "sm:max-w-[1280px] h-[92vh] flex flex-col" : "sm:max-w-md"} rounded-2xl border-border/60 p-0 overflow-hidden`}>
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
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden min-h-0">
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

                    <div className="flex-1 min-h-0 overflow-y-auto ps-10 pe-4 py-4 space-y-4 text-sm">
                      {(() => {
                        const incomplete = sections[0].incomplete;
                        return (
                          <div
                            id="verify-card-office"
                            className={`rounded-2xl p-4 transition-colors ${
                              incomplete
                                ? "border-2 border-amber-400/60 bg-amber-50/60 dark:bg-amber-500/5"
                                : "border border-border/60 bg-card"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div>
                                <span
                                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5 ${
                                    incomplete
                                      ? "bg-amber-200/80 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300"
                                      : "bg-primary/10 text-primary"
                                  }`}
                                >
                                  Required
                                </span>
                                <h4 className="text-sm font-bold text-foreground">Office & Checklist</h4>
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
                            <div className="grid grid-cols-1 gap-x-4 gap-y-3">
                              {renderField("Office", "office", "office")}
                              <div>
                                <div className="flex items-center justify-between mb-0.5">
                                  <p className="text-[11px] text-muted-foreground">Checklist type</p>
                                  {verifyValues.checklistType.trim() && (
                                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                      <Check className="h-3 w-3" />
                                      Done
                                    </span>
                                  )}
                                </div>
                                <Select
                                  value={verifyValues.checklistType}
                                  onValueChange={(v) => setVerifyField("checklistType", v)}
                                >
                                  <SelectTrigger className="h-8 text-xs rounded-lg">
                                    <SelectValue placeholder="Choose a checklist type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {CHECKLIST_TYPES.map((opt) => (
                                      <SelectItem key={opt} value={opt} className="text-xs">
                                        {opt}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      <div id="verify-card-propertyCore" className="rounded-2xl border border-border/60 bg-card p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                              Required
                            </span>
                            <h4 className="text-sm font-bold text-foreground">Property Core</h4>
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

                      <div id="verify-card-listingTerms" className="rounded-2xl border border-border/60 bg-card p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="inline-block bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                              Required
                            </span>
                            <h4 className="text-sm font-bold text-foreground">Listing Terms</h4>
                          </div>
                          {renderEditToggle("listingTerms")}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                          {renderField("Listing Price", "listingPrice", "listingTerms", { numeric: true })}
                          {renderField("Start Date", "startDate", "listingTerms")}
                          {renderField("Expiration Date", "expirationDate", "listingTerms")}
                        </div>
                      </div>

                      <div id="verify-card-seller" className="rounded-2xl border border-border/60 bg-card p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="inline-block bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                              Optional
                            </span>
                            <h4 className="text-sm font-bold text-foreground">Seller Information</h4>
                          </div>
                          {renderEditToggle("seller")}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                          {renderField("Name", "sellerName", "seller")}
                          {renderField("Email", "sellerEmail", "seller")}
                          {renderField("Phone", "sellerPhone", "seller", { numeric: true })}
                        </div>
                      </div>

                      <div id="verify-card-propertyDetails" className="rounded-2xl border border-border/60 bg-card p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="inline-block bg-muted text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1.5">
                              Optional
                            </span>
                            <h4 className="text-sm font-bold text-foreground">Property details</h4>
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
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCreateOpen(false);
                        toast("Draft saved", { description: "Your listing was saved as a draft." });
                      }}
                    >
                      Save as Draft
                    </Button>
                    <Button onClick={handleCreateListing} disabled={!canCreate}>
                      Create Listing
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Listing picker for Create Transaction flow */}
      <Dialog open={pickListingOpen} onOpenChange={setPickListingOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Create Transaction</DialogTitle>
            <DialogDescription>Select the listing this transaction is for.</DialogDescription>
          </DialogHeader>
          <Select value={pickedListingId} onValueChange={setPickedListingId}>
            <SelectTrigger className="h-11"><SelectValue placeholder="Choose a listing" /></SelectTrigger>
            <SelectContent>
              {ctxListings.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.extraction.propertyAddress} — {l.extraction.city}, {l.extraction.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setPickListingOpen(false)}>Cancel</Button>
            <Button
              disabled={!pickedListingId}
              onClick={() => {
                const id = pickedListingId;
                setPickListingOpen(false);
                setPickedListingId("");
                void startContractForListing(id);
              }}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

