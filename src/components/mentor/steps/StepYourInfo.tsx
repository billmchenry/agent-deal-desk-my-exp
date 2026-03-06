import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check } from "lucide-react";
import { userProfile } from "@/data/mockData";

export function StepYourInfo() {
  const info = [
    { label: "Full Name", value: "Michael Thompson" },
    { label: "Primary Email", value: "michael.thompson@exprealty.com" },
    { label: "Phone", value: "(916) 555-4827" },
    { label: "eXp Join Date", value: "01/15/2022" },
    { label: "Team", value: "N/A" },
    { label: "MLS Name", value: "ARMLS" },
    { label: "Primary Licensed State", value: "Arizona" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Your Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {info.map((item) => (
              <div key={item.label}>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">All Licenses</h3>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">State</TableHead>
                <TableHead className="text-xs">License #</TableHead>
                <TableHead className="text-xs">Expiration</TableHead>
                <TableHead className="text-xs">Primary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(userProfile.licenses || []).map((lic, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm">{lic.state}</TableCell>
                  <TableCell className="text-sm">{lic.licenseNumber}</TableCell>
                  <TableCell className="text-sm">{lic.expirationDate}</TableCell>
                  <TableCell>{lic.isPrimary && <Check className="h-4 w-4 text-primary" />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Active Markets</h3>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Primary</TableHead>
                <TableHead className="text-xs">City</TableHead>
                <TableHead className="text-xs">Zip</TableHead>
                <TableHead className="text-xs">State</TableHead>
                <TableHead className="text-xs">Country</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(userProfile.activeMarkets || []).map((m, i) => (
                <TableRow key={i}>
                  <TableCell>{m.isPrimary && <Check className="h-4 w-4 text-primary" />}</TableCell>
                  <TableCell className="text-sm">{m.city}</TableCell>
                  <TableCell className="text-sm">{m.zipCode}</TableCell>
                  <TableCell className="text-sm">{m.state}</TableCell>
                  <TableCell className="text-sm">{m.country}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
