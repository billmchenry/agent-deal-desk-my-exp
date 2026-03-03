import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UniversalFilterBar } from "@/components/filters";
import { DataTable, type ColumnDef } from "@/components/shared/DataTable";
import { TransactionDetailsSheet } from "@/components/agent/TransactionDetailsSheet";
import { type Transaction, transactionsData } from "@/components/agent/MasterTransactionTable";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { Badge } from "@/components/ui/badge";
import { DropdownFilter } from "@/components/filters/DropdownFilter";
import { SearchFilter } from "@/components/filters/SearchFilter";

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

export default function Transactions() {
  const { t } = useTranslation();
  const { formatCurrency, formatDate } = useFormatters();
  useDocumentTitle(t("txn.agentProductionDetails"));

  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "all";

  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [search, setSearch] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Filter data by status (top-level filter bar)
  // Filter by status and search (search across all data, not just visible page)
  const filteredData = transactionsData.filter((r) => {
    if (statusFilter !== "all" && r.status.toLowerCase() !== statusFilter) return false;
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

  const statusOptions = [
    { value: "all", label: t("txn.allStatuses") },
    { value: "paid", label: t("txn.paid") },
    { value: "pending", label: t("txn.pending") },
    { value: "withdrawn", label: t("txn.withdrawn") },
  ];

  const columns: ColumnDef<Transaction>[] = [
    { key: "status", header: "txn.status", type: "badge", sortable: true, filterable: true },
    { key: "transactionId", header: "txn.transactionId", type: "string", sortable: true },
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
    { key: "salesPrice", header: "txn.salePrice", type: "currency", sortable: true },
    { key: "gciSum", header: "txn.gci", type: "currency", sortable: true },
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
    { key: "firstCap", header: "txn.amtTowardCap", type: "string", sortable: true },
    // Hidden by default
    { key: "paymentSettledDate", header: "txn.paymentSettledDate", type: "date", sortable: true, defaultVisible: false },
    { key: "transactionType", header: "txn.transactionType", type: "string", sortable: true, filterable: true, defaultVisible: false },
    { key: "currency", header: "txn.currency", type: "string", sortable: true, defaultVisible: false },
    { key: "isBuyerAgent", header: "txn.buyerAgent", type: "string", sortable: true, defaultVisible: false },
    { key: "coAgentPercentage", header: "txn.coAgentPct", type: "string", sortable: true, defaultVisible: false },
    { key: "agentPayablePercentage", header: "txn.agentPayablePct", type: "string", sortable: true, defaultVisible: false },
    { key: "agentNetCommission", header: "txn.agentNetCommission", type: "currency", sortable: true, defaultVisible: false },
    { key: "companyCommission", header: "txn.companyCommission", type: "currency", sortable: true, defaultVisible: false },
    { key: "netPayment", header: "txn.netPayment", type: "currency", sortable: true, defaultVisible: false },
    { key: "brokerReviewFee", header: "txn.brokerReviewFee", type: "currency", sortable: true, defaultVisible: false },
    { key: "transactionCoordinatorFee", header: "txn.tcFee", type: "currency", sortable: true, defaultVisible: false },
    { key: "mentorFee", header: "txn.mentorFee", type: "currency", sortable: true, defaultVisible: false },
  ];

  const handleRowClick = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setSheetOpen(true);
  };

  const mobileCardRender = (row: Transaction) => {
    const closeDate = row.actualCloseDate !== "-" ? row.actualCloseDate : row.scheduledCloseDate;
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          {getStatusBadge(row.status)}
          <span className="text-xs text-muted-foreground font-mono">{row.transactionId}</span>
        </div>
        <p className="text-sm truncate text-foreground">{row.propertyAddress}</p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{formatDate(closeDate)}</span>
          <span className="font-semibold text-foreground">{formatCurrency(row.salesPrice)}</span>
          <span>GCI: {formatCurrency(row.gciSum)}</span>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <UniversalFilterBar title={t("txn.agentProductionDetails")}>
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
