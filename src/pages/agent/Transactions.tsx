import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MasterTransactionTable } from "@/components/agent/MasterTransactionTable";

export default function Transactions() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <MasterTransactionTable />
      </div>
    </DashboardLayout>
  );
}
