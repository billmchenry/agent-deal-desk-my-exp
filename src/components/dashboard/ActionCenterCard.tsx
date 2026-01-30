import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { influencerTiers, achievements } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { PromotionalCarousel } from "./PromotionalCarousel";

export function ActionCenterCard() {
  const currentTier = influencerTiers.filter((t) => t.completed).pop();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Action Center</CardTitle>
          <Button variant="link" className="text-primary h-auto p-0">
            Learn More
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tabbed Status Section */}
        <Tabs defaultValue="influencer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="influencer">My Influencer Status</TabsTrigger>
            <TabsTrigger value="flqa">FLQA Achievements</TabsTrigger>
          </TabsList>
          
          {/* Influencer Status Tab */}
          <TabsContent value="influencer" className="mt-4 space-y-4">
            {/* Congratulations Banner */}
            <div className="rounded-lg bg-exp-green/10 border border-exp-green/20 p-3">
              <p className="text-sm font-medium text-exp-green">
                🎉 Congratulations! You've reached{" "}
                <span className="font-bold">{currentTier?.name}</span> status
              </p>
            </div>

            {/* Tier Progression - No progress bars */}
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
          </TabsContent>

          {/* FLQA Achievements Tab */}
          <TabsContent value="flqa" className="mt-4">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">FLQA Status</span>
                <Badge className="bg-exp-green text-white hover:bg-exp-green/90">
                  {achievements.flqa.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-exp-blue">
                  ${achievements.flqa.amount.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  As of {achievements.flqa.date}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Promotional Carousel */}
        <PromotionalCarousel />
      </CardContent>
    </Card>
  );
}
