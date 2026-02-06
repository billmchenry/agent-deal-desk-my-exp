import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AgentHeroBanner } from "@/components/agent/AgentHeroBanner";
import { YearOverYearChart } from "@/components/agent/YearOverYearChart";
import { CappingHistorySection } from "@/components/agent/CappingHistorySection";

export default function AgentDashboard() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(2026, 0, 1),
    to: new Date(2026, 1, 6),
  });

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <AgentHeroBanner
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          units={5}
          volume={1784000}
          commission={2669}
          transactionsClosed={5}
          transactionsPending={15}
          transactionsWithdrawn={5}
          capCurrent={481.9}
          capTarget={16000}
          capPercentage={3}
        />
        <YearOverYearChart />
        <CappingHistorySection />
      </div>
    </DashboardLayout>
  );
}
