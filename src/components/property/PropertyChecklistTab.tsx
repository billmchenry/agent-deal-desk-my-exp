import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle2, MessageSquare, Sparkles, ClipboardList, FileText, FileCheck, ChevronDown } from 'lucide-react';
import { Listing, ChecklistItem } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { transactionChecklistItems } from '@/lib/mockContractExtraction';

interface PropertyChecklistTabProps {
  listing: Listing;
}

// Default checklist items for active listings organized by requirement status
const defaultChecklistItems: ChecklistItem[] = [
  // === REQUIRED (now approved) ===
  { id: '1', documentName: 'Information About Brokerage Services (IABS)', formCode: 'TREC IABS 1-1', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '2', documentName: 'Residential Real Estate Listing Agreement', formCode: 'TXR-1101', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '3', documentName: "Seller's Disclosure Notice", formCode: 'TREC OP-H', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '4', documentName: 'General Information and Notice to Buyers and Sellers', formCode: 'TXR-1506', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '5', documentName: 'MLS Profile Sheet', formCode: 'MLS', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '6', documentName: 'Keybox/Lockbox Authorization', formCode: 'LOCKBOX', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '7', documentName: 'Property Photos', formCode: 'PHOTOS', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required' },
  { id: '8', documentName: 'Unrepresented Customer Showing Form', formCode: 'TXR-1508', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required', note: 'Required before showing to unrepresented buyers' },
  { id: '9', documentName: 'Updated IABS (1-1)', formCode: 'TREC IABS 1-1', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required', note: '2026 non-representation version' },
  { id: '10', documentName: 'Affidavit of Title', formCode: 'TITLE-AFF', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required', note: 'Notarized ownership verification' },
  { id: '11', documentName: 'Mortgage Payoff Information', formCode: 'PAYOFF', status: 'approved', isAttached: true, verifiedByMira: true, category: 'Required', note: 'For accurate Seller Net Sheet' },
  
  // === IF APPLICABLE ===
  { id: '12', documentName: 'Lead-Based Paint Addendum', formCode: 'TXR-1906', status: 'in_review', isAttached: true, verifiedByMira: true, category: 'If Applicable', note: 'Required if home built before 1978' },
  { id: '13', documentName: 'Condominium Addendum to Listing', formCode: 'TXR-1401', status: 'if_applicable', isAttached: false, category: 'If Applicable', note: 'Required if property is a condo' },
  { id: '14', documentName: 'Addendum for Property Subject to Mandatory Membership in HOA', formCode: 'TREC', status: 'if_applicable', isAttached: false, category: 'If Applicable', note: 'Required if property is in an HOA' },
  { id: '15', documentName: 'Information About On-Site Sewer Facility', formCode: 'TXR-1407', status: 'if_applicable', isAttached: false, category: 'If Applicable', note: 'Required if property uses septic system' },
  { id: '16', documentName: 'MUD / Water District Notice', formCode: 'MUD', status: 'if_applicable', isAttached: false, category: 'If Applicable', note: 'Required if in Municipal Utility District' },
  { id: '17', documentName: 'T-47 Residential Real Property Affidavit', formCode: 'T-47', status: 'if_applicable', isAttached: false, category: 'If Applicable', note: 'Required if using existing survey' },
  { id: '18', documentName: 'T-47.1 Declaration', formCode: 'T-47.1', status: 'if_applicable', isAttached: false, category: 'If Applicable', note: '2026 option for verifying property with older survey' },
  { id: '19', documentName: 'Utility History & Average Bills', formCode: 'UTILITY', status: 'if_applicable', isAttached: false, category: 'If Applicable', note: '12 months of utility averages' },
  { id: '20', documentName: 'Notice of Information from Other Sources', formCode: 'TXR-2502', status: 'if_applicable', isAttached: false, category: 'If Applicable', note: 'If reporting data different from official records' },
  { id: '21', documentName: 'List of Improvements & Repairs', formCode: 'IMPROVEMENTS', status: 'if_applicable', isAttached: false, category: 'If Applicable', note: 'Last 5 years with receipts/warranties' },
  { id: '22', documentName: 'Residential Contract Critical Date List', formCode: 'TXR-1958', status: 'if_applicable', isAttached: false, category: 'If Applicable', note: '2026 deadline tracking form' },
];

const statusConfig = {
  required: { label: 'Required', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  in_review: { label: 'In Review', className: 'bg-warning/10 text-warning border-warning/20' },
  approved: { label: 'Approved', className: 'bg-success/10 text-success border-success/20' },
  if_applicable: { label: 'If Applicable', className: 'bg-muted text-muted-foreground border-border' },
  not_required: { label: 'Not Required', className: 'bg-muted text-muted-foreground border-border' },
};

export function PropertyChecklistTab({ listing }: PropertyChecklistTabProps) {
  const { askMira, updateListingMetadata, openChecklistBulkUpload } = useApp();
  const [comments, setComments] = useState<Record<string, string>>({});
  const [listingDocsOpen, setListingDocsOpen] = useState(false);
  const [metadataValues, setMetadataValues] = useState<Record<string, string>>(() => {
    // Initialize from existing contract data if available
    const initial: Record<string, string> = {};
    if (listing.contractData) {
      if (listing.contractData.gfEscrowNumber) initial['gfEscrowNumber'] = listing.contractData.gfEscrowNumber;
      if (listing.contractData.escrowOfficerName) initial['escrowOfficerName'] = listing.contractData.escrowOfficerName;
      if (listing.contractData.escrowOfficerEmail) initial['escrowOfficerEmail'] = listing.contractData.escrowOfficerEmail;
      if (listing.contractData.escrowOfficerPhone) initial['escrowOfficerPhone'] = listing.contractData.escrowOfficerPhone;
    }
    return initial;
  });
  
  // Determine if this is a transaction (has contract data) and use appropriate checklist
  const isTransaction = !!listing.contractData;
  const checklistItems = listing.checklist?.length 
    ? listing.checklist 
    : isTransaction 
      ? transactionChecklistItems 
      : defaultChecklistItems;
  
  const handleAskMira = (item: ChecklistItem) => {
    askMira(`I need to attach the "${item.documentName}" document for ${listing.extraction.propertyAddress}. Can you help me upload and verify it?`);
  };


  const handleCommentChange = (itemId: string, value: string) => {
    setComments(prev => ({ ...prev, [itemId]: value }));
  };

  const handleMetadataChange = (field: string, value: string) => {
    setMetadataValues(prev => ({ ...prev, [field]: value }));
  };

  const handleMetadataSave = (field: string, documentName: string) => {
    const value = metadataValues[field];
    if (value && updateListingMetadata) {
      updateListingMetadata(listing.id, field, value);
      toast.success(`${documentName} saved`);
    }
  };

  // Group items by section for transaction phase
  const groupedItems = useMemo(() => {
    const listingItems = checklistItems.filter(item => item.section === 'listing');
    const transactionItems = checklistItems.filter(item => item.section === 'transaction');
    const ungroupedItems = checklistItems.filter(item => !item.section);
    
    // If there are section-grouped items, return grouped
    if (listingItems.length > 0 || transactionItems.length > 0) {
      return { listing: listingItems, transaction: transactionItems, ungrouped: ungroupedItems };
    }
    // Otherwise return all as ungrouped (for listing-only phase)
    return { listing: [], transaction: [], ungrouped: checklistItems };
  }, [checklistItems]);

  const isTransactionPhase = groupedItems.listing.length > 0 || groupedItems.transaction.length > 0;

  // For transactions, only count transaction documents (not listing docs carried forward)
  const itemsToCount = isTransactionPhase ? groupedItems.transaction : checklistItems;
  
  // Count completed items - include metadata tasks that have values
  const completedCount = itemsToCount.filter(item => {
    if (item.isMetadataTask && item.metadataField) {
      return !!metadataValues[item.metadataField];
    }
    return item.status === 'approved' || item.status === 'in_review';
  }).length;
  
  const requiredCount = itemsToCount.filter(item => 
    item.status !== 'if_applicable' && item.status !== 'not_required'
  ).length;

  const progressPercentage = requiredCount > 0 ? Math.round((completedCount / requiredCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Progress Summary */}
      <Card className="shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 md:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
                <ClipboardList className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Document Checklist</p>
                <p className="text-sm text-muted-foreground">
                  {completedCount} of {requiredCount} required documents attached
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block w-40 h-2.5 rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className={cn(
                "text-sm font-semibold tabular-nums px-2.5 py-1 rounded-lg",
                progressPercentage === 100 
                  ? "bg-success/10 text-success" 
                  : progressPercentage >= 50 
                    ? "bg-primary/10 text-primary"
                    : "bg-warning/10 text-warning"
              )}>
                {progressPercentage}%
              </span>
            </div>
          </div>
          {/* Mobile progress bar */}
          <div className="sm:hidden px-4 pb-4">
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Documents Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={openChecklistBulkUpload}
        >
          <Sparkles className="w-4 h-4" />
          Upload Documents with Mira
        </Button>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {isTransactionPhase ? (
          <>
            {/* Transaction Documents Section (show first - active items) */}
            {groupedItems.transaction.length > 0 && (
              <>
                <div className="flex items-center gap-2 pt-2 pb-1">
                  <FileCheck className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Transaction Documents</h3>
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    {groupedItems.transaction.length} items
                  </Badge>
                </div>
                {groupedItems.transaction.map((item, index) => (
                  <Card key={item.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="text-sm font-medium text-muted-foreground mt-0.5">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground leading-tight">{item.documentName}</p>
                            {item.formCode && (
                              <p className="text-xs text-muted-foreground mt-0.5">{item.formCode}</p>
                            )}
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn(statusConfig[item.status].className, 'font-medium shrink-0')}
                        >
                          {statusConfig[item.status].label}
                        </Badge>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/50">
                        {item.isMetadataTask && item.metadataField ? (
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder={`Enter ${item.documentName.toLowerCase()}`}
                              value={metadataValues[item.metadataField] || ''}
                              onChange={(e) => handleMetadataChange(item.metadataField!, e.target.value)}
                              className="h-9 text-sm flex-1"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 w-9 p-0 shrink-0"
                              onClick={() => handleMetadataSave(item.metadataField!, item.documentName)}
                              disabled={!metadataValues[item.metadataField]}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : !item.isAttached && item.status !== 'approved' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 border-foreground/30 text-foreground hover:border-foreground/50 hover:bg-transparent w-full"
                            onClick={() => handleAskMira(item)}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Upload
                          </Button>
                        ) : item.verifiedByMira ? (
                          <span className="text-xs text-success flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground font-medium">Attached</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {/* Listing Documents Section (carried forward - collapsible) */}
            {groupedItems.listing.length > 0 && (
              <Collapsible open={listingDocsOpen} onOpenChange={setListingDocsOpen}>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-2 pt-4 pb-1 w-full hover:bg-secondary/30 rounded-lg px-2 -mx-2 transition-colors">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground">Listing Documents</h3>
                    <Badge variant="outline" className="text-xs">
                      {groupedItems.listing.length} carried forward
                    </Badge>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground ml-auto transition-transform duration-200",
                      listingDocsOpen && "rotate-180"
                    )} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pt-2">
                  {groupedItems.listing.map((item, index) => (
                    <Card key={item.id} className="shadow-sm opacity-75">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className="text-sm font-medium text-muted-foreground mt-0.5">
                              {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground leading-tight">{item.documentName}</p>
                              {item.formCode && (
                                <p className="text-xs text-muted-foreground mt-0.5">{item.formCode}</p>
                              )}
                            </div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn(statusConfig[item.status].className, 'font-medium shrink-0')}
                          >
                            {statusConfig[item.status].label}
                          </Badge>
                        </div>
                        <div className="mt-3 pt-3 border-t border-border/50">
                          {item.verifiedByMira ? (
                            <span className="text-xs text-success flex items-center gap-1.5 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          ) : item.isAttached ? (
                            <span className="text-xs text-muted-foreground font-medium">Attached</span>
                          ) : (
                            <span className="text-xs text-muted-foreground font-medium">If Applicable</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </>
        ) : (
          // Non-transaction phase: show all items without grouping
          checklistItems.map((item, index) => (
            <Card key={item.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground leading-tight">{item.documentName}</p>
                      {item.formCode && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.formCode}</p>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn(statusConfig[item.status].className, 'font-medium shrink-0')}
                  >
                    {statusConfig[item.status].label}
                  </Badge>
                </div>
                <div className="mt-3 pt-3 border-t border-border/50">
                  {item.isMetadataTask && item.metadataField ? (
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder={`Enter ${item.documentName.toLowerCase()}`}
                        value={metadataValues[item.metadataField] || ''}
                        onChange={(e) => handleMetadataChange(item.metadataField!, e.target.value)}
                        className="h-9 text-sm flex-1"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-9 w-9 p-0 shrink-0"
                        onClick={() => handleMetadataSave(item.metadataField!, item.documentName)}
                        disabled={!metadataValues[item.metadataField]}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : !item.isAttached && item.status !== 'approved' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 border-foreground/30 text-foreground hover:border-foreground/50 hover:bg-transparent w-full"
                      onClick={() => handleAskMira(item)}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Upload
                    </Button>
                  ) : item.verifiedByMira ? (
                    <span className="text-xs text-success flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium">Attached</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Desktop Checklist Table */}
      <Card className="shadow-sm hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30">
                  <TableHead className="w-12 font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Documentation</TableHead>
                  <TableHead className="w-32 font-semibold">Status</TableHead>
                  <TableHead className="w-48 font-semibold hidden lg:table-cell">Comments</TableHead>
                  <TableHead className="w-36 font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isTransactionPhase ? (
                  <>
                    {/* Transaction Documents Section Header */}
                    {groupedItems.transaction.length > 0 && (
                      <>
                        <TableRow className="bg-primary/5 hover:bg-primary/5">
                          <TableCell colSpan={5} className="py-3">
                            <div className="flex items-center gap-2">
                              <FileCheck className="w-4 h-4 text-primary" />
                              <span className="text-sm font-semibold text-foreground">Transaction Documents</span>
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 ml-2">
                                {groupedItems.transaction.length} items
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                        {groupedItems.transaction.map((item, index) => (
                          <TableRow key={item.id} className="group hover:bg-secondary/20 transition-colors">
                            <TableCell className="font-medium text-muted-foreground">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-foreground">{item.documentName}</p>
                                {item.formCode && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{item.formCode}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={cn(statusConfig[item.status].className, 'font-medium')}
                              >
                                {statusConfig[item.status].label}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="relative">
                                <MessageSquare className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <Input
                                  placeholder="Add comment..."
                                  value={comments[item.id] || item.comments || ''}
                                  onChange={(e) => handleCommentChange(item.id, e.target.value)}
                                  className="pl-8 h-9 text-sm bg-secondary/30 border-border/50 focus:bg-background"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.isMetadataTask && item.metadataField ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    placeholder={`Enter ${item.documentName.toLowerCase()}`}
                                    value={metadataValues[item.metadataField] || ''}
                                    onChange={(e) => handleMetadataChange(item.metadataField!, e.target.value)}
                                    className="h-8 text-sm w-40"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleMetadataSave(item.metadataField!, item.documentName)}
                                    disabled={!metadataValues[item.metadataField]}
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : !item.isAttached && item.status !== 'approved' ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1.5 border-foreground/30 text-foreground hover:border-foreground/50 hover:bg-transparent"
                                  onClick={() => handleAskMira(item)}
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  Upload with Mira
                                </Button>
                              ) : item.verifiedByMira ? (
                                <span className="text-xs text-success flex items-center gap-1.5 font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Verified by Mira
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground font-medium">Attached</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}

                    {/* Listing Documents Section Header - Collapsible */}
                    {groupedItems.listing.length > 0 && (
                      <Collapsible open={listingDocsOpen} onOpenChange={setListingDocsOpen} asChild>
                        <>
                          <TableRow className="bg-muted/30 hover:bg-muted/40 cursor-pointer transition-colors" onClick={() => setListingDocsOpen(!listingDocsOpen)}>
                            <TableCell colSpan={5} className="py-3">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-semibold text-muted-foreground">Listing Documents</span>
                                <Badge variant="outline" className="text-xs ml-2">
                                  {groupedItems.listing.length} carried forward
                                </Badge>
                                <ChevronDown className={cn(
                                  "w-4 h-4 text-muted-foreground ml-auto transition-transform duration-200",
                                  listingDocsOpen && "rotate-180"
                                )} />
                              </div>
                            </TableCell>
                          </TableRow>
                          {listingDocsOpen && groupedItems.listing.map((item, index) => (
                            <TableRow key={item.id} className="group hover:bg-secondary/20 transition-colors opacity-75">
                              <TableCell className="font-medium text-muted-foreground">
                                {index + 1}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium text-foreground">{item.documentName}</p>
                                  {item.formCode && (
                                    <p className="text-xs text-muted-foreground mt-0.5">{item.formCode}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={cn(statusConfig[item.status].className, 'font-medium')}
                                >
                                  {statusConfig[item.status].label}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <div className="relative">
                                  <MessageSquare className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                  <Input
                                    placeholder="Add comment..."
                                    value={comments[item.id] || item.comments || ''}
                                    onChange={(e) => handleCommentChange(item.id, e.target.value)}
                                    className="pl-8 h-9 text-sm bg-secondary/30 border-border/50 focus:bg-background"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                {item.verifiedByMira ? (
                                  <span className="text-xs text-success flex items-center gap-1.5 font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Verified by Mira
                                  </span>
                                ) : item.isAttached ? (
                                  <span className="text-xs text-muted-foreground font-medium">Attached</span>
                                ) : (
                                  <span className="text-xs text-muted-foreground font-medium">If Applicable</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      </Collapsible>
                    )}
                  </>
                ) : (
                  // Non-transaction phase: show all items without grouping
                  checklistItems.map((item, index) => (
                    <TableRow key={item.id} className="group hover:bg-secondary/20 transition-colors">
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{item.documentName}</p>
                          {item.formCode && (
                            <p className="text-xs text-muted-foreground mt-0.5">{item.formCode}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(statusConfig[item.status].className, 'font-medium')}
                        >
                          {statusConfig[item.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="relative">
                          <MessageSquare className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <Input
                            placeholder="Add comment..."
                            value={comments[item.id] || item.comments || ''}
                            onChange={(e) => handleCommentChange(item.id, e.target.value)}
                            className="pl-8 h-9 text-sm bg-secondary/30 border-border/50 focus:bg-background"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.isMetadataTask && item.metadataField ? (
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder={`Enter ${item.documentName.toLowerCase()}`}
                              value={metadataValues[item.metadataField] || ''}
                              onChange={(e) => handleMetadataChange(item.metadataField!, e.target.value)}
                              className="h-8 text-sm w-40"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => handleMetadataSave(item.metadataField!, item.documentName)}
                              disabled={!metadataValues[item.metadataField]}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : !item.isAttached && item.status !== 'approved' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 border-foreground/30 text-foreground hover:border-foreground/50 hover:bg-transparent"
                            onClick={() => handleAskMira(item)}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Upload with Mira
                          </Button>
                        ) : item.verifiedByMira ? (
                          <span className="text-xs text-success flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified by Mira
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground font-medium">Attached</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}