import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, GraduationCap, ChevronRight } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/shared/DataTable";
import { mockStateMentors, mockCanadianStateMentors, type StateMentor } from "@/data/mentorMockData";
import { StateMentorProfileSheet } from "@/components/agent/StateMentorProfileSheet";
import { useDemoConfig } from "@/contexts/DemoConfigContext";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";

type View = "tiles" | "list";

export default function BrokerHub() {
  const { t } = useTranslation();
  const { config } = useDemoConfig();
  useDocumentTitle(t("broker.title"));
  const [view, setView] = useState<View>("tiles");
  const [selectedMentor, setSelectedMentor] = useState<StateMentor | null>(null);

  const mentors = config.brokerHubMode === "us" ? mockStateMentors : mockCanadianStateMentors;
  const totalMentors = mentors.length;
  const mentorLabel = config.brokerHubMode === "us" ? t("broker.stateMentors") : t("broker.provincialMentors");
  const mentorDesc = config.brokerHubMode === "us" ? t("broker.stateMentorsDesc") : t("broker.provincialMentorsDesc");

  const columns: ColumnDef<StateMentor>[] = [
    { key: "name", header: t("broker.name"), type: "string", sortable: true, filterable: true },
    { key: "totalActiveMentees", header: t("broker.totalActiveMentees"), type: "string", sortable: true, filterable: true, render: (val) => String(val ?? 0) },
    { key: "primaryEmail", header: t("broker.primaryEmail"), type: "string", sortable: true, filterable: true },
    { key: "phone", header: t("broker.phone"), type: "string", filterable: true },
    { key: "secondaryEmail", header: t("broker.secondaryEmail"), type: "string", filterable: true },
    { key: "city", header: t("broker.city"), type: "string", sortable: true, filterable: true },
    { key: "state", header: t("broker.state"), type: "string", sortable: true, filterable: true },
    { key: "postalCode", header: config.brokerHubMode === "us" ? "ZIP Code" : t("broker.postalCode"), type: "string", filterable: true },
    { key: "agentId", header: "ID", type: "string", sortable: true, filterable: true },
    { key: "primaryStateLicense", header: config.brokerHubMode === "us" ? "Primary State License" { key: "primaryStateLicense", header: config.brokerHubMode === "us" ? "Primary State License" : "Primary Provincial License", type: "string", sortable: true, filterable: true },, type: "string", sortable: true, filterable: true },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {view === "tiles" && (
          <>
            <h1 className="text-page-title font-bold text-foreground">{t("broker.title")}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card
                className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                onClick={() => setView("list")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setView("list"); }}
                aria-label={`${mentorLabel} — ${totalMentors}`}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="rounded-full bg-primary-foreground/20 p-3">
                    <GraduationCap className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium opacity-90">{mentorLabel}</p>
                    <p className="text-stat-value font-bold font-secondary">{totalMentors}</p>
                    <p className="text-xs opacity-75 mt-0.5">{mentorDesc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 opacity-60" aria-hidden="true" />
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {view === "list" && (
          <>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView("tiles")}
                className="h-9 w-9"
                aria-label={t("broker.back")}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <h1 className="text-page-title font-bold text-foreground">{mentorLabel}</h1>
            </div>

            <DataTable
              data={mentors}
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
                      {mentor.totalActiveMentees} {mentor.totalActiveMentees !== 1 ? t("broker.activeMenteesCount") : t("broker.activeMenteeCount")}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
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
