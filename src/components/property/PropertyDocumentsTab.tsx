import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, File, CheckCircle2, Clock, XCircle, Pen, FolderOpen, Download, Eye } from 'lucide-react';
import { Listing, ListingDocument, ChecklistItem } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { transactionChecklistItems } from '@/lib/mockContractExtraction';

interface PropertyDocumentsTabProps {
  listing: Listing;
}

// Default checklist items for active listings (same as in PropertyChecklistTab)
const defaultChecklistItems: ChecklistItem[] = [
  { id: '1', documentName: 'Information About Brokerage Services (IABS)', formCode: 'TREC IABS 1-1', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '2', documentName: 'Residential Real Estate Listing Agreement', formCode: 'TXR-1101', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '3', documentName: "Seller's Disclosure Notice", formCode: 'TREC OP-H', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '4', documentName: 'General Information and Notice to Buyers and Sellers', formCode: 'TXR-1506', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '5', documentName: 'MLS Profile Sheet', formCode: 'MLS', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '6', documentName: 'Keybox/Lockbox Authorization', formCode: 'LOCKBOX', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '7', documentName: 'Property Photos', formCode: 'PHOTOS', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '8', documentName: 'Unrepresented Customer Showing Form', formCode: 'TXR-1508', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '9', documentName: 'Updated IABS (1-1)', formCode: 'TREC IABS 1-1', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '10', documentName: 'Affidavit of Title', formCode: 'TITLE-AFF', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '11', documentName: 'Mortgage Payoff Information', formCode: 'PAYOFF', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '12', documentName: 'Lead-Based Paint Addendum', formCode: 'TXR-1906', status: 'in_review', isAttached: true, verifiedByMira: true, category: 'If Applicable' },
];

const statusConfig = {
  awaiting_signature: { 
    label: 'Awaiting Signature', 
    className: 'bg-warning/10 text-warning border-warning/20',
    icon: Pen 
  },
  verified: { 
    label: 'Verified', 
    className: 'bg-success/10 text-success border-success/20',
    icon: CheckCircle2 
  },
  under_review: { 
    label: 'Under Review', 
    className: 'bg-primary/10 text-primary border-primary/20',
    icon: Clock 
  },
  rejected: { 
    label: 'Rejected', 
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    icon: XCircle 
  },
};

const statusSubtitles = {
  awaiting_signature: 'Sent for signature',
  verified: 'Document approved',
  under_review: 'Pending review',
  rejected: 'Needs revision',
};

// Convert checklist item status to document status
function checklistStatusToDocStatus(status: string): 'verified' | 'under_review' | 'awaiting_signature' | 'rejected' {
  if (status === 'approved') return 'verified';
  if (status === 'in_review') return 'under_review';
  return 'under_review';
}

export function PropertyDocumentsTab({ listing }: PropertyDocumentsTabProps) {
  // Determine if this is a transaction (has contract data)
  const isTransaction = !!listing.contractData;
  
  // Get the appropriate checklist items
  const checklistItems = listing.checklist?.length 
    ? listing.checklist 
    : isTransaction 
      ? transactionChecklistItems 
      : defaultChecklistItems;
  
  // Filter to only approved or in_review items and convert to documents
  const documentsFromChecklist = useMemo(() => {
    return checklistItems
      .filter(item => 
        (item.status === 'approved' || item.status === 'in_review') && 
        !item.isMetadataTask &&
        item.isAttached
      )
      .map((item): ListingDocument => ({
        id: `checklist-${item.id}`,
        name: item.documentName,
        type: 'pdf',
        status: checklistStatusToDocStatus(item.status),
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        verifiedAt: item.status === 'approved' ? new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) : undefined,
      }));
  }, [checklistItems]);

  // Use documents from checklist, or fall back to explicit documents if any
  const documents = documentsFromChecklist.length > 0 
    ? documentsFromChecklist 
    : (listing.documents || []);

  if (documents.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="relative w-16 h-16 md:w-20 md:h-20 mb-4 md:mb-6 mx-auto">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-slow" />
            <div className="relative w-full h-full rounded-full bg-secondary/50 flex items-center justify-center border border-border">
              <FolderOpen className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="font-semibold text-foreground mb-2">No documents yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Documents will appear here after they've been verified by Mira through the checklist.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const StatusIcon = statusConfig[doc.status].icon;
        
        return (
          <Card key={doc.id} className="shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                  <File className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{doc.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {statusSubtitles[doc.status]}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn(statusConfig[doc.status].className, 'gap-1.5 font-medium')}
                  >
                    <StatusIcon className="w-3 h-3" />
                    <span className="hidden sm:inline">{statusConfig[doc.status].label}</span>
                  </Badge>
                  <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}