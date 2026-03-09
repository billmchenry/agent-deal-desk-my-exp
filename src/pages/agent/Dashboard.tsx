import { useState } from "react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UniversalFilterBar, DateRange } from "@/components/filters";
import { AgentHeroBanner } from "@/components/agent/AgentHeroBanner";
import { YearOverYearChart } from "@/components/agent/YearOverYearChart";
import { CappingSection } from "@/components/agent/CappingSection";
import { CanadianDisclaimer } from "@/components/shared/CanadianDisclaimer";
import { useTranslation } from "@/hooks/useTranslation";
import { useDemoConfig } from "@/contexts/DemoConfigContext";

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
          capCurrent={481.9}
          capTarget={16000}
          capPercentage={3}
          dateRange={dateRange}
          hideHistory={isGlobal}
        />
      </div>
    </DashboardLayout>
  );
}
