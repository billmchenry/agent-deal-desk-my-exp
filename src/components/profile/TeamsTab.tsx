import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userProfile } from "@/data/mockData";

export function TeamsTab() {
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
