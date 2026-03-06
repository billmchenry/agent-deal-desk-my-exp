import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { achievements } from "@/data/mockData";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";

export function AchievementsCard() {
  const { formatCurrency } = useFormatters();
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-section-title font-semibold">{t("dashboard.myAchievements")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">{t("dashboard.flqaStatus")}</span>
            <Badge className="bg-exp-green text-white hover:bg-exp-green/90">
              {achievements.flqa.status}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-exp-blue">
              {formatCurrency(achievements.flqa.amount)}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("dashboard.asOf")} {achievements.flqa.date}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
