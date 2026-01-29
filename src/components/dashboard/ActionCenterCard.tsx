import { Phone, Mail, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InfluencerStatusCard } from "./InfluencerStatusCard";
import { DISCCard } from "./DISCCard";

const organizationLevels = [
  { name: "Alpha Legacy", value: "1000+ Total and 28+ FLQs Total and 28+ FLQA", isTop: true },
  { name: "Beta", value: "", completed: true },
  { name: "Leaders", value: "", completed: true },
  { name: "Builders", value: "", completed: true },
  { name: "Agents", value: "", completed: true },
];

export function ActionCenterCard() {
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
        {/* Influencer Status embedded */}
        <div className="rounded-lg border bg-muted/20 p-4">
          <h3 className="text-base font-semibold mb-4">My Influencer Status</h3>
          
          {/* Congratulations Banner */}
          <div className="rounded-lg bg-exp-green/10 border border-exp-green/20 p-3 mb-4">
            <p className="text-sm font-medium text-exp-green">
              🎉 Congratulations! Your star Legacy! Yeah? Rew Elite is is just getter.
            </p>
          </div>

          {/* Organization Level Row */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background border mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg">⭐</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold">Alpha Legacy</p>
              <p className="text-xs text-muted-foreground">1000+ Total and 28+ FLQs Total and 28+ FLQA</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Organization Levels */}
          <div className="relative pl-6 space-y-1">
            {organizationLevels.slice(1).map((level, index) => (
              <div key={level.name} className="relative flex items-center gap-3 py-2">
                {/* Connector Line */}
                {index < organizationLevels.length - 2 && (
                  <div className="absolute left-0 top-8 h-full w-0.5 bg-primary" />
                )}
                
                {/* Status Indicator */}
                <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-primary border-primary text-white">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Level Name */}
                <span className="ml-4 font-medium text-foreground">
                  {level.name}
                </span>

                {/* Progress Bar */}
                <div className="flex-1 h-2 bg-primary/30 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promo Card */}
        <div className="rounded-lg bg-primary p-4 text-primary-foreground">
          <h3 className="font-bold mb-1">Your Organization & Revenue View just got better!</h3>
          <p className="text-sm text-primary-foreground/80 mb-3">
            Take your DISC Assessment first. Choose to see online.
          </p>
          <Button size="sm" variant="secondary" className="gap-2">
            Learn More
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
