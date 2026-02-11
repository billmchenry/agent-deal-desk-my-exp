import { useRef } from "react";
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
  const startY = useRef(0);
  const scrolled = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    scrolled.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (Math.abs(e.touches[0].clientY - startY.current) > 10) {
      scrolled.current = true;
    }
  };

  const handleTouchEnd = (key: string) => {
    if (!scrolled.current) {
      onTabChange(key);
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 mb-6" style={{ touchAction: 'pan-y' }}>
      {pillars.map((pillar) => {
        const Icon = pillar.icon;
        const isActive = activeTab === pillar.key;

        return (
          <Card
            key={pillar.key}
            onClick={() => onTabChange(pillar.key)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleTouchEnd(pillar.key);
            }}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            className={`p-4 min-h-[88px] cursor-pointer select-none ${
              isActive
                ? "ring-2 ring-primary border-primary shadow-md scale-[1.02]"
                : ""
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
