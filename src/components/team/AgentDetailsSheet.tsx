import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Columns3, Search, User, Calendar, CheckCircle, DollarSign, Percent, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { agentDetails, type AgentDetail } from "@/data/mockData";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { exportToCsv, type CsvColumnDef } from "@/lib/csv-export";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type SortKey = "agentName" | "active" | "teamMemberEffectiveDate" | "capResetDate" | "closedTransactions" | "salesVolume" | "companyDollarPaidThrough" | "capPercent";
type SortDir = "asc" | "desc";
type ColumnId = SortKey;

interface AgentDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ColumnConfig {
  id: ColumnId;
  label: string;
  icon: React.ReactNode;
  alwaysOn?: boolean;
  type: "string" | "number" | "currency" | "percent";
}

const csvColumns: CsvColumnDef<AgentDetail>[] = [
  { key: "agentName", header: "Agent Name", type: "string" },
  { key: "active", header: "Active", type: "string" },
  { key: "teamMemberEffectiveDate", header: "Team Member Effective Date", type: "date" },
  { key: "capResetDate", header: "Cap Reset Date", type: "date" },
  { key: "closedTransactions", header: "Closed Transactions", type: "number" },
  { key: "salesVolume", header: "Sales Volume", type: "currency" },
  { key: "companyDollarPaidThrough", header: "Company Dollar Paid Through", type: "currency" },
  { key: "capPercent", header: "Cap %", type: "number" },
];

export function AgentDetailsSheet({ open, onOpenChange }: AgentDetailsSheetProps) {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatters();

  const [sortKey, setSortKey] = useState<SortKey>("agentName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Set<ColumnId>>(
    new Set(["agentName", "active", "teamMemberEffectiveDate", "capResetDate", "closedTransactions", "salesVolume", "companyDollarPaidThrough", "capPercent"])
  );

  const columns: ColumnConfig[] = [
    { id: "agentName", label: t("team.agentName"), icon: <User className="h-3.5 w-3.5" />, alwaysOn: true, type: "string" },
    { id: "active", label: t("team.active"), icon: <CheckCircle className="h-3.5 w-3.5" />, type: "string" },
    { id: "teamMemberEffectiveDate", label: t("team.teamMemberEffectiveDate"), icon: <Calendar className="h-3.5 w-3.5" />, type: "string" },
    { id: "capResetDate", label: t("team.capResetDateCol"), icon: <Calendar className="h-3.5 w-3.5" />, type: "string" },
    { id: "closedTransactions", label: t("team.closedTransactions"), icon: <BarChart3 className="h-3.5 w-3.5" />, type: "number" },
    { id: "salesVolume", label: t("team.salesVolume"), icon: <DollarSign className="h-3.5 w-3.5" />, type: "currency" },
    { id: "companyDollarPaidThrough", label: t("team.companyDollarPaidThrough"), icon: <DollarSign className="h-3.5 w-3.5" />, type: "currency" },
    { id: "capPercent", label: "Cap %", icon: <Percent className="h-3.5 w-3.5" />, type: "percent" },
  ];

  const toggleCol = (id: ColumnId) => {
    setVisibleCols((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return agentDetails;
    const q = search.toLowerCase();
    return agentDetails.filter((a) => a.agentName.toLowerCase().includes(q));
  }, [search]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const pageData = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const activeColumns = columns.filter((c) => visibleCols.has(c.id));

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <span className="text-[10px] opacity-40 leading-none">◇</span>;
    return sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />;
  };

  const renderCell = (agent: AgentDetail, colId: ColumnId) => {
    switch (colId) {
      case "agentName":
        return <span className="font-medium text-foreground">{agent.agentName}</span>;
      case "active":
        return (
          <Badge variant={agent.active === "Yes" ? "default" : "secondary"} className="text-xs">
            {agent.active}
          </Badge>
        );
      case "teamMemberEffectiveDate":
        return <span>{agent.teamMemberEffectiveDate}</span>;
      case "capResetDate":
        return <span>{agent.capResetDate}</span>;
      case "closedTransactions":
        return <span className="tabular-nums font-secondary">{agent.closedTransactions}</span>;
      case "salesVolume":
        return <span className="tabular-nums font-secondary">{formatCurrency(agent.salesVolume)}</span>;
      case "companyDollarPaidThrough":
        return <span className="tabular-nums font-secondary">{formatCurrency(agent.companyDollarPaidThrough)}</span>;
      case "capPercent":
        return <span className="tabular-nums font-secondary">{agent.capPercent}%</span>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-none flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">{t("team.agentDetails")}</SheetTitle>
          </div>
        </SheetHeader>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-border shrink-0 space-y-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setColumnsOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors",
                  columnsOpen ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Columns3 className="h-4 w-4" />
                Columns
              </button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-full"
                onClick={() => exportToCsv(sorted, csvColumns, "agent-details")}
              >
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
            <div className="relative w-56">
              <Input
                placeholder="Search Agents"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="h-9 pe-9"
              />
              <Search className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Column chips */}
          <AnimatePresence>
            {columnsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-3">
                  {columns.map((col) => {
                    const isOn = visibleCols.has(col.id);
                    const disabled = col.alwaysOn;
                    return (
                      <button
                        key={col.id}
                        disabled={disabled}
                        onClick={() => !disabled && toggleCol(col.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                          isOn
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted/60 text-muted-foreground border-border hover:border-primary/40",
                          disabled && "opacity-70 cursor-not-allowed"
                        )}
                      >
                        {col.icon}
                        {col.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6">
          <table className="w-full text-sm" style={{ tableLayout: "auto" }}>
            <thead className="sticky top-0 z-10">
              <tr className="bg-muted/60 border-b border-border">
                <AnimatePresence mode="popLayout">
                  {activeColumns.map((col) => (
                    <motion.th
                      key={col.id}
                      layout
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className={cn(
                        "py-3 px-4 text-body font-medium text-muted-foreground whitespace-nowrap overflow-hidden cursor-pointer select-none hover:text-foreground",
                        (col.type === "number" || col.type === "currency" || col.type === "percent") ? "text-end" : "text-start"
                      )}
                      onClick={() => handleSort(col.id)}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {col.label}
                        <SortIcon col={col.id} />
                      </span>
                    </motion.th>
                  ))}
                </AnimatePresence>
              </tr>
            </thead>
            <tbody>
              {pageData.map((agent) => (
                <tr key={agent.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <AnimatePresence mode="popLayout">
                    {activeColumns.map((col) => (
                      <motion.td
                        key={col.id}
                        layout
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className={cn(
                          "py-3 px-4 overflow-hidden",
                          col.type !== "string" && "text-end"
                        )}
                      >
                        {renderCell(agent, col.id)}
                      </motion.td>
                    ))}
                  </AnimatePresence>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-6 py-3 border-t border-border flex items-center justify-between shrink-0 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{t("team.rowsPerPage")}</span>
            <Select
              value={String(rowsPerPage)}
              onValueChange={(v) => { setRowsPerPage(Number(v)); setPage(1); }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {t("team.pageOf").replace("{page}", String(page)).replace("{total}", String(totalPages))}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
