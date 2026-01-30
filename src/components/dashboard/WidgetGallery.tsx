import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, CheckCircle, Sparkles, Newspaper, Users, TrendingUp, Zap, BarChart3 } from "lucide-react";
import { useLayout, WidgetType } from "@/contexts/LayoutContext";
import { useState } from "react";

interface WidgetDefinition {
  type: WidgetType;
  title: string;
  description: string;
  icon: React.ElementType;
  defaultZone: 'main' | 'sidebar';
  category: 'core' | 'ai';
}

const availableWidgets: WidgetDefinition[] = [
  {
    type: 'hero-banner',
    title: 'Capping Progress',
    description: 'Track your progress toward your annual cap goal',
    icon: Target,
    defaultZone: 'main',
    category: 'core',
  },
  {
    type: 'action-center',
    title: 'Action Center',
    description: 'View your influencer status and FLQA progress',
    icon: CheckCircle,
    defaultZone: 'main',
    category: 'core',
  },
  {
    type: 'promotional-carousel',
    title: 'Promotions',
    description: 'Current promotions and announcements',
    icon: Sparkles,
    defaultZone: 'main',
    category: 'core',
  },
  {
    type: 'news-training',
    title: 'News & Training',
    description: 'Latest news and training resources',
    icon: Newspaper,
    defaultZone: 'sidebar',
    category: 'core',
  },
  {
    type: 'connect-upline',
    title: 'Connect with Upline',
    description: 'Quick access to your upline contacts',
    icon: Users,
    defaultZone: 'sidebar',
    category: 'core',
  },
  {
    type: 'forecast',
    title: 'Revenue Forecast',
    description: 'AI-generated revenue share projections',
    icon: TrendingUp,
    defaultZone: 'main',
    category: 'ai',
  },
  {
    type: 'velocity',
    title: 'Listing Velocity',
    description: 'AI-analyzed listing performance metrics',
    icon: Zap,
    defaultZone: 'main',
    category: 'ai',
  },
  {
    type: 'pipeline',
    title: 'Active Pipeline',
    description: 'AI summary of your active escrows',
    icon: BarChart3,
    defaultZone: 'main',
    category: 'ai',
  },
];

export function WidgetGallery() {
  const { addWidget, isWidgetOnDashboard } = useLayout();
  const [open, setOpen] = useState(false);

  const coreWidgets = availableWidgets.filter(w => w.category === 'core');
  const aiWidgets = availableWidgets.filter(w => w.category === 'ai');

  const handleAddWidget = (widget: WidgetDefinition) => {
    addWidget(widget.type, widget.defaultZone);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Widget
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Widget</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Core Widgets */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Core Widgets</h3>
            <div className="space-y-2">
              {coreWidgets.map((widget) => {
                const isOnDashboard = isWidgetOnDashboard(widget.type);
                const Icon = widget.icon;

                return (
                  <Card
                    key={widget.type}
                    className={`p-4 cursor-pointer transition-all hover:bg-accent/50 ${
                      isOnDashboard ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => !isOnDashboard && handleAddWidget(widget)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{widget.title}</h4>
                          {isOnDashboard && (
                            <Badge variant="secondary" className="text-xs">Added</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {widget.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* AI Widgets */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Insights
            </h3>
            <div className="space-y-2">
              {aiWidgets.map((widget) => {
                const isOnDashboard = isWidgetOnDashboard(widget.type);
                const Icon = widget.icon;

                return (
                  <Card
                    key={widget.type}
                    className={`p-4 cursor-pointer transition-all hover:bg-accent/50 ${
                      isOnDashboard ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => !isOnDashboard && handleAddWidget(widget)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{widget.title}</h4>
                          {isOnDashboard && (
                            <Badge variant="secondary" className="text-xs">Added</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {widget.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
