import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnDef } from "@/components/shared/DataTable";
import { MenteeContactSheet } from "@/components/mentor/MenteeContactSheet";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { mockMentees, type Mentee } from "@/data/mentorMockData";
import { useFormatters } from "@/hooks/useFormatters";

const columns: ColumnDef<Mentee>[] = [
  { key: "agentName", header: "Agent", type: "string", sortable: true, filterable: true, defaultVisible: true },
  { key: "status", header: "Status", type: "badge", sortable: true, filterable: true, defaultVisible: true },
  { key: "agentId", header: "ID", type: "string", sortable: true, defaultVisible: false },
  { key: "joinDate", header: "Join Date", type: "date", sortable: true, defaultVisible: true },
  { key: "transactionsRemaining", header: "Transactions Remaining", type: "number", sortable: true, defaultVisible: true },
  { key: "paidMentorFees", header: "Paid Mentor Fees", type: "currency", sortable: true, defaultVisible: true },
  { key: "mentorFee", header: "Mentor Fee", type: "number", sortable: true, defaultVisible: true, render: (v) => <span>{String(v)}%</span> },
  { key: "email", header: "Email", type: "string", defaultVisible: false },
  { key: "phone", header: "Phone", type: "string", defaultVisible: false },
  { key: "city", header: "City", type: "string", defaultVisible: false },
  { key: "state", header: "State", type: "string", filterable: true, defaultVisible: false },
  { key: "postalCode", header: "Postal", type: "string", defaultVisible: false },
  { key: "country", header: "Country", type: "string", defaultVisible: false },
  { key: "secondaryEmail", header: "Secondary Email", type: "string", defaultVisible: false },
];

export default function MyMentees() {
  useDocumentTitle("My Mentees");
  const navigate = useNavigate();
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);
  const { formatCurrency } = useFormatters();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-4 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground -ml-2"
          onClick={() => navigate("/mentor")}
        >
          <ChevronLeft className="h-4 w-4" />
          My Mentees
        </Button>

        <DataTable
          data={mockMentees}
          columns={columns}
          searchableKeys={["agentName", "email", "city"]}
          onRowClick={(row) => setSelectedMentee(row)}
          csvFilename="my-mentees"
          defaultSort={{ key: "agentName", direction: "asc" }}
          mobileCardRender={(row) => (
            <div className="space-y-1">
              <p className="font-semibold text-foreground">{row.agentName}</p>
              <p className="text-xs text-muted-foreground">{row.status} · Joined {row.joinDate}</p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>Remaining: {row.transactionsRemaining}</span>
                <span>Fee: {row.mentorFee}%</span>
                <span>Paid: {formatCurrency(row.paidMentorFees)}</span>
              </div>
            </div>
          )}
        />

        <MenteeContactSheet
          open={!!selectedMentee}
          onOpenChange={(o) => { if (!o) setSelectedMentee(null); }}
          mentee={selectedMentee}
        />
      </div>
    </DashboardLayout>
  );
}
