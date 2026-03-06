import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { userProfile } from "@/data/mockData";

export function TeamsTab() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {userProfile.teams.map((team, index) => (
          <div key={index} className="rounded-lg border bg-card p-4 space-y-2">
            <span className="font-medium text-sm text-foreground">{team.team}</span>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground">Type</span>
              <span className="text-foreground">{team.teamType}</span>
              <span className="text-muted-foreground">Pay Plan</span>
              <span className="text-foreground">{team.payplanName}</span>
              <span className="text-muted-foreground">Status</span>
              <span className="text-foreground">{team.teamStatus}</span>
              <span className="text-muted-foreground">Agent Status</span>
              <span className="text-foreground">{team.teamAgentStatus}</span>
              <span className="text-muted-foreground">Role</span>
              <span className="text-foreground">{team.teamAgentRole}</span>
              <span className="text-muted-foreground">TMA Date</span>
              <span className="text-foreground">{team.tmaEffectiveDate}</span>
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
            <TableHead className="text-xs font-medium">Team</TableHead>
            <TableHead className="text-xs font-medium">Team Type</TableHead>
            <TableHead className="text-xs font-medium">Pay Plan Name</TableHead>
            <TableHead className="text-xs font-medium">Team Status</TableHead>
            <TableHead className="text-xs font-medium">Team Agent Status</TableHead>
            <TableHead className="text-xs font-medium">Team Agent Role</TableHead>
            <TableHead className="text-xs font-medium">TMA Effective Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userProfile.teams.map((team, index) => (
            <TableRow key={index}>
              <TableCell className="text-sm">{team.team}</TableCell>
              <TableCell className="text-sm">{team.teamType}</TableCell>
              <TableCell className="text-sm">{team.payplanName}</TableCell>
              <TableCell className="text-sm">{team.teamStatus}</TableCell>
              <TableCell className="text-sm">{team.teamAgentStatus}</TableCell>
              <TableCell className="text-sm">{team.teamAgentRole}</TableCell>
              <TableCell className="text-sm">{team.tmaEffectiveDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
