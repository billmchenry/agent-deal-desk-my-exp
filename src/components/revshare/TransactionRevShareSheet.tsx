import { ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
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

        {/* Address header */}
        <div className="flex items-center justify-between py-3 border-b border-border mb-4">
          <p className="text-sm font-medium text-foreground text-center flex-1">
            {txn.fullAddress}
          </p>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>

        {/* Transaction details */}
        <div className="space-y-4">
          <DetailRow label={t("fin.transactionNumber")} value={txn.transactionNumber} />
          <DetailRow label={t("fin.transactionStatus")} value={txn.transactionStatus} />
          <DetailRow label={t("fin.paidStatus")} value={txn.paidStatus} />
          <DetailRow label={t("fin.closedDate")} value={txn.closedDate} />
          <DetailRow
            label={t("fin.salePrice")}
            value={`${formatCurrency(txn.salePrice)} ${txn.currency}`}
          />
        </div>

        <Separator className="my-5" />

        {/* Revenue Share section */}
        <h3 className="text-sm font-semibold text-foreground mb-3">{t("fin.revShareSection")}</h3>
        <Card className="bg-muted/40 p-4 space-y-3">
          <DetailRow
            label={t("fin.revShareDollar")}
            value={`${formatCurrency(txn.revShareDollar)} ${txn.currency}`}
          />
          <DetailRow
            label={t("fin.expansionShare")}
            value={txn.expansionShare}
          />
          <DetailRow
            label={t("fin.exponentialShare")}
            value={txn.exponentialShare}
          />
          <DetailRow
            label={t("fin.revSharePercentage")}
            value={txn.revSharePercentage}
          />
          <Separator />
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-semibold text-foreground">{t("fin.finalRevShare")}</span>
            <span className="text-sm font-semibold text-foreground">
              {formatCurrency(txn.finalRevShare)} {txn.currency}
            </span>
          </div>
        </Card>
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}
