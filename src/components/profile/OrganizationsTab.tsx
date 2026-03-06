import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { userProfile } from "@/data/mockData";

export function OrganizationsTab() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {userProfile.organizations.map((org, index) => (
          <div key={index} className="rounded-lg border bg-card p-4 space-y-2">
            <span className="font-medium text-sm text-foreground">{org.organization}</span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground">OUID</span>
              <span className="text-foreground">{org.ouid}</span>
              <span className="text-muted-foreground">Agent MLS ID</span>
              <span className="text-foreground">{org.agentMlsId}</span>
              <span className="text-muted-foreground">Global ID</span>
              <span className="text-foreground">{org.globalId}</span>
              <span className="text-muted-foreground">Type</span>
              <span className="text-foreground">{org.orgType}</span>
              <span className="text-muted-foreground">Status</span>
              <span className="text-foreground">{org.orgStatus}</span>
              <span className="text-muted-foreground">State</span>
              <span className="text-foreground">{org.stateProvince}</span>
              <span className="text-muted-foreground">MLS Office</span>
              <span className="text-foreground">{org.mlsOfficeCode}</span>
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
