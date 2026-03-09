import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UniversalFilterBar } from "@/components/filters";
import { DataTable, type ColumnDef } from "@/components/shared/DataTable";
import { TeamBreakdownSheet } from "@/components/team/TeamBreakdownSheet";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { Badge } from "@/components/ui/badge";
import { SearchFilter } from "@/components/filters/SearchFilter";
import { DateRangeFilter, type DateRange } from "@/components/filters/DateRangeFilter";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CanadianDisclaimer } from "@/components/shared/CanadianDisclaimer";
import { useDemoConfig } from "@/contexts/DemoConfigContext";

export interface TeamTransaction {
  number: number;
  agentName: string;
  uuid: string;
  address: string;
  actualCloseDate: string;
  paymentInitiatedDate: string;
  typeOfProperty: string;
  status: string;
  netCommission: number;
  currency: string;
}

const teamTransactionsData: TeamTransaction[] = [
  { number: 1, agentName: "Michael Thompson", uuid: "1048572.1", address: "1842 Oak Valley Dr, Folsom CA 95630", actualCloseDate: "2025-01-15", paymentInitiatedDate: "2025-01-20", typeOfProperty: "Residential", status: "Paid", netCommission: 9750, currency: "USD" },
  { number: 2, agentName: "Rachel Morrison", uuid: "1048573.1", address: "2910 Sunset Blvd, Sacramento CA 95814", actualCloseDate: "2025-01-22", paymentInitiatedDate: "2025-01-28", typeOfProperty: "Residential", status: "Paid", netCommission: 12300, currency: "USD" },
  { number: 3, agentName: "Daniel Crawford", uuid: "1048574.1", address: "455 Maple Ln, Elk Grove CA 95624", actualCloseDate: "2025-02-03", paymentInitiatedDate: "2025-02-10", typeOfProperty: "Commercial", status: "Paid", netCommission: 18500, currency: "USD" },
  { number: 4, agentName: "Amanda Chen-Rodriguez", uuid: "1048575.1", address: "780 Pine Ridge Ct, Roseville CA 95661", actualCloseDate: "2025-02-14", paymentInitiatedDate: "2025-02-20", typeOfProperty: "Residential", status: "Pending", netCommission: 8200, currency: "USD" },
  { number: 5, agentName: "Marcus Anthony Blake", uuid: "1048576.1", address: "1204 Cedar Park Way, Rocklin CA 95677", actualCloseDate: "2025-02-28", paymentInitiatedDate: "-", typeOfProperty: "Residential", status: "Pending", netCommission: 11400, currency: "USD" },
  { number: 6, agentName: "Jennifer Walsh", uuid: "1048577.1", address: "3301 Riverfront Dr, West Sacramento CA 95691", actualCloseDate: "2025-03-05", paymentInitiatedDate: "2025-03-12", typeOfProperty: "Commercial", status: "Paid", netCommission: 22100, currency: "USD" },
  { number: 7, agentName: "Michael Thompson", uuid: "1048578.1", address: "567 Birch Ave, Davis CA 95616", actualCloseDate: "2025-03-12", paymentInitiatedDate: "-", typeOfProperty: "Residential", status: "Withdrawn", netCommission: 6800, currency: "CAD" },
  { number: 8, agentName: "Rachel Morrison", uuid: "1048579.1", address: "890 Lakeshore Blvd, Granite Bay CA 95746", actualCloseDate: "2025-03-20", paymentInitiatedDate: "2025-03-25", typeOfProperty: "Residential", status: "Paid", netCommission: 15750, currency: "USD" },
  { number: 9, agentName: "Daniel Crawford", uuid: "1048580.1", address: "2100 Capitol Mall, Sacramento CA 95811", actualCloseDate: "2025-04-01", paymentInitiatedDate: "-", typeOfProperty: "Commercial", status: "Pending", netCommission: 31200, currency: "USD" },
  { number: 10, agentName: "Amanda Chen-Rodriguez", uuid: "1048581.1", address: "445 Willow Creek Rd, Lincoln CA 95648", actualCloseDate: "2025-04-10", paymentInitiatedDate: "2025-04-15", typeOfProperty: "Residential", status: "Paid", netCommission: 7950, currency: "CAD" },
];

function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return <Badge className="bg-exp-green/10 text-exp-green border-exp-green/20 hover:bg-exp-green/10">Paid</Badge>;
    case "pending":
      return <Badge className="bg-exp-gold/10 text-exp-gold border-exp-gold/20 hover:bg-exp-gold/10">Pending</Badge>;
    case "withdrawn":
      return <Badge className="bg-muted text-muted-foreground hover:bg-muted">Withdrawn</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function Reconciliation() {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = useFormatters();
  const navigate = useNavigate();
  const { config } = useDemoConfig();
  const isCanada = config.countryMode === "canada";
  useDocumentTitle(t("team.reconciliation"));

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<TeamTransaction | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const statusOptions = [
    { value: "all", label: t("txn.allStatuses") },
    { value: "paid", label: t("txn.paid") },
    { value: "pending", label: t("txn.pending") },
    { value: "withdrawn", label: t("txn.withdrawn") },
    ...(isCanada ? [{ value: "firm", label: t("txn.firm") }] : []),
  ];

  const filteredData = teamTransactionsData.filter((r) => {
    // Status filter
    if (statusFilter !== "all" && r.status.toLowerCase() !== statusFilter) return false;

    // Date range filter on actualCloseDate
    if (dateRange.from || dateRange.to) {
      const d = new Date(r.actualCloseDate);
      if (dateRange.from && d < dateRange.from) return false;
      if (dateRange.to && d > dateRange.to) return false;
    }

    // Search
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.agentName.toLowerCase().includes(q) ||
      r.uuid.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    );
  }).map((r) => isCanada ? { ...r, currency: "CAD" } : r);

  const columns: ColumnDef<TeamTransaction>[] = [
    { key: "agentName", header: "team.agentName", type: "string", sortable: true, filterable: true },
    
    {
      key: "address",
      header: "txn.address",
      type: "string",
      sortable: true,
      render: (val) => (
        <span className="max-w-[200px] truncate block" title={String(val)}>
          {String(val)}
        </span>
      ),
    },
    {
      key: "actualCloseDate",
      header: "txn.actualCloseDate",
      type: "date",
      sortable: true,
      render: (val) => {
        const s = String(val ?? "");
        return s === "-" ? "-" : formatDate(s);
      },
    },
    {
      key: "paymentInitiatedDate",
      header: "team.paymentInitiatedDate",
      type: "date",
      sortable: true,
      render: (val) => {
        const s = String(val ?? "");
        return s === "-" ? "-" : formatDate(s);
      },
    },
    { key: "status", header: "txn.status", type: "badge", sortable: true, filterable: true },
    { key: "netCommission", header: "team.netCommission", type: "currency", sortable: true, currencyCodeKey: "currency" },
    {
      key: "number" as keyof TeamTransaction,
      header: "team.viewBreakdown",
      type: "string",
      render: (_val, row) => (
        <button
          className="text-primary hover:underline text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTransaction(row);
            setSheetOpen(true);
          }}
        >
          {t("team.viewBreakdown")}
        </button>
      ),
    },
  ];

  const handleRowClick = (txn: TeamTransaction) => {
    setSelectedTransaction(txn);
    setSheetOpen(true);
  };

  const mobileCardRender = (row: TeamTransaction) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        {getStatusBadge(row.status)}
        <span className="text-xs text-muted-foreground font-mono">{row.uuid}</span>
      </div>
      <p className="text-sm font-medium text-foreground">{row.agentName}</p>
      <p className="text-sm truncate text-muted-foreground">{row.address}</p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{formatCurrency(row.netCommission)} {row.currency}</span>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <CanadianDisclaimer variant="teamLead" email="canada.support@exprealty.com" />
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("team.backToTeam")}
        </Button>

        <UniversalFilterBar title={t("team.reconciliation")}>
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <DropdownFilter
            label={t("txn.status")}
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <SearchFilter
            value={search}
            onChange={setSearch}
            placeholder={t("txn.searchTransactions")}
          />
        </UniversalFilterBar>

        <DataTable
          data={filteredData}
          columns={columns}
          searchableKeys={["agentName", "uuid", "address", "status"]}
          onRowClick={handleRowClick}
          defaultPageSize={25}
          defaultSort={{ key: "number", direction: "asc" }}
          csvFilename="team-reconciliation"
          mobileCardRender={mobileCardRender}
        />

        <TeamBreakdownSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          transaction={selectedTransaction}
        />
      </div>
    </DashboardLayout>
  );
}
