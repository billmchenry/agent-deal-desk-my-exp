import { Card, CardContent } from "@/components/ui/card";
import { CappingHistorySection } from "./CappingHistorySection";

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
      {/* Sticky header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm border-b px-0 py-2">
        <h2 className="text-sm font-semibold text-foreground">Capping Status</h2>
      </div>

      {/* Cap Progress Card */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:justify-center">
            {/* Progress Ring */}
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0">
              <svg className="h-24 w-24 sm:h-28 sm:w-28 -rotate-90 transform" viewBox="0 0 100 100">
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
                <span className="text-xl sm:text-2xl font-bold text-foreground">{capPercentage}%</span>
                <span className="text-[10px] text-muted-foreground">Complete</span>
              </div>
            </div>

            {/* Cap Details */}
            <div className="space-y-1.5 min-w-0 text-center sm:text-left">
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(capCurrent)} <span className="text-muted-foreground font-normal">of {formatCurrency(capTarget)}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(remaining)} remaining to cap
              </p>
              <div className="w-48 mx-auto sm:mx-0 bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-exp-green h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(capPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capping History Table */}
      <CappingHistorySection />
    </section>
  );
}
