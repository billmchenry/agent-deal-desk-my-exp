import { Check } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { userProfile } from "@/data/mockData";

export function OfficeLocationsTab() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {userProfile.officeLocations.map((office, index) => (
          <div key={index} className="rounded-lg border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-foreground">{office.officeName}</span>
              {office.isPrimary && (
                <span className="text-xs font-medium text-exp-green flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Primary
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground">Office ID</span>
              <span className="text-foreground">{office.officeId}</span>
              <span className="text-muted-foreground">State</span>
              <span className="text-foreground">{office.state}</span>
              <span className="text-muted-foreground">Status</span>
              <span className="text-foreground">{office.status}</span>
              <span className="text-muted-foreground">Docker ID</span>
              <span className="text-foreground">{office.spaceDockerOfficeId}</span>
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
            <TableHead className="text-xs font-medium">Office ID</TableHead>
            <TableHead className="text-xs font-medium">Office Name</TableHead>
            <TableHead className="text-xs font-medium">State</TableHead>
            <TableHead className="text-xs font-medium">Status</TableHead>
            <TableHead className="text-xs font-medium">Space Docker Office ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userProfile.officeLocations.map((office, index) => (
            <TableRow key={index}>
              <TableCell>
                {office.isPrimary && <Check className="h-4 w-4 text-exp-green" />}
              </TableCell>
              <TableCell className="text-sm">{office.officeId}</TableCell>
              <TableCell className="text-sm">{office.officeName}</TableCell>
              <TableCell className="text-sm">{office.state}</TableCell>
              <TableCell className="text-sm">{office.status}</TableCell>
              <TableCell className="text-sm">{office.spaceDockerOfficeId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
