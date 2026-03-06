import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DataTable, type ColumnDef } from "@/components/shared/DataTable";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AgentTransactionsView, type AgentDetail, type AgentTransaction } from "@/components/revshare/AgentTransactionsView";
import { TransactionRevShareSheet } from "@/components/revshare/TransactionRevShareSheet";

// ── Types ──

interface AgentRevShareRow {
  agentName: string;
  uuid: string;
  level: number;
  country: string;
  state: string;
  totalRevShare: number;
  currency: string;
}

interface PeriodicRow {
  date: string;
  initialRevShare: number;
  adjustment: number;
  finalRevShare: number;
  transactionCount6Mo: number;
  memberCount: number;
  monthly: string;
  batchNumber: number;
  currency: string;
}

// ── Mock Transaction Data per Agent ──

const agentTransactionsMap: Record<string, AgentDetail> = {
  "Tatsiana Crawford": {
    agentName: "Tatsiana Crawford",
    agentId: "278153",
    totalRevShare: 2325.00,
    currency: "USD",
    email: "tatsiana.crawford@email.com",
    phone: "(207) 555-0142",
    transactions: [
      { address: "4521 Maple Dr, Portland...", fullAddress: "4521 Maple Dr, Portland, OR 97201, US", closedDate: "01/15/2026", revShareAmount: 1425.00, currency: "USD", transactionNumber: "3648712.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 890000, revShareDollar: 2850.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 1425.00 },
      { address: "782 Oak Lane, Augusta...", fullAddress: "782 Oak Lane, Augusta, ME 04330, US", closedDate: "01/08/2026", revShareAmount: 900.00, currency: "USD", transactionNumber: "3648199.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 540000, revShareDollar: 1800.00, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 900.00 },
    ],
  },
  "Ravi Ramachandran": {
    agentName: "Ravi Ramachandran",
    agentId: "278152",
    totalRevShare: 2556.64,
    currency: "USD",
    email: "ravi.ramachandran@email.com",
    phone: "(425) 555-0198",
    transactions: [
      { address: "9625 164th Ave NE, Re...", fullAddress: "9625 164th Ave NE, Redmond, WA 98052, US", closedDate: "01/20/2026", revShareAmount: 1876.43, currency: "USD", transactionNumber: "3648503.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 1270000, revShareDollar: 3752.85, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 1876.43 },
      { address: "2525C 29th Ave S, Seattl...", fullAddress: "2525C 29th Ave S, Seattle, WA 98144, US", closedDate: "01/07/2026", revShareAmount: 680.21, currency: "USD", transactionNumber: "3647891.1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: 425000, revShareDollar: 1360.42, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: 680.21 },
    ],
  },
};

// Fallback for agents without specific mock data
function getAgentDetail(row: AgentRevShareRow): AgentDetail {
  if (agentTransactionsMap[row.agentName]) return agentTransactionsMap[row.agentName];
  const half = row.totalRevShare * 0.6;
  const rest = row.totalRevShare - half;
  const firstNameLower = row.agentName.split(" ")[0].toLowerCase();
  const lastNameLower = row.agentName.split(" ").slice(-1)[0].toLowerCase();
  return {
    agentName: row.agentName,
    agentId: String(Math.floor(100000 + Math.random() * 900000)),
    totalRevShare: row.totalRevShare,
    currency: row.currency,
    email: `${firstNameLower}.${lastNameLower}@email.com`,
    phone: `(${Math.floor(200 + Math.random() * 800)}) 555-${String(Math.floor(1000 + Math.random() * 9000))}`,
    transactions: [
      { address: "123 Main St, " + row.state + "...", fullAddress: "123 Main St, " + row.state + ", " + row.country, closedDate: "01/12/2026", revShareAmount: half, currency: row.currency, transactionNumber: "364" + Math.floor(1000 + Math.random() * 9000) + ".1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: half * 500, revShareDollar: half * 2, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: half },
      { address: "456 Elm Ave, " + row.state + "...", fullAddress: "456 Elm Ave, " + row.state + ", " + row.country, closedDate: "01/05/2026", revShareAmount: rest, currency: row.currency, transactionNumber: "364" + Math.floor(1000 + Math.random() * 9000) + ".1", transactionStatus: "Paid", paidStatus: "Paid", salePrice: rest * 500, revShareDollar: rest * 2, expansionShare: "0%", exponentialShare: "50%", revSharePercentage: "50%", finalRevShare: rest },
    ],
  };
}

// ── Mock Data ──

const unpaidData: AgentRevShareRow[] = [
  { agentName: "Tatsiana Crawford", uuid: "a1214361-b902-11f0-bf04-6fa49648a531", level: 1, country: "US", state: "ME", totalRevShare: 2325.00, currency: "USD" },
  { agentName: "Kendra Campbell Borja LLC", uuid: "044bec73-bb01-11ee-853e-d51ab739de9d", level: 1, country: "US", state: "FL", totalRevShare: 1260.00, currency: "USD" },
  { agentName: "Cindy A Ermeav-Williams", uuid: "d699b01e-34d5-11f0-a0e0-bdd1e62643d3", level: 1, country: "US", state: "FL", totalRevShare: 1000.00, currency: "USD" },
  { agentName: "Brittany A Garcia PLLC", uuid: "b8fd09a0-2d39-11ed-8285-b75628342cbf", level: 2, country: "US", state: "AZ", totalRevShare: 937.50, currency: "USD" },
  { agentName: "Autumn Ceniza", uuid: "fa3f3b45-627b-11ec-842e-45a6f9a1dea2", level: 2, country: "US", state: "CA", totalRevShare: 917.04, currency: "USD" },
  { agentName: "Cara Darea Silverthorne", uuid: "fc9f014e-a2d4-11ef-8db9-dd0ff6fa6dfb", level: 3, country: "US", state: "FL", totalRevShare: 898.47, currency: "USD" },
  { agentName: "Sarah Brennan", uuid: "1ef799f5-c0cc-11f0-8c89-019f6c163964", level: 1, country: "CA", state: "NB", totalRevShare: 889.15, currency: "USD" },
  { agentName: "Allison Mireau", uuid: "03fb0af3-d911-11ef-8d6e-ddea294055e4", level: 2, country: "US", state: "NJ", totalRevShare: 852.19, currency: "USD" },
  { agentName: "Seth Steven Rhyne", uuid: "0686bdac-349f-11eb-a14f-8bf36dbde695", level: 2, country: "US", state: "SC", totalRevShare: 790.80, currency: "USD" },
  { agentName: "Susan A Thomas", uuid: "effe60b3-7b54-11f0-87f9-432a31a08428", level: 1, country: "US", state: "FL", totalRevShare: 737.50, currency: "USD" },
  { agentName: "Salvador Fernando Rivas Hernandez", uuid: "62f6f164-ba61-11f0-bf04-6fa49648a531", level: 1, country: "US", state: "MA", totalRevShare: 650.00, currency: "USD" },
  { agentName: "Marcus Bell", uuid: "9a12bc34-de56-78f0-ab12-cd34ef567890", level: 3, country: "US", state: "TX", totalRevShare: 612.33, currency: "USD" },
];

const expectedData: AgentRevShareRow[] = [
  { agentName: "Kendra Campbell Borja LLC", uuid: "", level: 1, country: "US", state: "FL", totalRevShare: 1260.00, currency: "USD" },
  { agentName: "Cindy A Ermeav-Williams", uuid: "", level: 1, country: "US", state: "FL", totalRevShare: 1000.00, currency: "USD" },
  { agentName: "Brittany A Garcia PLLC", uuid: "", level: 2, country: "US", state: "AZ", totalRevShare: 937.50, currency: "USD" },
  { agentName: "Autumn Ceniza", uuid: "", level: 2, country: "US", state: "CA", totalRevShare: 917.04, currency: "USD" },
  { agentName: "Cara Darea Silverthorne", uuid: "", level: 3, country: "US", state: "FL", totalRevShare: 898.47, currency: "USD" },
  { agentName: "Sarah Brennan", uuid: "", level: 1, country: "CA", state: "NB", totalRevShare: 889.15, currency: "USD" },
  { agentName: "Allison Mireau", uuid: "", level: 2, country: "US", state: "NJ", totalRevShare: 852.19, currency: "USD" },
  { agentName: "Seth Steven Rhyne", uuid: "", level: 2, country: "US", state: "SC", totalRevShare: 790.80, currency: "USD" },
  { agentName: "Susan A Thomas", uuid: "", level: 1, country: "US", state: "FL", totalRevShare: 737.50, currency: "USD" },
  { agentName: "Salvador Fernando Rivas Hernandez", uuid: "", level: 1, country: "US", state: "MA", totalRevShare: 650.00, currency: "USD" },
  { agentName: "Abby Moorman Andes", uuid: "", level: 3, country: "US", state: "GA", totalRevShare: 643.95, currency: "USD" },
];

const lastPaidData: AgentRevShareRow[] = [
  { agentName: "Ravi Ramachandran", uuid: "", level: 1, country: "US", state: "WA", totalRevShare: 2556.64, currency: "USD" },
  { agentName: "Lindsey Ruth Sampier", uuid: "", level: 3, country: "US", state: "CO", totalRevShare: 1000.00, currency: "USD" },
  { agentName: "Jennifer Horst", uuid: "", level: 2, country: "US", state: "CA", totalRevShare: 855.00, currency: "USD" },
  { agentName: "Christian Smith", uuid: "", level: 2, country: "US", state: "GA", totalRevShare: 834.50, currency: "USD" },
  { agentName: "Camille Anne Horvath", uuid: "", level: 3, country: "US", state: "FL", totalRevShare: 815.63, currency: "USD" },
  { agentName: "Sheri Morrison", uuid: "", level: 2, country: "US", state: "FL", totalRevShare: 784.00, currency: "USD" },
  { agentName: "Amanda Bowen", uuid: "", level: 7, country: "US", state: "WA", totalRevShare: 782.34, currency: "USD" },
  { agentName: "Sarah Brennan", uuid: "", level: 1, country: "CA", state: "NB", totalRevShare: 684.03, currency: "USD" },
];

const periodicData: PeriodicRow[] = [
  { date: "01/31/2026", initialRevShare: 34829.59, adjustment: 6687.39, finalRevShare: 41516.98, transactionCount6Mo: 310, memberCount: 207, monthly: "Yes", batchNumber: 1845, currency: "USD" },
  { date: "12/31/2025", initialRevShare: 38908.69, adjustment: 7027.19, finalRevShare: 45935.88, transactionCount6Mo: 425, memberCount: 241, monthly: "Yes", batchNumber: 1820, currency: "USD" },
  { date: "11/30/2025", initialRevShare: 37199.38, adjustment: 7414.32, finalRevShare: 44613.70, transactionCount6Mo: 339, memberCount: 232, monthly: "Yes", batchNumber: 1796, currency: "USD" },
  { date: "10/31/2025", initialRevShare: 39624.86, adjustment: 7979.28, finalRevShare: 47604.14, transactionCount6Mo: 378, memberCount: 230, monthly: "Yes", batchNumber: 1765, currency: "USD" },
  { date: "09/30/2025", initialRevShare: 37956.36, adjustment: 7574.30, finalRevShare: 45530.66, transactionCount6Mo: 385, memberCount: 250, monthly: "Yes", batchNumber: 1748, currency: "USD" },
  { date: "08/31/2025", initialRevShare: 47119.37, adjustment: 9530.45, finalRevShare: 56649.82, transactionCount6Mo: 451, memberCount: 280, monthly: "Yes", batchNumber: 1724, currency: "USD" },
  { date: "07/31/2025", initialRevShare: 58356.61, adjustment: 13808.35, finalRevShare: 72164.96, transactionCount6Mo: 509, memberCount: 299, monthly: "Yes", batchNumber: 1700, currency: "USD" },
  { date: "06/30/2025", initialRevShare: 53922.03, adjustment: 12164.04, finalRevShare: 66086.07, transactionCount6Mo: 525, memberCount: 303, monthly: "Yes", batchNumber: 1677, currency: "USD" },
  { date: "05/31/2025", initialRevShare: 63319.46, adjustment: 15272.33, finalRevShare: 78591.79, transactionCount6Mo: 580, memberCount: 317, monthly: "Yes", batchNumber: 1652, currency: "USD" },
  { date: "04/30/2025", initialRevShare: 55732.47, adjustment: 13213.15, finalRevShare: 68945.62, transactionCount6Mo: 524, memberCount: 306, monthly: "Yes", batchNumber: 1628, currency: "USD" },
  { date: "03/31/2025", initialRevShare: 44878.87, adjustment: 10562.97, finalRevShare: 55441.84, transactionCount6Mo: 399, memberCount: 246, monthly: "Yes", batchNumber: 1606, currency: "USD" },
];

const paymentDetails = {
  initialRevShare: 34829.59,
  adjustmentAmount: 6687.39,
  finalRevShare: 41516.98,
  batchId: 1845,
  initiatedDate: "02/17/2026",
};

// ── Component ──

export default function Financials() {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatters();
  const navigate = useNavigate();
  useDocumentTitle(t("fin.title"));

  // Drill-down state
  const [selectedAgent, setSelectedAgent] = useState<AgentDetail | null>(null);
  const [selectedTxn, setSelectedTxn] = useState<AgentTransaction | null>(null);
  const [txnSheetOpen, setTxnSheetOpen] = useState(false);

  const handleAgentClick = (row: AgentRevShareRow) => {
    setSelectedAgent(getAgentDetail(row));
  };

  const handleTxnClick = (txn: AgentTransaction) => {
    setSelectedTxn(txn);
    setTxnSheetOpen(true);
  };

  const handleBackFromAgent = () => {
    setSelectedAgent(null);
  };

  // Columns for Unpaid tab (with UUID)
  const unpaidColumns: ColumnDef<AgentRevShareRow>[] = [
    { key: "agentName", header: t("fin.agentName"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "uuid", header: t("fin.uuid"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "level", header: t("fin.level"), type: "number", sortable: true, filterable: true, defaultVisible: true },
    { key: "country", header: t("fin.country"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "state", header: t("fin.state"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "totalRevShare", header: t("fin.totalRevShare"), type: "currency", sortable: true, filterable: true, defaultVisible: true, currencyCodeKey: "currency" },
  ];

  const agentColumns: ColumnDef<AgentRevShareRow>[] = [
    { key: "agentName", header: t("fin.agentName"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "level", header: t("fin.level"), type: "number", sortable: true, filterable: true, defaultVisible: true },
    { key: "country", header: t("fin.country"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "state", header: t("fin.state"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "totalRevShare", header: t("fin.totalRevShare"), type: "currency", sortable: true, filterable: true, defaultVisible: true, currencyCodeKey: "currency" },
  ];

  const periodicColumns: ColumnDef<PeriodicRow>[] = [
    { key: "date", header: t("fin.date"), type: "date", sortable: true, filterable: true, defaultVisible: true },
    { key: "initialRevShare", header: t("fin.initialRevShare"), type: "currency", sortable: true, filterable: true, defaultVisible: true, currencyCodeKey: "currency" },
    { key: "adjustment", header: t("fin.adjustment"), type: "currency", sortable: true, filterable: true, defaultVisible: true, currencyCodeKey: "currency" },
    { key: "finalRevShare", header: t("fin.finalRevShare"), type: "currency", sortable: true, filterable: true, defaultVisible: true, currencyCodeKey: "currency" },
    { key: "transactionCount6Mo", header: t("fin.transactionCount6Mo"), type: "number", sortable: true, filterable: true, defaultVisible: true },
    { key: "memberCount", header: t("fin.memberCount"), type: "number", sortable: true, filterable: true, defaultVisible: true },
    { key: "monthly", header: t("fin.monthly"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "batchNumber", header: t("fin.batchNumber"), type: "number", sortable: true, filterable: true, defaultVisible: true },
  ];

  const mobileCard = (row: AgentRevShareRow) => (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium text-sm text-foreground">{row.agentName}</p>
        <p className="text-xs text-muted-foreground">Level {row.level} · {row.country}, {row.state}</p>
      </div>
      <span className="font-semibold text-sm">{formatCurrency(row.totalRevShare)} {row.currency}</span>
    </div>
  );

  const periodicMobileCard = (row: PeriodicRow) => (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium text-sm text-foreground">{row.date}</p>
        <p className="text-xs text-muted-foreground">Batch #{row.batchNumber}</p>
      </div>
      <span className="font-semibold text-sm">{formatCurrency(row.finalRevShare)} {row.currency}</span>
    </div>
  );

  // If an agent is selected, show drill-down
  if (selectedAgent) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <AgentTransactionsView
            agent={selectedAgent}
            onBack={handleBackFromAgent}
            onTransactionClick={handleTxnClick}
          />
          <TransactionRevShareSheet
            txn={selectedTxn}
            open={txnSheetOpen}
            onOpenChange={setTxnSheetOpen}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/revshare/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("fin.back")}
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{t("fin.title")}</h1>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="unpaid" className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 gap-6">
            <TabsTrigger value="unpaid" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2 text-sm">
              {t("fin.unpaid")}
            </TabsTrigger>
            <TabsTrigger value="expected" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2 text-sm">
              {t("fin.expected")}
            </TabsTrigger>
            <TabsTrigger value="lastPaid" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2 text-sm">
              {t("fin.lastPaid")}
            </TabsTrigger>
            <TabsTrigger value="periodic" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-2 text-sm">
              {t("fin.periodicOverview")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unpaid" className="mt-4">
            <DataTable
              data={unpaidData}
              columns={unpaidColumns}
              csvFilename="unpaid-revshare"
              mobileCardRender={mobileCard}
              defaultPageSize={25}
              onRowClick={handleAgentClick}
            />
          </TabsContent>

          <TabsContent value="expected" className="mt-4">
            <DataTable
              data={expectedData}
              columns={agentColumns}
              csvFilename="expected-revshare"
              mobileCardRender={mobileCard}
              defaultPageSize={25}
              onRowClick={handleAgentClick}
            />
          </TabsContent>

          <TabsContent value="lastPaid" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
              <Card className="p-5 h-fit">
                <h3 className="text-base font-semibold text-foreground mb-4">{t("fin.paymentDetails")}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">{t("fin.initialRevShare")}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium text-foreground">{formatCurrency(paymentDetails.initialRevShare)} USD</span>
                      <p className="text-xs text-muted-foreground">Initiated {paymentDetails.initiatedDate}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">{t("fin.adjustmentAmount")}</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{formatCurrency(paymentDetails.adjustmentAmount)} USD</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">{t("fin.finalRevShare")}</span>
                    <span className="text-sm font-medium text-foreground">{formatCurrency(paymentDetails.finalRevShare)} USD</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-muted-foreground">{t("fin.batchId")}</span>
                    <span className="text-sm font-medium text-foreground">{paymentDetails.batchId}</span>
                  </div>
                </div>
              </Card>

              <DataTable
                data={lastPaidData}
                columns={agentColumns}
                csvFilename="last-paid-revshare"
                mobileCardRender={mobileCard}
                defaultPageSize={25}
                onRowClick={handleAgentClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="periodic" className="mt-4">
            <DataTable
              data={periodicData}
              columns={periodicColumns}
              csvFilename="periodic-revshare"
              mobileCardRender={periodicMobileCard}
              defaultPageSize={25}
            />
          </TabsContent>
        </Tabs>
      </div>

      <TransactionRevShareSheet
        txn={selectedTxn}
        open={txnSheetOpen}
        onOpenChange={setTxnSheetOpen}
      />
    </DashboardLayout>
  );
}
