import { useState, useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { startOfYear, startOfMonth, subWeeks, subYears, addMonths } from "date-fns";
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

        {/* Calendar (always visible when custom or popover is open) */}
        {(showCustom || activePresetKey === "filter.custom") && (
          <div>
            <div className="flex gap-4 mb-3 text-xs text-muted-foreground">
              <span>{t("filter.from")}: <span className="text-foreground font-medium">{value.from ? formatDate(value.from) : "—"}</span></span>
              <span>{t("filter.to")}: <span className="text-foreground font-medium">{value.to ? formatDate(value.to) : "—"}</span></span>
            </div>
            <Calendar
              mode="range"
              captionLayout="dropdown-buttons"
              fromYear={2015}
              toYear={new Date().getFullYear() + 1}
              selected={value}
              onSelect={(range) =>
                onChange({ from: range?.from, to: range?.to })
              }
              disabled={
                value.from && !value.to
                  ? { after: addMonths(value.from, 12) }
                  : undefined
              }
              numberOfMonths={2}
              className={cn("p-3 pointer-events-auto")}
            />
            <p className="text-[11px] text-muted-foreground mt-2">Select up to 12 months. Use dropdowns to navigate.</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
