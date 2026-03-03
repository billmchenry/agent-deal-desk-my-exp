import { ChevronDown, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownFilterOption {
  value: string;
  label: string;
}

interface DropdownFilterProps {
  label: string;
  options: DropdownFilterOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: LucideIcon;
}

export function DropdownFilter({
  label,
  options,
  value,
  onChange,
  icon: Icon,
}: DropdownFilterProps) {
  const activeLabel = options.find((o) => o.value === value)?.label ?? label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-1 text-sm">
          {Icon && <Icon className="h-4 w-4" />}
          {activeLabel}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={value === option.value ? "bg-muted" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
