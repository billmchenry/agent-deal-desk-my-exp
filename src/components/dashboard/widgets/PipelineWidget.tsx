import { Home, Clock, CheckCircle } from "lucide-react";

interface PipelineWidgetProps {
  compact?: boolean;
}

const pipelineData = {
  totalValue: 2450000,
  escrows: [
    { status: "Pending", count: 3, icon: Clock },
    { status: "In Escrow", count: 5, icon: Home },
    { status: "Closing Soon", count: 2, icon: CheckCircle },
  ],
};

export function PipelineWidget({ compact = false }: PipelineWidgetProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className={`flex flex-col ${compact ? "gap-3" : "gap-4"}`}>
      <div>
        <p className="text-xs text-muted-foreground mb-1">Total Pipeline Value</p>
        <p className={`font-bold text-foreground ${compact ? "text-xl" : "text-2xl"}`}>
          {formatCurrency(pipelineData.totalValue)}
        </p>
      </div>
      
      <div className={`grid grid-cols-3 ${compact ? "gap-2" : "gap-3"}`}>
        {pipelineData.escrows.map((item) => (
          <div 
            key={item.status} 
            className="flex flex-col items-center p-2 rounded-lg bg-muted/50"
          >
            <item.icon className={`${compact ? "h-4 w-4" : "h-5 w-5"} text-primary mb-1`} />
            <span className={`font-bold text-foreground ${compact ? "text-lg" : "text-xl"}`}>
              {item.count}
            </span>
            <span className="text-[10px] text-muted-foreground text-center leading-tight">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
