import { useState } from 'react';
import { 
  X, 
  Maximize2, 
  Download, 
  Share2, 
  MessageSquare,
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Visualization } from '@/types';
import { ChartCard } from './ChartCard';
import { DataTable } from './DataTable';

interface ExploreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visualization: Visualization;
  onAskMira?: (query: string) => void;
}

type TimeRange = '1M' | '3M' | '6M' | 'YTD' | '1Y' | 'ALL';
type ChartType = 'line' | 'bar' | 'area';

export function ExploreModal({ 
  open, 
  onOpenChange, 
  visualization,
  onAskMira 
}: ExploreModalProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('6M');
  const [chartType, setChartType] = useState<ChartType>(
    visualization.type === 'pie' ? 'bar' : (visualization.type as ChartType) || 'line'
  );

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '1M', label: '1 Month' },
    { value: '3M', label: '3 Months' },
    { value: '6M', label: '6 Months' },
    { value: 'YTD', label: 'Year to Date' },
    { value: '1Y', label: '1 Year' },
    { value: 'ALL', label: 'All Time' },
  ];

  const chartTypes: { value: ChartType; label: string }[] = [
    { value: 'line', label: 'Line' },
    { value: 'bar', label: 'Bar' },
    { value: 'area', label: 'Area' },
  ];

  const modifiedViz: Visualization = {
    ...visualization,
    type: chartType,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {visualization.title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-border">
            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div className="flex bg-secondary/50 rounded-lg p-1">
                {timeRanges.slice(0, 4).map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
                      timeRange === range.value
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {range.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Type Selector */}
            {visualization.type !== 'table' && visualization.type !== 'list' && visualization.type !== 'metric' && (
              <Select value={chartType} onValueChange={(v) => setChartType(v as ChartType)}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chartTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label} Chart
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Filter Button */}
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>

            {/* Refresh Button */}
            <Button variant="outline" size="sm" className="gap-2 ml-auto">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          {/* Main Visualization */}
          <div className="min-h-[300px]">
            {visualization.type === 'table' ? (
              <DataTable
                title=""
                columns={visualization.columns || []}
                data={visualization.data}
                maxRows={20}
              />
            ) : visualization.type === 'pie' ? (
              <ChartCard visualization={visualization} />
            ) : (
              <ChartCard visualization={modifiedViz} />
            )}
          </div>

          {/* Data Table Below Chart */}
          {visualization.type !== 'table' && visualization.type !== 'list' && (
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Data Table</h4>
              <DataTable
                title=""
                columns={[
                  { key: 'label', label: 'Period', sortable: true },
                  { key: 'value', label: 'Value', type: 'number', sortable: true },
                ]}
                data={visualization.data || []}
                maxRows={10}
              />
            </div>
          )}
        </div>

        {/* Ask Mira Footer */}
        {onAskMira && (
          <div className="px-6 py-4 border-t border-border bg-secondary/30 flex-shrink-0">
            <Button 
              variant="outline" 
              className="w-full gap-2 justify-center"
              onClick={() => onAskMira(`Tell me more about ${visualization.title}`)}
            >
              <MessageSquare className="w-4 h-4" />
              Ask Mira about this data
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
