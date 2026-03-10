import { useState, useEffect } from "react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UniversalFilterBar, DateRange } from "@/components/filters";
import { AgentHeroBanner } from "@/components/agent/AgentHeroBanner";
import { YearOverYearChart } from "@/components/agent/YearOverYearChart";
import { CappingSection } from "@/components/agent/CappingSection";
import { CanadianDisclaimer } from "@/components/shared/CanadianDisclaimer";
import { CappingCelebrationModal } from "@/components/dashboard/CappingCelebrationModal";
import { useTranslation } from "@/hooks/useTranslation";
import { useDemoConfig } from "@/contexts/DemoConfigContext";

const CELEBRATION_KEY = "cappingCelebrationDismissed_2026";

export default function AgentDashboard() {
  const { t } = useTranslation();
  const { config } = useDemoConfig();
  useDocumentTitle(t("nav.agentDashboard"));
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2026, 0, 1),
    to: new Date(2026, 1, 6),
  });
  const [includePipeline, setIncludePipeline] = useState(false);

  const isCanada = config.countryMode === "canada";
  const isGlobal = config.countryMode === "global";
  const isCapped = config.cappingMode === "capped";

  const capCurrent = isCapped ? 16000 : 481.9;
  const capPercentage = isCapped ? 100 : 3;

  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isCapped) {
      localStorage.removeItem(CELEBRATION_KEY);
      setShowCelebration(true);
    } else {
      setShowCelebration(false);
    }
  }, [isCapped]);

  const handleDismiss = () => {
    setShowCelebration(false);
    localStorage.setItem(CELEBRATION_KEY, "true");
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-20">
        <UniversalFilterBar title={t("agent.agentPerformance")}>
          <UniversalFilterBar.DateRange
            value={dateRange}
            onChange={setDateRange}
          />
          {!isGlobal && (
            <UniversalFilterBar.Toggle
              label={t("common.pending")}
              checked={includePipeline}
              onChange={setIncludePipeline}
            />
          )}
        </UniversalFilterBar>
        <CanadianDisclaimer variant="agent" email="canada.support@exprealty.com" />
        <AgentHeroBanner
          units={isCanada ? 5.05 : 5}
          volume={1784000}
          commission={2669}
          transactionsClosed={5}
          transactionsPending={15}
          transactionsWithdrawn={5}
          {...(isCanada ? { transactionsFirm: 3 } : {})}
          hideStatusBreakdown={isGlobal}
        />
        <YearOverYearChart />
        <CappingSection
          capCurrent={capCurrent}
          capTarget={16000}
          capPercentage={capPercentage}
          dateRange={dateRange}
          hideHistory={isGlobal}
        />
      </div>
      <CappingCelebrationModal open={showCelebration} onDismiss={handleDismiss} />
    </DashboardLayout>
  );
}
