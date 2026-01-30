import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/contexts/DashboardContext";
import { DashboardWidget } from "@/types/dashboard";
import { ForecastWidget } from "./widgets/ForecastWidget";
import { VelocityWidget } from "./widgets/VelocityWidget";
import { PipelineWidget } from "./widgets/PipelineWidget";

const widgetComponents: Record<'forecast' | 'velocity' | 'pipeline', React.ComponentType<{ compact?: boolean }>> = {
  forecast: ForecastWidget,
  velocity: VelocityWidget,
  pipeline: PipelineWidget,
};

export function PinnedWidgetsGrid() {
  const { widgets, removeWidget } = useDashboard();

  // Only show AI-insight widgets in this legacy component (for backward compat)
  const aiWidgets = widgets.filter(w => 
    w.type === 'forecast' || w.type === 'velocity' || w.type === 'pipeline'
  );

  if (aiWidgets.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-foreground">Your Pinned Insights</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {aiWidgets.map((widget) => {
          const WidgetComponent = widgetComponents[widget.type as 'forecast' | 'velocity' | 'pipeline'];
          if (!WidgetComponent) return null;
          
          return (
            <Card 
              key={widget.id} 
              className="relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <CardHeader className="pb-2 pr-10">
                <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => removeWidget(widget.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <WidgetComponent />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
