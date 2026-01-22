import { ArrowRight, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PromoBanners() {
  return (
    <div className="space-y-3">
      {/* Stock Program Banner */}
      <Card className="border-exp-gold/30 bg-gradient-to-r from-exp-gold/10 to-exp-gold/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-exp-gold/20">
              <TrendingUp className="h-5 w-5 text-exp-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-exp-navy mb-1">
                Stock Purchase Program
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Invest in your future with eXp stock options. Learn how to maximize your earnings.
              </p>
              <Button size="sm" variant="outline" className="gap-2 border-exp-gold/50 hover:bg-exp-gold/10">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RevShare Banner */}
      <Card className="border-exp-gold/30 bg-gradient-to-r from-exp-gold/10 to-exp-gold/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-exp-gold/20">
              <DollarSign className="h-5 w-5 text-exp-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-exp-navy mb-1">
                Revenue Share Explained
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Discover how the eXp revenue share model can create passive income streams.
              </p>
              <Button size="sm" variant="outline" className="gap-2 border-exp-gold/50 hover:bg-exp-gold/10">
                Watch Video
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
