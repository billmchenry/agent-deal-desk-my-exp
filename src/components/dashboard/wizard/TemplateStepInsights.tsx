import { DashboardWidget, WIDGET_REGISTRY } from "@/types/dashboard";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TemplateStepInsightsProps {
  widgets: DashboardWidget[];
  selectedWidgetIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function TemplateStepInsights({
  widgets,
  selectedWidgetIds,
  onSelectionChange,
}: TemplateStepInsightsProps) {
  const toggleWidget = (id: string) => {
    if (selectedWidgetIds.includes(id)) {
      onSelectionChange(selectedWidgetIds.filter((wid) => wid !== id));
    } else {
      onSelectionChange([...selectedWidgetIds, id]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Select Insights</h3>
        <p className="text-sm text-muted-foreground">
          Choose the insights for your template
        </p>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {widgets.map((widget) => {
          const registry = WIDGET_REGISTRY[widget.type];
          const isSelected = selectedWidgetIds.includes(widget.id);

          return (
            <button
              key={widget.id}
              onClick={() => toggleWidget(widget.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/50"
              )}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{widget.title}</p>
                <p className="text-xs text-muted-foreground">
                  {registry?.refreshFrequency || 'Daily'} Refresh
                </p>
              </div>

              <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                {registry?.widgetKind || 'Card'}
              </span>
            </button>
          );
        })}
      </div>

      {widgets.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No widgets on your dashboard yet.</p>
          <p className="text-sm">Add some widgets first, then create a template.</p>
        </div>
      )}
    </div>
  );
}
