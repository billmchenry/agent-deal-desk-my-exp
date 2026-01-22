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

export function OfficeLocationsTab() {
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
                {office.isPrimary && (
                  <Check className="h-4 w-4 text-exp-green" />
                )}
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
