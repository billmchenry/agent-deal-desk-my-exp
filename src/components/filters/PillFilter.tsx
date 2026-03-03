import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PillFilterOption {
  value: string;
  label: string;
}

interface PillFilterProps {
  options: PillFilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PillFilter({
  options,
  value,
  onChange,
  className,
}: PillFilterProps) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-1", className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? "default" : "outline"}
          size="sm"
          className="shrink-0"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
