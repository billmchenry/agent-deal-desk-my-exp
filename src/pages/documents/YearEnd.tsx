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
  earningsType: "Real Estate Trx",
  reportingDate: "01/01/2026",
  amount: i === 0 ? 1212.50 : 800 + Math.round(Math.random() * 2000 * 100) / 100,
  name: "Michael Thompson",
  transactionId: `3652668.${i + 1}`,
  address: i === 0
    ? "#LEASE# DEC - 6089 Avenida Alteras, Rancho Santa Fe, CA 92067, US"
    : `${10000 + i * 111} Main St, San Diego, CA 92101, US`,
  fees: [
    { label: "Liability Fee", amount: 0 },
    { label: "Broker Review Fee", amount: 12.50 },
    { label: "eXpand Mentor Fee", amount: 0 },
    { label: "Mentor Fee", amount: 0 },
    { label: "Stock Comp", amount: 0 },
    { label: "Transaction Coordinator Fee", amount: 0 },
    { label: "Garnishment", amount: 0 },
    { label: "Third Party Advance", amount: 0 },
    { label: "Outstanding Receivables", amount: 0 },
    { label: "Over Under Payment Adjustment", amount: 0 },
    { label: "Tax", amount: 0 },
    { label: "Liability Fees You Paid", amount: 0 },
    { label: "Liability Fees Paid on Your Behalf", amount: 0 },
    { label: "Transaction Review Fees You Paid", amount: 12.50 },
    { label: "Transaction Review Fees Paid on Your Behalf", amount: 0 },
    { label: "Company Commission Paid on Your Behalf", amount: 0 },
    { label: "Broker Review Fee Paid on Your Behalf", amount: 0 },
    { label: "Transaction Fee 100 Percent Fees paid for others", amount: 0 },
    { label: "Liability Fees paid for others", amount: 0 },
    { label: "Company Commission Fees paid for others", amount: 0 },
    { label: "Broker ReviewFee Fees paid for others", amount: 0 },
  ],
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

  // Drilldown table columns
  const drillColumns = [
    { key: "companyName" as const, header: t("ye.companyName"), type: "string" as const, sortable: true, filterable: true },
    { key: "entity" as const, header: t("ye.entity"), type: "string" as const, sortable: true, filterable: true },
    { key: "earningsType" as const, header: t("ye.earningsType"), type: "string" as const, sortable: true, filterable: true },
    { key: "reportingDate" as const, header: t("ye.reportingDate"), type: "date" as const, sortable: true, filterable: true },
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
                      {formatCurrency(selectedTxn.amount)}
                    </p>
                    <p className="text-sm text-muted-foreground">{selectedTxn.earningsType}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>

                {/* Summary rows */}
                <div className="space-y-2">
                  {[
                    [t("ye.date"), selectedTxn.reportingDate],
                    [t("ye.name"), selectedTxn.name],
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
                  {selectedTxn.fees.map((fee) => (
                    <div key={fee.label} className="flex justify-between gap-4">
                      <span className="text-sm text-muted-foreground">{fee.label}</span>
                      <span className="text-sm font-medium tabular-nums font-secondary">{fee.amount.toFixed(2)}</span>
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
