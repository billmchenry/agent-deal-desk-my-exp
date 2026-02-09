import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const yearOverYearData = [
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

export function YearOverYearChart() {
  const [chartTab, setChartTab] = useState("units");

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-sm font-semibold">
            Year-over-Year Comparison
          </CardTitle>
          <Tabs value={chartTab} onValueChange={setChartTab}>
            <TabsList className="bg-muted h-8">
              <TabsTrigger value="units" className="text-xs h-7 px-3">Units</TabsTrigger>
              <TabsTrigger value="volume" className="text-xs h-7 px-3">Volume</TabsTrigger>
              <TabsTrigger value="commission" className="text-xs h-7 px-3">Commission</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 pb-4">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={yearOverYearData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="currentYear"
              name="Current Year"
              fill="hsl(var(--exp-blue))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="previousYear"
              name="Previous Year"
              fill="hsl(var(--exp-navy-light))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
