import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function CappingHistoryTable() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    capReached: "",
    capPercentage: "",
  });

  const filteredData = cappingHistoryData.filter((row) => (
    row.startDate.toLowerCase().includes(filters.startDate.toLowerCase()) &&
    row.endDate.toLowerCase().includes(filters.endDate.toLowerCase()) &&
    row.capReached.toLowerCase().includes(filters.capReached.toLowerCase()) &&
    row.capPercentage.toLowerCase().includes(filters.capPercentage.toLowerCase())
  ));

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">History</h3>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 text-xs h-7">
            <Download className="h-3 w-3" />
            Download
          </Button>
          <span className="text-xs text-muted-foreground">
            {filteredData.length} Results
          </span>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold min-w-[110px] text-xs h-9 px-3">Start Date</TableHead>
                <TableHead className="font-semibold min-w-[110px] text-xs h-9 px-3">End Date</TableHead>
                <TableHead className="font-semibold min-w-[110px] text-xs h-9 px-3">Cap Reached</TableHead>
                <TableHead className="font-semibold min-w-[100px] text-xs h-9 px-3">Cap %</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="py-1.5 px-3">
                  <Input
                    placeholder="Contains"
                    value={filters.startDate}
                    onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))}
                    className="h-7 text-xs"
                  />
                </TableHead>
                <TableHead className="py-1.5 px-3">
                  <Input
                    placeholder="Contains"
                    value={filters.endDate}
                    onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))}
                    className="h-7 text-xs"
                  />
                </TableHead>
                <TableHead className="py-1.5 px-3">
                  <Input
                    placeholder="Contains"
                    value={filters.capReached}
                    onChange={(e) => setFilters((p) => ({ ...p, capReached: e.target.value }))}
                    className="h-7 text-xs"
                  />
                </TableHead>
                <TableHead className="py-1.5 px-3">
                  <Input
                    placeholder="Contains"
                    value={filters.capPercentage}
                    onChange={(e) => setFilters((p) => ({ ...p, capPercentage: e.target.value }))}
                    className="h-7 text-xs"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="py-2 px-3 text-xs">{row.startDate}</TableCell>
                  <TableCell className="py-2 px-3 text-xs">{row.endDate}</TableCell>
                  <TableCell className="py-2 px-3 text-xs">{row.capReached}</TableCell>
                  <TableCell className="py-2 px-3 text-xs">{row.capPercentage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

// Keep backward compat
export const CappingHistorySection = CappingHistoryTable;
