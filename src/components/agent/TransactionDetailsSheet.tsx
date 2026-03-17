import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DetailRow, SectionHeader, CollapsibleSection } from "@/components/shared/BreakdownComponents";
import { X } from "lucide-react";

interface TransactionDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: {
    id: string;
    propertyAddress: string;
    transactionId: string;
    scheduledCloseDate: string;
    actualCloseDate: string;
    transactionType: string;
    status: string;
    isBuyerAgent: string;
    salesPrice: number;
    gciSum: number;
    agentNetCommission: number;
  } | null;
}

export function TransactionDetailsSheet({
  open,
  onOpenChange,
  transaction,
}: TransactionDetailsSheetProps) {
  if (!transaction) return null;

  const commissionData = {
    salesPrice: transaction.salesPrice,
    commissionBasePrice: transaction.salesPrice,
    actualCommission: transaction.gciSum,
    agentPercentage: "10%",
    agentCommission: transaction.agentNetCommission,
    bonus: 0,
    concession: 0,
    agentCommissionWithBonuses: transaction.agentNetCommission,
    commissionAdjustmentIncrease: 0,
    commissionAdjustmentDecrease: 0,
    commissionAmountBeforeTaxes: transaction.agentNetCommission,
    tax: 0,
    commissionAfterCoAgents: transaction.agentNetCommission,
    performanceUsed: 394.9,
    cappingTransaction: "Yes",
    agentSplitBeforeExpenses: transaction.agentNetCommission,
    companyCommission: 0,
    riskManagementFee: 0,
    cappedTransactionFee: 7.5,
    transactionReviewFee: 2.5,
  };

  const remainingFees = {
    agentNetCommission: transaction.agentNetCommission,
    stockComp: 12.98,
    commissionAdvanceFee: 0,
    transactionFee: 0,
    garnishment: 0,
    thirdPartyAdvance: 0,
    outstandingReceivables: 0,
    charitableContribution: 0,
    overUnderPaymentAdjustment: 0,
    agentNetPayment: transaction.agentNetCommission - 12.98,
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="sticky top-0 z-20 flex items-center justify-between bg-primary text-primary-foreground px-4 py-3">
            <span className="font-semibold">Transaction Details</span>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-primary-foreground/30 p-1 text-primary-foreground/50 hover:text-primary-foreground hover:border-primary-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:rounded-sm sm:border-0 sm:p-0 sm:text-primary-foreground/70 sm:hover:text-primary-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="p-4 space-y-3 border-b">
            <div>
              <p className="text-xs text-muted-foreground">Property Address</p>
              <p className="font-semibold text-foreground">{transaction.propertyAddress}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Transaction ID</p>
                <p className="font-semibold">{transaction.transactionId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Scheduled Close Date</p>
                <p className="font-semibold">{transaction.scheduledCloseDate}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Type of Sale</p>
                <p className="font-semibold">{transaction.transactionType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Actual Close Date</p>
                <p className="font-semibold">{transaction.actualCloseDate}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-semibold">{transaction.status}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Buyer Agent</p>
                <p className="font-semibold">{transaction.isBuyerAgent}</p>
              </div>
            </div>
          </div>

          <SectionHeader title="Commission Breakdown" />
          <div className="divide-y">
            <DetailRow label="Sales Price" value={commissionData.salesPrice} />
            <DetailRow label="Commission Base Price" value={commissionData.commissionBasePrice} />
            <DetailRow label="Actual commission" value={commissionData.actualCommission} />
            <DetailRow label="Agent Percentage" value={commissionData.agentPercentage} />
            <DetailRow label="Agent Commission" value={commissionData.agentCommission} highlighted />
            <DetailRow label="Bonus" value={commissionData.bonus} />
            <DetailRow label="Concession" value={commissionData.concession} />
            <DetailRow label="Agent Commission with Bonuses & Concessions" value={commissionData.agentCommissionWithBonuses} highlighted />
            <DetailRow label="Commission Adjustment (Increase)" value={commissionData.commissionAdjustmentIncrease} />
            <DetailRow label="Commission Adjustment (Decrease)" value={commissionData.commissionAdjustmentDecrease} />
            <DetailRow label="Commission Amount Before Taxes" value={commissionData.commissionAmountBeforeTaxes} highlighted />
            <DetailRow label="Tax" value={commissionData.tax} />
            <DetailRow label="Commission After eXp Co-agents (and if applicable Taxes)" value={commissionData.commissionAfterCoAgents} highlighted />
            <DetailRow label="Performance Used to Calculate Transaction" value={commissionData.performanceUsed} />
            <DetailRow label="Capping Transaction" value={commissionData.cappingTransaction} />
            <DetailRow label="Agent Split Before Expenses" value={commissionData.agentSplitBeforeExpenses} highlighted />
            <DetailRow label="Company Commission" value={commissionData.companyCommission} />
            <DetailRow label="Risk Management Fee" value={commissionData.riskManagementFee} />
            <DetailRow label="100% Capped Transaction Fee" value={commissionData.cappedTransactionFee} />
            <DetailRow label="Transaction Review Fee" value={commissionData.transactionReviewFee} />
          </div>

          <CollapsibleSection title="Fees Covered By Others">
            <div className="p-4 text-sm text-muted-foreground">No fees covered by others</div>
          </CollapsibleSection>

          <CollapsibleSection title="Fees I Paid for Others">
            <div className="p-4 text-sm text-muted-foreground">No fees paid for others</div>
          </CollapsibleSection>

          <CollapsibleSection title="Remaining Fees" defaultOpen>
            <div className="divide-y">
              <DetailRow label="Agent Net Commission" value={remainingFees.agentNetCommission} />
              <DetailRow label="Stock Comp" value={remainingFees.stockComp} />
              <DetailRow label="Commission Advance Fee" value={remainingFees.commissionAdvanceFee} />
              <DetailRow label="Transaction Fee" value={remainingFees.transactionFee} />
              <DetailRow label="Garnishment" value={remainingFees.garnishment} />
              <DetailRow label="Third Party Advance" value={remainingFees.thirdPartyAdvance} />
              <DetailRow label="Outstanding Receivables" value={remainingFees.outstandingReceivables} />
              <DetailRow label="eXtend a Hand Charitable Contribution" value={remainingFees.charitableContribution} />
              <DetailRow label="Over Under Payment Adjustment" value={remainingFees.overUnderPaymentAdjustment} />
              <DetailRow label="Agent Net Payment" value={remainingFees.agentNetPayment} highlighted />
            </div>
          </CollapsibleSection>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
