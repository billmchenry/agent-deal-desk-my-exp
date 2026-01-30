import { Pin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/contexts/DashboardContext";
import { WidgetType } from "@/types/dashboard";
import { ForecastWidget } from "@/components/dashboard/widgets/ForecastWidget";
import { VelocityWidget } from "@/components/dashboard/widgets/VelocityWidget";
import { PipelineWidget } from "@/components/dashboard/widgets/PipelineWidget";
import { toast } from "sonner";

interface WidgetPreviewProps {
  type: 'forecast' | 'velocity' | 'pipeline';
  id: string;
  title: string;
}

const widgetTitles = {
  forecast: "Revenue Share Forecast",
  velocity: "Listing Velocity",
  pipeline: "Active Pipeline",
};

export function WidgetPreview({ type, id, title }: WidgetPreviewProps) {
  const { addWidget, isWidgetPinned } = useDashboard();
  const isPinned = isWidgetPinned(type as WidgetType);

  const handlePin = () => {
    addWidget(type as WidgetType);
    toast.success("Insight added to your Command Center");
  };

  const renderWidget = () => {
    switch (type) {
      case 'forecast':
        return <ForecastWidget compact />;
      case 'velocity':
        return <VelocityWidget compact />;
      case 'pipeline':
        return <PipelineWidget compact />;
      default:
        return null;
    }
  };

  return (
    <Card className="mt-2 border-primary/20 bg-card/50">
      <CardHeader className="pb-2 pt-3 px-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        {renderWidget()}
        <Button
          onClick={handlePin}
          disabled={isPinned}
          size="sm"
          className={`w-full mt-3 ${
            isPinned 
              ? "bg-green-600 hover:bg-green-600 text-white" 
              : "bg-primary hover:bg-primary/90"
          }`}
        >
          {isPinned ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Pinned
            </>
          ) : (
            <>
              <Pin className="h-4 w-4 mr-1" />
              Pin to Dashboard
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
