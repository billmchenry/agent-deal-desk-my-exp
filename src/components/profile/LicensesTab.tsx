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

export function LicensesTab() {
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
                {license.isPrimary && (
                  <Check className="h-4 w-4 text-exp-green" />
                )}
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
