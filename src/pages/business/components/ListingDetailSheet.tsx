import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";

interface ListingLike {
  id: string;
  mlsNumber: string;
  propertyAddress: string;
  propertyCity: string;
  status: "Active" | "Expired" | "Incomplete" | "Canceled/Pend";
  listingAgent: string;
  office: string;
  expirationDate: string;
  listingPrice: number;
  stage: string;
}

interface Props {
  listing: ListingLike | null;
  onClose: () => void;
}

export function ListingDetailSheet({ listing, onClose }: Props) {
  const { t } = useTranslation();
  const { formatNumber } = useFormatters();

  const open = !!listing;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] p-0 flex flex-col"
      >
        {listing && (
          <>
            <SheetHeader className="p-6 pb-4 border-b border-border">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <SheetTitle className="text-xl font-semibold truncate">
                    {listing.propertyAddress}
                  </SheetTitle>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {listing.propertyCity}
                  </p>
                  <div className="mt-3">
                    <Badge variant="outline">{listing.status}</Badge>
                  </div>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("transactions.detailsProperty") || "Property"}
                </h3>
                <DetailRow label={t("transactions.mlsNumber")} value={listing.mlsNumber} />
                <DetailRow
                  label={t("transactions.listingPrice")}
                  value={`${formatNumber(listing.listingPrice)} USD`}
                  numeric
                />
                <DetailRow label={t("transactions.expirationDate")} value={listing.expirationDate} />
                <DetailRow label={t("transactions.stage")} value={listing.stage} />
              </section>

              <section className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("transactions.detailsPeople") || "People"}
                </h3>
                <DetailRow label={t("transactions.listingAgent")} value={listing.listingAgent} />
                <DetailRow label={t("transactions.office")} value={listing.office} />
              </section>
            </div>

            <div className="border-t border-border p-4 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
              <Button
                variant="outline"
                className="rounded-[51px] min-h-[44px] gap-2"
                onClick={() =>
                  window.open("https://exp.skyslope.com", "_blank", "noopener,noreferrer")
                }
              >
                <ExternalLink className="h-4 w-4" />
                {t("transactions.openInSkySlope")}
              </Button>
              <Button className="rounded-[51px] min-h-[44px] gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Pencil className="h-4 w-4" />
                {t("transactions.editListing")}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({
  label,
  value,
  numeric,
}: {
  label: string;
  value: string;
  numeric?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`text-sm text-foreground text-end ${numeric ? "font-secondary tabular-nums" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
