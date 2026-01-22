import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userProfile } from "@/data/mockData";

export function OrganizationsTab() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs font-medium">OUID</TableHead>
            <TableHead className="text-xs font-medium">Agent MLS ID</TableHead>
            <TableHead className="text-xs font-medium">Global ID</TableHead>
            <TableHead className="text-xs font-medium">Organization</TableHead>
            <TableHead className="text-xs font-medium">Org Type</TableHead>
            <TableHead className="text-xs font-medium">Org Status</TableHead>
            <TableHead className="text-xs font-medium">State/Province</TableHead>
            <TableHead className="text-xs font-medium">MLS Office Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userProfile.organizations.map((org, index) => (
            <TableRow key={index}>
              <TableCell className="text-sm">{org.ouid}</TableCell>
              <TableCell className="text-sm">{org.agentMlsId}</TableCell>
              <TableCell className="text-sm">{org.globalId}</TableCell>
              <TableCell className="text-sm">{org.organization}</TableCell>
              <TableCell className="text-sm">{org.orgType}</TableCell>
              <TableCell className="text-sm">{org.orgStatus}</TableCell>
              <TableCell className="text-sm">{org.stateProvince}</TableCell>
              <TableCell className="text-sm">{org.mlsOfficeCode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
