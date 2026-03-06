import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/shared/DataTable";
import { ChevronRight, ChevronLeft, FileText, Copy } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

// ── Types ──

interface EarningLine {
  id: string;
  type: string;       // "Real Estate Trx" | "Revenue Share" | "Stock Award"
  percentage: number;
  amount: number;
}

interface EntityGroup {
  entity: string;
  lines: EarningLine[];
}

interface CompanyGroup {
  company: string;
  entities: EntityGroup[];
}

interface TransactionRow {
  id: string;
  companyName: string;
  entity: string;
  agentName: string;
  advanceId: string;
  estimatedNum: string;
  expUnits: number;
  location: string;
  grossRevenue: number;
  prideFee: number;
  grossRevenueNet: number;
  transactionAmountPct: number;
  netAmount: number;
  earningsType: string;
  supplement: number;
  subsidiaryAmount: number;
  commissionRate: number;
  agentFeePct: number;
  agentFeeDollar: number;
  total: number;
  risk: number;
  pipeline: string;
  liabilityFee: number;
  brokerReviewFee: number;
  expandMentorFee: number;
  mentorFee: number;
  stockComp: number;
  transactionCoordinatorFee: number;
  garnishment: number;
  thirdPartyAdvance: number;
  outstandingReceivables: number;
  overUnderPaymentAdj: number;
  tax: number;
  liabilityFeesYouPaid: number;
  liabilityFeesPaidOnBehalf: number;
  txnReviewFeesYouPaid: number;
  txnReviewFeesPaidOnBehalf: number;
  companyCommPaidOnBehalf: number;
  brokerReviewFeePaidOnBehalf: number;
  txnFee100PctForOthers: number;
  liabilityFeesForOthers: number;
  companyCommFeesForOthers: number;
  brokerReviewFeeForOthers: number;
  reportingDate: string;
  transactionId: string;
  address: string;
  netPayment: number;
}

interface YearEndFile {
  company: string;
  filename: string;
}

// ── Mock Data ──

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--primary) / 0.7)",
  "hsl(var(--primary) / 0.5)",
  "hsl(var(--primary) / 0.35)",
  "hsl(var(--primary) / 0.2)",
];

const mockCompanyGroups: CompanyGroup[] = [
  {
    company: "Pinnacle Commercial, Inc.",
    entities: [
      {
        entity: "eXp Realty, LLC",
        lines: [
          { id: "l1", type: "Real Estate Trx", percentage: 0.16, amount: 11262.56 },
          { id: "l2", type: "Revenue Share", percentage: 0.12, amount: 8086.42 },
        ],
      },
      {
        entity: "eXp Realty of California, Inc",
        lines: [
          { id: "l3", type: "Real Estate Trx", percentage: 55.86, amount: 3859701.00 },
          { id: "l4", type: "Revenue Share", percentage: 13.57, amount: 937610.03 },
        ],
      },
    ],
  },
  {
    company: "Horizon Partners, LLC",
    entities: [
      {
        entity: "eXp Realty of California, Inc",
        lines: [
          { id: "l5", type: "Revenue Share", percentage: 4.50, amount: 310879.42 },
        ],
      },
    ],
  },
  {
    company: "Michael Thompson",
    entities: [
      {
        entity: "eXp Realty of California, Inc",
        lines: [
          { id: "l6", type: "Real Estate Trx", percentage: 5.13, amount: 354410.11 },
          { id: "l7", type: "Revenue Share", percentage: 1.97, amount: 136313.46 },
        ],
      },
      {
        entity: "eXp World Holdings, Inc.",
        lines: [
          { id: "l8", type: "Stock Award", percentage: 0.17, amount: 11877.59 },
        ],
      },
    ],
  },
  {
    company: "Thompson Realty Group, LLC",
    entities: [
      {
        entity: "eXp Realty of California, Inc",
        lines: [
          { id: "l9", type: "Real Estate Trx", percentage: 18.51, amount: 1279093.18 },
        ],
      },
    ],
  },
];

const mockTransactions: TransactionRow[] = Array.from({ length: 8 }, (_, i) => ({
  id: `t${i + 1}`,
  companyName: i < 7 ? "Thompson Realty Group, LLC" : "Pinnacle Commercial, Inc.",
  entity: "eXp Realty of California, Inc",
  agentName: "Michael Thompson",
  advanceId: `ADV-${900100 + i}`,
  estimatedNum: `EST-${7000 + i}`,
  expUnits: i < 3 ? 1 : 0.5,
  location: i === 0
    ? "#LEASE# DEC - 6089 Avenida Alteras, Rancho Santa Fe, CA 92067, US"
    : `${10000 + i * 111} Main St, San Diego, CA 92101, US`,
  grossRevenue: i === 0 ? 1212.50 : 800 + Math.round(Math.random() * 2000 * 100) / 100,
  prideFee: 0,
  grossRevenueNet: i === 0 ? 1212.50 : 800 + Math.round(Math.random() * 2000 * 100) / 100,
  transactionAmountPct: 100,
  netAmount: i === 0 ? 1212.50 : 800 + Math.round(Math.random() * 2000 * 100) / 100,
  earningsType: "Real Estate Trx",
  supplement: 0,
  subsidiaryAmount: 0,
  commissionRate: 80,
  agentFeePct: 20,
  agentFeeDollar: i === 0 ? 242.50 : Math.round(Math.random() * 400 * 100) / 100,
  total: i === 0 ? 1212.50 : 800 + Math.round(Math.random() * 2000 * 100) / 100,
  risk: 0,
  pipeline: i % 3 === 0 ? "Yes" : "No",
  liabilityFee: 0,
  brokerReviewFee: 12.50,
  expandMentorFee: 0,
  mentorFee: 0,
  stockComp: 0,
  transactionCoordinatorFee: 0,
  garnishment: 0,
  thirdPartyAdvance: 0,
  outstandingReceivables: 0,
  overUnderPaymentAdj: 0,
  tax: 0,
  liabilityFeesYouPaid: 0,
  liabilityFeesPaidOnBehalf: 0,
  txnReviewFeesYouPaid: 12.50,
  txnReviewFeesPaidOnBehalf: 0,
  companyCommPaidOnBehalf: 0,
  brokerReviewFeePaidOnBehalf: 0,
  txnFee100PctForOthers: 0,
  liabilityFeesForOthers: 0,
  companyCommFeesForOthers: 0,
  brokerReviewFeeForOthers: 0,
  reportingDate: "01/01/2026",
  transactionId: `3652668.${i + 1}`,
  address: i === 0
    ? "#LEASE# DEC - 6089 Avenida Alteras, Rancho Santa Fe, CA 92067, US"
    : `${10000 + i * 111} Main St, San Diego, CA 92101, US`,
  netPayment: i === 0 ? 1200.00 : 800 + Math.round(Math.random() * 1800 * 100) / 100,
}));

const mockFiles: YearEndFile[] = [
  { company: "Horizon Partners, LLC", filename: "M_Thompson_1099_NEC_13094_SB-36410_1..." },
  { company: "Michael Thompson", filename: "M_Thompson_1099_NEC_13094_SA-0013094..." },
  { company: "Michael Thompson", filename: "M_Thompson_1099_NEC_13094_SA-0013094..." },
  { company: "Thompson Realty Group, LLC", filename: "M_Thompson_1099_NEC_13094_SB-36412_1..." },
];

// ── Component ──

type View = "summary" | "drilldown";

export default function YearEnd() {
  const { t } = useTranslation();
  const { formatCurrency } = useFormatters();
  useDocumentTitle(t("nav.yearEnd"));

  const [year, setYear] = useState("2025");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [view, setView] = useState<View>("summary");
  const [drilldownLine, setDrilldownLine] = useState<EarningLine | null>(null);
  const [selectedTxn, setSelectedTxn] = useState<TransactionRow | null>(null);

  const grandTotal = useMemo(
    () => mockCompanyGroups.reduce((sum, cg) => sum + cg.entities.reduce((s, eg) => s + eg.lines.reduce((a, l) => a + l.amount, 0), 0), 0),
    []
  );

  // Donut data
  const donutData = useMemo(() => {
    const items: { name: string; value: number }[] = [];
    mockCompanyGroups.forEach((cg) => {
      cg.entities.forEach((eg) => {
        eg.lines.forEach((l) => {
          items.push({ name: `${cg.company} - ${l.type}`, value: l.amount });
        });
      });
    });
    return items;
  }, []);

  const handleDrilldown = (line: EarningLine) => {
    setDrilldownLine(line);
    setView("drilldown");
  };

  // Drilldown table columns — all columns from the report, most hidden by default
  const drillColumns = [
    { key: "companyName" as const, header: t("ye.companyName"), type: "string" as const, sortable: true, filterable: true },
    { key: "entity" as const, header: t("ye.entity"), type: "string" as const, sortable: true, filterable: true },
    { key: "agentName" as const, header: "Agent Name", type: "string" as const, sortable: true, filterable: true },
    { key: "advanceId" as const, header: "Advance ID", type: "string" as const, sortable: true, defaultVisible: false },
    { key: "estimatedNum" as const, header: "Estimated #", type: "string" as const, sortable: true, defaultVisible: false },
    { key: "expUnits" as const, header: "EXP Units", type: "number" as const, sortable: true, defaultVisible: false },
    { key: "location" as const, header: "Location", type: "string" as const, sortable: true, filterable: true, defaultVisible: false },
    { key: "grossRevenue" as const, header: "Gross Revenue", type: "currency" as const, sortable: true },
    { key: "prideFee" as const, header: "Pride Fee", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "grossRevenueNet" as const, header: "Gross Revenue Net", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "transactionAmountPct" as const, header: "Transaction Amount/Pct", type: "number" as const, sortable: true, defaultVisible: false },
    { key: "netAmount" as const, header: "Net Amount", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "earningsType" as const, header: t("ye.earningsType"), type: "string" as const, sortable: true, filterable: true },
    { key: "supplement" as const, header: "Supplement", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "subsidiaryAmount" as const, header: "Subsidiary Amount", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "commissionRate" as const, header: "Commission Rate", type: "number" as const, sortable: true, defaultVisible: false },
    { key: "agentFeePct" as const, header: "Agent Fee %", type: "number" as const, sortable: true, defaultVisible: false },
    { key: "agentFeeDollar" as const, header: "Agent Fee $", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "total" as const, header: "Total", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "risk" as const, header: "Risk", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "pipeline" as const, header: "Pipeline", type: "string" as const, sortable: true, defaultVisible: false },
    { key: "liabilityFee" as const, header: "Liability Fee", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "brokerReviewFee" as const, header: "Broker Review Fee", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "expandMentorFee" as const, header: "eXpand Mentor Fee", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "mentorFee" as const, header: "Mentor Fee", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "stockComp" as const, header: "Stock Comp", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "transactionCoordinatorFee" as const, header: "Transaction Coordinator Fee", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "garnishment" as const, header: "Garnishment", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "thirdPartyAdvance" as const, header: "Third Party Advance", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "outstandingReceivables" as const, header: "Outstanding Receivables", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "overUnderPaymentAdj" as const, header: "Over Under Payment Adj", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "tax" as const, header: "Tax", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "liabilityFeesYouPaid" as const, header: "Liability Fees You Paid", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "liabilityFeesPaidOnBehalf" as const, header: "Liability Fees Paid on Your Behalf", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "txnReviewFeesYouPaid" as const, header: "Txn Review Fees You Paid", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "txnReviewFeesPaidOnBehalf" as const, header: "Txn Review Fees Paid on Your Behalf", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "companyCommPaidOnBehalf" as const, header: "Company Commission Paid on Your Behalf", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "brokerReviewFeePaidOnBehalf" as const, header: "Broker Review Fee Paid on Your Behalf", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "txnFee100PctForOthers" as const, header: "Txn Fee 100% Fees for Others", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "liabilityFeesForOthers" as const, header: "Liability Fees for Others", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "companyCommFeesForOthers" as const, header: "Company Commission Fees for Others", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "brokerReviewFeeForOthers" as const, header: "Broker Review Fee for Others", type: "currency" as const, sortable: true, defaultVisible: false },
    { key: "reportingDate" as const, header: t("ye.reportingDate"), type: "date" as const, sortable: true, filterable: true },
  ];

  // Fee keys for detail sheet
  const feeFields: { key: keyof TransactionRow; label: string }[] = [
    { key: "liabilityFee", label: "Liability Fee" },
    { key: "brokerReviewFee", label: "Broker Review Fee" },
    { key: "expandMentorFee", label: "eXpand Mentor Fee" },
    { key: "mentorFee", label: "Mentor Fee" },
    { key: "stockComp", label: "Stock Comp" },
    { key: "transactionCoordinatorFee", label: "Transaction Coordinator Fee" },
    { key: "garnishment", label: "Garnishment" },
    { key: "thirdPartyAdvance", label: "Third Party Advance" },
    { key: "outstandingReceivables", label: "Outstanding Receivables" },
    { key: "overUnderPaymentAdj", label: "Over Under Payment Adjustment" },
    { key: "tax", label: "Tax" },
    { key: "liabilityFeesYouPaid", label: "Liability Fees You Paid" },
    { key: "liabilityFeesPaidOnBehalf", label: "Liability Fees Paid on Your Behalf" },
    { key: "txnReviewFeesYouPaid", label: "Transaction Review Fees You Paid" },
    { key: "txnReviewFeesPaidOnBehalf", label: "Transaction Review Fees Paid on Your Behalf" },
    { key: "companyCommPaidOnBehalf", label: "Company Commission Paid on Your Behalf" },
    { key: "brokerReviewFeePaidOnBehalf", label: "Broker Review Fee Paid on Your Behalf" },
    { key: "txnFee100PctForOthers", label: "Transaction Fee 100% Fees paid for others" },
    { key: "liabilityFeesForOthers", label: "Liability Fees paid for others" },
    { key: "companyCommFeesForOthers", label: "Company Commission Fees paid for others" },
    { key: "brokerReviewFeeForOthers", label: "Broker Review Fee Fees paid for others" },
  ];

  if (view === "drilldown") {
    return (
      <DashboardLayout>
        <div className="space-y-4 pb-20">
          <h1 className="text-2xl font-bold text-foreground">{t("ye.my1099Income")}</h1>
          <Button variant="ghost" className="gap-1 -ml-2" onClick={() => setView("summary")}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {t("ye.back")}
          </Button>
          <DataTable
            data={mockTransactions}
            columns={drillColumns}
            onRowClick={(row) => setSelectedTxn(row)}
            mobileCardRender={(row) => (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold truncate">{row.companyName}</span>
                  <span className="text-sm font-bold tabular-nums font-secondary shrink-0">
                    {formatCurrency(row.grossRevenue)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{row.address}</p>
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{row.earningsType}</span>
                  <span className="tabular-nums font-secondary">Net: {formatCurrency(row.netPayment)}</span>
                </div>
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{row.reportingDate}</span>
                  <span>ID: {row.transactionId}</span>
                </div>
              </div>
            )}
          />
        </div>

        {/* Transaction Detail Sheet */}
        <Sheet open={!!selectedTxn} onOpenChange={() => setSelectedTxn(null)}>
          <SheetContent className="overflow-y-auto sm:max-w-md">
            <SheetHeader>
              <SheetTitle>{t("ye.details")}</SheetTitle>
            </SheetHeader>
            {selectedTxn && (
              <div className="mt-6 space-y-6">
                {/* Amount hero */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="text-center flex-1">
                    <p className="text-2xl font-bold tabular-nums font-secondary">
                      {formatCurrency(selectedTxn.grossRevenue)}
                    </p>
                    <p className="text-sm text-muted-foreground">{selectedTxn.earningsType}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>

                {/* Summary rows */}
                <div className="space-y-2">
                  {[
                    [t("ye.date"), selectedTxn.reportingDate],
                    [t("ye.name"), selectedTxn.agentName],
                    [t("ye.companyName"), selectedTxn.companyName],
                    [t("ye.entity"), selectedTxn.entity],
                    [t("ye.transactionId"), selectedTxn.transactionId],
                    [t("ye.address"), selectedTxn.address],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
                      <span className="text-sm font-medium text-right">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Fee breakdown */}
                <div className="rounded-lg bg-muted/30 p-4 space-y-2">
                  {feeFields.map(({ key, label }) => (
                    <div key={key} className="flex justify-between gap-4">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <span className="text-sm font-medium tabular-nums font-secondary">
                        {(selectedTxn[key] as number).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Net Payment */}
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold">{t("ye.netPayment")}</span>
                  <span className="font-bold tabular-nums font-secondary">{formatCurrency(selectedTxn.netPayment)}</span>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </DashboardLayout>
    );
  }

  // ── Summary View ──
  return (
    <DashboardLayout>
      <div className="space-y-4 pb-20">
        <h1 className="text-2xl font-bold text-foreground">{t("nav.yearEnd")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Income breakdown */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">{t("ye.my1099Income")}</h2>
            <div className="flex items-center gap-3">
              <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="w-40" aria-label={t("ye.companyFilter")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">{t("common.all")}</SelectItem>
                  {mockCompanyGroups.map((cg) => (
                    <SelectItem key={cg.company} value={cg.company}>{cg.company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-24" aria-label={t("ye.yearSelect")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["2025", "2024", "2023"].map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* By Earnings Type label */}
            <div>
              <h3 className="text-primary font-semibold border-b-2 border-primary inline-block pb-1">
                {t("ye.byEarningsType")}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">{t("ye.earningsDesc")}</p>
            </div>

            {/* Donut + breakdown */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Donut */}
              <div className="w-full md:w-64 shrink-0">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      stroke="none"
                    >
                      {donutData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-2xl font-bold tabular-nums font-secondary -mt-4">
                  {formatCurrency(grandTotal)}
                </p>
              </div>

              {/* Breakdown list */}
              <div className="flex-1 space-y-4">
                {mockCompanyGroups
                  .filter((cg) => companyFilter === "All" || cg.company === companyFilter)
                  .map((cg) => (
                    <div key={cg.company} className="space-y-2">
                      <h4 className="font-semibold border-b pb-1">{cg.company}</h4>
                      {cg.entities.map((eg) => (
                        <div key={eg.entity} className="space-y-1 ml-1">
                          <Badge variant="secondary" className="text-xs font-normal">
                            Entity - {eg.entity}
                          </Badge>
                          {eg.lines.map((line) => (
                            <button
                              key={line.id}
                              className="flex items-center justify-between w-full py-1 px-1 rounded hover:bg-muted/40 transition-colors group text-left"
                              onClick={() => handleDrilldown(line)}
                              aria-label={`${line.type} ${formatCurrency(line.amount)}`}
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="h-2.5 w-2.5 rounded-sm shrink-0"
                                  style={{ backgroundColor: "hsl(var(--primary))" }}
                                  aria-hidden="true"
                                />
                                <span className="text-sm">
                                  {line.type} ({line.percentage.toFixed(2)}%)
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium tabular-nums font-secondary text-right">
                                  {formatCurrency(line.amount)}
                                </span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                              </div>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}

                {/* Total */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-semibold">{t("ye.total")}</span>
                  <button
                    className="flex items-center gap-1 font-bold tabular-nums font-secondary hover:text-primary transition-colors"
                    onClick={() => { setDrilldownLine(null); setView("drilldown"); }}
                  >
                    {formatCurrency(grandTotal)}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Files panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("ye.files")}</h2>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-24" aria-label={t("ye.yearSelect")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["2025", "2024", "2023"].map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {Object.entries(
              mockFiles.reduce<Record<string, YearEndFile[]>>((acc, f) => {
                (acc[f.company] = acc[f.company] || []).push(f);
                return acc;
              }, {})
            ).map(([company, files]) => (
              <div key={company} className="space-y-2">
                <h4 className="text-sm font-semibold">{company}</h4>
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
                  >
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden="true" />
                    <span className="text-sm truncate flex-1">{file.filename}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      aria-label={t("ye.copyFilename")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
