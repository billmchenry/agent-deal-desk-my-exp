import { Check } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { userProfile } from "@/data/mockData";

export function LicensesTab() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {userProfile.licenses.map((license, index) => (
          <div key={index} className="rounded-lg border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-foreground">
                {license.licenseFirstName} {license.licenseLastName}
              </span>
              {license.isPrimary && (
                <span className="text-xs font-medium text-exp-green flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Primary
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground">License #</span>
              <span className="text-foreground">{license.licenseNumber}</span>
              <span className="text-muted-foreground">Division</span>
              <span className="text-foreground">{license.division}</span>
              <span className="text-muted-foreground">State</span>
              <span className="text-foreground">{license.state}</span>
              <span className="text-muted-foreground">Expires</span>
              <span className="text-foreground">{license.expirationDate}</span>
              <span className="text-muted-foreground">Approval</span>
              <span className="text-foreground">{license.brokerApprovalStatus}</span>
              <span className="text-muted-foreground">Transfer</span>
              <span className="text-foreground">{license.transferStatus}</span>
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
            <TableHead className="text-xs font-medium whitespace-nowrap">Division</TableHead>
            <TableHead className="text-xs font-medium whitespace-nowrap">License Number</TableHead>
            <TableHead className="text-xs font-medium whitespace-nowrap">License First Name</TableHead>
            <TableHead className="text-xs font-medium whitespace-nowrap">License Last Name</TableHead>
            <TableHead className="text-xs font-medium whitespace-nowrap">Is Primary</TableHead>
            <TableHead className="text-xs font-medium whitespace-nowrap">Expiration Date</TableHead>
            <TableHead className="text-xs font-medium whitespace-nowrap">State</TableHead>
            <TableHead className="text-xs font-medium whitespace-nowrap">Broker Approval Status</TableHead>
            <TableHead className="text-xs font-medium whitespace-nowrap">Broker Approval Submitted Date</TableHead>
            <TableHead className="text-xs font-medium whitespace-nowrap">Broker Approval Submitted By</TableHead>
            <TableHead className="text-xs font-medium whitespace-nowrap">Transfer Status</TableHead>
            <TableHead className="text-xs font-medium whitespace-nowrap">Transfer Date</TableHead>
            <TableHead className="text-xs font-medium whitespace-nowrap">Transfer By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userProfile.licenses.map((license, index) => (
            <TableRow key={index}>
              <TableCell className="text-sm whitespace-nowrap">{license.division}</TableCell>
              <TableCell className="text-sm whitespace-nowrap">{license.licenseNumber}</TableCell>
              <TableCell className="text-sm whitespace-nowrap">{license.licenseFirstName}</TableCell>
              <TableCell className="text-sm whitespace-nowrap">{license.licenseLastName}</TableCell>
              <TableCell className="whitespace-nowrap">
                {license.isPrimary && <Check className="h-4 w-4 text-exp-green" />}
              </TableCell>
              <TableCell className="text-sm whitespace-nowrap">{license.expirationDate}</TableCell>
              <TableCell className="text-sm whitespace-nowrap">{license.state}</TableCell>
              <TableCell className="text-sm whitespace-nowrap">{license.brokerApprovalStatus}</TableCell>
              <TableCell className="text-sm whitespace-nowrap">{license.brokerApprovalSubmittedDate}</TableCell>
              <TableCell className="text-sm whitespace-nowrap">{license.brokerApprovalSubmittedBy}</TableCell>
              <TableCell className="text-sm whitespace-nowrap">{license.transferStatus}</TableCell>
              <TableCell className="text-sm whitespace-nowrap">{license.transferDate}</TableCell>
              <TableCell className="text-sm whitespace-nowrap">{license.transferBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
