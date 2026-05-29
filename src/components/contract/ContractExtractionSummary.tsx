import { DollarSign, Calendar, Users, Building2, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContractExtraction } from '@/types';
import { getContractConfidenceLevel } from '@/lib/mockContractExtraction';
import { cn } from '@/lib/utils';

interface ContractExtractionSummaryProps {
  extraction: ContractExtraction;
  onViewFullExtraction: () => void;
}

export function ContractExtractionSummary({ extraction, onViewFullExtraction }: ContractExtractionSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Check confidence levels
  const lowConfidenceFields = Object.entries(extraction.confidence)
    .filter(([_, conf]) => getContractConfidenceLevel(conf) !== 'high')
    .map(([field]) => field);

  const hasIssues = lowConfidenceFields.length > 0;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className={cn(
        "px-4 py-3 flex items-center gap-2",
        hasIssues ? "bg-warning/10" : "bg-success/10"
      )}>
        {hasIssues ? (
          <>
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning">
              {lowConfidenceFields.length} field{lowConfidenceFields.length !== 1 ? 's' : ''} need{lowConfidenceFields.length === 1 ? 's' : ''} review
            </span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">All fields verified</span>
          </>
        )}
      </div>

      {/* Content Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {/* Sales Price */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sales Price</p>
            <p className="text-sm font-semibold text-foreground">{formatCurrency(extraction.salesPrice)}</p>
          </div>
        </div>

        {/* Closing Date */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Closing Date</p>
            <p className="text-sm font-semibold text-foreground">{formatDate(extraction.closingDate)}</p>
          </div>
        </div>

        {/* Buyer */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Buyer</p>
            <p className="text-sm font-semibold text-foreground truncate max-w-[120px]">
              {extraction.buyers[0]?.name || 'Not specified'}
            </p>
          </div>
        </div>

        {/* Title Company */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Title Company</p>
            <p className="text-sm font-semibold text-foreground truncate max-w-[120px]">
              {extraction.titleCompany || 'Not specified'}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="px-4 pb-3 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Option Period</span>
          <span className="font-medium text-foreground">{extraction.optionPeriodDays} days</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Earnest Money</span>
          <span className="font-medium text-foreground">{formatCurrency(extraction.earnestMoney)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Option Fee</span>
          <span className="font-medium text-foreground">{formatCurrency(extraction.optionFee)}</span>
        </div>
      </div>

      {/* Action */}
      <div className="p-4 pt-0">
        <Button onClick={onViewFullExtraction} className="w-full gradient-primary">
          View & Edit
        </Button>
      </div>
    </div>
  );
}
