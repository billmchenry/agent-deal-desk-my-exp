import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { achievements } from "@/data/mockData";

export function AchievementsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">My Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        {/* FLQA Status */}
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
      </CardContent>
    </Card>
  );
}
