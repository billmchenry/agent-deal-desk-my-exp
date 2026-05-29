import { Pin, ChevronRight, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  avatar?: string;
  initials?: string;
  value?: string | number;
  status?: 'active' | 'inactive' | 'at_risk' | 'pending' | 'high' | 'medium' | 'low';
  metadata?: string;
}

interface ListCardProps {
  title: string;
  items: ListItem[];
  onPin?: () => void;
  onShare?: () => void;
  onItemClick?: (item: ListItem) => void;
  className?: string;
  maxItems?: number;
  showViewAll?: boolean;
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600',
  pending: 'bg-amber-500/10 text-amber-600',
  inactive: 'bg-muted text-muted-foreground',
  at_risk: 'bg-destructive/10 text-destructive',
  high: 'bg-destructive/10 text-destructive',
  medium: 'bg-amber-500/10 text-amber-600',
  low: 'bg-emerald-500/10 text-emerald-600',
};

export function ListCard({
  title,
  items,
  onPin,
  onShare,
  onItemClick,
  className,
  maxItems = 5,
  showViewAll = true,
}: ListCardProps) {
  const displayItems = items.slice(0, maxItems);
  const remainingCount = items.length - maxItems;

  return (
    <div className={cn(
      'bg-card border border-border rounded-xl overflow-hidden group',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h4 className="font-medium text-foreground text-sm">{title}</h4>
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

      {/* List */}
      <div className="divide-y divide-border">
        {displayItems.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No items to display
          </div>
        ) : (
          displayItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 transition-colors',
                onItemClick && 'cursor-pointer hover:bg-muted/50'
              )}
            >
              {(item.avatar || item.initials) && (
                <Avatar className="h-9 w-9">
                  {item.avatar && <AvatarImage src={item.avatar} />}
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {item.initials || item.title.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground truncate">
                    {item.subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {item.value && (
                  <span className="text-sm font-medium text-foreground tabular-nums">
                    {typeof item.value === 'number' 
                      ? `$${item.value.toLocaleString()}`
                      : item.value}
                  </span>
                )}
                {item.status && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      'text-[10px] px-1.5 py-0 capitalize font-normal',
                      statusColors[item.status]
                    )}
                  >
                    {item.status.replace('_', ' ')}
                  </Badge>
                )}
                {item.metadata && (
                  <span className="text-xs text-muted-foreground">
                    {item.metadata}
                  </span>
                )}
                {onItemClick && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {showViewAll && remainingCount > 0 && (
        <div className="px-4 py-2 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full text-xs h-7">
            View {remainingCount} more
          </Button>
        </div>
      )}
    </div>
  );
}
