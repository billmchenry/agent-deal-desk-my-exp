import { TrendingUp, TrendingDown, Minus, Pin, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onPin?: () => void;
  onShare?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  subtitle,
  icon,
  onPin,
  onShare,
  className,
  size = 'md',
}: MetricCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString() 
    : value;

  return (
    <div className={cn(
      'bg-card border border-border rounded-xl p-4 transition-all duration-200 hover:shadow-card group',
      size === 'sm' && 'p-3',
      size === 'lg' && 'p-6',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
          )}
          <span className={cn(
            'text-muted-foreground',
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}>
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onPin && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={onPin}
            >
              <Pin className="w-3.5 h-3.5" />
            </Button>
          )}
          {onShare && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={onShare}
            >
              <Share2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      <div className={cn(
        'font-semibold text-foreground mt-2',
        size === 'sm' && 'text-xl',
        size === 'md' && 'text-2xl',
        size === 'lg' && 'text-3xl'
      )}>
        {formattedValue}
      </div>

      {(change !== undefined || subtitle) && (
        <div className="flex items-center gap-2 mt-1">
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-0.5 text-xs font-medium',
              isPositive && 'text-emerald-600',
              isNegative && 'text-destructive',
              !isPositive && !isNegative && 'text-muted-foreground'
            )}>
              {isPositive && <TrendingUp className="w-3 h-3" />}
              {isNegative && <TrendingDown className="w-3 h-3" />}
              {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
              <span>{isPositive ? '+' : ''}{change}%</span>
            </div>
          )}
          {changeLabel && (
            <span className="text-xs text-muted-foreground">
              {changeLabel}
            </span>
          )}
          {subtitle && !change && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
