import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AgentFilterBar } from "@/components/agent/AgentFilterBar";
import { VitalSignsRow } from "@/components/agent/VitalSignsRow";
import { YearOverYearChart } from "@/components/agent/YearOverYearChart";
import { CappingHistorySection } from "@/components/agent/CappingHistorySection";
import { IconStatusSummary } from "@/components/agent/IconStatusSummary";
import { MasterTransactionTable } from "@/components/agent/MasterTransactionTable";

export default function AgentDashboard() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(2026, 0, 1),
    to: new Date(2026, 1, 6),
  });
  const [includePipeline, setIncludePipeline] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-2">
        {/* Global filter bar */}
        <AgentFilterBar
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          includePipeline={includePipeline}
          onIncludePipelineChange={setIncludePipeline}
        />

        {/* Vital Signs */}
        <VitalSignsRow
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

        {/* Year-over-Year Chart */}
        <YearOverYearChart />

        {/* Capping History */}
        <CappingHistorySection />

        {/* ICON Status Summary */}
        <IconStatusSummary />

        {/* Master Transaction Table */}
        <MasterTransactionTable />
      </div>
    </DashboardLayout>
  );
}
