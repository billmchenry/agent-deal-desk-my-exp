import { Card, CardContent } from "@/components/ui/card";
import { CappingHistoryTable } from "./CappingHistorySection";

interface CappingSectionProps {
  capCurrent: number;
  capTarget: number;
  capPercentage: number;
}

export function CappingSection({ capCurrent, capTarget, capPercentage }: CappingSectionProps) {
  const remaining = capTarget - capCurrent;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <section className="space-y-3">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Capping Status</h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Left: Progress Ring + Stats */}
            <div className="flex flex-col items-center justify-center shrink-0 sm:w-[180px] sm:border-r sm:pr-6 border-border">
              <div className="relative h-20 w-20 shrink-0">
                <svg className="h-20 w-20 -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="hsl(var(--exp-green))"
                    strokeWidth="8"
                    strokeDasharray={`${capPercentage * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-foreground">{capPercentage}%</span>
                  <span className="text-[9px] text-muted-foreground">Complete</span>
                </div>
              </div>
              <div className="mt-2 text-center space-y-0.5">
                <p className="text-xs font-semibold text-foreground">
                  {formatCurrency(capCurrent)} <span className="text-muted-foreground font-normal">/ {formatCurrency(capTarget)}</span>
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {formatCurrency(remaining)} remaining
                </p>
              </div>
            </div>

            {/* Right: History Table */}
            <CappingHistoryTable />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
