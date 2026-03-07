import { useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Calendar, ChevronRight } from "lucide-react";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";
import type { Mentee, MenteeTransaction } from "@/data/mentorMockData";
import { MenteeTransactionSheet } from "./MenteeTransactionSheet";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

interface MenteeContactSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentee: Mentee | null;
}

export function MenteeContactSheet({ open, onOpenChange, mentee }: MenteeContactSheetProps) {
  const { formatCurrency } = useFormatters();
  const { t } = useTranslation();
  const [selectedTx, setSelectedTx] = useState<MenteeTransaction | null>(null);

  if (!mentee) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md p-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <SheetHeader className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-border">
                    <AvatarImage src={mentee.avatarUrl} alt={mentee.agentName} />
                    <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                      {getInitials(mentee.agentName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <SheetTitle className="text-lg font-bold text-foreground">
                      {mentee.agentName}
                    </SheetTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          mentee.status === "Active"
                            ? "bg-exp-green/10 text-exp-green border-exp-green/20 hover:bg-exp-green/10"
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        }
                      >
                        {mentee.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{mentee.agentId}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{t("mentor.joined")} {mentee.joinDate}</span>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-3 h-11" asChild>
                  <a href={`tel:${mentee.phone.replace(/[^\d+]/g, "")}`}>
                    <Phone className="h-4 w-4 text-primary" />
                    <span>{mentee.phone}</span>
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-11" asChild>
                  <a href={`mailto:${mentee.email}`}>
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="truncate">{mentee.email}</span>
                  </a>
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("mentor.about")}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-foreground">{mentee.city}, {mentee.state}</p>
                      <p className="text-xs text-muted-foreground">{t("mentor.cityState")}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{mentee.country}</p>
                    <p className="text-xs text-muted-foreground">{t("mentor.country")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{mentee.postalCode}</p>
                    <p className="text-xs text-muted-foreground">{t("mentor.postalCode")}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("mentor.mentorshipMetrics")}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border bg-card p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">{t("mentor.txnsRemaining")}</p>
                    <p className="text-xl font-bold text-foreground">{mentee.transactionsRemaining}</p>
                  </div>
                  <div className="rounded-lg border bg-card p-3 space-y-1">
                    <p className="text-xs text-muted-foreground">{t("mentor.mentorFeeLabel")}</p>
                    <p className="text-xl font-bold text-foreground">{mentee.mentorFee}%</p>
                  </div>
                  <div className="rounded-lg border bg-card p-3 space-y-1 col-span-2 sm:col-span-1">
                    <p className="text-xs text-muted-foreground">{t("mentor.paidFees")}</p>
                    <p className="text-xl font-bold text-foreground">{formatCurrency(mentee.paidMentorFees)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("mentor.sponsor")}</h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      {getInitials(mentee.sponsor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{mentee.sponsor.name}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <a href={`tel:${mentee.sponsor.phone.replace(/[^\d+]/g, "")}`} aria-label={t("mentor.callSponsor")}>
                        <Phone className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <a href={`mailto:${mentee.sponsor.email}`} aria-label={t("mentor.emailSponsor")}>
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  {t("mentor.transactionInformation")} ({mentee.transactions.length})
                </h3>
                {mentee.transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("mentor.noTransactions")}</p>
                ) : (
                  <div className="space-y-2">
                    {mentee.transactions.map((tx) => (
                      <button
                        key={tx.id}
                        type="button"
                        className="w-full flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors text-left cursor-pointer"
                        onClick={() => setSelectedTx(tx)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{tx.address}</p>
                          <p className="text-xs text-muted-foreground">{tx.dateEntered} · {tx.source}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <MenteeTransactionSheet
        open={!!selectedTx}
        onOpenChange={(o) => { if (!o) setSelectedTx(null); }}
        transaction={selectedTx}
      />
    </>
  );
}