import { useState } from "react";
import { useFormatters } from "@/hooks/useFormatters";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TransactionDetailsSheet } from "./TransactionDetailsSheet";

export type Transaction = {
  id: string;
  status: string;
  transactionId: string;
  actualCloseDate: string;
  scheduledCloseDate: string;
  paymentSettledDate: string;
  gciSum: number;
  salesPrice: number;
  transactionType: string;
  currency: string;
  propertyAddress: string;
  isBuyerAgent: string;
  coAgentPercentage: string;
  agentPayablePercentage: string;
  agentNetCommission: number;
  companyCommission: number;
  netPayment: number;
  capPayment: number;
  firstCap: string;
  brokerReviewFee: number;
  transactionCoordinatorFee: number;
  mentorFee: number;
  mentorProgramFee: number;
  statusComp: string;
};

const transactionsData: Transaction[] = [
  {
    id: "34476557", status: "Paid", transactionId: "34476557",
    actualCloseDate: "01/15/2026", scheduledCloseDate: "01/18/2026",
    paymentSettledDate: "01/18/2026", gciSum: 398.62, salesPrice: 9750.0,
    transactionType: "Sale", currency: "USD",
    propertyAddress: "783 Rice street, watertown, CA, 95605, US",
    isBuyerAgent: "Yes", coAgentPercentage: "10.00%",
    agentPayablePercentage: "80.00%", agentNetCommission: 398.6,
    companyCommission: 286.87, netPayment: 0.03, capPayment: 0.0,
    firstCap: "1.38", brokerReviewFee: 0, transactionCoordinatorFee: 0,
    mentorFee: 0.02, mentorProgramFee: 0.02, statusComp: "19.96",
  },
  {
    id: "20130815", status: "Withdrawn", transactionId: "20130815",
    actualCloseDate: "-", scheduledCloseDate: "01/17/2026",
    paymentSettledDate: "-", gciSum: 0, salesPrice: 495000.0,
    transactionType: "Landlord", currency: "USD",
    propertyAddress: "1842 Sunrise Lane, ELK GROVE, CA 95624, US",
    isBuyerAgent: "False", coAgentPercentage: "0.00%",
    agentPayablePercentage: "80.00%", agentNetCommission: 0,
    companyCommission: 0.01, netPayment: 0, capPayment: 0,
    firstCap: "0.00", brokerReviewFee: 0, transactionCoordinatorFee: 0,
    mentorFee: 0, mentorProgramFee: 0, statusComp: "0.00",
  },
  {
    id: "33221081", status: "Withdrawn", transactionId: "33221081",
    actualCloseDate: "-", scheduledCloseDate: "01/09/2026",
    paymentSettledDate: "-", gciSum: 0, salesPrice: 2875000.0,
    transactionType: "Landlord", currency: "USD",
    propertyAddress: "Sacramento, CA 94204, US",
    isBuyerAgent: "False", coAgentPercentage: "0.00%",
    agentPayablePercentage: "80.00%", agentNetCommission: 0,
    companyCommission: 0.01, netPayment: 0, capPayment: 0,
    firstCap: "0.00", brokerReviewFee: 0, transactionCoordinatorFee: 0,
    mentorFee: 0, mentorProgramFee: 0, statusComp: "0.00",
  },
  {
    id: "34618903", status: "Withdrawn", transactionId: "34618903",
    actualCloseDate: "-", scheduledCloseDate: "01/06/2026",
    paymentSettledDate: "-", gciSum: 50420.0, salesPrice: 880000.0,
    transactionType: "Landlord", currency: "USD",
    propertyAddress: "3801 La Fiesta Way, Citrus Heights, CA 95762, US",
    isBuyerAgent: "False", coAgentPercentage: "0.00%",
    agentPayablePercentage: "100.00%", agentNetCommission: 18455.26,
    companyCommission: 13085.26, netPayment: 3480.01, capPayment: 0,
    firstCap: "26.80", brokerReviewFee: 508.84, transactionCoordinatorFee: 0,
    mentorFee: 0, mentorProgramFee: 0, statusComp: "18.14",
  },
  {
    id: "36254774", status: "Pending", transactionId: "36254774",
    actualCloseDate: "-", scheduledCloseDate: "01/08/2026",
    paymentSettledDate: "-", gciSum: 0, salesPrice: 186060.0,
    transactionType: "Both Ends", currency: "USD",
    propertyAddress: "19786 Ainsworth Stockton, CA 95206, US",
    isBuyerAgent: "Yes", coAgentPercentage: "0.00%",
    agentPayablePercentage: "80.00%", agentNetCommission: 0,
    companyCommission: 0.01, netPayment: 0, capPayment: 0,
    firstCap: "0.00", brokerReviewFee: 0, transactionCoordinatorFee: 0,
    mentorFee: 0, mentorProgramFee: 0, statusComp: "0.00",
  },
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


export function MasterTransactionTable() {
  const { formatCurrency, formatDate } = useFormatters();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = transactionsData.filter((row) => {
    if (statusFilter !== "all" && row.status.toLowerCase() !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      const closeDate = row.actualCloseDate !== "-" ? row.actualCloseDate : row.scheduledCloseDate;
      return (
        row.transactionId.toLowerCase().includes(s) ||
        row.propertyAddress.toLowerCase().includes(s) ||
        row.salesPrice.toString().includes(s) ||
        row.gciSum.toString().includes(s) ||
        closeDate.toLowerCase().includes(s) ||
        row.firstCap.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const handleRowClick = (txn: Transaction) => {
    setSelectedTransaction(txn);
    setSheetOpen(true);
  };

  return (
    <section>
      {/* Sticky header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm border-b px-0 py-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-sm font-semibold text-foreground mr-auto">Transactions</h2>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-[180px] pl-8 text-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredData.length} Results
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden mt-3">
        <ScrollArea className="w-full">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold min-w-[100px]">Status</TableHead>
                  <TableHead className="font-semibold min-w-[110px]">Transaction ID</TableHead>
                  <TableHead className="font-semibold min-w-[110px]">Close Date</TableHead>
                  <TableHead className="font-semibold min-w-[110px]">Sale Price</TableHead>
                  <TableHead className="font-semibold min-w-[90px]">GCI</TableHead>
                  <TableHead className="font-semibold min-w-[200px]">Address</TableHead>
                  <TableHead className="font-semibold min-w-[120px]">Amt Toward Cap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row) => {
                  const closeDate = row.actualCloseDate !== "-" ? row.actualCloseDate : row.scheduledCloseDate;
                  return (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer hover:bg-muted/50 min-h-[44px]"
                      onClick={() => handleRowClick(row)}
                    >
                      <TableCell>{getStatusBadge(row.status)}</TableCell>
                      <TableCell>{row.transactionId}</TableCell>
                      <TableCell>{formatDate(closeDate)}</TableCell>
                      <TableCell>{formatCurrency(row.salesPrice)}</TableCell>
                      <TableCell>{formatCurrency(row.gciSum)}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={row.propertyAddress}>
                        {row.propertyAddress}
                      </TableCell>
                      <TableCell>{row.firstCap}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Detail sheet */}
      <TransactionDetailsSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        transaction={selectedTransaction}
      />
    </section>
  );
}
