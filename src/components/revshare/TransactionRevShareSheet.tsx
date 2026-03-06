import { ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";
import type { AgentTransaction } from "./AgentTransactionsView";

interface Props {
  txn: AgentTransaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionRevShareSheet({ txn, open, onOpenChange }: Props) {
  const { formatCurrency } = useFormatters();
  const { t } = useTranslation();

  if (!txn) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-base sr-only">{t("fin.revShareDetails")}</SheetTitle>
        </SheetHeader>

        {/* Agent name header */}
        <div className="flex items-center justify-between py-3 border-b border-border mb-4">
          <p className="text-sm font-medium text-foreground text-center flex-1">
            {txn.paidStatus}
          </p>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>

        {/* Transaction details */}
        <div className="space-y-4">
          <DetailRow label={t("fin.level")} value={txn.expansionShare === "0%" ? "2" : "1"} />
          <DetailRow label={t("fin.transactionId")} value={txn.transactionNumber} />
          <DetailRow label={t("fin.address")} value={txn.fullAddress} />
          <DetailRow label={t("fin.generatedDate")} value={txn.closedDate} />
          <DetailRow label={t("fin.closedDate")} value={txn.closedDate} />
          <DetailRow
            label={t("fin.salePrice")}
            value={`${formatCurrency(txn.salePrice)} ${txn.currency}`}
          />

          <Separator />

          <DetailRow
            label={t("fin.revShareLabel")}
            value={`${formatCurrency(txn.finalRevShare)} ${txn.currency}`}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}
