import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DetailRow, SectionHeader, CollapsibleSection } from "@/components/shared/BreakdownComponents";
import type { TeamTransaction } from "@/pages/team/Reconciliation";

interface TeamBreakdownSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TeamTransaction | null;
}

// Mock multi-agent breakdown data for the TeamView
function getTeamViewAgents(txn: TeamTransaction) {
  return [
    {
      id: "AGT-284756",
      name: "Michael Thompson",
      splitPct: 60,
      agentCommission: txn.netCommission * 0.6,
      bonus: 0,
      concession: 0,
      agentCommissionWithBonuses: txn.netCommission * 0.6,
      commissionAmount: txn.netCommission * 0.6,
      tax: 0,
      commissionAfterCoAgents: txn.netCommission * 0.6,
      agentSplitBeforeExpenses: txn.netCommission * 0.6,
      companyCommission: 0,
      riskManagementFee: 0,
      cappedTransactionFee: 7.5,
      transactionReviewFee: 2.5,
    },
    {
      id: "AGT-394821",
      name: "Rachel Morrison",
      splitPct: 40,
      agentCommission: txn.netCommission * 0.4,
      bonus: 0,
      concession: 0,
      agentCommissionWithBonuses: txn.netCommission * 0.4,
      commissionAmount: txn.netCommission * 0.4,
      tax: 0,
      commissionAfterCoAgents: txn.netCommission * 0.4,
      agentSplitBeforeExpenses: txn.netCommission * 0.4,
      companyCommission: 0,
      riskManagementFee: 0,
      cappedTransactionFee: 7.5,
      transactionReviewFee: 2.5,
    },
  ];
}

export function TeamBreakdownSheet({
  open,
  onOpenChange,
  transaction,
}: TeamBreakdownSheetProps) {
  if (!transaction) return null;

  const agents = getTeamViewAgents(transaction);

  const remainingFees = {
    remainingCommission: transaction.netCommission * 0.85,
    remainingRisk: 0,
    cappedTransactionFee: 7.5,
    transactionReviewFee: 2.5,
    stockComp: 12.98,
    totalDeductions: 22.98,
    agentNet: transaction.netCommission * 0.85 - 22.98,
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <ScrollArea className="flex-1">
          {/* Transaction Details */}
          <SectionHeader title="Transaction Details" />
          <div className="p-4 space-y-3 border-b">
            <div>
              <p className="text-xs text-muted-foreground">Property Address</p>
              <p className="font-semibold text-foreground">{transaction.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Transaction ID</p>
                <p className="font-semibold">{transaction.uuid}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Actual Close Date</p>
                <p className="font-semibold">{transaction.actualCloseDate}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Buyer Agent</p>
                <p className="font-semibold">{transaction.agentName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-semibold">{transaction.status}</p>
              </div>
            </div>
          </div>

          {/* Buyer Commission Base */}
          <SectionHeader title="Buyer Commission Base" />
          <div className="divide-y">
            <DetailRow label="Sales Price" value={transaction.netCommission * 33.33} />
            <DetailRow label="Commission Sale" value={`${3}%`} />
            <DetailRow label="Actual Commission" value={transaction.netCommission} highlighted />
          </div>

          {/* TeamView */}
          <SectionHeader title="TeamView" />
          {agents.map((agent) => (
            <div key={agent.id}>
              <div className="flex items-center justify-between bg-muted px-4 py-2">
                <span className="text-sm font-semibold">
                  {agent.id} – {agent.name}
                </span>
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded">
                  {agent.splitPct}%
                </span>
              </div>
              <div className="divide-y">
                <DetailRow label="Agent Commission" value={agent.agentCommission} highlighted />
                <DetailRow label="Agent Commission with Bonuses & Concessions" value={agent.agentCommissionWithBonuses} highlighted />
                <DetailRow label="Commission Amount" value={agent.commissionAmount} highlighted />
                <DetailRow label="Tax" value={agent.tax} />
                <DetailRow label="Commission After Co-agents" value={agent.commissionAfterCoAgents} highlighted />
                <DetailRow label="Agent Split Before Expenses" value={agent.agentSplitBeforeExpenses} />
                <DetailRow label="Company Commission" value={agent.companyCommission} />
                <DetailRow label="Risk Management Fee" value={agent.riskManagementFee} />
                <DetailRow label="100% Capped Transaction Fee" value={agent.cappedTransactionFee} />
                <DetailRow label="Transaction Review Fee" value={agent.transactionReviewFee} />
              </div>
            </div>
          ))}

          {/* Fees Covered By Others */}
          <CollapsibleSection title="Fees Covered By Others">
            <div className="divide-y">
              <DetailRow label="Commission Covered By" value="N/A" />
              <DetailRow label="Currency" value="USD" />
              <DetailRow label="Commission Amount" value={0} />
              <DetailRow label="Risk Management Amount" value={0} />
            </div>
          </CollapsibleSection>

          {/* Fees I Paid for Others */}
          <CollapsibleSection title="Fees I Paid for Others">
            <div className="p-4 text-sm text-muted-foreground">No fees paid for others</div>
          </CollapsibleSection>

          {/* Remaining Fees */}
          <CollapsibleSection title="Remaining Fees" defaultOpen>
            <div className="divide-y">
              <DetailRow label="Remaining Commission" value={remainingFees.remainingCommission} />
              <DetailRow label="Remaining Risk" value={remainingFees.remainingRisk} />
              <DetailRow label="Capped Transaction Fee" value={remainingFees.cappedTransactionFee} />
              <DetailRow label="Transaction Review Fee" value={remainingFees.transactionReviewFee} />
              <DetailRow label="Stock Comp" value={remainingFees.stockComp} />
              <DetailRow label="Total Deductions" value={remainingFees.totalDeductions} />
              <DetailRow label="Agent Net" value={remainingFees.agentNet} highlighted />
            </div>
          </CollapsibleSection>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
