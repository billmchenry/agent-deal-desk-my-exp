import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CappingHistorySection } from "@/components/agent/CappingHistorySection";

export default function CappingHistory() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <CappingHistorySection />
      </div>
    </DashboardLayout>
  );
}
