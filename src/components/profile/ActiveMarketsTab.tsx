import { Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userProfile } from "@/data/mockData";

export function ActiveMarketsTab() {
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
                {market.isPrimary && (
                  <Check className="h-4 w-4 text-exp-green" />
                )}
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
