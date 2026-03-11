import { useState, useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { startOfYear, startOfMonth, subWeeks, subYears } from "date-fns";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface Preset {
  labelKey: string;
  getRange: () => DateRange;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  presets?: Preset[];
}

const defaultPresets: Preset[] = [
  {
    labelKey: "filter.ytd",
    getRange: () => ({ from: startOfYear(new Date()), to: new Date() }),
  },
  {
    labelKey: "filter.mtd",
    getRange: () => ({ from: startOfMonth(new Date()), to: new Date() }),
  },
  {
    labelKey: "filter.lastWeek",
    getRange: () => ({ from: subWeeks(new Date(), 1), to: new Date() }),
  },
  {
    labelKey: "filter.lastYear",
    getRange: () => ({
      from: startOfYear(subYears(new Date(), 1)),
      to: new Date(subYears(new Date(), 1).getFullYear(), 11, 31),
    }),
  },
];

export function DateRangeFilter({
  value,
  onChange,
  presets,
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [selectingField, setSelectingField] = useState<"from" | "to">("from");
  const { formatDate } = useFormatters();
  const { t } = useTranslation();

  const activePresets = presets ?? defaultPresets;

  // Determine which preset is active
  const activePresetKey = useMemo(() => {
    if (!value.from || !value.to) return null;
    for (const p of activePresets) {
      const r = p.getRange();
      if (
        r.from &&
        r.to &&
        r.from.toDateString() === value.from.toDateString() &&
        r.to.toDateString() === value.to.toDateString()
      ) {
        return p.labelKey;
      }
    }
    return "filter.custom";
  }, [value, activePresets]);

  const handlePreset = (preset: Preset) => {
    onChange(preset.getRange());
    setShowCustom(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    if (selectingField === "from") {
      // If new from is after current to, clear to
      const newTo = value.to && date > value.to ? undefined : value.to;
      onChange({ from: date, to: newTo });
      setSelectingField("to");
    } else {
      // If new to is before current from, set it as from instead
      if (value.from && date < value.from) {
        onChange({ from: date, to: value.from });
      } else {
        onChange({ from: value.from, to: date });
      }
      setSelectingField("from");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 text-sm rounded-full px-4 h-9 font-normal">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          {value.from && value.to ? (
            <span className="text-foreground">
              {formatDate(value.from)} – {formatDate(value.to)}
            </span>
          ) : (
            <span className="text-muted-foreground">{t("filter.selectDateRange")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="end">
        {/* Preset buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {activePresets.map((p) => (
            <Button
              key={p.labelKey}
              variant={activePresetKey === p.labelKey ? "default" : "outline"}
              size="sm"
              className="text-xs h-7"
              onClick={() => handlePreset(p)}
            >
              {t(p.labelKey)}
            </Button>
          ))}
          <Button
            variant={showCustom || activePresetKey === "filter.custom" ? "default" : "outline"}
            size="sm"
            className="text-xs h-7"
            onClick={() => setShowCustom(true)}
          >
            {t("filter.custom")}
          </Button>
        </div>

        {/* Calendar for custom range */}
        {(showCustom || activePresetKey === "filter.custom") && (
          <div>
            <div className="flex gap-4 mb-3 text-xs">
              <button
                type="button"
                onClick={() => setSelectingField("from")}
                className={cn(
                  "px-3 py-1.5 rounded-md border transition-colors",
                  selectingField === "from"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {t("filter.from")}: <span className="text-foreground font-medium">{value.from ? formatDate(value.from) : "—"}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectingField("to")}
                className={cn(
                  "px-3 py-1.5 rounded-md border transition-colors",
                  selectingField === "to"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {t("filter.to")}: <span className="text-foreground font-medium">{value.to ? formatDate(value.to) : "—"}</span>
              </button>
            </div>
            <Calendar
              mode="single"
              captionLayout="dropdown-buttons"
              fromYear={2015}
              toYear={new Date().getFullYear() + 1}
              selected={selectingField === "from" ? value.from : value.to}
              onSelect={handleDateSelect}
              numberOfMonths={2}
              className={cn("p-3 pointer-events-auto")}
            />
            <p className="text-[11px] text-muted-foreground mt-2">
              Selecting: <span className="font-medium text-foreground">{selectingField === "from" ? t("filter.from") : t("filter.to")}</span> date. Use dropdowns to navigate months.
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
