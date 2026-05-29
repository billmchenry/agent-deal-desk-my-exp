import { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Sparkles,
  FileCheck,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClassifiedDocument } from '@/types/batch';
import { ListingExtraction } from '@/types';
import { getTierBadgeStyle } from '@/lib/mockDocumentClassification';
import { cn } from '@/lib/utils';
import { SupportingDocumentView } from './SupportingDocumentView';

interface BatchExtractionSummaryProps {
  documents: ClassifiedDocument[];
  primaryExtraction: ListingExtraction | null;
  onViewPrimary: () => void;
  onApproveDocument: (docId: string) => void;
  onRejectDocument: (docId: string) => void;
  onAttachAll: () => void;
  onReviewIndividually: () => void;
  approvalState: Record<string, 'pending' | 'approved' | 'rejected'>;
}

export function BatchExtractionSummary({
  documents,
  primaryExtraction,
  onViewPrimary,
  onApproveDocument,
  onRejectDocument,
  onAttachAll,
  onReviewIndividually,
  approvalState,
}: BatchExtractionSummaryProps) {
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);
  
  const primaryDoc = documents.find(d => d.classification.tier === 'primary') ?? documents[0];
  const supportingDocs = primaryDoc ? documents.filter(d => d.id !== primaryDoc.id) : [];
  
  const approvedCount = Object.values(approvalState).filter(s => s === 'approved').length;
  const pendingCount = Object.values(approvalState).filter(s => s === 'pending').length;
  const allApproved = pendingCount === 0 && approvedCount > 0;

  const getDocumentStatus = (doc: ClassifiedDocument) => {
    const state = approvalState[doc.id];
    if (state === 'approved') return { icon: CheckCircle2, color: 'text-success', label: 'Approved' };
    if (state === 'rejected') return { icon: AlertTriangle, color: 'text-destructive', label: 'Rejected' };
    return { icon: FileCheck, color: 'text-muted-foreground', label: 'Pending' };
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (selectedDocIndex === null) return;
    const newIndex = direction === 'prev' ? selectedDocIndex - 1 : selectedDocIndex + 1;
    if (newIndex >= 0 && newIndex < supportingDocs.length) {
      setSelectedDocIndex(newIndex);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Mira Message */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground">
              <span className="font-medium">Great!</span> I've processed all {documents.length} documents. 
              {primaryDoc && (
                <> Your <span className="font-medium">{primaryDoc.classification.displayName}</span> is ready for verification.</>
              )}
            </p>
          </div>
        </div>

        {/* Primary Document Card */}
        {primaryDoc && primaryExtraction && (
          <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">
                    {primaryDoc.classification.displayName}
                  </h3>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                    PRIMARY
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {primaryExtraction.propertyAddress}, {primaryExtraction.city}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>${primaryExtraction.listingPrice.toLocaleString()}</span>
                  <span>•</span>
                  <span>
                    {primaryExtraction.signaturesDetected ? (
                      <span className="text-success">✓ Signatures detected</span>
                    ) : (
                      <span className="text-warning">⚠ Missing signatures</span>
                    )}
                  </span>
                </div>
              </div>
              <Button onClick={onViewPrimary} className="flex-shrink-0">
                View & Edit
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Supporting Documents */}
        {supportingDocs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">
                Supporting Documents ({supportingDocs.length})
              </h4>
              <span className="text-xs text-muted-foreground">
                {approvedCount} approved, {pendingCount} pending
              </span>
            </div>
            
            <div className="space-y-2">
              {supportingDocs.map((doc, index) => {
                const tierStyle = getTierBadgeStyle(doc.classification.tier);
                const status = getDocumentStatus(doc);
                const StatusIcon = status.icon;
                
                return (
                  <div
                    key={doc.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/30',
                      approvalState[doc.id] === 'approved' && 'border-success/30 bg-success/5',
                      approvalState[doc.id] === 'rejected' && 'border-destructive/30 bg-destructive/5',
                      approvalState[doc.id] === 'pending' && 'border-border'
                    )}
                    onClick={() => setSelectedDocIndex(index)}
                  >
                    {/* Status Icon */}
                    <StatusIcon className={cn('w-4 h-4 flex-shrink-0', status.color)} />
                    
                    {/* Document Icon */}
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                    
                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {doc.classification.displayName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn(
                          'text-xs px-1.5 py-0.5 rounded',
                          tierStyle.bg, tierStyle.text
                        )}>
                          {tierStyle.label}
                        </span>
                        {doc.classification.checklistMatch && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <LinkIcon className="w-3 h-3" />
                            {doc.classification.checklistMatch}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* View button */}
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onReviewIndividually}
            className="flex-1"
          >
            Review Individually
          </Button>
          <Button
            onClick={onAttachAll}
            disabled={!allApproved && pendingCount > 0}
            className="flex-1 gradient-primary"
          >
            {allApproved ? 'Attach All to Checklist' : `Approve ${pendingCount} Pending`}
          </Button>
        </div>
      </div>

      {/* Supporting Document View Sheet */}
      {selectedDocIndex !== null && supportingDocs[selectedDocIndex] && (
        <SupportingDocumentView
          open={true}
          onClose={() => setSelectedDocIndex(null)}
          document={supportingDocs[selectedDocIndex]}
          onApprove={() => {
            onApproveDocument(supportingDocs[selectedDocIndex].id);
            // Auto-advance to next document if available
            if (selectedDocIndex < supportingDocs.length - 1) {
              setSelectedDocIndex(selectedDocIndex + 1);
            } else {
              setSelectedDocIndex(null);
            }
          }}
          onReject={() => {
            onRejectDocument(supportingDocs[selectedDocIndex].id);
            setSelectedDocIndex(null);
          }}
          onReclassify={() => {
            // In a real app, this would update the classification
          }}
          currentIndex={selectedDocIndex}
          totalDocuments={supportingDocs.length}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}
