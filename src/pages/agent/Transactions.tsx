import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UniversalFilterBar, DateRange } from "@/components/filters";
import { DataTable, type ColumnDef } from "@/components/shared/DataTable";
import { TransactionDetailsSheet } from "@/components/agent/TransactionDetailsSheet";
import { type Transaction, transactionsData, canadianTransactionsData } from "@/components/agent/MasterTransactionTable";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { Badge } from "@/components/ui/badge";
import { Eye, ChevronDown, Check, SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SearchFilter } from "@/components/filters/SearchFilter";
import { LabeledFilter } from "@/components/filters/LabeledFilter";
import { CanadianDisclaimer } from "@/components/shared/CanadianDisclaimer";
import { useDemoConfig } from "@/contexts/DemoConfigContext";

function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return <Badge className="bg-exp-green/10 text-exp-green border-exp-green/20 hover:bg-exp-green/10">Paid</Badge>;
    case "pending":
      return <Badge className="bg-exp-gold/10 text-exp-gold border-exp-gold/20 hover:bg-exp-gold/10">Pending</Badge>;
    case "withdrawn":
      return <Badge className="bg-muted text-muted-foreground hover:bg-muted">Withdrawn</Badge>;
    case "firm":
      return <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">Firm</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function Transactions() {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = useFormatters();
  const { config } = useDemoConfig();
  const isCanada = config.countryMode === "canada";
  const isGlobal = config.countryMode === "global";
  useDocumentTitle(t("txn.agentProductionDetails"));

  const [searchParams] = useSearchParams();
  const initialStatus = isGlobal ? "paid" : (searchParams.get("status") || "all");

  const [statusFilter, setStatusFilter] = useState<string[]>(initialStatus === "all" ? ["all"] : [initialStatus]);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2026, 0, 1),
    to: new Date(2026, 1, 6),
  });
  const [includePipeline, setIncludePipeline] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleStatusToggle = (value: string) => {
    if (value === "all") {
      setStatusFilter(["all"]);
      return;
    }
    setStatusFilter((prev) => {
      const withoutAll = prev.filter((v) => v !== "all");
      if (withoutAll.includes(value)) {
        const next = withoutAll.filter((v) => v !== value);
        return next.length === 0 ? ["all"] : next;
      }
      return [...withoutAll, value];
    });
  };

  const allStatuses = [
    { value: "initiated", label: "Initiated" },
    { value: "compreview", label: "CompReview" },
    { value: "preda", label: "PreDA" },
    { value: "initialdasent", label: "InitialDASent" },
    { value: "settlement", label: "Settlement" },
    { value: "paid", label: "Paid" },
    { value: "incorrection", label: "InCorrection" },
    { value: "withdrawn", label: "Withdrawn" },
    { value: "cancelled", label: "Cancelled" },
    { value: "withdrawpendingreview", label: "WithdrawPendingReview" },
    { value: "changes_pending_review", label: "Changes_Pending_Review" },
  ];

  const isAllSelected = statusFilter.includes("all");

  const statusLabel = isAllSelected
    ? t("txn.allStatuses")
    : statusFilter.length === 1
      ? allStatuses.find((s) => s.value === statusFilter[0])?.label ?? statusFilter[0]
      : `${statusFilter.length} selected`;

  const sourceData = isCanada ? canadianTransactionsData : transactionsData;

  const filteredData = sourceData.filter((r) => {
    if (isGlobal && r.status.toLowerCase() !== "paid") return false;
    if (!isAllSelected && !statusFilter.includes(r.status.toLowerCase())) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.transactionId.toLowerCase().includes(q) ||
        r.propertyAddress.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.salesPrice.toString().includes(q) ||
        r.gciSum.toString().includes(q)
      );
    }
    return true;
  });


  const columns: ColumnDef<Transaction>[] = [
    { key: "status", header: "txn.status", type: "badge", sortable: true, filterable: true },
    { key: "transactionId", header: "txn.transactionId", type: "string", sortable: true },
    {
      key: "propertyAddress",
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
      header: "txn.closeDate",
      type: "date",
      sortable: true,
      render: (val, row) => {
        const d = row.actualCloseDate !== "-" ? row.actualCloseDate : row.scheduledCloseDate;
        return d === "-" ? "-" : formatDate(d);
      },
    },
    { key: "salesPrice", header: "txn.salePrice", type: "currency", sortable: true, currencyCodeKey: "currency" },
    { key: "gciSum", header: "txn.gci", type: "currency", sortable: true, currencyCodeKey: "currency" },
    { key: "commissionPercentage", header: "txn.commissionPct", type: "string", sortable: true },
    ...(isCanada ? [{ key: "endUnits" as keyof Transaction, header: "txn.endUnits", type: "number" as const, sortable: true }] : []),
    {
      id: "viewDetails",
      key: "transactionId" as keyof Transaction,
      header: "txn.viewDetails",
      type: "string",
      sortable: false,
      stickyRight: true,
      render: (_val, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleRowClick(row); }}
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("txn.viewDetails")}
        </button>
      ),
    },
    // Hidden by default
    { key: "paymentSettledDate", header: "txn.paymentSettledDate", type: "date", sortable: true, defaultVisible: false },
    { key: "transactionType", header: "txn.transactionType", type: "string", sortable: true, filterable: true, defaultVisible: false },
    { key: "currency", header: "txn.currency", type: "string", sortable: true, defaultVisible: false },
    { key: "isBuyerAgent", header: "txn.buyerAgent", type: "string", sortable: true, defaultVisible: false },
    { key: "coAgentPercentage", header: "txn.coAgentPct", type: "string", sortable: true, defaultVisible: false },
    { key: "agentPayablePercentage", header: "txn.agentPayablePct", type: "string", sortable: true, defaultVisible: false },
    { key: "agentNetCommission", header: "txn.agentNetCommission", type: "currency", sortable: true, currencyCodeKey: "currency", defaultVisible: false },
    { key: "companyCommission", header: "txn.companyCommission", type: "currency", sortable: true, currencyCodeKey: "currency", defaultVisible: false },
    { key: "netPayment", header: "txn.netPayment", type: "currency", sortable: true, currencyCodeKey: "currency", defaultVisible: false },
    { key: "brokerReviewFee", header: "txn.brokerReviewFee", type: "currency", sortable: true, currencyCodeKey: "currency", defaultVisible: false },
    { key: "transactionCoordinatorFee", header: "txn.tcFee", type: "currency", sortable: true, currencyCodeKey: "currency", defaultVisible: false },
    { key: "mentorFee", header: "txn.mentorFee", type: "currency", sortable: true, currencyCodeKey: "currency", defaultVisible: false },
  ];

  const handleRowClick = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setSheetOpen(true);
  };

  const mobileCardRender = (row: Transaction) => {
    const closeDate = row.actualCloseDate !== "-" ? row.actualCloseDate : row.scheduledCloseDate;
    return (
      <div className="flex items-start gap-2">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            {getStatusBadge(row.status)}
            <span className="text-xs text-muted-foreground font-mono">{row.transactionId}</span>
          </div>
          <p className="text-sm text-foreground">{row.propertyAddress}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{formatDate(closeDate)}</span>
            <span className="font-semibold text-foreground">{formatCurrency(row.salesPrice)}</span>
            <span>GCI: {formatCurrency(row.gciSum)}</span>
          </div>
        </div>
        <Eye className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <CanadianDisclaimer variant="agent" email="canada.support@exprealty.com" />
        <UniversalFilterBar title={t("txn.agentProductionDetails")} />

        {/* Single-row filter bar */}
        <div className="rounded-[32px] border border-border/60 bg-card p-3 font-secondary [&_*]:font-secondary">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex-1 min-w-[220px]">
              <SearchFilter
                value={search}
                onChange={setSearch}
                placeholder={t("txn.searchTransactions")}
              />
            </div>

            <div className="h-8 w-px bg-border mx-1 hidden md:block" />

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={`inline-flex items-center justify-between gap-2 rounded-[51px] border bg-background px-4 h-11 text-sm hover:bg-muted/50 transition-colors ${!isAllSelected ? "border-primary text-primary" : "border-input"}`}
                >
                  <span className="truncate">{t("txn.status") ?? "Status"}: {statusLabel}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-1">
                <div
                  className="flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-muted text-sm"
                  onClick={() => handleStatusToggle("all")}
                >
                  <Checkbox checked={isAllSelected} className="pointer-events-none" />
                  <span className="font-medium">{t("txn.allStatuses")}</span>
                </div>
                <div className="h-px bg-border my-1" />
                {allStatuses.map((opt) => (
                  <div
                    key={opt.value}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-muted text-sm"
                    onClick={() => handleStatusToggle(opt.value)}
                  >
                    <Checkbox
                      checked={statusFilter.includes(opt.value)}
                      disabled={isAllSelected}
                      className="pointer-events-none"
                    />
                    <span>{opt.label}</span>
                  </div>
                ))}
              </PopoverContent>
            </Popover>

            <UniversalFilterBar.DateRange
              value={dateRange}
              onChange={setDateRange}
              extraContent={!isGlobal ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={includePipeline}
                    onCheckedChange={(checked) => setIncludePipeline(checked === true)}
                  />
                  <span className="text-sm text-foreground">Include All Pipeline</span>
                </label>
              ) : undefined}
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-[51px] h-11 gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  More filters
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 rounded-2xl">
                <p className="text-sm text-muted-foreground">
                  Additional filters — coming soon.
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </div>


        <DataTable
          data={filteredData}
          columns={columns}
          searchableKeys={["transactionId", "propertyAddress", "status"]}
          onRowClick={handleRowClick}
          defaultPageSize={25}
          defaultSort={{ key: "actualCloseDate", direction: "desc" }}
          csvFilename="agent-production-details"
          mobileCardRender={mobileCardRender}
        />

        <TransactionDetailsSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          transaction={selectedTransaction}
        />
      </div>
    </DashboardLayout>
  );
}
