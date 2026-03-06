import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";

export interface AgentTransaction {
  address: string;
  fullAddress: string;
  closedDate: string;
  revShareAmount: number;
  currency: string;
  transactionNumber: string;
  transactionStatus: string;
  paidStatus: string;
  salePrice: number;
  revShareDollar: number;
  expansionShare: string;
  exponentialShare: string;
  revSharePercentage: string;
  finalRevShare: number;
}

export interface AgentDetail {
  agentName: string;
  agentId: string;
  totalRevShare: number;
  currency: string;
  transactions: AgentTransaction[];
}

interface Props {
  agent: AgentDetail;
  onBack: () => void;
  onTransactionClick: (txn: AgentTransaction) => void;
}

export function AgentTransactionsView({ agent, onBack, onTransactionClick }: Props) {
  const { formatCurrency } = useFormatters();
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground hover:text-foreground"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t("fin.back")}
      </Button>

      <div>
        <h2 className="text-lg font-bold text-foreground">{agent.agentName}</h2>
        <p className="text-sm text-muted-foreground">ID :{agent.agentId}</p>
      </div>

      <Separator />

      <div className="flex justify-between items-baseline">
        <span className="text-sm text-muted-foreground">{t("fin.totalRevShare")}</span>
        <span className="text-base font-semibold text-foreground">
          {formatCurrency(agent.totalRevShare)} {agent.currency}
        </span>
      </div>

      <Separator />

      <div className="space-y-1">
        {agent.transactions.map((txn, i) => (
          <button
            key={i}
            type="button"
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors text-left min-h-[56px] focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onTransactionClick(txn)}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{txn.address}</p>
              <p className="text-xs text-muted-foreground">
                {t("fin.closedDate")} {txn.closedDate}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-3 shrink-0">
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(txn.revShareAmount)} {txn.currency}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
