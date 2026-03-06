import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, GraduationCap, ChevronRight } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/shared/DataTable";
import { mockStateMentors, mockMentees, type StateMentor } from "@/data/mentorMockData";
import { StateMentorProfileSheet } from "@/components/agent/StateMentorProfileSheet";
import { useDocumentTitle } from "@/hooks/use-document-title";

type View = "tiles" | "list";

const columns: ColumnDef<StateMentor>[] = [
  { key: "name", header: "Name", type: "string", sortable: true, filterable: true },
  { key: "totalActiveMentees", header: "Total Active Mentees", type: "number", sortable: true, filterable: true },
  { key: "primaryEmail", header: "Primary Email", type: "string", sortable: true, filterable: true },
  { key: "phone", header: "Phone", type: "string", filterable: true },
  { key: "secondaryEmail", header: "Secondary Email", type: "string", filterable: true },
  { key: "city", header: "City", type: "string", sortable: true, filterable: true },
  { key: "state", header: "State", type: "string", sortable: true, filterable: true },
  { key: "postalCode", header: "Postal Code", type: "string", filterable: true },
];

export default function BrokerHub() {
  useDocumentTitle("Broker Hub");
  const [view, setView] = useState<View>("tiles");
  const [selectedMentor, setSelectedMentor] = useState<StateMentor | null>(null);

  const totalMentors = mockStateMentors.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {view === "tiles" && (
          <>
            <h1 className="text-2xl font-bold text-foreground">Broker Hub</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card
                className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                onClick={() => setView("list")}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="rounded-full bg-primary-foreground/20 p-3">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium opacity-90">State Mentors</p>
                    <p className="text-3xl font-bold">{totalMentors}</p>
                    <p className="text-xs opacity-75 mt-0.5">Count of all Mentors in your state(s).</p>
                  </div>
                  <ChevronRight className="h-5 w-5 opacity-60" />
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {view === "list" && (
          <>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setView("tiles")} className="h-9 w-9">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-foreground">State Mentors</h1>
            </div>

            <DataTable
              data={mockStateMentors}
              columns={columns}
              searchableKeys={["name", "primaryEmail", "city", "state"]}
              onRowClick={(mentor) => setSelectedMentor(mentor)}
              csvFilename="state-mentors"
              defaultSort={{ key: "name", direction: "asc" }}
              mobileCardRender={(mentor) => (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{mentor.name}</p>
                    <p className="text-xs text-muted-foreground">{mentor.city}, {mentor.state}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {mentor.totalActiveMentees} active mentee{mentor.totalActiveMentees !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            />
          </>
        )}
      </div>

      <StateMentorProfileSheet
        mentor={selectedMentor}
        open={!!selectedMentor}
        onOpenChange={(open) => { if (!open) setSelectedMentor(null); }}
      />
    </DashboardLayout>
  );
}
