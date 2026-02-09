import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Capping Status</h2>
            <Button variant="outline" size="sm" className="gap-2 text-xs h-7">
              <Download className="h-3 w-3" />
              Download
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Left: Progress Ring + Stats */}
            <div className="flex flex-col items-center justify-center shrink-0 sm:w-[180px] sm:border-r sm:pr-6 border-border">
              <div className="relative h-28 w-28 shrink-0">
                <svg className="h-28 w-28 -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="hsl(var(--exp-green))"
                    strokeWidth="7"
                    strokeDasharray={`${capPercentage * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-foreground">{capPercentage}%</span>
                  <span className="text-xs text-muted-foreground">Complete</span>
                </div>
              </div>
              <div className="mt-2 text-center space-y-0.5">
                <p className="text-xs font-semibold text-foreground">
                  {formatCurrency(capCurrent)} <span className="text-muted-foreground font-normal">/ {formatCurrency(capTarget)}</span>
                </p>
                <p className="text-xs sm:text-[10px] text-muted-foreground">
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
