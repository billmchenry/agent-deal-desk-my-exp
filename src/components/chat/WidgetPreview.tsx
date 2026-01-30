import { Pin, Check, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
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
  onFollowUp?: (question: string) => void;
}

// Insights and follow-up questions for each widget type
const widgetInsights: Record<string, { insights: { icon: 'trend' | 'sparkle'; text: string }[]; followUps: string[] }> = {
  forecast: {
    insights: [
      { icon: 'trend', text: '23% growth compared to last year' },
      { icon: 'sparkle', text: 'December was your best month at $54K' },
      { icon: 'sparkle', text: 'Average deal size increased by $12K' },
    ],
    followUps: [
      'How does this compare to my team?',
      'Projected revenue next quarter?',
    ],
  },
  velocity: {
    insights: [
      { icon: 'trend', text: 'Selling 15% faster than market average' },
      { icon: 'sparkle', text: 'Average days on market: 18 days' },
      { icon: 'sparkle', text: 'Price-to-list ratio improved to 98.5%' },
    ],
    followUps: [
      'Which listings are slowest?',
      'How can I improve velocity?',
    ],
  },
  pipeline: {
    insights: [
      { icon: 'trend', text: '8 active deals worth $2.4M total' },
      { icon: 'sparkle', text: '3 deals expected to close this month' },
      { icon: 'sparkle', text: 'Average commission per deal: $18K' },
    ],
    followUps: [
      'Which deals need attention?',
      'Projected commission this quarter?',
    ],
  },
};

export function WidgetPreview({ type, id, title, onFollowUp }: WidgetPreviewProps) {
  const { addWidget, isWidgetPinned } = useDashboard();
  const isPinned = isWidgetPinned(type as WidgetType);
  const { insights, followUps } = widgetInsights[type] || { insights: [], followUps: [] };

  const handlePin = () => {
    addWidget(type as WidgetType);
    toast.success("Insight pinned to your dashboard!");
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
    <div className="mt-3 space-y-3">
      {/* Chart Card */}
      <Card className="border-border/50 bg-card shadow-sm">
        <CardHeader className="pb-2 pt-3 sm:pt-4 px-3 sm:px-4">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
          {renderWidget()}
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="space-y-1.5 sm:space-y-2 px-1">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-2 text-xs sm:text-sm">
            {insight.icon === 'trend' ? (
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0 mt-0.5" />
            )}
            <span className="text-muted-foreground">{insight.text}</span>
          </div>
        ))}
      </div>

      {/* Follow-up Questions - Stack on mobile */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
        {followUps.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onFollowUp?.(question)}
            className="h-8 text-xs rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/5 justify-start sm:justify-center"
          >
            <span className="truncate">{question}</span>
            <ArrowRight className="h-3 w-3 ml-1 shrink-0" />
          </Button>
        ))}
      </div>

      {/* Pin to Dashboard */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePin}
        disabled={isPinned}
        className={`h-8 px-2 text-xs sm:text-sm ${
          isPinned 
            ? 'text-green-600 hover:text-green-600' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {isPinned ? (
          <>
            <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
            Pinned to Dashboard
          </>
        ) : (
          <>
            <Pin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
            Pin to Dashboard
          </>
        )}
      </Button>
    </div>
  );
}
