import { Home, DollarSign, Building2, Target, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AgentHeroBannerProps {
  units: number;
  volume: number;
  commission: number;
  transactionsClosed: number;
  transactionsPending: number;
  transactionsWithdrawn: number;
}

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
        <p className="text-xs sm:text-[11px] text-white/70">{label}</p>
      </div>
    </div>
  );
}

export function AgentHeroBanner({
  units,
  volume,
  commission,
  transactionsClosed,
  transactionsPending,
  transactionsWithdrawn,
}: AgentHeroBannerProps) {
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
