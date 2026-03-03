import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useFormatters } from "@/hooks/useFormatters";

export function DetailRow({ label, value, highlighted = false }: { label: string; value: string | number; highlighted?: boolean }) {
  const { formatNumber } = useFormatters();
  return (
    <div className={cn("flex justify-between py-2 px-4", highlighted && "bg-accent/50")}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium", highlighted && "text-primary font-semibold")}>
        {typeof value === "number" ? formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
      </span>
    </div>
  );
}

export function SectionHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="bg-primary text-primary-foreground px-4 py-3 font-semibold flex items-center justify-between">
      <span>{title}</span>
      {badge && (
        <span className="bg-primary-foreground/20 text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
          {badge}
        </span>
      )}
    </div>
  );
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between bg-muted/50 px-4 py-3 font-semibold hover:bg-muted transition-colors">
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
