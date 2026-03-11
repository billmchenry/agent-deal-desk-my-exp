import { ArrowRight, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DiscAssessmentCard() {
  return (
    <Card className="bg-gradient-to-r from-exp-green/10 to-exp-green/5 border-exp-green/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-exp-green/20 text-exp-green">
            <Target className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold mb-1 text-section-title">DISC Assessment</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Understand your communication style and improve client relationships.
            </p>
            <Button size="sm" className="gap-2 bg-exp-green hover:bg-exp-green/90">
              Take Assessment
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
