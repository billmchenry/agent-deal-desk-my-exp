import { DashboardWidget } from "@/types/dashboard";
import { HeroBannerCard } from "./HeroBannerCard";
import { StatsRow } from "./StatsRow";
import { ActionCenterCard } from "./ActionCenterCard";
import { GrowthAndDevelopmentRows } from "./GrowthAndDevelopmentRows";
import { NewsAndTrainingCard } from "./NewsAndTrainingCard";
import { ConnectUplineCard } from "./ConnectUplineCard";
import { ForecastWidget } from "./widgets/ForecastWidget";
import { VelocityWidget } from "./widgets/VelocityWidget";
import { PipelineWidget } from "./widgets/PipelineWidget";
import { AIInsightWidget } from "./widgets/AIInsightWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WidgetRendererProps {
  widget: DashboardWidget;
}

export function WidgetRenderer({ widget }: WidgetRendererProps) {
  switch (widget.type) {
    case 'hero-banner':
      return <HeroBannerCard />;
    case 'stats-row':
      return <StatsRow />;
    case 'action-center':
      return <ActionCenterCard />;
    case 'promo-carousel':
      return <GrowthAndDevelopmentRows />;
    case 'news-training':
      return <NewsAndTrainingCard />;
    case 'connect-upline':
      return <ConnectUplineCard />;
    case 'forecast':
      return (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue Share Forecast</CardTitle>
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
            <CardTitle className="text-sm font-medium">Listing Velocity</CardTitle>
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
            <CardTitle className="text-sm font-medium">Active Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <PipelineWidget />
          </CardContent>
        </Card>
      );
    case 'ai-insight':
      return (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <AIInsightWidget content={widget.content || ''} />
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
}
