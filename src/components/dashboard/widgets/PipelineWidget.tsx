import { Home, Clock, CheckCircle } from "lucide-react";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";

interface PipelineWidgetProps {
  compact?: boolean;
}

export function PipelineWidget({ compact = false }: PipelineWidgetProps) {
  const { formatCurrency } = useFormatters();
  const { t } = useTranslation();

  const fmtCurrency = (value: number) => formatCurrency(value, { decimals: 0 });

  const pipelineData = {
    totalValue: 2450000,
    escrows: [
      { status: t("widget.pending"), count: 3, icon: Clock },
      { status: t("widget.inEscrow"), count: 5, icon: Home },
      { status: t("widget.closingSoon"), count: 2, icon: CheckCircle },
    ],
  };

  return (
    <div className={`flex flex-col ${compact ? "gap-2 sm:gap-3" : "gap-4"}`}>
      <div>
        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">{t("widget.totalPipelineValue")}</p>
        <p className="font-bold text-foreground text-stat-value">
          {fmtCurrency(pipelineData.totalValue)}
        </p>
      </div>
      
      <div className={`grid grid-cols-3 ${compact ? "gap-1.5 sm:gap-2" : "gap-3"}`}>
        {pipelineData.escrows.map((item) => (
          <div 
            key={item.status} 
            className="flex flex-col items-center p-1.5 sm:p-2 rounded-lg bg-muted/50"
          >
            <item.icon className={`${compact ? "h-3.5 w-3.5 sm:h-4 sm:w-4" : "h-5 w-5"} text-primary mb-0.5 sm:mb-1`} />
            <span className={`font-bold text-foreground ${compact ? "text-base sm:text-lg" : "text-xl"}`}>
              {item.count}
            </span>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground text-center leading-tight">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}