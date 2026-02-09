import { useState, useMemo } from "react";
import { Download, Search, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const cappingHistoryData = [
  { startDate: "01/01/2026", endDate: "12/31/2026", capReached: "-", capPercentage: "3.01%" },
  { startDate: "01/01/2025", endDate: "12/31/2025", capReached: "05/14/2025", capPercentage: "100%" },
  { startDate: "01/01/2024", endDate: "12/31/2024", capReached: "03/15/2024", capPercentage: "100%" },
  { startDate: "01/01/2023", endDate: "12/31/2023", capReached: "07/26/2023", capPercentage: "100%" },
  { startDate: "10/19/2021", endDate: "12/31/2022", capReached: "-", capPercentage: "0%" },
];

type SortKey = "startDate" | "endDate" | "capReached" | "capPercentage";
type SortDir = "asc" | "desc";

function parseDate(s: string): Date {
  if (s === "-") return new Date(9999, 0, 1);
  const [m, d, y] = s.split("/").map(Number);
  return new Date(y, m - 1, d);
}

function isActiveRow(startDate: string, endDate: string) {
  const now = new Date();
  return now >= parseDate(startDate) && now <= parseDate(endDate);
}

function getCapColor(pct: string) {
  const val = parseFloat(pct);
  if (val >= 100) return "text-exp-green font-semibold";
  if (val === 0) return "text-muted-foreground";
  return "text-exp-blue font-medium";
}

export function CappingHistoryTable() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else { setSortKey(null); setSortDir("asc"); }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  };

  const sortedData = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = cappingHistoryData.filter((row) => {
      if (!q) return true;
      const capLabel = row.capReached === "-" ? "in progress" : row.capReached;
      return [row.startDate, row.endDate, capLabel, row.capPercentage]
        .some((v) => v.toLowerCase().includes(q));
    });
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "capPercentage") {
        cmp = parseFloat(a.capPercentage) - parseFloat(b.capPercentage);
      } else {
        cmp = parseDate(a[sortKey]).getTime() - parseDate(b[sortKey]).getTime();
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [search, sortKey, sortDir]);

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">History</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 w-[130px] pl-7 text-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-7">
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <span className="text-xs text-muted-foreground">
            {sortedData.length}
          </span>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {([
                  ["startDate", "Start Date"],
                  ["endDate", "End Date"],
                  ["capReached", "Cap Reached"],
                  ["capPercentage", "Cap %"],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <TableHead
                    key={key}
                    className="font-semibold min-w-[100px] text-xs h-9 px-3 cursor-pointer select-none"
                    onClick={() => handleSort(key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {label}
                      <SortIcon col={key} />
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row, i) => {
                const active = isActiveRow(row.startDate, row.endDate);
                return (
                  <TableRow key={i} className={active ? "bg-primary/5 border-l-2 border-l-primary" : ""}>
                    <TableCell className="py-2 px-3 text-xs">{row.startDate}</TableCell>
                    <TableCell className="py-2 px-3 text-xs">{row.endDate}</TableCell>
                    <TableCell className="py-2 px-3 text-xs">
                      {row.capReached === "-" ? (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">In Progress</Badge>
                      ) : row.capReached}
                    </TableCell>
                    <TableCell className={`py-2 px-3 text-xs ${getCapColor(row.capPercentage)}`}>
                      {row.capPercentage}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

export const CappingHistorySection = CappingHistoryTable;
