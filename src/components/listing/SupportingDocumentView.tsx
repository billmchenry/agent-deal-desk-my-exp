import { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, FileCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { PDFViewer } from './PDFViewer';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClassifiedDocument, SupportingDocumentExtraction } from '@/types/batch';
import { DocumentType, documentDisplayNames, getTierBadgeStyle } from '@/lib/mockDocumentClassification';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';

interface SupportingDocumentViewProps {
  open: boolean;
  onClose: () => void;
  document: ClassifiedDocument;
  onApprove: () => void;
  onReject: () => void;
  onReclassify: (newType: DocumentType) => void;
  // Batch navigation
  currentIndex?: number;
  totalDocuments?: number;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

export function SupportingDocumentView({
  open,
  onClose,
  document,
  onApprove,
  onReject,
  onReclassify,
  currentIndex,
  totalDocuments,
  onNavigate,
}: SupportingDocumentViewProps) {
  const [isReclassifying, setIsReclassifying] = useState(false);
  const tier = document.classification.tier;
  const tierStyle = getTierBadgeStyle(tier);
  
  const isCritical = tier === 'critical';
  const extraction = document.extraction as SupportingDocumentExtraction | undefined;

  const showNavigation = totalDocuments !== undefined && totalDocuments > 1;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-[90vw] lg:max-w-[80vw] p-0 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            {showNavigation && (
              <div className="flex items-center gap-1 mr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate?.('prev')}
                  disabled={currentIndex === 0}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                  {(currentIndex ?? 0) + 1} of {totalDocuments}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onNavigate?.('next')}
                  disabled={currentIndex === (totalDocuments ?? 1) - 1}
                  className="h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {document.classification.displayName}
                </h2>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded font-medium',
                  tierStyle.bg, tierStyle.text
                )}>
                  {tierStyle.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate max-w-md">
                {document.file.name}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Split View */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            {/* Left Pane - PDF Viewer */}
            <ResizablePanel defaultSize={55} minSize={30}>
              <div className="h-full p-4">
                <PDFViewer fileName={document.file.name} />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Right Pane - Review Form */}
            <ResizablePanel defaultSize={45} minSize={30}>
              <div className="h-full overflow-auto p-6">
                {isCritical ? (
                  <CriticalDocumentForm 
                    document={document}
                    extraction={extraction}
                    onReclassify={onReclassify}
                    isReclassifying={isReclassifying}
                    setIsReclassifying={setIsReclassifying}
                  />
                ) : (
                  <ReferenceDocumentForm
                    document={document}
                    onReclassify={onReclassify}
                    isReclassifying={isReclassifying}
                    setIsReclassifying={setIsReclassifying}
                  />
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2">
            {extraction?.isComplete ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-success">
                  Document verified
                </span>
              </>
            ) : extraction?.issuesFound && extraction.issuesFound.length > 0 ? (
              <>
                <AlertTriangle className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium text-warning">
                  {extraction.issuesFound.length} issue{extraction.issuesFound.length !== 1 ? 's' : ''} found
                </span>
              </>
            ) : (
              <>
                <FileCheck className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Ready for review
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onReject}>
              Reject
            </Button>
            <Button onClick={onApprove} className="gradient-primary">
              Approve & Attach to Checklist
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Critical document form with targeted extraction fields
function CriticalDocumentForm({
  document,
  extraction,
  onReclassify,
  isReclassifying,
  setIsReclassifying,
}: {
  document: ClassifiedDocument;
  extraction?: SupportingDocumentExtraction;
  onReclassify: (type: DocumentType) => void;
  isReclassifying: boolean;
  setIsReclassifying: (val: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Document Verification</h3>
        <p className="text-xs text-muted-foreground">
          Review the extracted information below to ensure accuracy.
        </p>
      </div>

      {/* Classification */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Document Type</Label>
        {isReclassifying ? (
          <Select
            value={document.classification.type}
            onValueChange={(value) => {
              onReclassify(value as DocumentType);
              setIsReclassifying(false);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(documentDisplayNames).map(([type, name]) => (
                <SelectItem key={type} value={type}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{document.classification.displayName}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsReclassifying(true)}
              className="text-xs"
            >
              Reclassify
            </Button>
          </div>
        )}
      </div>

      {/* Signature Detection */}
      <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border">
        <h4 className="text-sm font-medium text-foreground">Signatures</h4>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Signatures detected</span>
          <div className="flex items-center gap-2">
            {extraction?.signaturesDetected ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">
                  {extraction.signaturesFound}/{extraction.signaturesRequired}
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-sm text-warning">Not detected</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Date Detection */}
      <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border">
        <h4 className="text-sm font-medium text-foreground">Dates</h4>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Effective date</span>
          <span className="text-sm font-medium">
            {extraction?.effectiveDate 
              ? new Date(extraction.effectiveDate).toLocaleDateString()
              : 'Not found'}
          </span>
        </div>
      </div>

      {/* Lead Paint specific */}
      {document.classification.type === 'lead_paint' && (
        <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border">
          <h4 className="text-sm font-medium text-foreground">Lead Paint Status</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Lead paint present</span>
            <span className="text-sm font-medium capitalize">
              {extraction?.leadPaintPresent || 'Unknown'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Disclosure complete</span>
            {extraction?.leadPaintDisclosureComplete ? (
              <CheckCircle2 className="w-4 h-4 text-success" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-warning" />
            )}
          </div>
        </div>
      )}

      {/* Acknowledgments */}
      {extraction?.acknowledgmentsRequired !== undefined && (
        <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border">
          <h4 className="text-sm font-medium text-foreground">Acknowledgments</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Required acknowledgments</span>
            <span className="text-sm font-medium">
              {extraction.acknowledgmentsFound}/{extraction.acknowledgmentsRequired}
            </span>
          </div>
        </div>
      )}

      {/* Issues */}
      {extraction?.issuesFound && extraction.issuesFound.length > 0 && (
        <div className="space-y-2 p-4 rounded-lg bg-warning/10 border border-warning/30">
          <h4 className="text-sm font-medium text-warning">Issues Found</h4>
          <ul className="space-y-1">
            {extraction.issuesFound.map((issue, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-warning mt-0.5 flex-shrink-0" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Checklist Match */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Will be attached to</Label>
        <div className="p-3 rounded-lg bg-success/10 border border-success/30">
          <span className="text-sm font-medium text-success">
            ✓ {document.classification.checklistMatch}
          </span>
        </div>
      </div>
    </div>
  );
}

// Reference document form with simplified confirmation
function ReferenceDocumentForm({
  document,
  onReclassify,
  isReclassifying,
  setIsReclassifying,
}: {
  document: ClassifiedDocument;
  onReclassify: (type: DocumentType) => void;
  isReclassifying: boolean;
  setIsReclassifying: (val: boolean) => void;
}) {
  const [looksCorrect, setLooksCorrect] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Quick Review</h3>
        <p className="text-xs text-muted-foreground">
          Confirm the document type and attach to checklist.
        </p>
      </div>

      {/* Classification */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Detected Document Type</Label>
        {isReclassifying ? (
          <Select
            value={document.classification.type}
            onValueChange={(value) => {
              onReclassify(value as DocumentType);
              setIsReclassifying(false);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(documentDisplayNames).map(([type, name]) => (
                <SelectItem key={type} value={type}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="p-4 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{document.classification.displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {document.classification.confidence}% confidence
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsReclassifying(true)}
              >
                Change
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
        <div>
          <Label className="text-sm font-medium">Classification looks correct</Label>
          <p className="text-xs text-muted-foreground">
            Toggle off if this document needs reclassification
          </p>
        </div>
        <Switch
          checked={looksCorrect}
          onCheckedChange={setLooksCorrect}
        />
      </div>

      {/* File Info */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">File Details</Label>
        <div className="p-4 rounded-lg border border-border bg-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">File name</span>
            <span className="text-sm font-medium truncate max-w-[200px]">
              {document.file.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Size</span>
            <span className="text-sm font-medium">
              {(document.file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
      </div>

      {/* Checklist Match */}
      {document.classification.checklistMatch && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Will be attached to</Label>
          <div className="p-3 rounded-lg bg-success/10 border border-success/30">
            <span className="text-sm font-medium text-success">
              ✓ {document.classification.checklistMatch}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
