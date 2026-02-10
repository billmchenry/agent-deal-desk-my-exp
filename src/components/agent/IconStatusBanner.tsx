import { Card } from "@/components/ui/card";
import { CheckCircle, TrendingUp, Heart, Calendar, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface IconStatusBannerProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const pillars = [
  {
    key: "production",
    label: "Production",
    icon: TrendingUp,
    status: "3%",
    detail: "$481.90 / $16K",
    complete: false,
    progress: 3.01,
  },
  {
    key: "cultural",
    label: "Cultural",
    icon: Heart,
    status: "Complete",
    detail: "Goal achieved",
    complete: true,
  },
  {
    key: "events",
    label: "Events",
    icon: Calendar,
    status: "2 / 2",
    detail: "All attended",
    complete: true,
  },
  {
    key: "stockgrants",
    label: "Stock Grants",
    icon: Award,
    status: "4 / 4",
    detail: "All awarded",
    complete: true,
  },
];

export function IconStatusBanner({ activeTab, onTabChange }: IconStatusBannerProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {pillars.map((pillar) => {
        const Icon = pillar.icon;
        const isActive = activeTab === pillar.key;

        return (
          <Card
            key={pillar.key}
            onClick={() => onTabChange(pillar.key)}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              isActive
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/40"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  pillar.complete
                    ? "bg-[hsl(var(--exp-green))]/10"
                    : "bg-primary/10"
                }`}
              >
                {pillar.complete ? (
                  <CheckCircle className="w-4 h-4 text-[hsl(var(--exp-green))]" />
                ) : (
                  <Icon className="w-4 h-4 text-primary" />
                )}
              </div>
              <span className="text-sm font-medium text-foreground">{pillar.label}</span>
            </div>

            {pillar.progress !== undefined ? (
              <div className="space-y-1.5">
                <Progress value={pillar.progress} className="h-1.5" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{pillar.detail}</span>
                  <span className="text-xs font-semibold text-foreground">{pillar.status}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{pillar.detail}</span>
                <span className="text-xs font-semibold text-[hsl(var(--exp-green))]">{pillar.status}</span>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
