import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { MenteeTransaction } from "@/data/mentorMockData";
import { useFormatters } from "@/hooks/useFormatters";

interface MenteeTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: MenteeTransaction | null;
}

export function MenteeTransactionSheet({ open, onOpenChange, transaction }: MenteeTransactionSheetProps) {
  const { formatCurrency } = useFormatters();

  if (!transaction) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            <SheetHeader>
              <SheetTitle className="text-lg font-bold text-foreground">
                {transaction.address}
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction Number</span>
                <span className="text-foreground font-medium">{transaction.transactionNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  className={
                    transaction.status === "Closed"
                      ? "bg-exp-green/10 text-exp-green border-exp-green/20"
                      : "bg-exp-gold/10 text-exp-gold border-exp-gold/20"
                  }
                >
                  {transaction.status}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type of Property</span>
                <span className="text-foreground">{transaction.propertyType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type of Sale</span>
                <span className="text-foreground">{transaction.saleType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Actual Close Date</span>
                <span className="text-foreground">{transaction.actualCloseDate}</span>
              </div>
            </div>

            <Separator />

            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Financial Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Mentor Fee</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(transaction.mentorFee)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Sale Price</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(transaction.salePrice)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">GCI</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(transaction.gci)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Company Commission</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(transaction.companyCommission)}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
