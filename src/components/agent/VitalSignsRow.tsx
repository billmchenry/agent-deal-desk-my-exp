import { Card, CardContent } from "@/components/ui/card";
import { useFormatters } from "@/hooks/useFormatters";

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

function StatCard({ title, value, prefix = "" }: { title: string; value: string | number; prefix?: string }) {
  const { formatNumber } = useFormatters();
  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <p className="text-xs text-muted-foreground mb-1">{title}</p>
        <p className="text-section-title font-semibold text-foreground truncate">
          {prefix}{typeof value === "number" ? formatNumber(value) : value}
        </p>
      </CardContent>
    </Card>
  );
}

function CircularProgress({ percentage, value }: { percentage: number; value: number }) {
  const { formatCurrency } = useFormatters();
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke="hsl(var(--primary))" strokeWidth="7" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-500" />
      </svg>
      <div className="absolute text-center">
        <p className="text-sm font-semibold text-primary">{formatCurrency(value)}</p>
        <p className="text-xs sm:text-[10px] text-primary">{percentage}%</p>
      </div>
    </div>
  );
}

export function VitalSignsRow({
  units, volume, commission, transactionsClosed, transactionsPending, transactionsWithdrawn, capCurrent, capTarget, capPercentage,
}: VitalSignsRowProps) {
  const { formatCurrency } = useFormatters();
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <StatCard title="Units" value={units} />
      <StatCard title="Volume" value={formatCurrency(volume)} />
      <StatCard title="Commission" value={formatCurrency(commission)} />
      <Card>
        <CardContent className="p-3 sm:p-4">
          <p className="text-xs text-muted-foreground mb-1.5">Transactions</p>
          <div className="space-y-0.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Closed</span><span className="font-semibold">{transactionsClosed}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Pending</span><span className="font-semibold">{transactionsPending}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Withdrawn</span><span className="font-semibold">{transactionsWithdrawn}</span></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 sm:p-4 flex flex-col items-center">
          <p className="text-xs text-muted-foreground mb-1 self-start">Cap Status</p>
          <CircularProgress percentage={capPercentage} value={capCurrent} />
          <p className="text-xs sm:text-[10px] text-muted-foreground text-center mt-0.5 leading-tight">
            Complete {formatCurrency(capTarget, { compact: true, decimals: 0 })} to achieve cap
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
