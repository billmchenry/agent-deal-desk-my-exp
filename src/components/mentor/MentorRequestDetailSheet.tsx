import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  if (!request) return null;

  const fullName = `${request.firstName} ${request.lastName}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Header */}
            <SheetHeader className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-border">
                  <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                    {getInitials(request.firstName, request.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <SheetTitle className="text-lg font-bold text-foreground">{fullName}</SheetTitle>
                  <Badge className="bg-exp-green/10 text-exp-green border-exp-green/20 hover:bg-exp-green/10">
                    {request.status}
                  </Badge>
                </div>
              </div>
            </SheetHeader>

            <Separator />

            {/* Details grid */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Contact Information</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">First Name</p>
                  <p className="text-foreground">{request.firstName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Name</p>
                  <p className="text-foreground">{request.lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Primary Email</p>
                  <p className="text-primary truncate">{request.primaryEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Secondary Email</p>
                  <p className="text-foreground truncate">{request.secondaryEmail || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-foreground">{request.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">City / State</p>
                  <p className="text-foreground">{request.city}, {request.state}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sponsor</p>
                  <p className="text-foreground">{request.sponsorName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Region</p>
                  <p className="text-foreground">{request.region}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Team</p>
                  <p className="text-foreground">{request.team}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* MLS */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">MLS Memberships</h3>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">MLS Name</TableHead>
                      <TableHead className="text-xs">MLS ID</TableHead>
                      <TableHead className="text-xs">State</TableHead>
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

            {/* Active Markets */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Active Markets</h3>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Market</TableHead>
                      <TableHead className="text-xs">State</TableHead>
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
