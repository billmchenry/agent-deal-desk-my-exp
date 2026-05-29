import { Check, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function getConfidenceLevel(confidence: number): "high" | "medium" | "low" {
  if (confidence >= 85) return "high";
  if (confidence >= 70) return "medium";
  return "low";
}

type FieldType = "text" | "number" | "currency" | "date" | "select" | "percentage";

interface ReviewFieldProps {
  label: string;
  value: string | number | undefined;
  editing: boolean;
  type?: FieldType;
  options?: { value: string; label: string }[];
  onChange: (value: any) => void;
  confidence?: number;
  placeholder?: string;
}

export function ReviewField({
  label,
  value,
  editing,
  type = "text",
  options,
  onChange,
  confidence,
  placeholder = "—",
}: ReviewFieldProps) {
  const confidenceLevel = confidence !== undefined ? getConfidenceLevel(confidence) : "high";
  const needsReview = confidenceLevel !== "high";

  const formatDisplayValue = () => {
    if (value === undefined || value === null || value === "") return placeholder;
    if (type === "currency") {
      return `${Number(value).toLocaleString("en-US", { maximumFractionDigits: 0 })} USD`;
    }
    if (type === "percentage") return `${value}%`;
    if (type === "date" && value) {
      return new Date(value as string).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    if (type === "select" && options) {
      return options.find((o) => o.value === value)?.label || String(value);
    }
    return String(value);
  };

  if (!editing) {
    return (
      <div className="space-y-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p
          className={cn(
            "text-sm font-medium text-foreground tabular-nums truncate",
            needsReview && "text-exp-gold",
          )}
        >
          {formatDisplayValue()}
        </p>
      </div>
    );
  }

  if (type === "select" && options) {
    return (
      <div className="space-y-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <Select value={String(value || "")} onValueChange={onChange}>
          <SelectTrigger className="h-9 text-sm rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <Input
        type={type === "currency" || type === "number" || type === "percentage" ? "number" : type}
        value={value ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          onChange(
            type === "number" || type === "currency" || type === "percentage" ? Number(val) : val,
          );
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="h-9 text-sm rounded-lg tabular-nums"
        step={type === "percentage" ? "0.1" : undefined}
      />
    </div>
  );
}

interface SectionCardProps {
  title: string;
  badge?: string;
  badgeVariant?: "default" | "secondary";
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

export function SectionCard({
  title,
  badge,
  badgeVariant = "default",
  editing,
  onEdit,
  onSave,
  children,
}: SectionCardProps) {
  const badgeClasses =
    badgeVariant === "secondary"
      ? "bg-muted text-muted-foreground"
      : "bg-primary/10 text-primary";

  return (
    <div className="pb-4">
      <div className="rounded-2xl border border-border/60 bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {badge && (
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                  badgeClasses,
                )}
              >
                {badge}
              </span>
            )}
          </div>
          {editing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              className="h-8 px-3 text-xs text-primary hover:text-primary rounded-[51px]"
            >
              <Check className="w-3 h-3 me-1" />
              Done
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 px-3 text-xs text-primary hover:text-primary rounded-[51px]"
            >
              <Pencil className="w-3 h-3 me-1" />
              Edit
            </Button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export function MobileSectionNav({
  sections,
  activeSection,
  onSelect,
}: {
  sections: { id: string; label: string }[];
  activeSection: string;
  onSelect: (section: string) => void;
}) {
  return (
    <div className="flex justify-start gap-2 p-3 border-b border-border bg-background sticky top-0 z-10 overflow-x-auto">
      {sections.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-[51px] text-xs font-medium transition-colors min-h-[36px]",
            activeSection === id
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function AutoFilledField({
  label,
  value,
  source,
  editing,
  onEdit,
  type = "text",
  isFilled,
}: {
  label: string;
  value: string | number | undefined;
  source?: string;
  editing: boolean;
  onEdit: (value: any) => void;
  type?: "text" | "number";
  isFilled: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 p-3",
        isFilled
          ? "border-exp-green/30 bg-exp-green/5"
          : editing
            ? "border-primary/40 bg-primary/5"
            : "border-primary/20 bg-primary/5",
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        {isFilled ? (
          <>
            <Check className="w-3.5 h-3.5 text-exp-green shrink-0" />
            <p className="text-xs font-medium text-exp-green">
              {label}
              {source ? ` (${source})` : ""}
            </p>
          </>
        ) : (
          <p className="text-xs font-medium text-primary">{label}</p>
        )}
      </div>
      {editing ? (
        <Input
          type={type}
          placeholder={`Enter ${label.toLowerCase()}`}
          value={value ?? ""}
          onChange={(e) => onEdit(type === "number" ? Number(e.target.value) : e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="h-9 text-sm rounded-lg bg-background"
        />
      ) : (
        <p className="text-sm font-medium text-foreground">
          {value || <span className="text-muted-foreground italic">Not provided</span>}
        </p>
      )}
    </div>
  );
}
