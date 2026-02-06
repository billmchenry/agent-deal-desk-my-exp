import { Pin, Check, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/contexts/DashboardContext";
import { useMiraChat } from "@/contexts/MiraChatContext";
import { WidgetType } from "@/types/dashboard";
import { ForecastWidget } from "@/components/dashboard/widgets/ForecastWidget";
import { VelocityWidget } from "@/components/dashboard/widgets/VelocityWidget";
import { PipelineWidget } from "@/components/dashboard/widgets/PipelineWidget";


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
  const { closeChat, setCurrentMessages } = useMiraChat();
  const isPinned = isWidgetPinned(type as WidgetType);
  const { insights, followUps } = widgetInsights[type] || { insights: [], followUps: [] };

  const handlePin = () => {
    addWidget(type as WidgetType);
    // Re-query after adding so we can reference the new widget
    const onViewDashboard = () => {
      // Find the widget that was just added
      const w = document.querySelector(`[data-widget-type="${type}"]`);
      closeChat();
      setTimeout(() => {
        if (w) {
          w.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    };

    setCurrentMessages(prev => [
      ...prev,
      {
        id: `pin-success-${Date.now()}`,
        sender: 'ai' as const,
        content: `✅ Done! I've pinned **${title}** to your dashboard.`,
        action: {
          label: 'View on Dashboard',
          icon: 'focus',
          onClick: onViewDashboard,
        },
        timestamp: new Date(),
      },
    ]);
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
    <div className="mt-3 space-y-2.5 w-full max-w-full overflow-hidden">
      {/* Chart Card */}
      <Card className="border-border/50 bg-card shadow-sm w-full">
        <CardHeader className="pb-2 pt-2.5 px-2.5 sm:pt-4 sm:px-4 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs sm:text-sm font-semibold truncate">{title}</CardTitle>
          <div className="flex items-center gap-1">
            {/* Pin button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handlePin();
              }}
              disabled={isPinned}
              className={`h-6 w-6 sm:h-7 sm:w-7 shrink-0 ${
                isPinned 
                  ? 'text-green-600 hover:text-green-600' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={isPinned ? "Pinned to Dashboard" : "Pin to Dashboard"}
            >
              {isPinned ? (
                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Pin className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-4 pb-2.5 sm:pb-4">
          {renderWidget()}
        </CardContent>
      </Card>

      {/* Key Insights */}
      <div className="space-y-1 sm:space-y-2">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-sm">
            {insight.icon === 'trend' ? (
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0 mt-0.5" />
            )}
            <span className="text-muted-foreground leading-tight">{insight.text}</span>
          </div>
        ))}
      </div>

      {/* Follow-up Questions - Stack on mobile */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-2">
        {followUps.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onFollowUp?.(question)}
            className="h-7 sm:h-8 text-[11px] sm:text-xs rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/5 justify-start px-2.5 sm:px-3"
          >
            <span className="truncate">{question}</span>
            <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-1 shrink-0" />
          </Button>
        ))}
      </div>
    </div>
  );
}
