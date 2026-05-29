import { MapPin, Users, DollarSign, Calendar, ShieldCheck, ShieldAlert } from "lucide-react";
import type { ListingExtraction } from "@/types/transactions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExtractionSummaryProps {
  extraction: ListingExtraction;
  onViewFullExtraction: () => void;
}

function fmtUsd(n: number) {
  return `${n.toLocaleString("en-US", { maximumFractionDigits: 0 })} USD`;
}

function fmtDate(d?: Date) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function ExtractionSummary({ extraction, onViewFullExtraction }: ExtractionSummaryProps) {
  const isCompliant = extraction.complianceStatus === "compliant";

  const rows = [
    {
      icon: MapPin,
      label: "Property",
      value: `${extraction.propertyAddress}, ${extraction.city}, ${extraction.state}`,
      tone: "primary" as const,
    },
    {
      icon: Users,
      label: "Sellers",
      value: extraction.sellers.map((s) => s.name).join(", "),
      tone: "primary" as const,
    },
    {
      icon: DollarSign,
      label: "Price & Commission",
      value: `${fmtUsd(extraction.listingPrice)} • ${extraction.totalCommission}%`,
      tone: "green" as const,
    },
    {
      icon: Calendar,
      label: "Term",
      value: `Ends ${fmtDate(extraction.listingEndDate)}`,
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

      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl",
          isCompliant ? "bg-exp-green/10" : "bg-exp-gold/10",
        )}
      >
        {isCompliant ? (
          <ShieldCheck className="w-5 h-5 text-exp-green" />
        ) : (
          <ShieldAlert className="w-5 h-5 text-exp-gold" />
        )}
        <div className="flex-1">
          <p
            className={cn(
              "font-medium text-sm",
              isCompliant ? "text-exp-green" : "text-exp-gold",
            )}
          >
            {isCompliant ? "100% Compliant" : "Issues Found"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {isCompliant
              ? "All signatures and initials detected"
              : "Some fields require review"}
          </p>
        </div>
      </div>

      <Button onClick={onViewFullExtraction} className="w-full rounded-[51px] min-h-[44px]">
        View & Edit
      </Button>
    </div>
  );
}
