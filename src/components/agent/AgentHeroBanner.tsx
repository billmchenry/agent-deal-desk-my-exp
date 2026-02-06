import { useState } from "react";
import { CalendarDays, Home, DollarSign, Building2, Target, FileText } from "lucide-react";
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
}: AgentHeroBannerProps) {
  const [open, setOpen] = useState(false);

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
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-exp-gold/20 text-exp-gold-light border-exp-gold/30 hover:bg-exp-gold/30">
              <Target className="mr-1 h-3 w-3" />
              PERFORMANCE
            </Badge>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-xl sm:text-2xl font-bold">Agent Performance</h1>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white border-b border-transparent hover:border-white/40 transition-all cursor-pointer pb-0.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {dateRange.from && dateRange.to ? (
                    <span>{format(dateRange.from, "MMM d, yyyy")} – {format(dateRange.to, "MMM d, yyyy")}</span>
                  ) : (
                    <span>Select date range</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="flex flex-wrap gap-2 mb-4">
                  {presets.map((p) => (
                    <Button key={p.label} variant="outline" size="sm" className="text-xs h-7" onClick={() => onDateRangeChange(p.getRange())}>
                      {p.label}
                    </Button>
                  ))}
                </div>
                <Calendar
                  mode="range"
                  captionLayout="dropdown-buttons"
                  fromYear={2015}
                  toYear={new Date().getFullYear() + 1}
                  selected={dateRange}
                  onSelect={(range) => onDateRangeChange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
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
        </div>
      </div>
    </Card>
  );
}
