import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cappingData } from "@/data/mockData";

export function CappingYearCard() {
  const progressPercentage = (cappingData.current / cappingData.target) * 100;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    }
    return `$${value}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Capping Year</CardTitle>
          <Badge 
            variant="secondary" 
            className="bg-exp-green/10 text-exp-green border-exp-green/20 font-medium"
          >
            {cappingData.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              ${cappingData.current.toLocaleString()} of ${(cappingData.target / 1000).toFixed(0)}K
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <p className="text-2xl font-bold text-exp-blue">{cappingData.units}</p>
            <p className="text-xs text-muted-foreground">Units</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-exp-blue">{formatCurrency(cappingData.gci)}</p>
            <p className="text-xs text-muted-foreground">GCI</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-exp-blue">{formatCurrency(cappingData.volume)}</p>
            <p className="text-xs text-muted-foreground">Volume</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
