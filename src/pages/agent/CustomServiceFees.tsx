import { useState } from "react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UniversalFilterBar, DateRange } from "@/components/filters";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronRight, Download, FileText } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { exportToCsv, CsvColumnDef } from "@/lib/csv-export";

interface ServiceFeeTransaction {
  transactionId: string;
  closeDate: string;
  customServiceFee: number;
}

interface ServiceFeeAgent {
  id: string;
  agentName: string;
  transactions: number;
  totalFees: number;
  details: ServiceFeeTransaction[];
}

const mockServiceFeeAgents: ServiceFeeAgent[] = [
  { id: "1", agentName: "Jessica Ana Rodriguez", transactions: 1, totalFees: 250, details: [{ transactionId: "3390015", closeDate: "02/03/2026", customServiceFee: 250 }] },
  { id: "2", agentName: "Michael H Collier PA", transactions: 1, totalFees: 250, details: [{ transactionId: "3390042", closeDate: "02/10/2026", customServiceFee: 250 }] },
  { id: "3", agentName: "Jennifer Wade LLC", transactions: 2, totalFees: 500, details: [{ transactionId: "3390078", closeDate: "02/14/2026", customServiceFee: 250 }, { transactionId: "3390091", closeDate: "02/21/2026", customServiceFee: 250 }] },
  { id: "4", agentName: "Diante Lawrence", transactions: 2, totalFees: 275, details: [{ transactionId: "3390105", closeDate: "02/18/2026", customServiceFee: 150 }, { transactionId: "3390112", closeDate: "02/25/2026", customServiceFee: 125 }] },
  { id: "5", agentName: "Jillian Silk PA", transactions: 3, totalFees: 750, details: [{ transactionId: "3390130", closeDate: "02/05/2026", customServiceFee: 250 }, { transactionId: "3390145", closeDate: "02/15/2026", customServiceFee: 250 }, { transactionId: "3390160", closeDate: "02/28/2026", customServiceFee: 250 }] },
  { id: "6", agentName: "Devin Lofton", transactions: 1, totalFees: 250, details: [{ transactionId: "3390178", closeDate: "02/08/2026", customServiceFee: 250 }] },
  { id: "7", agentName: "Gail Bell", transactions: 1, totalFees: 250, details: [{ transactionId: "3390195", closeDate: "02/12/2026", customServiceFee: 250 }] },
  { id: "8", agentName: "Ma Cristina R Rau", transactions: 1, totalFees: 250, details: [{ transactionId: "3390210", closeDate: "02/19/2026", customServiceFee: 250 }] },
  { id: "9", agentName: "Thomas K Bradley", transactions: 2, totalFees: 500, details: [{ transactionId: "3390225", closeDate: "02/07/2026", customServiceFee: 250 }, { transactionId: "3390240", closeDate: "02/22/2026", customServiceFee: 250 }] },
  { id: "10", agentName: "Sarah L Mitchell", transactions: 1, totalFees: 250, details: [{ transactionId: "3390255", closeDate: "02/16/2026", customServiceFee: 250 }] },
];

const csvColumns: CsvColumnDef<ServiceFeeAgent>[] = [
  { key: "agentName", header: "Agent Name Fee", type: "string" },
  { key: "transactions", header: "Transactions", type: "number" },
  { key: "totalFees", header: "Total Fees", type: "currency" },
];

export default function CustomServiceFees() {
  useDocumentTitle("Custom Service Fees");
  const { t } = useTranslation();
  const { formatCurrency } = useFormatters();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2026, 1, 3),
    to: new Date(2026, 2, 5),
  });
  const [selectedAgent, setSelectedAgent] = useState<ServiceFeeAgent | null>(null);

  const columns = [
    {
      key: "agentName" as const,
      header: t("csf.agentNameFee"),
      sortable: true,
      filterable: true,
      render: (_: string, row: ServiceFeeAgent) => (
        <div className="flex items-center gap-3">
          <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>{row.agentName}</span>
        </div>
      ),
    },
    {
      key: "transactions" as const,
      header: t("csf.transactions"),
      sortable: true,
      filterable: true,
      className: "text-right tabular-nums",
      headerClassName: "text-right",
    },
    {
      key: "totalFees" as const,
      header: t("csf.totalFees"),
      sortable: true,
      className: "text-right tabular-nums font-secondary",
      headerClassName: "text-right",
      render: (val: number) => formatCurrency(val),
    },
  ];

  const handleDownload = () => {
    exportToCsv(mockServiceFeeAgents, csvColumns, "custom-service-fees");
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-20">
        <h1 className="text-2xl font-bold text-foreground">{t("csf.title")}</h1>

        <UniversalFilterBar title={t("csf.dateRange")}>
          <UniversalFilterBar.DateRange value={dateRange} onChange={setDateRange} />
        </UniversalFilterBar>

        <div className="flex items-center justify-end gap-2">
          <Button className="gap-2" aria-label={t("csf.createReport")}>
            <FileText className="h-4 w-4" aria-hidden="true" />
            {t("csf.createReport")}
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleDownload} aria-label={t("common.download")}>
            <Download className="h-4 w-4" aria-hidden="true" />
            {t("common.download")}
          </Button>
        </div>

        <div className="flex justify-end">
          <span className="text-sm text-muted-foreground">
            {mockServiceFeeAgents.length} {t("csf.results")}
          </span>
        </div>

        <DataTable
          data={mockServiceFeeAgents}
          columns={columns}
          onRowClick={(agent) => setSelectedAgent(agent)}
        />
      </div>

      <Sheet open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t("csf.detailsTitle")}</SheetTitle>
          </SheetHeader>
          {selectedAgent && (
            <div className="mt-6 space-y-6">
              {/* Agent header */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <span className="text-lg font-semibold">{selectedAgent.agentName}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>

              {/* Summary rows */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("csf.startDate")}</span>
                  <span className="font-medium tabular-nums">
                    {dateRange.from ? `${String(dateRange.from.getMonth() + 1).padStart(2, "0")}/${String(dateRange.from.getDate()).padStart(2, "0")}/${dateRange.from.getFullYear()}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("csf.endDate")}</span>
                  <span className="font-medium tabular-nums">
                    {dateRange.to ? `${String(dateRange.to.getMonth() + 1).padStart(2, "0")}/${String(dateRange.to.getDate()).padStart(2, "0")}/${dateRange.to.getFullYear()}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("csf.transactions")}</span>
                  <span className="font-medium tabular-nums">{selectedAgent.transactions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("csf.totalFees")}</span>
                  <span className="font-semibold font-secondary tabular-nums">{formatCurrency(selectedAgent.totalFees)}</span>
                </div>
              </div>

              {/* Transaction details */}
              <div className="space-y-3">
                {selectedAgent.details.map((txn) => (
                  <div key={txn.transactionId} className="rounded-lg bg-muted/40 p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("csf.transactionId")}</span>
                      <span className="font-semibold tabular-nums text-primary">{txn.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("csf.closeDate")}</span>
                      <span className="font-medium tabular-nums">{txn.closeDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("csf.customServiceFee")}</span>
                      <span className="font-semibold font-secondary tabular-nums">{formatCurrency(txn.customServiceFee)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}
