import { useState } from "react";
import { Filter, CalendarIcon } from "lucide-react";
import { format, startOfYear, startOfMonth, subWeeks, subYears } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface AgentFilterBarProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  includePipeline?: boolean;
  onIncludePipelineChange?: (include: boolean) => void;
}

const presets = [
  { label: "YTD", getRange: () => ({ from: startOfYear(new Date()), to: new Date() }) },
  { label: "MTD", getRange: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  { label: "Last Week", getRange: () => ({ from: subWeeks(new Date(), 1), to: new Date() }) },
  { label: "Last Year", getRange: () => ({ from: startOfYear(subYears(new Date(), 1)), to: new Date(subYears(new Date(), 1).getFullYear(), 11, 31) }) },
];

export function AgentFilterBar({
  dateRange,
  onDateRangeChange,
  includePipeline = false,
  onIncludePipelineChange,
}: AgentFilterBarProps) {
  const [open, setOpen] = useState(false);

  const handlePreset = (preset: typeof presets[0]) => {
    onDateRangeChange(preset.getRange());
  };

  return (
    <div className="flex items-center justify-between mb-2">
      <h1 className="text-xl font-bold text-foreground">Agent Performance</h1>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 text-sm">
            <Filter className="h-4 w-4" />
            {dateRange.from && dateRange.to ? (
              <>
                {format(dateRange.from, "MM/dd/yyyy")} –{" "}
                {format(dateRange.to, "MM/dd/yyyy")}
              </>
            ) : (
              "Select date range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="end">
          {/* Preset buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {presets.map((p) => (
              <Button
                key={p.label}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => handlePreset(p)}
              >
                {p.label}
              </Button>
            ))}
          </div>

          {/* Calendar */}
          <Calendar
            mode="range"
            captionLayout="dropdown-buttons"
            fromYear={2015}
            toYear={new Date().getFullYear() + 1}
            selected={dateRange}
            onSelect={(range) =>
              onDateRangeChange({ from: range?.from, to: range?.to })
            }
            numberOfMonths={2}
            className={cn("p-3 pointer-events-auto")}
          />

          {/* Include pipeline */}
          {onIncludePipelineChange && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <Checkbox
                id="pipeline"
                checked={includePipeline}
                onCheckedChange={(checked) =>
                  onIncludePipelineChange(checked === true)
                }
              />
              <label
                htmlFor="pipeline"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Include All Pipeline
              </label>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
