import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle2, FileText, ClipboardList } from 'lucide-react';
import { ListingExtraction } from '@/types';
import { getConfidenceLevel } from '@/lib/mockDocumentExtraction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { PDFViewer } from './PDFViewer';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ReviewField, 
  SectionCard, 
  MobileSectionNav, 
  AutoFilledField 
} from '@/components/shared/VerificationComponents';

interface FullExtractionViewProps {
  open: boolean;
  onClose: () => void;
  extraction: ListingExtraction;
  onUpdate: (field: string, value: any) => void;
  onApprove: () => void;
  onSaveDraft: () => void;
}

const LISTING_SECTIONS = [
  { id: 'property', label: 'Property' },
  { id: 'seller', label: 'Seller' },
  { id: 'terms', label: 'Terms' },
  { id: 'financials', label: 'Financials' },
  { id: 'business', label: 'Business' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'metadata', label: 'Additional Details' },
];

export function FullExtractionView({
  open,
  onClose,
  extraction,
  onUpdate,
  onApprove,
  onSaveDraft,
}: FullExtractionViewProps) {
  const isMobile = useIsMobile();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('property');
  const [showPdfOnMobile, setShowPdfOnMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Count fields that need review (confidence < 70)
  const fieldsNeedingReview = Object.values(extraction.confidence).filter(
    (conf) => getConfidenceLevel(conf) !== 'high'
  ).length;

  const allFieldsVerified = fieldsNeedingReview === 0;

  // Intersection Observer to track active section
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) setActiveSection(sectionId);
          }
        });
      },
      {
        root: container,
        rootMargin: '-10% 0px -70% 0px',
        threshold: [0.3],
      }
    );

    sectionRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [open, showPdfOnMobile]);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current.set(id, el);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current.get(sectionId);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Shared section content renderer
  const renderSectionContent = () => (
    <>
      {/* Section 1: Property Core */}
      <div ref={setSectionRef('property')} data-section="property">
        <SectionCard
          title="Property Core"
          badge="Required"
          editing={editingSection === 'property'}
          onEdit={() => setEditingSection('property')}
          onSave={() => setEditingSection(null)}
          isMobile={isMobile}
        >
          <div className="space-y-4">
            <ReviewField
              label="Street Address"
              value={extraction.propertyAddress}
              editing={editingSection === 'property'}
              onChange={(v) => onUpdate('propertyAddress', v)}
              confidence={extraction.confidence.propertyAddress}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <ReviewField
                label="City"
                value={extraction.city}
                editing={editingSection === 'property'}
                onChange={(v) => onUpdate('city', v)}
                confidence={extraction.confidence.city}
              />
              <ReviewField
                label="State"
                value={extraction.state}
                editing={editingSection === 'property'}
                onChange={(v) => onUpdate('state', v)}
                confidence={extraction.confidence.state}
              />
              <ReviewField
                label="ZIP"
                value={extraction.zipCode}
                editing={editingSection === 'property'}
                onChange={(v) => onUpdate('zipCode', v)}
                confidence={extraction.confidence.zipCode}
              />
              <ReviewField
                label="County"
                value={extraction.county}
                editing={editingSection === 'property'}
                onChange={(v) => onUpdate('county', v)}
                confidence={extraction.confidence.county}
              />
            </div>
            <ReviewField
              label="Legal Description"
              value={extraction.legalDescription}
              editing={editingSection === 'property'}
              onChange={(v) => onUpdate('legalDescription', v)}
              confidence={extraction.confidence.legalDescription}
            />
          </div>
        </SectionCard>
      </div>

      {/* Section 2: Seller Information */}
      <div ref={setSectionRef('seller')} data-section="seller">
        <SectionCard
          title="Seller Information"
          badge="Required"
          editing={editingSection === 'seller'}
          onEdit={() => setEditingSection('seller')}
          onSave={() => setEditingSection(null)}
          isMobile={isMobile}
        >
          <div className="space-y-4">
            {extraction.sellers.map((seller, index) => (
              <div key={index} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Name</p>
                    {editingSection === 'seller' ? (
                      <Input
                        value={seller.name}
                        onChange={(e) => {
                          const updatedSellers = [...extraction.sellers];
                          updatedSellers[index] = { ...seller, name: e.target.value };
                          onUpdate('sellers', updatedSellers);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        className="h-8 text-sm"
                      />
                    ) : (
                      <p className="text-sm font-medium text-foreground">{seller.name || '—'}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    {editingSection === 'seller' ? (
                      <Input
                        type="email"
                        value={seller.email || ''}
                        onChange={(e) => {
                          const updatedSellers = [...extraction.sellers];
                          updatedSellers[index] = { ...seller, email: e.target.value };
                          onUpdate('sellers', updatedSellers);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        className="h-8 text-sm"
                      />
                    ) : (
                      <p className="text-sm font-medium text-foreground">{seller.email || '—'}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    {editingSection === 'seller' ? (
                      <Input
                        type="tel"
                        value={seller.phone || ''}
                        onChange={(e) => {
                          const updatedSellers = [...extraction.sellers];
                          updatedSellers[index] = { ...seller, phone: e.target.value };
                          onUpdate('sellers', updatedSellers);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        className="h-8 text-sm"
                      />
                    ) : (
                      <p className="text-sm font-medium text-foreground">{seller.phone || '—'}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Section 3: Listing Terms */}
      <div ref={setSectionRef('terms')} data-section="terms">
        <SectionCard
          title="Listing Terms"
          badge="Required"
          editing={editingSection === 'terms'}
          onEdit={() => setEditingSection('terms')}
          onSave={() => setEditingSection(null)}
          isMobile={isMobile}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <ReviewField
              label="Listing Price"
              value={extraction.listingPrice}
              editing={editingSection === 'terms'}
              type="currency"
              onChange={(v) => onUpdate('listingPrice', v)}
              confidence={extraction.confidence.listingPrice}
            />
            <ReviewField
              label="Start Date"
              value={extraction.listingStartDate ? new Date(extraction.listingStartDate).toISOString().split('T')[0] : undefined}
              editing={editingSection === 'terms'}
              type="date"
              onChange={(v) => onUpdate('listingStartDate', new Date(v))}
              confidence={extraction.confidence.listingStartDate}
            />
            <ReviewField
              label="Expiration Date"
              value={extraction.listingEndDate ? new Date(extraction.listingEndDate).toISOString().split('T')[0] : undefined}
              editing={editingSection === 'terms'}
              type="date"
              onChange={(v) => onUpdate('listingEndDate', new Date(v))}
              confidence={extraction.confidence.listingEndDate}
            />
          </div>
        </SectionCard>
      </div>

      {/* Section 4: Financials */}
      <div ref={setSectionRef('financials')} data-section="financials">
        <SectionCard
          title="Financials"
          badge="Required"
          editing={editingSection === 'financials'}
          onEdit={() => setEditingSection('financials')}
          onSave={() => setEditingSection(null)}
          isMobile={isMobile}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <ReviewField
              label="Listing Commission %"
              value={extraction.totalCommission}
              editing={editingSection === 'financials'}
              type="percentage"
              onChange={(v) => onUpdate('totalCommission', v)}
              confidence={extraction.confidence.totalCommission}
            />
            <ReviewField
              label="Buyer Broker Split %"
              value={extraction.buyerBrokerSplit}
              editing={editingSection === 'financials'}
              type="percentage"
              onChange={(v) => onUpdate('buyerBrokerSplit', v)}
              confidence={extraction.confidence.buyerBrokerSplit}
            />
          </div>
        </SectionCard>
      </div>

      {/* Section 5: Business Logic */}
      <div ref={setSectionRef('business')} data-section="business">
        <SectionCard
          title="Business Logic"
          badge="Required"
          editing={editingSection === 'business'}
          onEdit={() => setEditingSection('business')}
          onSave={() => setEditingSection(null)}
          isMobile={isMobile}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <ReviewField
              label="Checklist Type"
              value={extraction.checklistType}
              editing={editingSection === 'business'}
              type="select"
              options={[
                { value: 'residential', label: 'Residential' },
                { value: 'lease', label: 'Lease' },
                { value: 'land', label: 'Land' },
              ]}
              onChange={(v) => onUpdate('checklistType', v)}
              confidence={extraction.confidence.checklistType}
            />
            <ReviewField
              label="Office/Division"
              value={extraction.officeDivision}
              editing={editingSection === 'business'}
              onChange={(v) => onUpdate('officeDivision', v)}
              confidence={extraction.confidence.officeDivision}
            />
          </div>
        </SectionCard>
      </div>

      {/* Section 6: Compliance/Status */}
      <div ref={setSectionRef('compliance')} data-section="compliance">
        <SectionCard
          title="Compliance/Status"
          badge="Required"
          editing={editingSection === 'compliance'}
          onEdit={() => setEditingSection('compliance')}
          onSave={() => setEditingSection(null)}
          isMobile={isMobile}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <ReviewField
              label="Occupancy Status"
              value={extraction.occupancyStatus}
              editing={editingSection === 'compliance'}
              type="select"
              options={[
                { value: 'owner', label: 'Owner Occupied' },
                { value: 'tenant', label: 'Tenant Occupied' },
                { value: 'vacant', label: 'Vacant' },
              ]}
              onChange={(v) => onUpdate('occupancyStatus', v)}
              confidence={extraction.confidence.occupancyStatus}
            />
            <ReviewField
              label="Personal Interest Disclosure"
              value={extraction.personalInterestDisclosure ? 'yes' : 'no'}
              editing={editingSection === 'compliance'}
              type="select"
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
              onChange={(v) => onUpdate('personalInterestDisclosure', v === 'yes')}
              confidence={extraction.confidence.personalInterestDisclosure}
            />
            <ReviewField
              label="HOA Status"
              value={extraction.hoaStatus}
              editing={editingSection === 'compliance'}
              type="select"
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'unknown', label: 'Unknown' },
              ]}
              onChange={(v) => onUpdate('hoaStatus', v)}
              confidence={extraction.confidence.hoaStatus}
            />
            <ReviewField
              label="Keybox Authorized"
              value={extraction.keyboxAuthorized ? 'yes' : 'no'}
              editing={editingSection === 'compliance'}
              type="select"
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
              onChange={(v) => onUpdate('keyboxAuthorized', v === 'yes')}
              confidence={extraction.confidence.keyboxAuthorized}
            />
          </div>
          
          {extraction.exclusions && extraction.exclusions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Exclusions</p>
              <p className="text-sm text-foreground">{extraction.exclusions.join(', ')}</p>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Section 7: Additional Details (Optional) */}
      <div ref={setSectionRef('metadata')} data-section="metadata">
        <SectionCard
          title="Additional Details"
          badge="Optional"
          badgeVariant="secondary"
          editing={editingSection === 'metadata'}
          onEdit={() => setEditingSection('metadata')}
          onSave={() => setEditingSection(null)}
          isMobile={isMobile}
        >
          <div className="space-y-3">
            <AutoFilledField
              label="MLS Number"
              value={extraction.mlsNumber}
              source="from listing"
              editing={editingSection === 'metadata'}
              onEdit={(v) => onUpdate('mlsNumber', v)}
              isFilled={!!extraction.mlsNumber}
            />
            <AutoFilledField
              label="Year Built"
              value={extraction.yearBuilt}
              source="from public records"
              editing={editingSection === 'metadata'}
              onEdit={(v) => onUpdate('yearBuilt', v)}
              type="number"
              isFilled={!!extraction.yearBuilt}
            />
            <ReviewField
              label="Lead Source"
              value={extraction.leadSource}
              editing={editingSection === 'metadata'}
              type="select"
              options={[
                { value: 'referral', label: 'Referral' },
                { value: 'sign_call', label: 'Sign Call' },
                { value: 'past_client', label: 'Past Client' },
                { value: 'sphere', label: 'Sphere of Influence' },
                { value: 'open_house', label: 'Open House' },
                { value: 'online', label: 'Online Lead' },
                { value: 'other', label: 'Other' },
              ]}
              onChange={(v) => onUpdate('leadSource', v)}
              confidence={extraction.confidence.leadSource}
            />
          </div>
        </SectionCard>
      </div>
    </>
  );

  // Mobile view
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <SheetContent 
          side="bottom" 
          className="h-[95vh] p-0 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="shrink-0 p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Listing Verification</h2>
            <p className="text-sm text-muted-foreground">
              Review extracted data from the Listing Agreement
            </p>
          </div>

          {/* Toggle between PDF and Form */}
          <div className="shrink-0 flex border-b border-border">
            <button
              onClick={() => setShowPdfOnMobile(false)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                !showPdfOnMobile 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground"
              )}
            >
              <ClipboardList className="w-4 h-4" />
              Review Data
            </button>
            <button
              onClick={() => setShowPdfOnMobile(true)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
                showPdfOnMobile 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground"
              )}
            >
              <FileText className="w-4 h-4" />
              View Document
            </button>
          </div>

          {/* Content */}
          {showPdfOnMobile ? (
            <div className="flex-1 overflow-hidden p-4 min-h-0">
              <PDFViewer fileName={extraction.documentName} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              <MobileSectionNav
                sections={LISTING_SECTIONS}
                activeSection={activeSection}
                onSelect={(id) => {
                  setActiveSection(id);
                  scrollToSection(id);
                }}
              />
              <div className="flex-1 overflow-auto min-h-0 pb-4" ref={scrollContainerRef}>
                {renderSectionContent()}
              </div>
            </div>
          )}

          {/* Footer - Always visible */}
          <div className="shrink-0 flex items-center justify-between p-4 border-t border-border bg-card">
            <div className="flex items-center gap-2">
              {allFieldsVerified ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium text-success">
                    All fields verified
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <span className="text-sm font-medium text-warning">
                    {fieldsNeedingReview} field{fieldsNeedingReview !== 1 ? 's' : ''} need{fieldsNeedingReview === 1 ? 's' : ''} review
                  </span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onSaveDraft}>
                Save Draft
              </Button>
              <Button size="sm" onClick={onApprove} className="gradient-primary">
                Create Listing
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop view
  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-[95vw] lg:max-w-[85vw] p-0 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Listing Verification</h2>
          <p className="text-sm text-muted-foreground">
            Review extracted data from the Listing Agreement
          </p>
        </div>

        {/* Split View */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            {/* Left Pane - PDF Viewer */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full p-4">
                <PDFViewer fileName={extraction.documentName} />
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Right Pane - Section Cards */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full overflow-auto p-4" ref={scrollContainerRef}>
                {renderSectionContent()}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2">
            {allFieldsVerified ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-success">
                  All fields verified
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium text-warning">
                  {fieldsNeedingReview} field{fieldsNeedingReview !== 1 ? 's' : ''} need{fieldsNeedingReview === 1 ? 's' : ''} review
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onSaveDraft}>
              Save as Draft
            </Button>
            <Button onClick={onApprove} className="gradient-primary">
              Create Listing
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
