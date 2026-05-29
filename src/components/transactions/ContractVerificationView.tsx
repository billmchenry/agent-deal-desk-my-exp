import { useState, useMemo } from "react";
import { ArrowLeft, Check, Pencil, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PDFViewer } from "@/components/transactions/PDFViewer";
import { cn } from "@/lib/utils";
import { useFormatters } from "@/hooks/useFormatters";
import type { ContractExtraction, Listing } from "@/types/transactions";
import { getContractConfidenceLevel } from "@/data/mockContractExtraction";

interface Props {
  open: boolean;
  onClose: () => void;
  listing: Listing;
  extraction: ContractExtraction;
  sourceFile?: File | null;
  onUpdate: (field: keyof ContractExtraction | string, value: unknown) => void;
  onApprove: () => void;
  onSaveDraft: () => void;
}

type SectionKey = "property" | "parties" | "price" | "earnest" | "broker" | "transaction";

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
  type?: "text" | "number" | "date" | "email" | "tel";
}) {
  const needsReview = confidence !== undefined && getContractConfidenceLevel(confidence) !== "high";
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
  const { formatNumber } = useFormatters();
  const [editing, setEditing] = useState<SectionKey | null>(null);
  const toggle = (k: SectionKey) => setEditing((cur) => (cur === k ? null : k));

  const grossCommission = useMemo(
    () => ((extraction.salesPrice || 0) * (extraction.listingBrokerFee || 0)) / 100,
    [extraction.salesPrice, extraction.listingBrokerFee],
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[1280px] h-[92vh] flex flex-col p-0 overflow-hidden rounded-2xl border-border/60">
        <DialogTitle className="sr-only">Contract Verification</DialogTitle>

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
            <p className="font-semibold">Contract Verification</p>
            <p className="text-xs text-white/75 truncate">
              Review extracted contract details for {listing.extraction.propertyAddress}.
            </p>
          </div>
          <Badge className="bg-exp-green text-white border-0 hidden sm:inline-flex tabular-nums">
            Gross {formatNumber(Math.round(grossCommission))} USD
          </Badge>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1fr] min-h-0">
          <div className="hidden lg:block p-4 border-e border-border bg-muted/10">
            <PDFViewer fileName={extraction.documentName} file={sourceFile} />
          </div>

          <div className="overflow-y-auto p-5 space-y-4">
            <SectionCard
              title="Property"
              required
              editing={editing === "property"}
              onToggleEdit={() => toggle("property")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldRow
                  label="Address"
                  value={extraction.propertyAddress}
                  confidence={extraction.confidence.propertyAddress}
                  editing={editing === "property"}
                  onChange={(v) => onUpdate("propertyAddress", v)}
                />
                <FieldRow
                  label="Legal Description"
                  value={extraction.legalDescription}
                  confidence={extraction.confidence.legalDescription}
                  editing={editing === "property"}
                  onChange={(v) => onUpdate("legalDescription", v)}
                />
                <FieldRow
                  label="Title Company"
                  value={extraction.titleCompany}
                  editing={editing === "property"}
                  onChange={(v) => onUpdate("titleCompany", v)}
                />
                <FieldRow
                  label="Escrow Agent"
                  value={extraction.escrowAgent}
                  editing={editing === "property"}
                  onChange={(v) => onUpdate("escrowAgent", v)}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Parties"
              required
              editing={editing === "parties"}
              onToggleEdit={() => toggle("parties")}
            >
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">Sellers</p>
                  <p className="text-sm font-medium text-foreground">
                    {extraction.sellers.map((s) => s.name).join(", ") || "—"}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FieldRow
                    label="Buyer Name"
                    value={extraction.buyers[0]?.name}
                    editing={editing === "parties"}
                    onChange={(v) => {
                      const next = [...extraction.buyers];
                      next[0] = { ...(next[0] || { role: "buyer", name: "" }), name: v };
                      onUpdate("buyers", next);
                    }}
                  />
                  <FieldRow
                    label="Buyer Email"
                    type="email"
                    value={extraction.buyers[0]?.email}
                    editing={editing === "parties"}
                    onChange={(v) => {
                      const next = [...extraction.buyers];
                      next[0] = { ...(next[0] || { role: "buyer", name: "" }), email: v };
                      onUpdate("buyers", next);
                    }}
                  />
                  <FieldRow
                    label="Buyer Phone"
                    type="tel"
                    value={extraction.buyers[0]?.phone}
                    editing={editing === "parties"}
                    onChange={(v) => {
                      const next = [...extraction.buyers];
                      next[0] = { ...(next[0] || { role: "buyer", name: "" }), phone: v };
                      onUpdate("buyers", next);
                    }}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Sales Price"
              required
              editing={editing === "price"}
              onToggleEdit={() => toggle("price")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FieldRow
                  label="Sales Price"
                  value={extraction.salesPrice}
                  type="number"
                  confidence={extraction.confidence.salesPrice}
                  editing={editing === "price"}
                  onChange={(v) => onUpdate("salesPrice", Number(v))}
                />
                <FieldRow
                  label="Cash Portion"
                  value={extraction.cashPortion}
                  type="number"
                  editing={editing === "price"}
                  onChange={(v) => onUpdate("cashPortion", Number(v))}
                />
                <FieldRow
                  label="Financing"
                  value={extraction.financing}
                  type="number"
                  editing={editing === "price"}
                  onChange={(v) => onUpdate("financing", Number(v))}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Earnest Money & Option"
              editing={editing === "earnest"}
              onToggleEdit={() => toggle("earnest")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldRow
                  label="Earnest Money"
                  value={extraction.earnestMoney}
                  type="number"
                  editing={editing === "earnest"}
                  onChange={(v) => onUpdate("earnestMoney", Number(v))}
                />
                <FieldRow
                  label="Option Fee"
                  value={extraction.optionFee}
                  type="number"
                  editing={editing === "earnest"}
                  onChange={(v) => onUpdate("optionFee", Number(v))}
                />
                <FieldRow
                  label="Option Period (days)"
                  value={extraction.optionPeriodDays}
                  type="number"
                  editing={editing === "earnest"}
                  onChange={(v) => onUpdate("optionPeriodDays", Number(v))}
                />
                <FieldRow
                  label="Closing Date"
                  value={extraction.closingDate?.toISOString().slice(0, 10)}
                  type="date"
                  editing={editing === "earnest"}
                  onChange={(v) => onUpdate("closingDate", new Date(v))}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Broker Fees"
              required
              editing={editing === "broker"}
              onToggleEdit={() => toggle("broker")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldRow
                  label="Listing Broker Fee %"
                  value={extraction.listingBrokerFee}
                  type="number"
                  editing={editing === "broker"}
                  onChange={(v) => onUpdate("listingBrokerFee", Number(v))}
                />
                <FieldRow
                  label="Buying Broker Fee %"
                  value={extraction.buyingBrokerFee}
                  type="number"
                  editing={editing === "broker"}
                  onChange={(v) => onUpdate("buyingBrokerFee", Number(v))}
                />
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Gross commission (listing side)</span>
                <span className="text-sm font-semibold text-exp-green tabular-nums">
                  {formatNumber(Math.round(grossCommission))} USD
                </span>
              </div>
            </SectionCard>

            <SectionCard
              title="Transaction Metadata"
              editing={editing === "transaction"}
              onToggleEdit={() => toggle("transaction")}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldRow
                  label="MLS Number"
                  value={extraction.mlsNumber}
                  editing={editing === "transaction"}
                  onChange={(v) => onUpdate("mlsNumber", v)}
                />
                <FieldRow
                  label="GF / Escrow Number"
                  value={extraction.gfEscrowNumber}
                  editing={editing === "transaction"}
                  onChange={(v) => onUpdate("gfEscrowNumber", v)}
                />
                <FieldRow
                  label="Lead Source"
                  value={extraction.transactionLeadSource}
                  editing={editing === "transaction"}
                  onChange={(v) => onUpdate("transactionLeadSource", v)}
                />
                <FieldRow
                  label="Escrow Officer"
                  value={extraction.escrowOfficerName}
                  editing={editing === "transaction"}
                  onChange={(v) => onUpdate("escrowOfficerName", v)}
                />
              </div>
            </SectionCard>
          </div>
        </div>

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
