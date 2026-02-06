import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const productionGoals = [
  {
    label: "Individual Cap",
    current: 481.9,
    target: 16000,
    percentage: 3.01,
  },
  {
    label: "Team Cap",
    current: 12469,
    target: 40000,
    percentage: 31.17,
  },
];

const stockGrants = [
  { label: "Production", status: "awarded" as const },
  { label: "Cultural", status: "awarded" as const },
  { label: "Event 1", status: "awarded" as const },
  { label: "Event 2", status: "awarded" as const },
];

export function IconStatusSummary() {
  return (
    <section>
      {/* Sticky header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm border-b px-0 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">ICON Status</h2>
          <Link
            to="/agent/icon-program"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline min-h-[44px] px-2"
          >
            View Full Details
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3">
        {/* Production Goals */}
        <Card>
          <CardContent className="p-4 sm:p-6 space-y-5">
            <h3 className="font-semibold text-foreground text-sm">Production Goals</h3>
            {productionGoals.map((goal) => (
              <div key={goal.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{goal.label}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10 text-xs">
                      In Progress
                    </Badge>
                    <span className="text-xs text-muted-foreground">{goal.percentage}%</span>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={goal.percentage} className="h-2" />
                  <div
                    className="absolute -top-6 text-[10px] bg-foreground text-background px-1.5 py-0.5 rounded"
                    style={{
                      left: `${Math.max(2, Math.min(goal.percentage, 95))}%`,
                      transform: "translateX(-50%)",
                    }}
                  >
                    ${goal.current.toLocaleString("en-US")}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Goal: ${(goal.target / 1000).toFixed(0)}K
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stock Grants */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-semibold text-foreground text-sm mb-4">Stock Grants</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stockGrants.map((grant) => (
                <div
                  key={grant.label}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50"
                >
                  <span className="text-xs text-muted-foreground font-medium">{grant.label}</span>
                  {grant.status === "awarded" ? (
                    <Badge className="bg-green-500 hover:bg-green-500 text-white gap-1 text-[10px]">
                      <Check className="h-3 w-3" />
                      Awarded
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">
                      In Progress
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
