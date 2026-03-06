import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { influencerTiers } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function InfluencerStatusCard() {
  const currentTier = influencerTiers.filter((t) => t.completed).pop();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-section-title font-semibold">My Influencer Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Congratulations Banner */}
        <div className="rounded-lg bg-exp-green/10 border border-exp-green/20 p-4">
          <p className="text-sm font-medium text-exp-green">
            🎉 Congratulations! You've reached{" "}
            <span className="font-bold">{currentTier?.name}</span> status
          </p>
        </div>

        {/* Tier Progression */}
        <div className="relative pl-6">
          {influencerTiers.map((tier, index) => (
            <div key={tier.name} className="relative flex items-center gap-3 py-2">
              {/* Connector Line */}
              {index < influencerTiers.length - 1 && (
                <div
                  className={cn(
                    "absolute left-0 top-8 h-full w-0.5",
                    tier.completed ? "bg-exp-green" : "bg-border"
                  )}
                />
              )}

              {/* Status Indicator */}
              <div
                className={cn(
                  "absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border-2",
                  tier.completed
                    ? "bg-exp-green border-exp-green text-white"
                    : "bg-background border-border"
                )}
              >
                {tier.completed && <Check className="h-3.5 w-3.5" />}
              </div>

              {/* Tier Name */}
              <span
                className={cn(
                  "ml-4 font-medium",
                  tier.completed ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {tier.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
