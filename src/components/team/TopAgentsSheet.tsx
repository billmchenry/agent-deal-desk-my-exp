import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { topAgents, type TopAgent } from "@/data/mockData";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { exportToCsv, type CsvColumnDef } from "@/lib/csv-export";
import { cn } from "@/lib/utils";

type TabKey = "units" | "volume" | "commission";
type SortKey = "name" | "units" | "volume" | "commission";
type SortDir = "asc" | "desc";

interface TopAgentsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: TabKey;
}

const csvColumns: CsvColumnDef<TopAgent>[] = [
  { key: "name", header: "Agent Name", type: "string" },
  { key: "units", header: "Units Closed", type: "number" },
  { key: "volume", header: "Sales Volume", type: "currency" },
  { key: "commission", header: "GCI Sum", type: "currency" },
  { key: "currency", header: "Currency", type: "string" },
];

export function TopAgentsSheet({ open, onOpenChange, defaultTab = "units" }: TopAgentsSheetProps) {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatters();

  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);
  const [sortKey, setSortKey] = useState<SortKey>(defaultTab === "volume" ? "volume" : defaultTab === "commission" ? "commission" : "units");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(1);

  // Reset sort when tab changes
  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSortKey(tab === "units" ? "units" : tab === "volume" ? "volume" : "commission");
    setSortDir("desc");
    setPage(1);
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

  const sorted = useMemo(() => {
    const arr = [...topAgents];
    arr.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return arr;
  }, [sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const pageData = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const maxUnits = useMemo(() => Math.max(...topAgents.map((a) => a.units), 1), []);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "units", label: t("team.unitsClosed") },
    { key: "volume", label: t("team.highestVolume") },
    { key: "commission", label: t("team.gciCommission") },
  ];

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronDown className="h-3 w-3 opacity-30" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-none sm:w-[75vw] flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">{t("team.topAgentsFullList")}</SheetTitle>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => exportToCsv(sorted, csvColumns, "top-agents")}
            >
              <Download className="h-4 w-4" />
              {t("team.downloadCsv")}
            </Button>
          </div>
        </SheetHeader>

        {/* Tabs */}
        <div className="px-6 pt-4 pb-2 shrink-0">
          <div className="inline-flex bg-muted/60 backdrop-blur-sm border border-border/50 rounded-full p-1 gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap",
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background z-10">
              <tr className="border-b border-border">
                {([
                  { key: "name" as SortKey, label: t("team.agentName"), align: "text-start" },
                  { key: "units" as SortKey, label: t("team.unitsClosed"), align: "text-end" },
                  { key: "volume" as SortKey, label: t("team.salesVolume"), align: "text-end" },
                  { key: "commission" as SortKey, label: t("team.gciSum"), align: "text-end" },
                  { key: null, label: t("team.currency"), align: "text-end" },
                ] as const).map((col, i) => (
                  <th
                    key={i}
                    className={cn(
                      "py-3 px-2 font-medium text-muted-foreground whitespace-nowrap",
                      col.align,
                      col.key && "cursor-pointer select-none hover:text-foreground"
                    )}
                    onClick={() => col.key && handleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {col.key && <SortIcon col={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageData.map((agent) => (
                <tr key={agent.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {agent.initials.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground truncate">{agent.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-end">
                    <div className="flex items-center justify-end gap-3">
                      <Progress
                        value={(agent.units / maxUnits) * 100}
                        className="h-1.5 w-16 hidden sm:block"
                      />
                      <span className="tabular-nums font-secondary font-medium min-w-[2ch]">{agent.units}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-end tabular-nums font-secondary">
                    {formatCurrency(agent.volume)}
                  </td>
                  <td className="py-3 px-2 text-end tabular-nums font-secondary">
                    {formatCurrency(agent.commission)}
                  </td>
                  <td className="py-3 px-2 text-end text-muted-foreground">
                    {agent.currency}
                  </td>
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
              onValueChange={(v) => {
                setRowsPerPage(Number(v));
                setPage(1);
              }}
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
              className="h-8 w-8"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
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
