import { useEffect, useRef } from 'react';
import { CheckCircle2, Loader2, Clock, AlertCircle, FileText, Sparkles } from 'lucide-react';
import { ClassifiedContractDocument, getContractTierBadgeStyle } from '@/lib/mockContractClassification';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ContractBatchProcessingStatusProps {
  documents: ClassifiedContractDocument[];
  currentIndex: number;
  onComplete: (documents: ClassifiedContractDocument[]) => void;
  onUpdateDocuments?: (documents: ClassifiedContractDocument[]) => void;
}

export function ContractBatchProcessingStatus({ 
  documents, 
  currentIndex,
  onComplete,
  onUpdateDocuments
}: ContractBatchProcessingStatusProps) {
  const hasStartedRef = useRef(false);
  const completedCount = documents.filter(d => d.status === 'complete').length;
  const errorCount = documents.filter(d => d.status === 'error').length;
  const progress = (completedCount / documents.length) * 100;
  
  const currentDoc = documents[currentIndex];
  const isAllComplete = completedCount + errorCount === documents.length;

  // Simulate processing documents sequentially
  useEffect(() => {
    if (hasStartedRef.current || !onUpdateDocuments) return;
    hasStartedRef.current = true;
    
    const processDocuments = async () => {
      let updatedDocs = [...documents];
      
      for (let i = 0; i < documents.length; i++) {
        // Mark current document as processing
        updatedDocs = updatedDocs.map((doc, idx) => 
          idx === i ? { ...doc, status: 'processing' as const } : doc
        );
        onUpdateDocuments(updatedDocs);
        
        // Simulate processing time (1-2 seconds per document)
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // Mark as complete (occasionally mark as error for demo)
        const hasError = Math.random() < 0.05; // 5% chance of error
        updatedDocs = updatedDocs.map((doc, idx) => 
          idx === i ? { ...doc, status: hasError ? 'error' as const : 'complete' as const } : doc
        );
        onUpdateDocuments(updatedDocs);
      }
      
      // Small delay before calling onComplete with final documents
      setTimeout(() => {
        onComplete(updatedDocs);
      }, 500);
    };
    
    processDocuments();
  }, [documents.length, onComplete, onUpdateDocuments]);

  const getStatusIcon = (status: ClassifiedContractDocument['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'queued':
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Mira Message */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-foreground">
            {isAllComplete ? (
              <>
                <span className="font-medium">All done!</span> I've classified {completedCount} document{completedCount !== 1 ? 's' : ''}.
                {errorCount > 0 && ` (${errorCount} had issues)`}
              </>
            ) : currentDoc ? (
              <>
                Classifying <span className="font-medium">{currentDoc.classification.displayName}</span>...
                {' '}({completedCount + 1} of {documents.length})
              </>
            ) : (
              'Starting contract classification...'
            )}
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Classifying {documents.length} contract documents</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Document List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {documents.map((doc) => {
          const tierStyle = getContractTierBadgeStyle(doc.classification.tier);
          const isPrimary = doc.classification.tier === 'primary';
          
          return (
            <div
              key={doc.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border transition-all',
                doc.status === 'processing' && 'border-primary/50 bg-primary/5',
                doc.status === 'complete' && 'border-success/30 bg-success/5',
                doc.status === 'error' && 'border-destructive/30 bg-destructive/5',
                doc.status === 'queued' && 'border-border bg-card'
              )}
            >
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {getStatusIcon(doc.status)}
              </div>

              {/* Document Icon */}
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                isPrimary ? 'bg-primary/10' : 'bg-muted'
              )}>
                <FileText className={cn(
                  'w-4 h-4',
                  isPrimary ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>

              {/* Document Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {doc.file.name}
                  </p>
                  {isPrimary && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      PRIMARY
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn(
                    'text-xs px-1.5 py-0.5 rounded',
                    tierStyle.bg, tierStyle.text
                  )}>
                    {doc.classification.displayName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {doc.classification.confidence}% match
                  </span>
                </div>
                {doc.classification.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {doc.classification.description}
                  </p>
                )}
              </div>

              {/* Processing indicator */}
              {doc.status === 'processing' && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
