import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MasterTransactionTable } from "@/components/agent/MasterTransactionTable";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function Transactions() {
  useDocumentTitle("Transactions");
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <MasterTransactionTable />
      </div>
    </DashboardLayout>
  );
}
