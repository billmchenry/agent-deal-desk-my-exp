import { MapPin, Users, DollarSign, Calendar, ShieldCheck, ShieldAlert, Building2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ListingExtraction, ContractExtraction } from '@/types';
import { getConfidenceLevel } from '@/lib/mockDocumentExtraction';
import { getContractConfidenceLevel } from '@/lib/mockContractExtraction';

interface ListingSummaryProps {
  type: 'listing';
  extraction: ListingExtraction;
  onViewFullExtraction: () => void;
}

interface ContractSummaryProps {
  type: 'contract';
  extraction: ContractExtraction;
  onViewFullExtraction: () => void;
}

type UnifiedExtractionSummaryProps = ListingSummaryProps | ContractSummaryProps;

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};

export function UnifiedExtractionSummary(props: UnifiedExtractionSummaryProps) {
  if (props.type === 'listing') {
    return <ListingSummaryView extraction={props.extraction} onViewFullExtraction={props.onViewFullExtraction} />;
  }
  return <ContractSummaryView extraction={props.extraction} onViewFullExtraction={props.onViewFullExtraction} />;
}

function ListingSummaryView({ extraction, onViewFullExtraction }: { extraction: ListingExtraction; onViewFullExtraction: () => void }) {
  const isCompliant = extraction.complianceStatus === 'compliant';
  
  // Count low confidence fields
  const lowConfidenceFields = Object.entries(extraction.confidence || {})
    .filter(([_, conf]) => getConfidenceLevel(conf) !== 'high')
    .length;

  const hasIssues = lowConfidenceFields > 0 || !isCompliant;
  
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className={cn(
        "px-4 py-3 flex items-center gap-2",
        hasIssues ? "bg-warning/10" : "bg-success/10"
      )}>
        {hasIssues ? (
          <>
            <ShieldAlert className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-warning">
              {lowConfidenceFields > 0 
                ? `${lowConfidenceFields} field${lowConfidenceFields !== 1 ? 's' : ''} need${lowConfidenceFields === 1 ? 's' : ''} review`
                : 'Issues found'
              }
            </span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-success">100% Compliant</span>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
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
      </div>

      {/* Action */}
      <div className="p-4 pt-0">
        <Button onClick={onViewFullExtraction} variant="outline" className="w-full">
          View & Edit
        </Button>
      </div>
    </div>
  );
}

function ContractSummaryView({ extraction, onViewFullExtraction }: { extraction: ContractExtraction; onViewFullExtraction: () => void }) {
  // Calculate which fields are actually missing
  const missingFields = [];
  if (!extraction.mlsNumber) missingFields.push('MLS Number');
  if (!extraction.representationType) missingFields.push('Representation Type');
  if (!extraction.referrals || extraction.referrals.length === 0) missingFields.push('Referral Fees');
  if (!extraction.transactionLeadSource) missingFields.push('Source of Business');
  if (!extraction.escrowOfficerEmail) missingFields.push('Escrow Officer Email');

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Buyer */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Buyer</p>
            <p className="font-medium text-foreground">
              {extraction.buyers.map(b => b.name).join(' & ') || 'Not specified'}
            </p>
          </div>
        </div>

        {/* Sales Price */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sales Price</p>
            <p className="font-medium text-foreground">
              {formatCurrency(extraction.salesPrice)}
            </p>
          </div>
        </div>

        {/* Closing Date */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-info" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Closing Date</p>
            <p className="font-medium text-foreground">
              {formatDate(extraction.closingDate)}
            </p>
          </div>
        </div>

        {/* Option Fee & Period */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Option Period</p>
            <p className="font-medium text-foreground">
              {formatCurrency(extraction.optionFee)} | {extraction.optionPeriodDays} days
            </p>
          </div>
        </div>

        {/* Title Company */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Title Company</p>
            <p className="font-medium text-foreground">
              {extraction.titleCompany || 'Not specified'}
            </p>
          </div>
        </div>

        {/* Buyer's Agent */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Buyer's Agent</p>
            <p className="font-medium text-foreground">
              {extraction.buyingBrokerName || 'Not specified'}
            </p>
          </div>
        </div>

        {/* Earnest Money */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Earnest Money</p>
            <p className="font-medium text-foreground">
              {formatCurrency(extraction.earnestMoney)}
            </p>
          </div>
        </div>

        {/* Fields to Complete - Dynamic based on what's actually missing */}
        {missingFields.length > 0 && (
          <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">Fields to complete:</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-blue-600 dark:text-blue-400">
              {missingFields.map((field) => (
                <span key={field} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-blue-400" />
                  {field}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="p-4 pt-0">
        <Button onClick={onViewFullExtraction} variant="outline" className="w-full">
          View & Edit
        </Button>
      </div>
    </div>
  );
}
