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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Year-over-Year Comparison
        </CardTitle>
        <Tabs value={chartTab} onValueChange={setChartTab} className="w-full">
          <TabsList className="bg-muted">
            <TabsTrigger value="units">Units</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="commission">Commission</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearOverYearData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="currentYear"
              name="Current Year"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="previousYear"
              name="Previous Year"
              fill="hsl(var(--muted))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
