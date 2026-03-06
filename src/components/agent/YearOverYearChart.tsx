import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFormatters } from "@/hooks/useFormatters";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const unitsData = [
  { month: "Jan", currentYear: 2, previousYear: 1 },
  { month: "Feb", currentYear: 5, previousYear: 3 },
  { month: "Mar", currentYear: 7, previousYear: 5 },
  { month: "Apr", currentYear: 8, previousYear: 6 },
  { month: "May", currentYear: 30, previousYear: 12 },
  { month: "Jun", currentYear: 22, previousYear: 10 },
  { month: "Jul", currentYear: 12, previousYear: 9 },
  { month: "Aug", currentYear: 10, previousYear: 8 },
  { month: "Sep", currentYear: 8, previousYear: 7 },
  { month: "Oct", currentYear: 9, previousYear: 6 },
  { month: "Nov", currentYear: 7, previousYear: 5 },
  { month: "Dec", currentYear: 6, previousYear: 4 },
];

const volumeData = [
  { month: "Jan", currentYear: 450000, previousYear: 320000 },
  { month: "Feb", currentYear: 620000, previousYear: 480000 },
  { month: "Mar", currentYear: 780000, previousYear: 550000 },
  { month: "Apr", currentYear: 890000, previousYear: 670000 },
  { month: "May", currentYear: 1784000, previousYear: 920000 },
  { month: "Jun", currentYear: 1250000, previousYear: 850000 },
  { month: "Jul", currentYear: 980000, previousYear: 760000 },
  { month: "Aug", currentYear: 870000, previousYear: 710000 },
  { month: "Sep", currentYear: 750000, previousYear: 640000 },
  { month: "Oct", currentYear: 820000, previousYear: 580000 },
  { month: "Nov", currentYear: 690000, previousYear: 520000 },
  { month: "Dec", currentYear: 560000, previousYear: 430000 },
];

const commissionData = [
  { month: "Jan", currentYear: 1200, previousYear: 800 },
  { month: "Feb", currentYear: 2100, previousYear: 1500 },
  { month: "Mar", currentYear: 2800, previousYear: 1900 },
  { month: "Apr", currentYear: 3200, previousYear: 2400 },
  { month: "May", currentYear: 8500, previousYear: 3600 },
  { month: "Jun", currentYear: 6200, previousYear: 3100 },
  { month: "Jul", currentYear: 4100, previousYear: 2800 },
  { month: "Aug", currentYear: 3500, previousYear: 2500 },
  { month: "Sep", currentYear: 2900, previousYear: 2200 },
  { month: "Oct", currentYear: 3100, previousYear: 2000 },
  { month: "Nov", currentYear: 2600, previousYear: 1700 },
  { month: "Dec", currentYear: 2200, previousYear: 1400 },
];

const dataByTab: Record<string, typeof unitsData> = {
  units: unitsData,
  volume: volumeData,
  commission: commissionData,
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border rounded-md shadow-md px-2.5 py-1.5 text-xs max-w-[160px]">
      <p className="font-semibold text-foreground mb-0.5">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="leading-tight">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function YearOverYearChart() {
  const [chartTab, setChartTab] = useState("units");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { formatCurrency: fmtCurr } = useFormatters();

  const fullData = dataByTab[chartTab] || unitsData;
  const chartData = isMobile ? fullData.slice(6) : fullData;

  const formatValue = (val: number) => {
    if (chartTab === "volume") {
      return fmtCurr(val, { compact: true, decimals: 1 });
    }
    if (chartTab === "commission") {
      return fmtCurr(val, { compact: true, decimals: 1 });
    }
    return val.toString();
  };

  const selectedData = selectedMonth
    ? chartData.find((d) => d.month === selectedMonth)
    : null;

  const handleBarClick = (data: any) => {
    if (isMobile && data?.activeLabel) {
      setSelectedMonth((prev) =>
        prev === data.activeLabel ? null : data.activeLabel
      );
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-sm font-semibold">
            Year-over-Year Comparison
          </CardTitle>
          <Tabs value={chartTab} onValueChange={(v) => { setChartTab(v); setSelectedMonth(null); }}>
            <TabsList className="bg-muted h-8">
              <TabsTrigger value="units" className="text-xs h-7 px-3">Units</TabsTrigger>
              <TabsTrigger value="volume" className="text-xs h-7 px-3">Volume</TabsTrigger>
              <TabsTrigger value="commission" className="text-xs h-7 px-3">Commission</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 pb-6">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={chartData}
            barCategoryGap="20%"
            barGap={4}
            onClick={handleBarClick}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} width={chartTab === "units" ? 30 : 50} tickFormatter={(v) => formatValue(v)} />
            {!isMobile && (
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
            )}
            {isMobile && (
              <Tooltip content={() => null} cursor={{ fill: 'hsl(var(--muted))' }} />
            )}
            <Legend />
            <Bar
              dataKey="currentYear"
              name="Current Year"
              fill="hsl(var(--exp-blue))"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.month}
                  fill={
                    selectedMonth === entry.month
                      ? "hsl(var(--exp-blue-light))"
                      : "hsl(var(--exp-blue))"
                  }
                  stroke={selectedMonth === entry.month ? "hsl(var(--exp-blue))" : "none"}
                  strokeWidth={selectedMonth === entry.month ? 2 : 0}
                />
              ))}
            </Bar>
            <Bar
              dataKey="previousYear"
              name="Previous Year"
              fill="hsl(var(--exp-navy-light))"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.month}
                  fill={
                    selectedMonth === entry.month
                      ? "hsl(var(--exp-navy))"
                      : "hsl(var(--exp-navy-light))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Mobile: tap-to-select detail strip */}
        {isMobile && (
          <div className="mt-3 rounded-lg bg-muted/50 px-3 py-2.5 text-center min-h-[44px] flex items-center justify-center">
            {selectedData ? (
              <div className="flex items-center gap-4">
                <span className="font-semibold text-sm text-foreground">{selectedData.month}</span>
                <span className="text-xs text-exp-blue">
                  Current: <span className="font-semibold">{formatValue(selectedData.currentYear)}</span>
                </span>
                <span className="text-xs text-exp-navy">
                  Previous: <span className="font-semibold">{formatValue(selectedData.previousYear)}</span>
                </span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">Tap a bar to see details</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
