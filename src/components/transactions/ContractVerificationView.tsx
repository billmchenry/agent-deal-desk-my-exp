import { useEffect, useRef, useState } from "react";
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
  getConfidenceLevel,
} from "@/components/transactions/VerificationComponents";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ContractExtraction, Listing } from "@/types/transactions";

interface Props {
  open: boolean;
  onClose: () => void;
  listing: Listing;
  extraction: ContractExtraction;
  sourceFile?: File | null;
  onUpdate: (field: string, value: any) => void;
  onApprove: () => void;
  onSaveDraft: () => void;
}

const SECTIONS = [
  { id: "property", label: "Property" },
  { id: "transaction", label: "Transaction" },
  { id: "parties", label: "Parties" },
  { id: "agent", label: "Agent" },
  { id: "commissions", label: "Commissions" },
];

export function ContractVerificationView({
  open,
  onClose,
  listing,
  extraction,
  sourceFile,
  onUpdate,
  onApprove,
  onSaveDraft,
}: Props) {
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

  // Commission calcs
  const salesPrice = extraction.salesPrice || 0;
  const listingFee = extraction.listingBrokerFee || 0;
  const grossCommission = (salesPrice * listingFee) / 100;
  const referralTotal = (extraction.referrals || []).reduce(
    (sum, r) => sum + (grossCommission * (r.percentage || 0)) / 100,
    0,
  );
  const teamSplitTotal = (extraction.coAgentSplits || []).reduce(
    (sum, s) => sum + (grossCommission * (s.splitPercentage || 0)) / 100,
    0,
  );
  const netToAgent = grossCommission - referralTotal - teamSplitTotal;
  const fmt = (n: number) =>
    `${Math.round(n).toLocaleString("en-US")} USD`;

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
  const scrollTo = (id: string) =>
    sectionRefs.current.get(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const renderSections = () => (
    <>
      <div ref={setRef("property")} data-section="property">
        <SectionCard
          title="Property"
          badge="Required"
          editing={editingSection === "property"}
          onEdit={() => setEditingSection("property")}
          onSave={() => setEditingSection(null)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ReviewField
              label="Address"
              value={extraction.propertyAddress}
              editing={editingSection === "property"}
              onChange={(v) => onUpdate("propertyAddress", v)}
              confidence={extraction.confidence.propertyAddress}
            />
            <ReviewField
              label="Legal Description"
              value={extraction.legalDescription}
              editing={editingSection === "property"}
              onChange={(v) => onUpdate("legalDescription", v)}
              confidence={extraction.confidence.legalDescription}
            />
            <ReviewField
              label="Title Company"
              value={extraction.titleCompany}
              editing={editingSection === "property"}
              onChange={(v) => onUpdate("titleCompany", v)}
              confidence={extraction.confidence.titleCompany}
            />
            <ReviewField
              label="Escrow Agent"
              value={extraction.escrowAgent}
              editing={editingSection === "property"}
              onChange={(v) => onUpdate("escrowAgent", v)}
              confidence={extraction.confidence.escrowAgent}
            />
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-[11px] font-medium text-muted-foreground mb-2">Escrow Officer Contact</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ReviewField
                label="Name"
                value={extraction.escrowOfficerName}
                editing={editingSection === "property"}
                onChange={(v) => onUpdate("escrowOfficerName", v)}
                confidence={extraction.confidence.escrowOfficerName}
              />
              <ReviewField
                label="Email"
                value={extraction.escrowOfficerEmail}
                editing={editingSection === "property"}
                onChange={(v) => onUpdate("escrowOfficerEmail", v)}
                confidence={extraction.confidence.escrowOfficerEmail}
              />
              <ReviewField
                label="Phone"
                value={extraction.escrowOfficerPhone}
                editing={editingSection === "property"}
                onChange={(v) => onUpdate("escrowOfficerPhone", v)}
                confidence={extraction.confidence.escrowOfficerPhone}
              />
            </div>
          </div>
        </SectionCard>
      </div>

      <div ref={setRef("transaction")} data-section="transaction">
        <SectionCard
          title="Transaction"
          badge="Required"
          editing={editingSection === "transaction"}
          onEdit={() => setEditingSection("transaction")}
          onSave={() => setEditingSection(null)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ReviewField label="Sale Price" value={extraction.salesPrice} editing={editingSection === "transaction"} type="currency" onChange={(v) => onUpdate("salesPrice", v)} confidence={extraction.confidence.salesPrice} />
            <ReviewField label="Earnest Money" value={extraction.earnestMoney} editing={editingSection === "transaction"} type="currency" onChange={(v) => onUpdate("earnestMoney", v)} confidence={extraction.confidence.earnestMoney} />
            <ReviewField label="Option Fee" value={extraction.optionFee} editing={editingSection === "transaction"} type="currency" onChange={(v) => onUpdate("optionFee", v)} confidence={extraction.confidence.optionFee} />
            <ReviewField label="Option Period (days)" value={extraction.optionPeriodDays} editing={editingSection === "transaction"} type="number" onChange={(v) => onUpdate("optionPeriodDays", v)} confidence={extraction.confidence.optionPeriodDays} />
            <ReviewField label="Effective Date" value={extraction.effectiveDate?.toISOString().split("T")[0]} editing={editingSection === "transaction"} type="date" onChange={(v) => onUpdate("effectiveDate", new Date(v))} confidence={extraction.confidence.effectiveDate} />
            <ReviewField label="Closing Date" value={extraction.closingDate?.toISOString().split("T")[0]} editing={editingSection === "transaction"} type="date" onChange={(v) => onUpdate("closingDate", new Date(v))} confidence={extraction.confidence.closingDate} />
          </div>
          <div className="mt-3 pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ReviewField label="Cash Portion" value={extraction.cashPortion} editing={editingSection === "transaction"} type="currency" onChange={(v) => onUpdate("cashPortion", v)} confidence={extraction.confidence.cashPortion} />
            <ReviewField label="Financing" value={extraction.financing} editing={editingSection === "transaction"} type="currency" onChange={(v) => onUpdate("financing", v)} confidence={extraction.confidence.financing} />
            <ReviewField label="Seller Concessions" value={extraction.sellerConcessions} editing={editingSection === "transaction"} type="currency" onChange={(v) => onUpdate("sellerConcessions", v)} confidence={extraction.confidence.sellerConcessions} />
            <ReviewField
              label="Possession"
              value={extraction.possessionType}
              editing={editingSection === "transaction"}
              type="select"
              options={[
                { value: "at_closing", label: "Upon closing and funding" },
                { value: "temporary_lease", label: "Temporary residential lease" },
              ]}
              onChange={(v) => onUpdate("possessionType", v)}
              confidence={extraction.confidence.possessionType}
            />
          </div>
        </SectionCard>
      </div>

      <div ref={setRef("parties")} data-section="parties">
        <SectionCard
          title="Parties"
          badge="Required"
          editing={editingSection === "parties"}
          onEdit={() => setEditingSection("parties")}
          onSave={() => setEditingSection(null)}
        >
          <div className="space-y-3">
            <div>
              <p className="text-[11px] text-muted-foreground mb-1">Seller(s)</p>
              <p className="text-sm font-medium text-foreground">
                {extraction.sellers?.map((s) => s.name).join(", ") || "—"}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground mb-1">Buyer(s)</p>
              {editingSection === "parties" ? (
                <div className="space-y-2">
                  <Input
                    value={extraction.buyers?.[0]?.name || ""}
                    onChange={(e) =>
                      onUpdate("buyers", [{ ...(extraction.buyers?.[0] || { role: "buyer" }), name: e.target.value }])
                    }
                    placeholder="Name"
                    className="h-9 text-sm rounded-lg"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      value={extraction.buyers?.[0]?.email || ""}
                      onChange={(e) =>
                        onUpdate("buyers", [{ ...(extraction.buyers?.[0] || { role: "buyer", name: "" }), email: e.target.value }])
                      }
                      placeholder="Email"
                      className="h-9 text-sm rounded-lg"
                    />
                    <Input
                      value={extraction.buyers?.[0]?.phone || ""}
                      onChange={(e) =>
                        onUpdate("buyers", [{ ...(extraction.buyers?.[0] || { role: "buyer", name: "" }), phone: e.target.value }])
                      }
                      placeholder="Phone"
                      className="h-9 text-sm rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {extraction.buyers?.map((b) => b.name).join(", ") || "—"}
                  </p>
                  {extraction.buyers?.[0]?.email && (
                    <p className="text-[11px] text-muted-foreground tabular-nums mt-1">
                      {extraction.buyers[0].email} · {extraction.buyers[0].phone}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      </div>

      <div ref={setRef("agent")} data-section="agent">
        <SectionCard
          title="Agent & Brokerage"
          badge="Required"
          editing={editingSection === "agent"}
          onEdit={() => setEditingSection("agent")}
          onSave={() => setEditingSection(null)}
        >
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Listing Side</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ReviewField label="Broker" value={extraction.listingBrokerName} editing={editingSection === "agent"} onChange={(v) => onUpdate("listingBrokerName", v)} confidence={extraction.confidence.listingBrokerName} />
                <ReviewField label="Agent" value={extraction.listingAgentName} editing={editingSection === "agent"} onChange={(v) => onUpdate("listingAgentName", v)} confidence={extraction.confidence.listingAgentName} />
                <ReviewField label="Broker License" value={extraction.listingBrokerLicense} editing={editingSection === "agent"} onChange={(v) => onUpdate("listingBrokerLicense", v)} />
                <ReviewField label="Commission %" value={extraction.listingBrokerFee} editing={editingSection === "agent"} type="percentage" onChange={(v) => onUpdate("listingBrokerFee", v)} confidence={extraction.confidence.listingBrokerFee} />
              </div>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Buying Side</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ReviewField label="Broker" value={extraction.buyingBrokerName} editing={editingSection === "agent"} onChange={(v) => onUpdate("buyingBrokerName", v)} confidence={extraction.confidence.buyingBrokerName} />
                <ReviewField label="Agent" value={extraction.buyingAgentName} editing={editingSection === "agent"} onChange={(v) => onUpdate("buyingAgentName", v)} confidence={extraction.confidence.buyingAgentName} />
                <ReviewField label="Broker License" value={extraction.buyingBrokerLicense} editing={editingSection === "agent"} onChange={(v) => onUpdate("buyingBrokerLicense", v)} />
                <ReviewField label="Commission %" value={extraction.buyingBrokerFee} editing={editingSection === "agent"} type="percentage" onChange={(v) => onUpdate("buyingBrokerFee", v)} confidence={extraction.confidence.buyingBrokerFee} />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div ref={setRef("commissions")} data-section="commissions">
        <SectionCard
          title="Commission Summary"
          badge="Auto-calculated"
          badgeVariant="secondary"
          editing={false}
          onEdit={() => {}}
          onSave={() => {}}
        >
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Sale Price</span>
              <span className="font-medium text-foreground tabular-nums">{fmt(salesPrice)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/60">
              <span className="text-muted-foreground">Listing Side Commission ({listingFee}%)</span>
              <span className="font-medium text-foreground tabular-nums">{fmt(grossCommission)}</span>
            </div>
            {referralTotal > 0 && (
              <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground">Referrals</span>
                <span className="font-medium text-exp-red tabular-nums">- {fmt(referralTotal)}</span>
              </div>
            )}
            {teamSplitTotal > 0 && (
              <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground">Team Splits</span>
                <span className="font-medium text-exp-red tabular-nums">- {fmt(teamSplitTotal)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2">
              <span className="font-semibold text-foreground">Net to Agent</span>
              <span className="font-bold text-exp-green tabular-nums text-base">{fmt(netToAgent)}</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
        <SheetContent side="bottom" className="h-[95vh] p-0 flex flex-col overflow-hidden rounded-t-2xl">
          <div className="shrink-0 px-4 py-3 border-b border-border flex items-center gap-3 bg-gradient-to-r from-exp-dark-navy via-exp-charcoal-blue to-exp-slate-blue text-white">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/15 hover:text-white" onClick={onClose} aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h2 className="text-base font-semibold">Transaction Verification</h2>
              <p className="text-xs text-white/75 truncate">{listing.extraction.propertyAddress}</p>
            </div>
          </div>

          <div className="shrink-0 flex border-b border-border bg-card">
            <button
              onClick={() => setShowPdfOnMobile(false)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium min-h-[44px]",
                !showPdfOnMobile ? "text-primary border-b-2 border-primary" : "text-muted-foreground",
              )}
            >
              <ClipboardList className="w-4 h-4" />
              Review Data
            </button>
            <button
              onClick={() => setShowPdfOnMobile(true)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium min-h-[44px]",
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
              <MobileSectionNav sections={SECTIONS} activeSection={activeSection} onSelect={(id) => { setActiveSection(id); scrollTo(id); }} />
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
                  <span className="text-xs font-medium text-exp-green truncate">Verified</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-exp-gold shrink-0" />
                  <span className="text-xs font-medium text-exp-gold truncate">{fieldsNeedingReview} review</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onSaveDraft} className="rounded-[51px] min-h-[36px]">Save Draft</Button>
              <Button size="sm" onClick={onApprove} className="rounded-[51px] min-h-[36px]">Create Transaction</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      <div className="shrink-0 bg-gradient-to-r from-exp-dark-navy via-exp-charcoal-blue to-exp-slate-blue px-5 py-4 text-white flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-white hover:bg-white/15 hover:text-white" onClick={onClose} aria-label="Back">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold">Transaction Verification</h2>
          <p className="text-xs text-white/75 truncate">
            {listing.extraction.propertyAddress} • Review extracted contract data and complete required details.
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
              <MobileSectionNav sections={SECTIONS} activeSection={activeSection} onSelect={(id) => { setActiveSection(id); scrollTo(id); }} />
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
            Create Transaction
          </Button>
        </div>
      </div>
    </div>
  );
}
