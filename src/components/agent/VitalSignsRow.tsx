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
      <CardContent className="p-4 sm:p-6">
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-xl sm:text-2xl font-semibold text-foreground">
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
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
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
        <p className="text-base font-semibold text-primary">
          ${value.toLocaleString("en-US")}
        </p>
        <p className="text-xs text-primary">{percentage}%</p>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard title="Units" value={units} />
      <StatCard title="Volume" value={volume.toFixed(2)} prefix="$" />
      <StatCard title="Commission" value={commission.toFixed(2)} prefix="$" />

      {/* Transactions summary */}
      <Card>
        <CardHeader className="pb-1 pt-4 px-4 sm:px-6">
          <CardTitle className="text-sm text-muted-foreground font-normal">
            Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
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
        <CardHeader className="pb-0 pt-3 px-4 sm:px-6">
          <CardTitle className="text-sm text-muted-foreground font-normal">
            Cap Status
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center px-4 sm:px-6 pb-3">
          <CircularProgress percentage={capPercentage} value={capCurrent} />
          <p className="text-[11px] text-muted-foreground text-center mt-1 leading-tight">
            Complete ${(capTarget / 1000).toFixed(0)}K to achieve cap
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
