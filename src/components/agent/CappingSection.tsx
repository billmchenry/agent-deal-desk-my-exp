import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CappingHistoryTable } from "./CappingHistorySection";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";

interface CappingSectionProps {
  capCurrent: number;
  capTarget: number;
  capPercentage: number;
  dateRange?: { from: Date | undefined; to: Date | undefined };
}

export function CappingSection({ capCurrent, capTarget, capPercentage, dateRange }: CappingSectionProps) {
  const remaining = capTarget - capCurrent;
  const { formatCurrency } = useFormatters();
  const { t } = useTranslation();

  return (
    <section className="space-y-3">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">{t("agent.cappingStatus")}</h2>
            <Button variant="outline" size="sm" className="gap-2 text-xs h-7">
              <Download className="h-3 w-3" />
              {t("agent.download")}
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex flex-col items-center justify-center shrink-0 sm:w-[180px] sm:border-r sm:pr-6 border-border">
              <div className="relative h-28 w-28 shrink-0">
                <svg className="h-28 w-28 -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--exp-green))" strokeWidth="7" strokeDasharray={`${capPercentage * 2.51} 251`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-foreground">{capPercentage}%</span>
                  <span className="text-xs text-muted-foreground">{t("agent.complete")}</span>
                </div>
              </div>
              <div className="mt-2 text-center space-y-0.5">
                <p className="text-xs font-semibold text-foreground">
                  {formatCurrency(capCurrent, { compact: true })} <span className="text-muted-foreground font-normal">/ {formatCurrency(capTarget, { compact: true })}</span>
                </p>
                <p className="text-xs sm:text-[10px] text-muted-foreground">
                  {formatCurrency(remaining, { compact: true })} {t("agent.remaining")}
                </p>
              </div>
            </div>
            <CappingHistoryTable />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
