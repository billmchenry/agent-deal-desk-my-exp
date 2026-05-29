import { MapPin, Users, DollarSign, Calendar, ShieldCheck, ShieldAlert } from 'lucide-react';
import { ListingExtraction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/mockDocumentExtraction';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExtractionSummaryProps {
  extraction: ListingExtraction;
  onViewFullExtraction: () => void;
}

export function ExtractionSummary({ extraction, onViewFullExtraction }: ExtractionSummaryProps) {
  const isCompliant = extraction.complianceStatus === 'compliant';
  
  return (
    <div className="p-4 rounded-xl border border-border bg-card space-y-4 animate-fade-in">
      {/* Property */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Property</p>
          <p className="font-medium text-foreground">
            {extraction.propertyAddress}, {extraction.city}, {extraction.state}
          </p>
        </div>
      </div>

      {/* Sellers */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Users className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Sellers</p>
          <p className="font-medium text-foreground">
            {extraction.sellers.map(s => s.name).join(', ')}
          </p>
        </div>
      </div>

      {/* Price & Commission */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
          <DollarSign className="w-4 h-4 text-success" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Price & Commission</p>
          <p className="font-medium text-foreground">
            {formatCurrency(extraction.listingPrice)} | {extraction.totalCommission}%
          </p>
        </div>
      </div>

      {/* Term */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-4 h-4 text-info" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Term</p>
          <p className="font-medium text-foreground">
            Ends {formatDate(extraction.listingEndDate)}
          </p>
        </div>
      </div>

      {/* Compliance Status */}
      <div className={cn(
        'flex items-center gap-3 p-3 rounded-lg',
        isCompliant ? 'bg-success/10' : 'bg-warning/10'
      )}>
        {isCompliant ? (
          <ShieldCheck className="w-5 h-5 text-success" />
        ) : (
          <ShieldAlert className="w-5 h-5 text-warning" />
        )}
        <div className="flex-1">
          <p className={cn(
            'font-medium',
            isCompliant ? 'text-success' : 'text-warning'
          )}>
            {isCompliant ? '100% Compliant' : 'Issues Found'}
          </p>
          <p className="text-xs text-muted-foreground">
            {isCompliant 
              ? 'All signatures and initials detected'
              : 'Some fields require review'
            }
          </p>
        </div>
      </div>

      {/* View Full Extraction Button */}
      <Button 
        onClick={onViewFullExtraction} 
        className="w-full"
        variant="outline"
      >
        View & Edit
      </Button>
    </div>
  );
}
