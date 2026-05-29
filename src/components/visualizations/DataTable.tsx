import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Pin, Download, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import { VisualizationColumn } from '@/types';

interface DataTableProps {
  title: string;
  columns: VisualizationColumn[];
  data: Record<string, any>[];
  onPin?: () => void;
  onShare?: () => void;
  className?: string;
  maxRows?: number;
}

type SortDirection = 'asc' | 'desc' | null;

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  inactive: 'bg-muted text-muted-foreground',
  at_risk: 'bg-destructive/10 text-destructive border-destructive/20',
  closed: 'bg-primary/10 text-primary border-primary/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  low: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
};

export function DataTable({ 
  title, 
  columns, 
  data, 
  onPin,
  onShare,
  className,
  maxRows = 10 
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [showAll, setShowAll] = useState(false);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(row => 
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(query)
        )
      );
    }

    // Sort
    if (sortKey && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        return sortDirection === 'asc' 
          ? aStr.localeCompare(bStr) 
          : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [data, searchQuery, sortKey, sortDirection]);

  const displayData = showAll 
    ? filteredAndSortedData 
    : filteredAndSortedData.slice(0, maxRows);

  const formatCell = (value: any, type?: VisualizationColumn['type']) => {
    if (value === null || value === undefined) return '—';
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return `${value > 0 ? '+' : ''}${value}%`;
      case 'number':
        return value.toLocaleString();
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'status':
        return (
          <Badge 
            variant="outline" 
            className={cn(
              'capitalize font-normal',
              statusColors[value.toLowerCase()] || statusColors.inactive
            )}
          >
            {value.replace('_', ' ')}
          </Badge>
        );
      default:
        return value;
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-muted-foreground" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5 ml-1 text-primary" />
      : <ArrowDown className="w-3.5 h-3.5 ml-1 text-primary" />;
  };

  return (
    <div className={cn('bg-card border border-border rounded-xl', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h4 className="font-medium text-foreground">{title}</h4>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 w-40 text-sm"
            />
          </div>
          {onPin && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPin}>
              <Pin className="w-4 h-4" />
            </Button>
          )}
          {onShare && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col) => (
                <TableHead 
                  key={col.key}
                  className={cn(
                    'text-xs font-medium text-muted-foreground',
                    col.sortable && 'cursor-pointer select-none hover:text-foreground'
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center">
                    {col.label}
                    {col.sortable && <SortIcon columnKey={col.key} />}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="text-center text-muted-foreground py-8"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((row, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  {columns.map((col) => (
                    <TableCell 
                      key={col.key} 
                      className={cn(
                        'text-sm',
                        col.type === 'number' || col.type === 'currency' || col.type === 'percentage'
                          ? 'font-medium tabular-nums'
                          : ''
                      )}
                    >
                      {formatCell(row[col.key], col.type)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      {filteredAndSortedData.length > maxRows && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Showing {displayData.length} of {filteredAndSortedData.length} rows
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show less' : 'View all'}
          </Button>
        </div>
      )}
    </div>
  );
}
