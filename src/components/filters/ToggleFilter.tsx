import { Checkbox } from "@/components/ui/checkbox";

interface ToggleFilterProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export function ToggleFilter({
  label,
  checked,
  onChange,
  id,
}: ToggleFilterProps) {
  const toggleId = id ?? `toggle-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={toggleId}
        checked={checked}
        onCheckedChange={(c) => onChange(c === true)}
      />
      <label
        htmlFor={toggleId}
        className="text-sm text-muted-foreground cursor-pointer whitespace-nowrap"
      >
        {label}
      </label>
    </div>
  );
}
