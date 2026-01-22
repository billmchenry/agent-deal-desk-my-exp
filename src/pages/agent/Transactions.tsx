import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Filter } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { TransactionDetailsSheet } from "@/components/agent/TransactionDetailsSheet";

type Transaction = {
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

// Mock transactions data
const transactionsData = [
  {
    id: "34476557",
    status: "Paid",
    transactionId: "34476557",
    actualCloseDate: "01/15/2026",
    scheduledCloseDate: "01/18/2026",
    paymentSettledDate: "01/18/2026",
    gciSum: 398.62,
    salesPrice: 9750.00,
    transactionType: "Sale",
    currency: "USD",
    propertyAddress: "783 Rice street, watertown, CA, 95605, US",
    isBuyerAgent: "Yes",
    coAgentPercentage: "10.00%",
    agentPayablePercentage: "80.00%",
    agentNetCommission: 398.60,
    companyCommission: 286.87,
    netPayment: 0.03,
    capPayment: 0.00,
    firstCap: "1.38",
    brokerReviewFee: 0.00,
    transactionCoordinatorFee: 0.00,
    mentorFee: 0.02,
    mentorProgramFee: 0.02,
    statusComp: "19.96",
  },
  {
    id: "20130815",
    status: "Withdrawn",
    transactionId: "20130815",
    actualCloseDate: "-",
    scheduledCloseDate: "01/17/2026",
    paymentSettledDate: "-",
    gciSum: 0.00,
    salesPrice: 495000.00,
    transactionType: "Landlord",
    currency: "USD",
    propertyAddress: "1842 Sunrise Lane, ELK G ROVE, CA 95624, US",
    isBuyerAgent: "False",
    coAgentPercentage: "0.00%",
    agentPayablePercentage: "80.00%",
    agentNetCommission: 0.00,
    companyCommission: 0.01,
    netPayment: 0.00,
    capPayment: 0.00,
    firstCap: "0.00",
    brokerReviewFee: 0.00,
    transactionCoordinatorFee: 0.00,
    mentorFee: 0.00,
    mentorProgramFee: 0.00,
    statusComp: "0.00",
  },
  {
    id: "33221081",
    status: "Withdrawn",
    transactionId: "33221081",
    actualCloseDate: "-",
    scheduledCloseDate: "01/09/2026",
    paymentSettledDate: "-",
    gciSum: 0.00,
    salesPrice: 2875000.00,
    transactionType: "Landlord",
    currency: "USD",
    propertyAddress: "Sacramento, CA 94204, US",
    isBuyerAgent: "False",
    coAgentPercentage: "0.00%",
    agentPayablePercentage: "80.00%",
    agentNetCommission: 0.00,
    companyCommission: 0.01,
    netPayment: 0.00,
    capPayment: 0.00,
    firstCap: "0.00",
    brokerReviewFee: 0.00,
    transactionCoordinatorFee: 0.00,
    mentorFee: 0.00,
    mentorProgramFee: 0.00,
    statusComp: "0.00",
  },
  {
    id: "34618903",
    status: "Withdrawn",
    transactionId: "34618903",
    actualCloseDate: "-",
    scheduledCloseDate: "01/06/2026",
    paymentSettledDate: "-",
    gciSum: 50420.00,
    salesPrice: 880000.00,
    transactionType: "Landlord",
    currency: "USD",
    propertyAddress: "3801 La Fiesta Way, Citrus Heights, CA 95762, US",
    isBuyerAgent: "False",
    coAgentPercentage: "0.00%",
    agentPayablePercentage: "100.00%",
    agentNetCommission: 18455.26,
    companyCommission: 13085.26,
    netPayment: 3480.01,
    capPayment: 0.00,
    firstCap: "26.80",
    brokerReviewFee: 508.84,
    transactionCoordinatorFee: 0.00,
    mentorFee: 0.00,
    mentorProgramFee: 0.00,
    statusComp: "18.14",
  },
  {
    id: "36254774",
    status: "Pending",
    transactionId: "36254774",
    actualCloseDate: "-",
    scheduledCloseDate: "01/08/2026",
    paymentSettledDate: "-",
    gciSum: 0.00,
    salesPrice: 186060.00,
    transactionType: "Both Ends",
    currency: "USD",
    propertyAddress: "19786 Ainsworth Stockton, CA 95206, US",
    isBuyerAgent: "Yes",
    coAgentPercentage: "0.00%",
    agentPayablePercentage: "80.00%",
    agentNetCommission: 0.00,
    companyCommission: 0.01,
    netPayment: 0.00,
    capPayment: 0.00,
    firstCap: "0.00",
    brokerReviewFee: 0.00,
    transactionCoordinatorFee: 0.00,
    mentorFee: 0.00,
    mentorProgramFee: 0.00,
    statusComp: "0.00",
  },
];

export default function Transactions() {
  const navigate = useNavigate();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(2026, 0, 1),
    to: new Date(2026, 0, 27),
  });

  const [filters, setFilters] = useState({
    status: "",
    transactionId: "",
    actualCloseDate: "",
    scheduledCloseDate: "",
    paymentSettledDate: "",
    gciSum: "",
    salesPrice: "",
    transactionType: "",
    currency: "",
    propertyAddress: "",
  });

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setSheetOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "withdrawn":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Withdrawn</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-foreground mb-4">Agent</h1>

        {/* Back Button */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => navigate("/agent/dashboard")}
            className="flex items-center gap-1 text-foreground hover:text-foreground/80 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-lg font-semibold">Back</span>
          </button>
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {dateRange.from && dateRange.to ? (
                  <>
                    {format(dateRange.from, "MM/dd/yyyy")} -{" "}
                    {format(dateRange.to, "MM/dd/yyyy")}
                  </>
                ) : (
                  "Select date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) =>
                  setDateRange({ from: range?.from, to: range?.to })
                }
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>

          <span className="text-muted-foreground">
            {transactionsData.length} Results
          </span>
        </div>

        {/* Data Table */}
        <div className="border rounded-lg overflow-hidden">
          <ScrollArea className="w-full">
            <div className="min-w-[2000px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold min-w-[120px]">Transaction Status</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Transaction ID</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Actual Close Date</TableHead>
                    <TableHead className="font-semibold min-w-[140px]">Scheduled Close Date</TableHead>
                    <TableHead className="font-semibold min-w-[150px]">Payment Settled Date</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">GCI Sum</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">Sales Price</TableHead>
                    <TableHead className="font-semibold min-w-[130px]">Transaction Type</TableHead>
                    <TableHead className="font-semibold min-w-[80px]">Currency</TableHead>
                    <TableHead className="font-semibold min-w-[200px]">Property Address</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">Is Buyer Agent</TableHead>
                    <TableHead className="font-semibold min-w-[130px]">Co-agent Percentage</TableHead>
                    <TableHead className="font-semibold min-w-[160px]">Agent Payable Percentage</TableHead>
                    <TableHead className="font-semibold min-w-[160px]">Agent Net Commission</TableHead>
                    <TableHead className="font-semibold min-w-[150px]">Company Commission</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">Net Payment</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">Cap Payment</TableHead>
                    <TableHead className="font-semibold min-w-[80px]">First Cap</TableHead>
                    <TableHead className="font-semibold min-w-[130px]">Broker Review Fee</TableHead>
                    <TableHead className="font-semibold min-w-[180px]">Transaction Coordinator Fee</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">Mentor Fee</TableHead>
                    <TableHead className="font-semibold min-w-[140px]">Mentor Program Fee</TableHead>
                    <TableHead className="font-semibold min-w-[100px]">Status Comp</TableHead>
                  </TableRow>
                  {/* Filter Row */}
                  <TableRow>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                    <TableHead className="py-2">
                      <Input placeholder="Contains" className="h-8 text-sm" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsData.map((row) => (
                    <TableRow 
                      key={row.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(row)}
                    >
                      <TableCell>{getStatusBadge(row.status)}</TableCell>
                      <TableCell>{row.transactionId}</TableCell>
                      <TableCell>{row.actualCloseDate}</TableCell>
                      <TableCell>{row.scheduledCloseDate}</TableCell>
                      <TableCell>{row.paymentSettledDate}</TableCell>
                      <TableCell>${row.gciSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>${row.salesPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{row.transactionType}</TableCell>
                      <TableCell>{row.currency}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={row.propertyAddress}>
                        {row.propertyAddress}
                      </TableCell>
                      <TableCell>{row.isBuyerAgent}</TableCell>
                      <TableCell>{row.coAgentPercentage}</TableCell>
                      <TableCell>{row.agentPayablePercentage}</TableCell>
                      <TableCell>${row.agentNetCommission.toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>${row.companyCommission.toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>${row.netPayment.toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>${row.capPayment.toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{row.firstCap}</TableCell>
                      <TableCell>${row.brokerReviewFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>${row.transactionCoordinatorFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>${row.mentorFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>${row.mentorProgramFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{row.statusComp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Transaction Details Sheet */}
        <TransactionDetailsSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          transaction={selectedTransaction}
        />
      </div>
    </DashboardLayout>
  );
}
