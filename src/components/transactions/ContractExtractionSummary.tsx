import { MapPin, Users, DollarSign, Calendar, ShieldCheck } from "lucide-react";
import type { ContractExtraction, Listing } from "@/types/transactions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContractExtractionSummaryProps {
  extraction: ContractExtraction;
  listing: Listing | null;
  onViewFullExtraction: () => void;
}

function fmtUsd(n: number) {
  return `${n.toLocaleString("en-US", { maximumFractionDigits: 0 })} USD`;
}

function fmtDate(d?: Date) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function ContractExtractionSummary({
  extraction,
  listing,
  onViewFullExtraction,
}: ContractExtractionSummaryProps) {
  const cityState = listing
    ? `, ${listing.extraction.city}, ${listing.extraction.state}`
    : "";

  const totalFee =
    (extraction.listingBrokerFee ?? 0) + (extraction.buyingBrokerFee ?? 0);
  const commissionPct =
    extraction.salesPrice > 0 && totalFee > 0
      ? `${((totalFee / extraction.salesPrice) * 100).toFixed(2).replace(/\.?0+$/, "")}%`
      : "—";

  const rows = [
    {
      icon: MapPin,
      label: "Property",
      value: `${extraction.propertyAddress}${cityState}`,
      tone: "primary" as const,
    },
    {
      icon: Users,
      label: "Buyers",
      value: extraction.buyers.map((b) => b.name).join(", ") || "—",
      tone: "primary" as const,
    },
    {
      icon: DollarSign,
      label: "Sales Price & Commission",
      value: `${fmtUsd(extraction.salesPrice)} • ${commissionPct}`,
      tone: "green" as const,
    },
    {
      icon: Calendar,
      label: "Closing",
      value: `Closes ${fmtDate(extraction.closingDate)}`,
      tone: "blue" as const,
    },
  ];

  const toneClasses = {
    primary: "bg-primary/10 text-primary",
    green: "bg-exp-green/10 text-exp-green",
    blue: "bg-exp-blue-light/15 text-exp-slate-blue",
  };

  return (
    <div className="p-4 rounded-2xl border border-border bg-card space-y-3 animate-fade-in">
      {rows.map(({ icon: Icon, label, value, tone }) => (
        <div key={label} className="flex items-start gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
              toneClasses[tone],
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground truncate">{value}</p>
          </div>
        </div>
      ))}

      <div className={cn("flex items-center gap-3 p-3 rounded-xl bg-exp-green/10")}>
        <ShieldCheck className="w-5 h-5 text-exp-green" />
        <div className="flex-1">
          <p className="font-medium text-sm text-exp-green">100% Compliant</p>
          <p className="text-[11px] text-muted-foreground">
            All signatures and initials detected
          </p>
        </div>
      </div>

      <Button onClick={onViewFullExtraction} className="w-full rounded-[51px] min-h-[44px]">
        View & Edit
      </Button>
    </div>
  );
}
