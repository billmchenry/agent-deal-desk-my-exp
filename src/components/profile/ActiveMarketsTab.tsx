import { Check } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { userProfile } from "@/data/mockData";

export function ActiveMarketsTab() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {userProfile.activeMarkets.map((market, index) => (
          <div key={index} className="rounded-lg border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-foreground">{market.city}, {market.state}</span>
              {market.isPrimary && (
                <span className="text-xs font-medium text-exp-green flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Primary
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground">Zip Code</span>
              <span className="text-foreground">{market.zipCode}</span>
              <span className="text-muted-foreground">Country</span>
              <span className="text-foreground">{market.country}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs font-medium">Is Primary</TableHead>
            <TableHead className="text-xs font-medium">City</TableHead>
            <TableHead className="text-xs font-medium">Zip Code</TableHead>
            <TableHead className="text-xs font-medium">State</TableHead>
            <TableHead className="text-xs font-medium">Country</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userProfile.activeMarkets.map((market, index) => (
            <TableRow key={index}>
              <TableCell>
                {market.isPrimary && <Check className="h-4 w-4 text-exp-green" />}
              </TableCell>
              <TableCell className="text-sm">{market.city}</TableCell>
              <TableCell className="text-sm">{market.zipCode}</TableCell>
              <TableCell className="text-sm">{market.state}</TableCell>
              <TableCell className="text-sm">{market.country}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
