import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LabeledFilterProps {
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Wraps a filter control with an uppercase label above it.
 * Used in the secondary "labeled dropdowns" row on list pages.
 */
export function LabeledFilter({ label, children, className }: LabeledFilterProps) {
  return (
    <div className={cn("space-y-2 min-w-0", className)}>
      <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-[0.1em] ms-1">
        {label}
      </label>
      {children}
    </div>
  );
}
