import { CheckCircle2, FileText, AlertCircle, ChevronRight, FileCheck, FilePlus } from 'lucide-react';
import { ClassifiedContractDocument, getContractTierBadgeStyle, getContractBatchSummary } from '@/lib/mockContractClassification';
import { ContractExtraction } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ContractBatchExtractionSummaryProps {
  documents: ClassifiedContractDocument[];
  primaryExtraction: ContractExtraction | null;
  onViewPrimary: () => void;
  onProceed: () => void;
}

export function ContractBatchExtractionSummary({
  documents,
  primaryExtraction,
  onViewPrimary,
  onProceed,
}: ContractBatchExtractionSummaryProps) {
  const summary = getContractBatchSummary(documents);
  const primaryDoc = documents.find(d => d.classification.tier === 'primary');

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-primary/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary">{summary.total}</div>
          <div className="text-xs text-muted-foreground">Documents</div>
        </div>
        <div className="bg-info/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-info">{summary.addendaCount}</div>
          <div className="text-xs text-muted-foreground">Addenda</div>
        </div>
        <div className="bg-warning/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-warning">{summary.disclosureCount}</div>
          <div className="text-xs text-muted-foreground">Disclosures</div>
        </div>
      </div>

      {/* Primary Document Card */}
      {primaryDoc && primaryExtraction && (
        <div className="bg-card rounded-lg border border-primary/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileCheck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Executed Contract (Resale)</p>
                <p className="text-xs text-muted-foreground">{primaryDoc.file.name}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
              Primary
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Property</p>
              <p className="font-medium truncate">{primaryExtraction.propertyAddress}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Sales Price</p>
              <p className="font-medium">${primaryExtraction.salesPrice?.toLocaleString()}</p>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={onViewPrimary}
          >
            <FileText className="w-4 h-4 mr-2" />
            View & Edit Details
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
        </div>
      )}

      {/* Supporting Documents List */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Supporting Documents
        </p>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {documents
            .filter(d => d.classification.tier !== 'primary')
            .map(doc => {
              const tierStyle = getContractTierBadgeStyle(doc.classification.tier);
              const isComplete = doc.status === 'complete';
              
              return (
                <div
                  key={doc.id}
                  className={cn(
                    'flex items-center gap-3 p-2.5 rounded-lg border bg-card',
                    isComplete && 'border-success/20'
                  )}
                >
                  <div className="flex-shrink-0">
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <FilePlus className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {doc.classification.displayName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {doc.file.name}
                    </p>
                  </div>

                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded flex-shrink-0',
                    tierStyle.bg, tierStyle.text
                  )}>
                    {tierStyle.label}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Action Button */}
      <Button 
        className="w-full" 
        onClick={onProceed}
      >
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Continue with {summary.total} Document{summary.total !== 1 ? 's' : ''}
        <ChevronRight className="w-4 h-4 ml-auto" />
      </Button>
    </div>
  );
}
