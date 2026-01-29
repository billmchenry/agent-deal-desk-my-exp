import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartData = {
  "1M": [
    { month: "Week 1", gci: 800 },
    { month: "Week 2", gci: 1200 },
    { month: "Week 3", gci: 900 },
    { month: "Week 4", gci: 1500 },
  ],
  "3M": [
    { month: "Nov", gci: 1800 },
    { month: "Dec", gci: 2200 },
    { month: "Jan", gci: 2670 },
  ],
  "6M": [
    { month: "Aug", gci: 1200 },
    { month: "Sep", gci: 1500 },
    { month: "Oct", gci: 1400 },
    { month: "Nov", gci: 1800 },
    { month: "Dec", gci: 2200 },
    { month: "Jan", gci: 2670 },
  ],
  "YTD": [
    { month: "Jan", gci: 2670 },
  ],
  "ALL": [
    { month: "Q1 '24", gci: 4500 },
    { month: "Q2 '24", gci: 5200 },
    { month: "Q3 '24", gci: 4800 },
    { month: "Q4 '24", gci: 6000 },
    { month: "Jan '25", gci: 2670 },
  ],
};

type TimePeriod = keyof typeof chartData;

export function PerformanceChart() {
  const [period, setPeriod] = useState<TimePeriod>("6M");
  const data = chartData[period];
  
  const average = data.reduce((sum, item) => sum + item.gci, 0) / data.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Performance Overview</CardTitle>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as TimePeriod)}>
          <TabsList className="h-8">
            <TabsTrigger value="1M" className="text-xs px-2 py-1">1M</TabsTrigger>
            <TabsTrigger value="3M" className="text-xs px-2 py-1">3M</TabsTrigger>
            <TabsTrigger value="6M" className="text-xs px-2 py-1">6M</TabsTrigger>
            <TabsTrigger value="YTD" className="text-xs px-2 py-1">YTD</TabsTrigger>
            <TabsTrigger value="ALL" className="text-xs px-2 py-1">ALL</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-exp-blue" />
            <span className="text-muted-foreground">GCI Trend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 bg-exp-green" />
            <span className="text-muted-foreground">Avg: ${average.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gciGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--exp-blue))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--exp-blue))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "GCI"]}
              />
              <Area
                type="monotone"
                dataKey="gci"
                stroke="hsl(var(--exp-blue))"
                strokeWidth={2}
                fill="url(#gciGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
