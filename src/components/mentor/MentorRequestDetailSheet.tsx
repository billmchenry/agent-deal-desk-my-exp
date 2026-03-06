import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/useTranslation";
import type { MentorRequestDetail } from "@/data/mentorMockData";

function getInitials(first: string, last: string) {
  return `${first[0] || ""}${last[0] || ""}`.toUpperCase();
}

interface MentorRequestDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: MentorRequestDetail | null;
}

export function MentorRequestDetailSheet({ open, onOpenChange, request }: MentorRequestDetailSheetProps) {
  const { t } = useTranslation();

  if (!request) return null;

  const fullName = `${request.firstName} ${request.lastName}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            <SheetHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-border">
                  <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                    {getInitials(request.firstName, request.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <SheetTitle className="text-section-title font-bold text-foreground">{fullName}</SheetTitle>
                  <Badge className="bg-exp-green/10 text-exp-green border-exp-green/20 hover:bg-exp-green/10">
                    {request.status}
                  </Badge>
                </div>
              </div>
            </SheetHeader>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("mentor.contactInformation")}</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">{t("mentor.firstName")}</p>
                  <p className="text-foreground">{request.firstName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("mentor.lastName")}</p>
                  <p className="text-foreground">{request.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("mentor.primaryEmail")}</p>
                  <p className="text-primary truncate">{request.primaryEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("mentor.secondaryEmail")}</p>
                  <p className="text-foreground truncate">{request.secondaryEmail || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("mentor.phone")}</p>
                  <p className="text-foreground">{request.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("mentor.cityState")}</p>
                  <p className="text-foreground">{request.city}, {request.state}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("mentor.sponsor")}</p>
                  <p className="text-foreground">{request.sponsorName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t("mentor.region")}</p>
                  <p className="text-foreground">{request.region}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">{t("mentor.team")}</p>
                  <p className="text-foreground">{request.team}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("mentor.mlsMemberships")}</h3>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">{t("mentor.mlsName")}</TableHead>
                      <TableHead className="text-xs">{t("mentor.mlsId")}</TableHead>
                      <TableHead className="text-xs">{t("mentor.state")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {request.mlsList.map((mls) => (
                      <TableRow key={mls.id}>
                        <TableCell className="text-sm">{mls.name}</TableCell>
                        <TableCell className="text-sm">{mls.id}</TableCell>
                        <TableCell className="text-sm">{mls.state}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t("mentor.activeMarkets")}</h3>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">{t("mentor.market")}</TableHead>
                      <TableHead className="text-xs">{t("mentor.state")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {request.activeMarkets.map((m) => (
                      <TableRow key={m.market}>
                        <TableCell className="text-sm">{m.market}</TableCell>
                        <TableCell className="text-sm">{m.state}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}