import { useState } from "react";
import { Filter, CalendarIcon, Home, DollarSign, Building2, TrendingUp, Target, Clock, FileText } from "lucide-react";
import { format, startOfYear, startOfMonth, subWeeks, subYears } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface AgentHeroBannerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  units: number;
  volume: number;
  commission: number;
  transactionsClosed: number;
  transactionsPending: number;
  transactionsWithdrawn: number;
  capCurrent: number;
  capTarget: number;
  capPercentage: number;
}

const presets = [
  { label: "YTD", getRange: () => ({ from: startOfYear(new Date()), to: new Date() }) },
  { label: "MTD", getRange: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  { label: "Last Week", getRange: () => ({ from: subWeeks(new Date(), 1), to: new Date() }) },
  { label: "Last Year", getRange: () => ({ from: startOfYear(subYears(new Date(), 1)), to: new Date(subYears(new Date(), 1).getFullYear(), 11, 31) }) },
];

function MiniStatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: "blue" | "green" | "gold" | "purple";
}) {
  const colorClasses = {
    blue: "bg-white/15 text-white",
    green: "bg-exp-green/20 text-exp-green-light",
    gold: "bg-exp-gold/20 text-exp-gold-light",
    purple: "bg-white/15 text-white",
  };

  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/10 backdrop-blur-sm px-3 py-2.5 min-w-0">
      <div className={cn("rounded-lg p-2 shrink-0", colorClasses[color])}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-white truncate">{value}</p>
        <p className="text-[11px] text-white/70">{label}</p>
      </div>
    </div>
  );
}

export function AgentHeroBanner({
  dateRange,
  onDateRangeChange,
  units,
  volume,
  commission,
  transactionsClosed,
  transactionsPending,
  transactionsWithdrawn,
  capCurrent,
  capTarget,
  capPercentage,
}: AgentHeroBannerProps) {
  const [open, setOpen] = useState(false);
  const remaining = capTarget - capCurrent;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (capPercentage / 100) * circumference;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-exp-navy via-exp-navy-light to-exp-blue p-4 sm:p-6 text-white">
      {/* Decorative background */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
        <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-white" />
        <div className="absolute right-20 bottom-4 h-20 w-20 rounded-full bg-exp-gold" />
      </div>

      <div className="relative z-10">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-exp-gold/20 text-exp-gold-light border-exp-gold/30 hover:bg-exp-gold/30">
                <Target className="mr-1 h-3 w-3" />
                PERFORMANCE
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">Agent Performance</h1>
            <p className="text-sm text-white/70 mt-0.5">
              You're <span className="font-semibold text-white">{formatCurrency(remaining)}</span> away from capping
            </p>
          </div>

          {/* Cap Progress Ring */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24">
              <svg className="h-20 w-20 sm:h-24 sm:w-24 -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="hsl(var(--exp-green))"
                  strokeWidth="8"
                  strokeDasharray={`${capPercentage * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg sm:text-xl font-bold">{capPercentage}%</span>
                <span className="text-[10px] text-white/70">Cap</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date filter row */}
        <div className="flex items-center gap-2 mb-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2 text-xs bg-white/15 border-white/20 text-white hover:bg-white/25 hover:text-white h-8">
                <Filter className="h-3.5 w-3.5" />
                {dateRange.from && dateRange.to ? (
                  <>
                    {format(dateRange.from, "MM/dd/yyyy")} – {format(dateRange.to, "MM/dd/yyyy")}
                  </>
                ) : (
                  "Select date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="flex flex-wrap gap-2 mb-4">
                {presets.map((p) => (
                  <Button key={p.label} variant="outline" size="sm" className="text-xs h-7" onClick={() => onDateRangeChange(p.getRange())}>
                    {p.label}
                  </Button>
                ))}
              </div>
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => onDateRangeChange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
          <MiniStatCard
            icon={<Home className="h-4 w-4" />}
            value={units.toString()}
            label="Units"
            color="blue"
          />
          <MiniStatCard
            icon={<Building2 className="h-4 w-4" />}
            value={formatCurrency(volume)}
            label="Volume"
            color="purple"
          />
          <MiniStatCard
            icon={<DollarSign className="h-4 w-4" />}
            value={formatCurrency(commission)}
            label="Commission"
            color="green"
          />
          <MiniStatCard
            icon={<FileText className="h-4 w-4" />}
            value={`${transactionsClosed}/${transactionsPending}/${transactionsWithdrawn}`}
            label="Closed / Pending / Withdrawn"
            color="gold"
          />
          <MiniStatCard
            icon={<TrendingUp className="h-4 w-4" />}
            value={formatCurrency(capCurrent)}
            label={`of ${formatCurrency(capTarget)} cap`}
            color="green"
          />
        </div>
      </div>
    </Card>
  );
}
