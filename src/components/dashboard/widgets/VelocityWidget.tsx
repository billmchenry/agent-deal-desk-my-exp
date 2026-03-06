import { TrendingDown, TrendingUp } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface VelocityWidgetProps {
  compact?: boolean;
}

export function VelocityWidget({ compact = false }: VelocityWidgetProps) {
  const { t } = useTranslation();
  const daysOnMarket = 18;
  const previousPeriod = 24;
  const improvement = ((previousPeriod - daysOnMarket) / previousPeriod) * 100;
  const isImproved = daysOnMarket < previousPeriod;

  return (
    <div className={`flex flex-col ${compact ? "gap-1.5 sm:gap-2" : "gap-4"}`}>
      <div className="flex items-baseline gap-1.5 sm:gap-2">
        <span className="font-bold text-foreground text-stat-value">
          {daysOnMarket}
        </span>
        <span className="text-muted-foreground text-xs sm:text-sm">{t("widget.daysAvg")}</span>
      </div>
      
      <div className="flex items-center gap-1.5 sm:gap-2">
        {isImproved ? (
          <div className="flex items-center gap-1 text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
            <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>{improvement.toFixed(0)}% {t("widget.faster")}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
            <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>{t("widget.slowerThanAvg")}</span>
          </div>
        )}
      </div>
      
      <p className="text-[10px] sm:text-xs text-muted-foreground">
        {t("widget.vsLastPeriod").replace("{days}", String(previousPeriod))}
      </p>
    </div>
  );
}