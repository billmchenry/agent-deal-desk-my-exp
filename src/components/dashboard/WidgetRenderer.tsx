import { LayoutWidget, WidgetType } from "@/contexts/LayoutContext";
import { HeroBannerCard } from "./HeroBannerCard";
import { ActionCenterCard } from "./ActionCenterCard";
import { PromotionalCarousel } from "./PromotionalCarousel";
import { NewsAndTrainingCard } from "./NewsAndTrainingCard";
import { ConnectUplineCard } from "./ConnectUplineCard";
import { ForecastWidget } from "./widgets/ForecastWidget";
import { VelocityWidget } from "./widgets/VelocityWidget";
import { PipelineWidget } from "./widgets/PipelineWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Zap, BarChart3 } from "lucide-react";

interface WidgetRendererProps {
  widget: LayoutWidget;
}

export function WidgetRenderer({ widget }: WidgetRendererProps) {
  switch (widget.type) {
    case 'hero-banner':
      return <HeroBannerCard />;
    case 'action-center':
      return <ActionCenterCard />;
    case 'promotional-carousel':
      return <PromotionalCarousel />;
    case 'news-training':
      return <NewsAndTrainingCard />;
    case 'connect-upline':
      return <ConnectUplineCard />;
    case 'forecast':
      return (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastWidget />
          </CardContent>
        </Card>
      );
    case 'velocity':
      return (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Listing Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VelocityWidget />
          </CardContent>
        </Card>
      );
    case 'pipeline':
      return (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Active Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineWidget />
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
}
