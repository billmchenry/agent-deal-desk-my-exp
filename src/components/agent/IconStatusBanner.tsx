import { Card } from "@/components/ui/card";
import { CheckCircle, TrendingUp, Heart, Calendar, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "@/hooks/useTranslation";

interface IconStatusBannerProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const pillars = [
  {
    key: "production",
    labelKey: "icon.production",
    icon: TrendingUp,
    status: "3%",
    detail: "$481.90 / $16K",
    complete: false,
    progress: 3.01,
  },
  {
    key: "cultural",
    labelKey: "icon.cultural",
    icon: Heart,
    statusKey: "agent.complete",
    detailKey: "icon.goalAchieved",
    complete: true,
  },
  {
    key: "events",
    labelKey: "icon.events",
    icon: Calendar,
    status: "2 / 2",
    detailKey: "icon.allAttended",
    complete: true,
  },
  {
    key: "stockgrants",
    labelKey: "icon.stockGrants",
    icon: Award,
    status: "4 / 4",
    detailKey: "icon.allAwarded",
    complete: true,
  },
];

export function IconStatusBanner({ activeTab, onTabChange }: IconStatusBannerProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 mb-6 max-w-full overflow-hidden">
      {pillars.map((pillar) => {
        const Icon = pillar.icon;
        const isActive = activeTab === pillar.key;

        return (
          <Card
            key={pillar.key}
            onClick={() => onTabChange(pillar.key)}
            className={`tap-card p-3 sm:p-4 min-h-[88px] cursor-pointer select-none ${
              isActive
                ? "border-2 border-primary shadow-md"
                : "lg:hover:shadow-md lg:hover:border-primary/40"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {pillar.complete ? (
                <CheckCircle className="w-4 h-4 text-[hsl(var(--exp-green))]" />
              ) : (
                <Icon className="w-4 h-4 text-primary" />
              )}
              <span className="text-sm font-medium text-foreground">{pillar.label}</span>
            </div>

            {pillar.progress !== undefined ? (
              <div className="space-y-1.5">
                <Progress value={Math.max(pillar.progress, 8)} className="h-1.5" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{pillar.detail}</span>
                  <span className="text-sm font-bold text-foreground">{pillar.status}</span>
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
