import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ExternalLink, 
  Pin,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChatMessage, Visualization } from '@/types';
import { ChartCard } from '@/components/visualizations/ChartCard';
import { DataTable } from '@/components/visualizations/DataTable';
import { ListCard } from '@/components/visualizations/ListCard';
import { MetricCard } from '@/components/visualizations/MetricCard';

interface IntelligentResponseProps {
  message: ChatMessage;
  onPin?: () => void;
  onQueryClick?: (query: string) => void;
  className?: string;
}

const keyPointIcons: Record<string, typeof TrendingUp> = {
  increase: TrendingUp,
  decrease: TrendingDown,
  warning: AlertCircle,
  success: CheckCircle,
  insight: Lightbulb,
  default: Sparkles,
};

export function IntelligentResponse({ 
  message, 
  onPin, 
  onQueryClick,
  className 
}: IntelligentResponseProps) {
  const [showSources, setShowSources] = useState(false);
  const [showAllKeyPoints, setShowAllKeyPoints] = useState(false);

  const hasVisualizations = message.visualizations && message.visualizations.length > 0;
  const hasSources = message.sources && message.sources.length > 0;
  const hasKeyPoints = message.keyPoints && message.keyPoints.length > 0;
  const hasRelatedQueries = message.relatedQueries && message.relatedQueries.length > 0;

  // Extract summary from content or use the summary field
  const summary = message.summary || (message.content.length > 120 
    ? message.content.substring(0, 120) + '...' 
    : message.content);

  const displayedKeyPoints = showAllKeyPoints 
    ? message.keyPoints 
    : message.keyPoints?.slice(0, 3);

  const renderVisualization = (viz: Visualization, index: number) => {
    const isCompact = (message.visualizations?.length || 0) > 1;
    
    switch (viz.type) {
      case 'line':
      case 'bar':
      case 'pie':
      case 'area':
        return (
          <ChartCard 
            key={index}
            visualization={viz} 
            onPin={onPin}
            compact={isCompact}
          />
        );
      case 'table':
        return (
          <DataTable 
            key={index}
            title={viz.title} 
            columns={viz.columns || []} 
            data={viz.data} 
            onPin={onPin}
            maxRows={5}
          />
        );
      case 'list':
        return (
          <ListCard 
            key={index}
            title={viz.title} 
            items={viz.data} 
            onPin={onPin}
            maxItems={4}
          />
        );
      case 'metric':
        return (
          <MetricCard 
            key={index}
            title={viz.title}
            value={viz.data.value}
            change={viz.data.change}
            changeLabel={viz.data.changeLabel}
            onPin={onPin}
            size="sm"
          />
        );
      default:
        return null;
    }
  };

  const getVisualizationLayout = () => {
    const count = message.visualizations?.length || 0;
    if (count === 0) return '';
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <div className={cn('space-y-4 animate-fade-in', className)}>
      {/* Summary Card - The Key Insight */}
      {summary && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-primary/80 uppercase tracking-wide mb-1">
                Key Insight
              </p>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {summary}
              </p>
            </div>
            {onPin && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-60 hover:opacity-100 hover:text-primary"
                onClick={onPin}
                title="Pin to Pulse"
              >
                <Pin className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Primary Visualization Zone */}
      {hasVisualizations && (
        <div className={cn('grid gap-4', getVisualizationLayout())}>
          {message.visualizations?.map((viz, i) => renderVisualization(viz, i))}
        </div>
      )}

      {/* Key Points Section */}
      {hasKeyPoints && (
        <div className="rounded-xl bg-card border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Key Factors
            </h4>
            {message.keyPoints && message.keyPoints.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setShowAllKeyPoints(!showAllKeyPoints)}
              >
                {showAllKeyPoints ? 'Show less' : `+${message.keyPoints.length - 3} more`}
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {displayedKeyPoints?.map((point, i) => {
              const IconComponent = keyPointIcons[point.icon] || keyPointIcons.default;
              return (
                <div 
                  key={i}
                  className="flex items-start gap-3 p-2 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className={cn(
                    'w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0',
                    point.icon === 'decrease' || point.icon === 'warning' 
                      ? 'bg-destructive/10 text-destructive'
                      : point.icon === 'increase' || point.icon === 'success'
                      ? 'bg-success/10 text-success'
                      : 'bg-primary/10 text-primary'
                  )}>
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm text-muted-foreground flex-1">{point.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Content (if not just summary) */}
      {message.expandedContent && (
        <div className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-2 border-border">
          {message.expandedContent}
        </div>
      )}

      {/* Sources Panel */}
      {hasSources && (
        <div className="rounded-lg bg-secondary/30 overflow-hidden">
          <button
            onClick={() => setShowSources(!showSources)}
            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-secondary/50 transition-colors"
          >
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              {message.sources?.length} Sources
            </span>
            {showSources ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {showSources && (
            <div className="px-4 pb-3 pt-1 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {message.sources?.map((source, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {source}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Related Questions */}
      {hasRelatedQueries && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            Ask more
          </p>
          <div className="flex flex-wrap gap-2">
            {message.relatedQueries?.map((query, i) => (
              <button
                key={i}
                onClick={() => onQueryClick?.(query)}
                className="text-sm px-3 py-1.5 rounded-full bg-secondary/80 text-secondary-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
