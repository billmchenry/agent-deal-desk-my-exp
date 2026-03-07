import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Download, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { UniversalFilterBar } from "@/components/filters";

const totalSummaryData = [
  { field: "Transaction Count", jan2026: "12", dec2025: "27", nov2025: "18", oct2025: "23", sep2025: "28", aug2025: "16" },
  { field: "RevShare", jan2026: "892.71 USD", dec2025: "3,987.73 USD", nov2025: "1,893.62 USD", oct2025: "2,123.06 USD", sep2025: "2,185.90 USD", aug2025: "1,766.33 USD" },
  { field: "Adjustments", jan2026: "94.21 USD", dec2025: "782.56 USD", nov2025: "344.14 USD", oct2025: "312.35 USD", sep2025: "185.75 USD", aug2025: "426.73 USD" },
];

const allLevelsSummary = [
  { field: "Transaction Count", jan2026: "12", dec2025: "27", nov2025: "18", oct2025: "23", sep2025: "28", aug2025: "16" },
  { field: "Company Dollar", jan2026: "19,085.32 USD", dec2025: "60,142.24 USD", nov2025: "32,914.03 USD", oct2025: "32,824.03 USD", sep2025: "40,689.82 USD", aug2025: "29,237.50 USD" },
  { field: "Revshare Earnings", jan2026: "892.71 USD", dec2025: "3,987.73 USD", nov2025: "1,893.62 USD", oct2025: "2,123.06 USD", sep2025: "2,185.89 USD", aug2025: "1,766.33 USD" },
  { field: "Avg Company $ Per Transaction", jan2026: "1,590.44 USD", dec2025: "2,227.49 USD", nov2025: "1,828.55 USD", oct2025: "1,427.13 USD", sep2025: "1,453.20 USD", aug2025: "1,827.34 USD" },
];

const levelBreakdowns = [
  {
    level: 1,
    data: [
      { field: "Transaction Count", jan2026: "2", dec2025: "6", nov2025: "1", oct2025: "5", sep2025: "3", aug2025: "2" },
      { field: "Company Dollar", jan2026: "320.00 USD", dec2025: "9,334.00 USD", nov2025: "2,035.00 USD", oct2025: "5,553.50 USD", sep2025: "1,944.00 USD", aug2025: "4,280.00 USD" },
      { field: "Revshare Earnings", jan2026: "57.25 USD", dec2025: "816.74 USD", nov2025: "178.06 USD", oct2025: "731.31 USD", sep2025: "170.10 USD", aug2025: "374.50 USD" },
      { field: "Avg Company $ Per Transaction", jan2026: "160.00 USD", dec2025: "1,555.66 USD", nov2025: "2,035.00 USD", oct2025: "1,110.70 USD", sep2025: "648.00 USD", aug2025: "2,140.00 USD" },
    ],
  },
  {
    level: 2,
    data: [
      { field: "Transaction Count", jan2026: "1", dec2025: "6", nov2025: "2", oct2025: "0", sep2025: "1", aug2025: "6" },
      { field: "Company Dollar", jan2026: "1,688.00 USD", dec2025: "21,121.04 USD", nov2025: "8,407.04 USD", oct2025: "0.00 USD", sep2025: "1,220.93 USD", aug2025: "6,312.50 USD" },
      { field: "Revshare Earnings", jan2026: "168.80 USD", dec2025: "2,112.10 USD", nov2025: "840.70 USD", oct2025: "0.00 USD", sep2025: "122.09 USD", aug2025: "631.25 USD" },
      { field: "Avg Company $ Per Transaction", jan2026: "1,688.00 USD", dec2025: "3,520.17 USD", nov2025: "4,203.52 USD", oct2025: "0.00 USD", sep2025: "1,220.93 USD", aug2025: "1,052.08 USD" },
    ],
  },
  {
    level: 3,
    data: [
      { field: "Transaction Count", jan2026: "3", dec2025: "6", nov2025: "4", oct2025: "2", sep2025: "2", aug2025: "1" },
      { field: "Company Dollar", jan2026: "12,677.50 USD", dec2025: "12,584.50 USD", nov2025: "6,562.40 USD", oct2025: "2,369.94 USD", sep2025: "4,938.00 USD", aug2025: "2,705.00 USD" },
      { field: "Revshare Earnings", jan2026: "475.41 USD", dec2025: "471.93 USD", nov2025: "246.10 USD", oct2025: "88.87 USD", sep2025: "185.18 USD", aug2025: "101.44 USD" },
      { field: "Avg Company $ Per Transaction", jan2026: "4,225.83 USD", dec2025: "2,097.41 USD", nov2025: "1,640.60 USD", oct2025: "1,184.97 USD", sep2025: "2,469.00 USD", aug2025: "2,705.00 USD" },
    ],
  },
];

export default function RevShareTrends() {
  useDocumentTitle(t("nav.revShareTrends"));
  const [openLevels, setOpenLevels] = useState<number[]>([1, 2, 3]);
  const { t } = useTranslation();

  const toggleLevel = (level: number) => {
    setOpenLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <UniversalFilterBar title={t("revshare.revShareTrends")} />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
            <span className="text-sm text-muted-foreground">{t("trends.dateRange")} :</span>
            <span className="text-sm font-medium text-foreground">Aug 2025 to Jan 2026</span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t("trends.monthsView")} :</span>
            <span className="font-medium text-foreground">{t("trends.newestFirst")}</span>
          </div>

          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            {t("common.filter")}
          </Button>
        </div>

        {/* Total Summary */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-section-title font-medium">{t("trends.totalSummary")}</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              {t("agent.download")} {t("trends.totalSummary")}
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{t("trends.globalTotals")}</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">{t("trends.field")}</TableHead>
                  <TableHead>Jan 2026</TableHead>
                  <TableHead>Dec 2025</TableHead>
                  <TableHead>Nov 2025</TableHead>
                  <TableHead>Oct 2025</TableHead>
                  <TableHead>Sep 2025</TableHead>
                  <TableHead>Aug 2025</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {totalSummaryData.map((row) => (
                  <TableRow key={row.field}>
                    <TableCell className="font-medium">{row.field}</TableCell>
                    <TableCell>{row.jan2026}</TableCell>
                    <TableCell>{row.dec2025}</TableCell>
                    <TableCell>{row.nov2025}</TableCell>
                    <TableCell>{row.oct2025}</TableCell>
                    <TableCell>{row.sep2025}</TableCell>
                    <TableCell>{row.aug2025}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Level Data */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-section-title font-semibold text-foreground">{t("trends.levelData")}</h2>
              <p className="text-sm text-muted-foreground">{t("trends.changeCountry")}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t("trends.country")} :</span>
              <Select defaultValue="us">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t("trends.selectCountry")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* All Levels Summary */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-section-title font-medium">{t("trends.allLevelsSummary")}</CardTitle>
                <p className="text-sm text-muted-foreground">{t("trends.combinedContribution")}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                {t("agent.download")} {t("trends.levelSummary")}
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">{t("trends.field")}</TableHead>
                    <TableHead>Jan 2026</TableHead>
                    <TableHead>Dec 2025</TableHead>
                    <TableHead>Nov 2025</TableHead>
                    <TableHead>Oct 2025</TableHead>
                    <TableHead>Sep 2025</TableHead>
                    <TableHead>Aug 2025</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allLevelsSummary.map((row) => (
                    <TableRow key={row.field}>
                      <TableCell className="font-medium">{row.field}</TableCell>
                      <TableCell>{row.jan2026}</TableCell>
                      <TableCell>{row.dec2025}</TableCell>
                      <TableCell>{row.nov2025}</TableCell>
                      <TableCell>{row.oct2025}</TableCell>
                      <TableCell>{row.sep2025}</TableCell>
                      <TableCell>{row.aug2025}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Level-wise Breakdown */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">{t("trends.levelBreakdown")}</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              {t("agent.download")} {t("trends.levelBreakdown")}
            </Button>
          </div>

          {levelBreakdowns.map((levelData) => (
            <Collapsible
              key={levelData.level}
              open={openLevels.includes(levelData.level)}
              onOpenChange={() => toggleLevel(levelData.level)}
              className="mb-4"
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center gap-2">
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openLevels.includes(levelData.level) ? "" : "-rotate-90"
                        }`}
                      />
                      <CardTitle className="text-section-title font-medium">Level {levelData.level}</CardTitle>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">{t("trends.field")}</TableHead>
                          <TableHead>Jan 2026</TableHead>
                          <TableHead>Dec 2025</TableHead>
                          <TableHead>Nov 2025</TableHead>
                          <TableHead>Oct 2025</TableHead>
                          <TableHead>Sep 2025</TableHead>
                          <TableHead>Aug 2025</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {levelData.data.map((row) => (
                          <TableRow key={row.field}>
                            <TableCell className="font-medium">{row.field}</TableCell>
                            <TableCell>{row.jan2026}</TableCell>
                            <TableCell>{row.dec2025}</TableCell>
                            <TableCell>{row.nov2025}</TableCell>
                            <TableCell>{row.oct2025}</TableCell>
                            <TableCell>{row.sep2025}</TableCell>
                            <TableCell>{row.aug2025}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
