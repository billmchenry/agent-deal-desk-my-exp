import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
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
import { cn } from "@/lib/utils";

// Mock data for the agent dashboard
const agentStats = {
  units: 5,
  volume: 1784000,
  commission: 2669,
};

const transactionsSummary = {
  closed: 5,
  pending: 15,
  withdrawn: 5,
};

const capStatus = {
  current: 481.9,
  target: 16000,
  percentage: 3,
};

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

function StatCard({
  title,
  value,
  prefix = "",
  onClick,
}: {
  title: string;
  value: string | number;
  prefix?: string;
  onClick?: () => void;
}) {
  return (
    <Card 
      className={onClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground mb-2">{title}</p>
        <p className="text-2xl font-semibold text-foreground">
          {prefix}
          {typeof value === "number" ? value.toLocaleString("en-US") : value}
        </p>
      </CardContent>
    </Card>
  );
}

function CircularProgress({
  percentage,
  value,
}: {
  percentage: number;
  value: number;
}) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-40 h-40 -rotate-90" viewBox="0 0 140 140">
        {/* Background circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-xl font-semibold text-primary">
          ${value.toLocaleString("en-US")}
        </p>
        <p className="text-sm text-primary">{percentage}%</p>
      </div>
    </div>
  );
}

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(2026, 0, 1),
    to: new Date(2026, 0, 22),
  });
  const [chartTab, setChartTab] = useState("units");

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Agent</h1>

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
            <PopoverContent className="w-auto p-0" align="end">
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
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Units" 
            value={agentStats.units} 
            onClick={() => navigate("/agent/transactions")}
          />
          <StatCard
            title="Volume"
            value={agentStats.volume.toFixed(2)}
            prefix="$"
            onClick={() => navigate("/agent/transactions")}
          />
          <StatCard
            title="Commission"
            value={agentStats.commission.toFixed(2)}
            prefix="$"
            onClick={() => navigate("/agent/transactions")}
          />

          {/* Transactions Summary Card */}
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => navigate("/agent/transactions")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Closed</span>
                  <span className="font-semibold">
                    {transactionsSummary.closed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="font-semibold">
                    {transactionsSummary.pending}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Withdrawn
                  </span>
                  <span className="font-semibold">
                    {transactionsSummary.withdrawn}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Year-over-Year Comparison Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Year-over-Year Comparison
              </CardTitle>
              <Tabs
                value={chartTab}
                onValueChange={setChartTab}
                className="w-full"
              >
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

          {/* Cap Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Cap Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <CircularProgress
                percentage={capStatus.percentage}
                value={capStatus.current}
              />
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Note: Complete 16K to achieve the cap status
              </p>
              <Button 
                variant="link" 
                className="mt-2 text-primary"
                onClick={() => navigate("/agent/capping-history")}
              >
                View Capping History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
