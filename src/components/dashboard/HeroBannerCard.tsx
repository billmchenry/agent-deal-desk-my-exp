import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target } from "lucide-react";
import { cappingData } from "@/data/mockData";

export function HeroBannerCard() {
  const remaining = cappingData.target - cappingData.current;
  const progressPercentage = (cappingData.current / cappingData.target) * 100;

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-exp-navy via-exp-navy-light to-exp-blue p-4 sm:p-6 text-white">
      {/* Decorative background elements */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
        <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-white" />
        <div className="absolute right-16 bottom-4 h-20 w-20 rounded-full bg-exp-gold" />
      </div>

      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Badge className="bg-exp-gold/20 text-exp-gold-light border-exp-gold/30 hover:bg-exp-gold/30">
            <Target className="mr-1 h-3 w-3" />
            CAPPING UPDATE
          </Badge>
          
          <div>
            <h2 className="text-lg font-medium text-white/80">Track your progress to</h2>
            <p className="text-3xl font-bold">
              <span className="text-exp-green-light">${(cappingData.target / 1000).toFixed(0)}K</span> Cap
            </p>
          </div>
          
          <p className="text-sm text-white/70">
            You're <span className="font-semibold text-white">{formatCurrency(remaining)}</span> away from capping this year
          </p>

          <div className="flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-4 pt-2">
            <Button className="bg-white text-exp-navy hover:bg-white/90 w-full xs:w-auto">
              View Details
            </Button>
            <div className="flex items-center gap-2 text-sm flex-wrap">
              <TrendingUp className="h-4 w-4 text-exp-green-light" />
              <span className="min-w-0 break-words">
                Current:{" "}
                <span className="font-semibold text-exp-green-light">${cappingData.current.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Mini progress ring */}
        <div className="flex items-center justify-center lg:pr-8">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28">
            <svg className="h-24 w-24 sm:h-28 sm:w-28 -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="hsl(var(--exp-green))"
                strokeWidth="8"
                strokeDasharray={`${progressPercentage * 2.51} 251`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold">{progressPercentage.toFixed(0)}%</span>
              <span className="text-xs text-white/70">Complete</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
