import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronRight } from "lucide-react";

export interface DonutDatum {
  name: string;
  value: number;
  color: string;
  label?: string;
}

interface DistributionDonutProps {
  data: DonutDatum[];
  total: number;
  formatValue: (v: number) => string;
  centerLabel: string;
  /** Optional percentage per item – if not provided, computed from total */
  showPercentage?: boolean;
}

export function DistributionDonut({
  data,
  total,
  formatValue,
  centerLabel,
  showPercentage = true,
}: DistributionDonutProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
      {/* Donut */}
      <div className="w-28 h-28 sm:w-32 sm:h-32 relative shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              dataKey="value"
              strokeWidth={2}
              stroke="hsl(var(--card))"
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold font-secondary text-foreground">
            {formatValue(total)}
          </span>
          <span className="text-xs text-muted-foreground">{centerLabel}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 w-full space-y-0.5">
        {data.map((item) => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
          return (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs group cursor-pointer hover:bg-muted/50 rounded px-1 py-2 sm:py-0.5 -mx-1"
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-foreground">{item.label ?? item.name}</span>
                {showPercentage && (
                  <span className="text-muted-foreground font-secondary">({pct}%)</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="font-secondary">{formatValue(item.value)}</span>
                <ChevronRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
