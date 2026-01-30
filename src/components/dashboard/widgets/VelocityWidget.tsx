import { TrendingDown, TrendingUp } from "lucide-react";

interface VelocityWidgetProps {
  compact?: boolean;
}

export function VelocityWidget({ compact = false }: VelocityWidgetProps) {
  const daysOnMarket = 18;
  const previousPeriod = 24;
  const improvement = ((previousPeriod - daysOnMarket) / previousPeriod) * 100;
  const isImproved = daysOnMarket < previousPeriod;

  return (
    <div className={`flex flex-col ${compact ? "gap-2" : "gap-4"}`}>
      <div className="flex items-baseline gap-2">
        <span className={`font-bold text-foreground ${compact ? "text-3xl" : "text-4xl"}`}>
          {daysOnMarket}
        </span>
        <span className="text-muted-foreground text-sm">days avg.</span>
      </div>
      
      <div className="flex items-center gap-2">
        {isImproved ? (
          <>
            <div className="flex items-center gap-1 text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs font-medium">
              <TrendingDown className="h-3 w-3" />
              <span>{improvement.toFixed(0)}% faster</span>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-1 text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full text-xs font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>Slower than avg</span>
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground">
        vs. {previousPeriod} days last period
      </p>
    </div>
  );
}
