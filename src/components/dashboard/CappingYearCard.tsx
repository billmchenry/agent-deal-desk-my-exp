import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cappingData } from "@/data/mockData";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";

export function CappingYearCard() {
  const progressPercentage = (cappingData.current / cappingData.target) * 100;
  const { formatCurrency } = useFormatters();
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-section-title font-semibold">{t("dashboard.cappingYear")}</CardTitle>
          <Badge 
            variant="secondary" 
            className="bg-exp-green/10 text-exp-green border-exp-green/20 font-medium"
          >
            {cappingData.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("team.progress")}</span>
            <span className="font-medium">
              {formatCurrency(cappingData.current)} of {formatCurrency(cappingData.target, { compact: true })}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <p className="text-stat-value font-bold text-exp-blue">{cappingData.units}</p>
            <p className="text-xs text-muted-foreground">{t("agent.units")}</p>
          </div>
          <div className="text-center">
            <p className="text-stat-value font-bold text-exp-blue">{formatCurrency(cappingData.gci, { compact: true })}</p>
            <p className="text-xs text-muted-foreground">{t("txn.gci")}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-exp-blue">{formatCurrency(cappingData.volume, { compact: true })}</p>
            <p className="text-xs text-muted-foreground">{t("agent.volume")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
