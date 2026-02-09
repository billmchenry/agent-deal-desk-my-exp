import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VitalSignsRowProps {
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

function StatCard({
  title,
  value,
  prefix = "",
}: {
  title: string;
  value: string | number;
  prefix?: string;
}) {
  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <p className="text-sm sm:text-xs text-muted-foreground mb-1">{title}</p>
        <p className="text-lg sm:text-xl font-semibold text-foreground truncate">
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
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="7"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-sm font-semibold text-primary">
          ${value.toLocaleString("en-US")}
        </p>
        <p className="text-xs sm:text-[10px] text-primary">{percentage}%</p>
      </div>
    </div>
  );
}

export function VitalSignsRow({
  units,
  volume,
  commission,
  transactionsClosed,
  transactionsPending,
  transactionsWithdrawn,
  capCurrent,
  capTarget,
  capPercentage,
}: VitalSignsRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <StatCard title="Units" value={units} />
      <StatCard title="Volume" value={volume.toFixed(2)} prefix="$" />
      <StatCard title="Commission" value={commission.toFixed(2)} prefix="$" />

      {/* Transactions summary */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <p className="text-sm sm:text-xs text-muted-foreground mb-1.5">Transactions</p>
          <div className="space-y-0.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Closed</span>
              <span className="font-semibold">{transactionsClosed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-semibold">{transactionsPending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Withdrawn</span>
              <span className="font-semibold">{transactionsWithdrawn}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cap Status */}
      <Card>
        <CardContent className="p-3 sm:p-4 flex flex-col items-center">
          <p className="text-sm sm:text-xs text-muted-foreground mb-1 self-start">Cap Status</p>
          <CircularProgress percentage={capPercentage} value={capCurrent} />
          <p className="text-xs sm:text-[10px] text-muted-foreground text-center mt-0.5 leading-tight">
            Complete ${(capTarget / 1000).toFixed(0)}K to achieve cap
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
