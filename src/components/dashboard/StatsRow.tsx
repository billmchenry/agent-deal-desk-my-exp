import { Card, CardContent } from "@/components/ui/card";
import { Home, DollarSign, Building2 } from "lucide-react";
import { cappingData } from "@/data/mockData";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  progress: number;
  color: "blue" | "green" | "purple";
}

function StatCard({ icon, value, label, progress, color }: StatCardProps) {
  const colorClasses = {
    blue: {
      bg: "bg-exp-blue/10",
      icon: "text-exp-blue",
      bar: "bg-exp-blue",
    },
    green: {
      bg: "bg-exp-green/10",
      icon: "text-exp-green",
      bar: "bg-exp-green",
    },
    purple: {
      bg: "bg-exp-purple/10",
      icon: "text-exp-purple",
      bar: "bg-exp-purple",
    },
  };

  const colors = colorClasses[color];

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className={`rounded-lg p-2.5 ${colors.bg}`}>
            <div className={colors.icon}>{icon}</div>
          </div>
          <span className="text-2xl font-bold text-foreground">{value}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{label}</p>
        
        {/* Mini progress bar */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div 
            className={`h-full rounded-full transition-all ${colors.bar}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsRow() {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    }
    return `$${value}`;
  };

  // Mock progress values (would come from real data)
  const unitsProgress = (cappingData.units / 20) * 100; // Assume 20 units target
  const gciProgress = (cappingData.gci / 50000) * 100; // Assume $50K GCI target
  const volumeProgress = (cappingData.volume / 5000000) * 100; // Assume $5M volume target

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        icon={<Home className="h-5 w-5" />}
        value={cappingData.units.toString()}
        label="Units Closed"
        progress={unitsProgress}
        color="blue"
      />
      <StatCard
        icon={<DollarSign className="h-5 w-5" />}
        value={formatCurrency(cappingData.gci)}
        label="Gross Commission"
        progress={gciProgress}
        color="green"
      />
      <StatCard
        icon={<Building2 className="h-5 w-5" />}
        value={formatCurrency(cappingData.volume)}
        label="Total Volume"
        progress={volumeProgress}
        color="purple"
      />
    </div>
  );
}
