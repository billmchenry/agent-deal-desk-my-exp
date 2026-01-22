import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Download, MoreVertical } from "lucide-react";
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
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Mock data for capping history
const cappingHistoryData = [
  {
    startDate: "01/01/2026",
    endDate: "12/31/2026",
    capReached: "-",
    capPercentage: "3.01%",
  },
  {
    startDate: "01/01/2025",
    endDate: "12/31/2025",
    capReached: "05/14/2025",
    capPercentage: "100%",
  },
  {
    startDate: "01/01/2024",
    endDate: "12/31/2024",
    capReached: "03/15/2024",
    capPercentage: "100%",
  },
  {
    startDate: "01/01/2023",
    endDate: "12/31/2023",
    capReached: "07/26/2023",
    capPercentage: "100%",
  },
  {
    startDate: "10/19/2021",
    endDate: "12/31/2022",
    capReached: "-",
    capPercentage: "0%",
  },
];

export default function CappingHistory() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    capReached: "",
    capPercentage: "",
  });

  const filteredData = cappingHistoryData.filter((row) => {
    return (
      row.startDate.toLowerCase().includes(filters.startDate.toLowerCase()) &&
      row.endDate.toLowerCase().includes(filters.endDate.toLowerCase()) &&
      row.capReached.toLowerCase().includes(filters.capReached.toLowerCase()) &&
      row.capPercentage.toLowerCase().includes(filters.capPercentage.toLowerCase())
    );
  });

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-foreground mb-4">Agent</h1>

        {/* Back Button + Title */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => navigate("/agent/dashboard")}
            className="flex items-center gap-1 text-foreground hover:text-foreground/80 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-lg font-semibold">Capping History</span>
          </button>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
          <span className="text-muted-foreground">
            {filteredData.length} Results
          </span>
        </div>

        {/* Data Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">
                  <div className="flex items-center justify-between">
                    Start Date
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center justify-between">
                    End Date
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center justify-between">
                    Cap Reached
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold">
                  <div className="flex items-center justify-between">
                    Cap Percentage
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableHead>
              </TableRow>
              {/* Filter Row */}
              <TableRow>
                <TableHead className="py-2">
                  <Input
                    placeholder="Contains"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    className="h-8 text-sm"
                  />
                </TableHead>
                <TableHead className="py-2">
                  <Input
                    placeholder="Contains"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                    className="h-8 text-sm"
                  />
                </TableHead>
                <TableHead className="py-2">
                  <Input
                    placeholder="Contains"
                    value={filters.capReached}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, capReached: e.target.value }))
                    }
                    className="h-8 text-sm"
                  />
                </TableHead>
                <TableHead className="py-2">
                  <Input
                    placeholder="Contains"
                    value={filters.capPercentage}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, capPercentage: e.target.value }))
                    }
                    className="h-8 text-sm"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.startDate}</TableCell>
                  <TableCell>{row.endDate}</TableCell>
                  <TableCell>{row.capReached}</TableCell>
                  <TableCell>{row.capPercentage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
