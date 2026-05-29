import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Pencil, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PDFViewer } from "@/components/transactions/PDFViewer";
import { cn } from "@/lib/utils";
import type { ListingExtraction } from "@/types/transactions";
import { getConfidenceLevel } from "@/data/mockListingExtraction";

interface Props {
  open: boolean;
  onClose: () => void;
  extraction: ListingExtraction;
  sourceFile?: File | null;
  onUpdate: (field: keyof ListingExtraction | string, value: unknown) => void;
  onApprove: () => void;
  onSaveDraft: () => void;
}

type SectionKey = "property" | "seller" | "terms" | "financials" | "compliance";

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "property", label: "Property" },
  { key: "seller", label: "Seller" },
  { key: "terms", label: "Terms" },
  { key: "financials", label: "Financials" },
  { key: "compliance", label: "Compliance" },
];

function FieldRow({
  label,
  value,
  confidence,
  editing,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number | undefined;
  confidence?: number;
  editing: boolean;
  onChange: (v: string) => void;
  type?: "text" | "number" | "date";
}) {
  const needsReview = confidence !== undefined && getConfidenceLevel(confidence) !== "high";
  return (
    <div className="space-y-1">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      {editing ? (
        <Input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 text-sm"
        />
      ) : (
        <p
          className={cn(
            "text-sm font-medium truncate",
            needsReview ? "text-exp-gold" : "text-foreground",
          )}
        >
          {value === undefined || value === "" ? "—" : String(value)}
        </p>
      )}
    </div>
  );
}

function SectionCard({
  title,
  required,
  editing,
  onToggleEdit,
  children,
}: {
  title: string;
  required?: boolean;
  editing: boolean;
  onToggleEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {required && (
            <Badge className="bg-primary/10 text-primary border-0 text-[10px] px-2 py-0 h-5">
              Required
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-xs text-primary hover:text-primary"
          onClick={onToggleEdit}
        >
          {editing ? <Check className="w-3 h-3 me-1" /> : <Pencil className="w-3 h-3 me-1" />}
          {editing ? "Done" : "Edit"}
        </Button>
      </div>
      {children}
    </div>
  );
}

export function FullExtractionView({
  open,
  onClose,
  extraction,
  sourceFile,
  onUpdate,
  onApprove,
  onSaveDraft,
}: Props) {
  const [editing, setEditing] = useState<SectionKey | null>(null);
  const toggle = (k: SectionKey) => setEditing((cur) => (cur === k ? null : k));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[1280px] h-[92vh] flex flex-col p-0 overflow-hidden rounded-2xl border-border/60">
        <DialogTitle className="sr-only">Listing Verification</DialogTitle>

        {/* Header */}
        <div className="bg-gradient-to-r from-exp-dark-navy via-exp-charcoal-blue to-exp-slate-blue px-5 py-4 text-white flex items-center gap-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white hover:bg-white/15 hover:text-white"
            aria-label="Back"
            onClick={onClose}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold">Listing Verification</p>
            <p className="text-xs text-white/75 truncate">
              Review extracted data from the Listing Agreement and complete any required details.
            </p>
          </div>
        </div>

        {/* Body: left PDF, right form */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1fr] min-h-0">
          <div className="hidden lg:block p-4 border-e border-border bg-muted/10">
            <PDFViewer fileName={extraction.documentName} file={sourceFile} />
          </div>

          <div className="overflow-y-auto p-5 space-y-4">
            <SectionCard
              title="Property Core"
              required
              editing={editing === "property"}
              onToggleEdit={() => toggle("property")}
            >
              <div className="space-y-3">
                <FieldRow
                  label="Street Address"
                  value={extraction.propertyAddress}
                  confidence={extraction.confidence.propertyAddress}
                  editing={editing === "property"}
                  onChange={(v) => onUpdate("propertyAddress", v)}
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <FieldRow
                    label="City"
                    value={extraction.city}
                    confidence={extraction.confidence.city}
                    editing={editing === "property"}
                    onChange={(v) => onUpdate("city", v)}
                  />
                  <FieldRow
                    label="State"
                    value={extraction.state}
                    confidence={extraction.confidence.state}
                    editing={editing === "property"}
                    onChange={(v) => onUpdate("state", v)}
                  />
                  <FieldRow
                    label="ZIP"
                    value={extraction.zipCode}
                    confidence={extraction.confidence.zipCode}
                    editing={editing === "property"}
                    onChange={(v) => onUpdate("zipCode", v)}
                  />
                  <FieldRow
                    label="County"
                    value={extraction.county}
                    confidence={extraction.confidence.county}
                    editing={editing === "property"}
                    onChange={(v) => onUpdate("county", v)}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Seller Information"
              required
              editing={editing === "seller"}
              onToggleEdit={() => toggle("seller")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FieldRow
                  label="Name"
                  value={extraction.sellers[0]?.name}
                  editing={editing === "seller"}
                  onChange={(v) => {
                    const next = [...extraction.sellers];
                    next[0] = { ...(next[0] || { role: "seller", name: "" }), name: v };
                    onUpdate("sellers", next);
                  }}
                />
                <FieldRow
                  label="Email"
                  value={extraction.sellers[0]?.email}
                  editing={editing === "seller"}
                  onChange={(v) => {
                    const next = [...extraction.sellers];
                    next[0] = { ...(next[0] || { role: "seller", name: "" }), email: v };
                    onUpdate("sellers", next);
                  }}
                />
                <FieldRow
                  label="Phone"
                  value={extraction.sellers[0]?.phone}
                  editing={editing === "seller"}
                  onChange={(v) => {
                    const next = [...extraction.sellers];
                    next[0] = { ...(next[0] || { role: "seller", name: "" }), phone: v };
                    onUpdate("sellers", next);
                  }}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Listing Terms"
              required
              editing={editing === "terms"}
              onToggleEdit={() => toggle("terms")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FieldRow
                  label="Listing Price"
                  value={extraction.listingPrice}
                  type="number"
                  confidence={extraction.confidence.listingPrice}
                  editing={editing === "terms"}
                  onChange={(v) => onUpdate("listingPrice", Number(v))}
                />
                <FieldRow
                  label="Start Date"
                  value={extraction.listingStartDate?.toISOString().slice(0, 10)}
                  type="date"
                  editing={editing === "terms"}
                  onChange={(v) => onUpdate("listingStartDate", new Date(v))}
                />
                <FieldRow
                  label="Expiration Date"
                  value={extraction.listingEndDate?.toISOString().slice(0, 10)}
                  type="date"
                  editing={editing === "terms"}
                  onChange={(v) => onUpdate("listingEndDate", new Date(v))}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Financials"
              required
              editing={editing === "financials"}
              onToggleEdit={() => toggle("financials")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldRow
                  label="Total Commission %"
                  value={extraction.totalCommission}
                  type="number"
                  editing={editing === "financials"}
                  onChange={(v) => onUpdate("totalCommission", Number(v))}
                />
                <FieldRow
                  label="Buyer Broker Split %"
                  value={extraction.buyerBrokerSplit}
                  type="number"
                  editing={editing === "financials"}
                  onChange={(v) => onUpdate("buyerBrokerSplit", Number(v))}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Compliance"
              required
              editing={editing === "compliance"}
              onToggleEdit={() => toggle("compliance")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] text-muted-foreground">Occupancy Status</p>
                  {editing === "compliance" ? (
                    <Select
                      value={extraction.occupancyStatus}
                      onValueChange={(v) => onUpdate("occupancyStatus", v)}
                    >
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner Occupied</SelectItem>
                        <SelectItem value="tenant">Tenant Occupied</SelectItem>
                        <SelectItem value="vacant">Vacant</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm font-medium text-foreground capitalize">
                      {extraction.occupancyStatus}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-muted-foreground">HOA Status</p>
                  {editing === "compliance" ? (
                    <Select
                      value={extraction.hoaStatus}
                      onValueChange={(v) => onUpdate("hoaStatus", v)}
                    >
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm font-medium text-foreground capitalize">
                      {extraction.hoaStatus}
                    </p>
                  )}
                </div>
              </div>
              {extraction.exclusions && extraction.exclusions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[11px] text-muted-foreground mb-1">Exclusions</p>
                  <p className="text-sm text-foreground">{extraction.exclusions.join(", ")}</p>
                </div>
              )}
            </SectionCard>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-card px-5 py-3 flex items-center justify-end gap-2 shrink-0">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="outline" onClick={onSaveDraft}>Save Draft</Button>
          <Button onClick={onApprove} className="gap-2">
            <Check className="h-4 w-4" />
            Approve & Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
