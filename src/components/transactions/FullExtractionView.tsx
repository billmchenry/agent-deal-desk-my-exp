import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, CheckCircle2, FileText, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { PDFViewer } from "@/components/transactions/PDFViewer";
import {
  ReviewField,
  SectionCard,
  MobileSectionNav,
  AutoFilledField,
  getConfidenceLevel,
} from "@/components/transactions/VerificationComponents";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ListingExtraction } from "@/types/transactions";

interface Props {
  open: boolean;
  onClose: () => void;
  extraction: ListingExtraction;
  sourceFile?: File | null;
  onUpdate: (field: string, value: any) => void;
  onApprove: () => void;
  onSaveDraft: () => void;
}

const LISTING_SECTIONS = [
  { id: "property", label: "Property" },
  { id: "seller", label: "Seller" },
  { id: "terms", label: "Terms" },
  { id: "financials", label: "Financials" },
  { id: "business", label: "Business" },
  { id: "compliance", label: "Compliance" },
  { id: "metadata", label: "Additional" },
];

export function FullExtractionView({
  open,
  onClose,
  extraction,
  sourceFile,
  onUpdate,
  onApprove,
  onSaveDraft,
}: Props) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("property");
  const [showPdfOnMobile, setShowPdfOnMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const fieldsNeedingReview = Object.values(extraction.confidence).filter(
    (c) => getConfidenceLevel(c) !== "high",
  ).length;
  const allFieldsVerified = fieldsNeedingReview === 0;

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const id = entry.target.getAttribute("data-section");
            if (id) setActiveSection(id);
          }
        });
      },
      { root: container, rootMargin: "-10% 0px -70% 0px", threshold: [0.3] },
    );
    sectionRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [open, showPdfOnMobile]);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(id, el);
  };

  const scrollTo = (id: string) => {
    sectionRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderSections = () => (
    <>
      <div ref={setRef("property")} data-section="property">
        <SectionCard
          title="Property Core"
          badge="Required"
          editing={editingSection === "property"}
          onEdit={() => setEditingSection("property")}
          onSave={() => setEditingSection(null)}
        >
          <div className="space-y-3">
            <ReviewField
              label="Street Address"
              value={extraction.propertyAddress}
              editing={editingSection === "property"}
              onChange={(v) => onUpdate("propertyAddress", v)}
              confidence={extraction.confidence.propertyAddress}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <ReviewField label="City" value={extraction.city} editing={editingSection === "property"} onChange={(v) => onUpdate("city", v)} confidence={extraction.confidence.city} />
              <ReviewField label="State" value={extraction.state} editing={editingSection === "property"} onChange={(v) => onUpdate("state", v)} confidence={extraction.confidence.state} />
              <ReviewField label="ZIP" value={extraction.zipCode} editing={editingSection === "property"} onChange={(v) => onUpdate("zipCode", v)} confidence={extraction.confidence.zipCode} />
              <ReviewField label="County" value={extraction.county} editing={editingSection === "property"} onChange={(v) => onUpdate("county", v)} confidence={extraction.confidence.county} />
            </div>
            <ReviewField
              label="Legal Description"
              value={extraction.legalDescription}
              editing={editingSection === "property"}
              onChange={(v) => onUpdate("legalDescription", v)}
              confidence={extraction.confidence.legalDescription}
            />
          </div>
        </SectionCard>
      </div>

      <div ref={setRef("seller")} data-section="seller">
        <SectionCard
          title="Seller Information"
          badge="Required"
          editing={editingSection === "seller"}
          onEdit={() => setEditingSection("seller")}
          onSave={() => setEditingSection(null)}
        >
          <div className="space-y-3">
            {extraction.sellers.map((seller, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] text-muted-foreground">Name</p>
                  {editingSection === "seller" ? (
                    <Input
                      value={seller.name}
                      onChange={(e) => {
                        const next = [...extraction.sellers];
                        next[index] = { ...seller, name: e.target.value };
                        onUpdate("sellers", next);
                      }}
                      className="h-9 text-sm rounded-lg"
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground truncate">{seller.name || "—"}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-muted-foreground">Email</p>
                  {editingSection === "seller" ? (
                    <Input
                      type="email"
                      value={seller.email || ""}
                      onChange={(e) => {
                        const next = [...extraction.sellers];
                        next[index] = { ...seller, email: e.target.value };
                        onUpdate("sellers", next);
                      }}
                      className="h-9 text-sm rounded-lg"
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground truncate">{seller.email || "—"}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-muted-foreground">Phone</p>
                  {editingSection === "seller" ? (
                    <Input
                      type="tel"
                      value={seller.phone || ""}
                      onChange={(e) => {
                        const next = [...extraction.sellers];
                        next[index] = { ...seller, phone: e.target.value };
                        onUpdate("sellers", next);
                      }}
                      className="h-9 text-sm rounded-lg"
                    />
                  ) : (
                    <p className="text-sm font-medium text-foreground tabular-nums">{seller.phone || "—"}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div ref={setRef("terms")} data-section="terms">
        <SectionCard
          title="Listing Terms"
          badge="Required"
          editing={editingSection === "terms"}
          onEdit={() => setEditingSection("terms")}
          onSave={() => setEditingSection(null)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ReviewField
              label="Listing Price"
              value={extraction.listingPrice}
              editing={editingSection === "terms"}
              type="currency"
              onChange={(v) => onUpdate("listingPrice", v)}
              confidence={extraction.confidence.listingPrice}
            />
            <ReviewField
              label="Start Date"
              value={extraction.listingStartDate?.toISOString().split("T")[0]}
              editing={editingSection === "terms"}
              type="date"
              onChange={(v) => onUpdate("listingStartDate", new Date(v))}
              confidence={extraction.confidence.listingStartDate}
            />
            <ReviewField
              label="Expiration Date"
              value={extraction.listingEndDate?.toISOString().split("T")[0]}
              editing={editingSection === "terms"}
              type="date"
              onChange={(v) => onUpdate("listingEndDate", new Date(v))}
              confidence={extraction.confidence.listingEndDate}
            />
          </div>
        </SectionCard>
      </div>

      <div ref={setRef("financials")} data-section="financials">
        <SectionCard
          title="Financials"
          badge="Required"
          editing={editingSection === "financials"}
          onEdit={() => setEditingSection("financials")}
          onSave={() => setEditingSection(null)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ReviewField
              label="Listing Commission %"
              value={extraction.totalCommission}
              editing={editingSection === "financials"}
              type="percentage"
              onChange={(v) => onUpdate("totalCommission", v)}
              confidence={extraction.confidence.totalCommission}
            />
            <ReviewField
              label="Buyer Broker Split %"
              value={extraction.buyerBrokerSplit}
              editing={editingSection === "financials"}
              type="percentage"
              onChange={(v) => onUpdate("buyerBrokerSplit", v)}
              confidence={extraction.confidence.buyerBrokerSplit}
            />
          </div>
        </SectionCard>
      </div>

      <div ref={setRef("business")} data-section="business">
        <SectionCard
          title="Business Logic"
          badge="Required"
          editing={editingSection === "business"}
          onEdit={() => setEditingSection("business")}
          onSave={() => setEditingSection(null)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ReviewField
              label="Checklist Type"
              value={extraction.checklistType}
              editing={editingSection === "business"}
              type="select"
              options={[
                { value: "residential", label: "Residential" },
                { value: "lease", label: "Lease" },
                { value: "land", label: "Land" },
              ]}
              onChange={(v) => onUpdate("checklistType", v)}
              confidence={extraction.confidence.checklistType}
            />
            <ReviewField
              label="Office/Division"
              value={extraction.officeDivision}
              editing={editingSection === "business"}
              onChange={(v) => onUpdate("officeDivision", v)}
              confidence={extraction.confidence.officeDivision}
            />
          </div>
        </SectionCard>
      </div>

      <div ref={setRef("compliance")} data-section="compliance">
        <SectionCard
          title="Compliance / Status"
          badge="Required"
          editing={editingSection === "compliance"}
          onEdit={() => setEditingSection("compliance")}
          onSave={() => setEditingSection(null)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ReviewField
              label="Occupancy Status"
              value={extraction.occupancyStatus}
              editing={editingSection === "compliance"}
              type="select"
              options={[
                { value: "owner", label: "Owner Occupied" },
                { value: "tenant", label: "Tenant Occupied" },
                { value: "vacant", label: "Vacant" },
              ]}
              onChange={(v) => onUpdate("occupancyStatus", v)}
              confidence={extraction.confidence.occupancyStatus}
            />
            <ReviewField
              label="Personal Interest Disclosure"
              value={extraction.personalInterestDisclosure ? "yes" : "no"}
              editing={editingSection === "compliance"}
              type="select"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
              onChange={(v) => onUpdate("personalInterestDisclosure", v === "yes")}
              confidence={extraction.confidence.personalInterestDisclosure}
            />
            <ReviewField
              label="HOA Status"
              value={extraction.hoaStatus}
              editing={editingSection === "compliance"}
              type="select"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
                { value: "unknown", label: "Unknown" },
              ]}
              onChange={(v) => onUpdate("hoaStatus", v)}
              confidence={extraction.confidence.hoaStatus}
            />
            <ReviewField
              label="Keybox Authorized"
              value={extraction.keyboxAuthorized ? "yes" : "no"}
              editing={editingSection === "compliance"}
              type="select"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
              onChange={(v) => onUpdate("keyboxAuthorized", v === "yes")}
              confidence={extraction.confidence.keyboxAuthorized}
            />
          </div>
          {extraction.exclusions && extraction.exclusions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-[11px] text-muted-foreground mb-1">Exclusions</p>
              <p className="text-sm text-foreground">{extraction.exclusions.join(", ")}</p>
            </div>
          )}
        </SectionCard>
      </div>

      <div ref={setRef("metadata")} data-section="metadata">
        <SectionCard
          title="Additional Details"
          badge="Optional"
          badgeVariant="secondary"
          editing={editingSection === "metadata"}
          onEdit={() => setEditingSection("metadata")}
          onSave={() => setEditingSection(null)}
        >
          <div className="space-y-3">
            <AutoFilledField
              label="MLS Number"
              value={extraction.mlsNumber}
              source="from listing"
              editing={editingSection === "metadata"}
              onEdit={(v) => onUpdate("mlsNumber", v)}
              isFilled={!!extraction.mlsNumber}
            />
            <AutoFilledField
              label="Year Built"
              value={extraction.yearBuilt}
              source="from public records"
              editing={editingSection === "metadata"}
              onEdit={(v) => onUpdate("yearBuilt", v)}
              type="number"
              isFilled={!!extraction.yearBuilt}
            />
            <ReviewField
              label="Source"
              value={extraction.leadSource}
              editing={editingSection === "metadata"}
              type="select"
              options={[
                { value: "referral", label: "Referral" },
                { value: "sign_call", label: "Sign Call" },
                { value: "past_client", label: "Past Client" },
                { value: "sphere", label: "Sphere of Influence" },
                { value: "open_house", label: "Open House" },
                { value: "online", label: "Online Lead" },
                { value: "other", label: "Other" },
              ]}
              onChange={(v) => onUpdate("leadSource", v)}
              confidence={extraction.confidence.leadSource}
            />
          </div>
        </SectionCard>
      </div>
    </>
  );

  // Mobile: bottom sheet with PDF/Form toggle
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
        <SheetContent side="bottom" className="h-[95vh] p-0 flex flex-col overflow-hidden rounded-t-2xl">
          <div className="shrink-0 px-4 py-3 border-b border-border flex items-center gap-3 bg-gradient-to-r from-exp-dark-navy via-exp-charcoal-blue to-exp-slate-blue text-white">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/15 hover:text-white"
              onClick={onClose}
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h2 className="text-base font-semibold">Listing Verification</h2>
              <p className="text-xs text-white/75 truncate">Review extracted data from the Listing Agreement</p>
            </div>
          </div>

          <div className="shrink-0 flex border-b border-border bg-card">
            <button
              onClick={() => setShowPdfOnMobile(false)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors min-h-[44px]",
                !showPdfOnMobile ? "text-primary border-b-2 border-primary" : "text-muted-foreground",
              )}
            >
              <ClipboardList className="w-4 h-4" />
              Review Data
            </button>
            <button
              onClick={() => setShowPdfOnMobile(true)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors min-h-[44px]",
                showPdfOnMobile ? "text-primary border-b-2 border-primary" : "text-muted-foreground",
              )}
            >
              <FileText className="w-4 h-4" />
              View Document
            </button>
          </div>

          {showPdfOnMobile ? (
            <div className="flex-1 overflow-hidden p-3 min-h-0">
              <PDFViewer fileName={extraction.documentName} file={sourceFile} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              <MobileSectionNav
                sections={LISTING_SECTIONS}
                activeSection={activeSection}
                onSelect={(id) => {
                  setActiveSection(id);
                  scrollTo(id);
                }}
              />
              <div className="flex-1 overflow-auto min-h-0 p-3 pb-6 space-y-2" ref={scrollContainerRef}>
                {renderSections()}
              </div>
            </div>
          )}

          <div className="shrink-0 flex items-center justify-between p-3 border-t border-border bg-card gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {allFieldsVerified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-exp-green shrink-0" />
                  <span className="text-xs font-medium text-exp-green truncate">All fields verified</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-exp-gold shrink-0" />
                  <span className="text-xs font-medium text-exp-gold truncate">
                    {fieldsNeedingReview} need{fieldsNeedingReview === 1 ? "s" : ""} review
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onSaveDraft} className="rounded-[51px] min-h-[36px]">
                Save Draft
              </Button>
              <Button size="sm" onClick={onApprove} className="rounded-[51px] min-h-[36px]">
                Create Listing
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: split-screen with PDF + sections
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="shrink-0 bg-gradient-to-r from-exp-dark-navy via-exp-charcoal-blue to-exp-slate-blue px-5 py-4 text-white flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-white hover:bg-white/15 hover:text-white"
          onClick={onClose}
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold">Listing Verification</h2>
          <p className="text-xs text-white/75 truncate">
            Review extracted data from the Listing Agreement and complete any required details.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full p-4">
              <PDFViewer fileName={extraction.documentName} file={sourceFile} />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full flex flex-col overflow-hidden">
              <MobileSectionNav
                sections={LISTING_SECTIONS}
                activeSection={activeSection}
                onSelect={(id) => {
                  setActiveSection(id);
                  scrollTo(id);
                }}
              />
              <div className="flex-1 overflow-auto min-h-0 p-4 space-y-2" ref={scrollContainerRef}>
                {renderSections()}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="shrink-0 flex items-center justify-between p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          {allFieldsVerified ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-exp-green" />
              <span className="text-sm font-medium text-exp-green">All fields verified</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-exp-gold" />
              <span className="text-sm font-medium text-exp-gold">
                {fieldsNeedingReview} field{fieldsNeedingReview !== 1 ? "s" : ""} need
                {fieldsNeedingReview === 1 ? "s" : ""} review
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onSaveDraft} className="rounded-[51px] min-h-[44px]">
            Save as Draft
          </Button>
          <Button onClick={onApprove} className="rounded-[51px] min-h-[44px]">
            Create Listing
          </Button>
        </div>
      </div>
    </div>
  );
}
