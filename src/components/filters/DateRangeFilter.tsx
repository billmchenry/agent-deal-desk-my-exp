import { useState, useMemo } from "react";
import { CalendarDays, RotateCcw } from "lucide-react";
import { startOfYear, startOfMonth, subWeeks, subYears, format } from "date-fns";
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
  const [customFrom, setCustomFrom] = useState<Date | undefined>(value.from);
  const [customTo, setCustomTo] = useState<Date | undefined>(value.to);
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
    setOpen(false);
  };

  const handleApply = () => {
    if (customFrom && customTo) {
      onChange({ from: customFrom, to: customTo });
      setOpen(false);
    }
  };

  const handleReset = () => {
    const defaultRange = activePresets[0]?.getRange() ?? { from: startOfYear(new Date()), to: new Date() };
    onChange(defaultRange);
    setCustomFrom(undefined);
    setCustomTo(undefined);
    setShowCustom(false);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 text-sm rounded-[51px] px-4 h-9 font-normal">
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
              variant={!showCustom && activePresetKey === p.labelKey ? "default" : "outline"}
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

        {/* Custom date pickers — same pattern as RevShare Dashboard */}
        {(showCustom || activePresetKey === "filter.custom") && (
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("filter.from")}</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left text-xs h-8", !customFrom && "text-muted-foreground")}>
                      <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                      {customFrom ? format(customFrom, "MMM d, yyyy") : "Select"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customFrom}
                      onSelect={setCustomFrom}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("filter.to")}</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left text-xs h-8", !customTo && "text-muted-foreground")}>
                      <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                      {customTo ? format(customTo, "MMM d, yyyy") : "Select"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customTo}
                      onSelect={setCustomTo}
                      disabled={(date) => customFrom ? date < customFrom : false}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}

        {/* Apply / Reset buttons */}
        {(showCustom || activePresetKey === "filter.custom") && (
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" size="sm" className="text-xs h-7 gap-1" onClick={handleReset}>
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
            <Button
              size="sm"
              className="text-xs h-7"
              onClick={handleApply}
              disabled={!customFrom || !customTo}
            >
              Apply
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
