import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { DataTable, type ColumnDef } from "@/components/shared/DataTable";
import { MenteeContactSheet } from "@/components/mentor/MenteeContactSheet";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { mockMentees, type Mentee } from "@/data/mentorMockData";
import { useFormatters } from "@/hooks/useFormatters";

export default function MyMentees() {
  const { t } = useTranslation();
  useDocumentTitle(t("mentor.myMentees"));
  const navigate = useNavigate();
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);
  const { formatCurrency } = useFormatters();

  const columns: ColumnDef<Mentee>[] = [
    { key: "agentName", header: t("mentor.agent"), type: "string", sortable: true, filterable: true, defaultVisible: true },
    { key: "status", header: t("mentor.status"), type: "badge", sortable: true, filterable: true, defaultVisible: true },
    { key: "agentId", header: t("mentor.id"), type: "string", sortable: true, defaultVisible: false },
    { key: "joinDate", header: t("mentor.joinDate"), type: "date", sortable: true, defaultVisible: true },
    { key: "transactionsRemaining", header: t("mentor.transactionsRemaining"), type: "number", sortable: true, defaultVisible: true },
    { key: "paidMentorFees", header: t("mentor.paidMentorFees"), type: "currency", sortable: true, defaultVisible: true },
    { key: "mentorFee", header: t("mentor.mentorFeeLabel"), type: "number", sortable: true, defaultVisible: true, render: (v) => <span>{String(v)}%</span> },
    { key: "email", header: t("mentor.emailLabel"), type: "string", defaultVisible: false },
    { key: "phone", header: t("mentor.phone"), type: "string", defaultVisible: false },
    { key: "city", header: t("mentor.city"), type: "string", defaultVisible: false },
    { key: "state", header: t("mentor.state"), type: "string", filterable: true, defaultVisible: false },
    { key: "postalCode", header: t("mentor.postalCode"), type: "string", defaultVisible: false },
    { key: "country", header: t("mentor.country"), type: "string", defaultVisible: false },
    { key: "secondaryEmail", header: t("mentor.secondaryEmail"), type: "string", defaultVisible: false },
  ];

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
          {t("mentor.myMentees")}
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
              <p className="text-xs text-muted-foreground">{row.status} · {t("mentor.joined")} {row.joinDate}</p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{t("mentor.remaining")}: {row.transactionsRemaining}</span>
                <span>{t("mentor.fee")}: {row.mentorFee}%</span>
                <span>{t("mentor.paid")}: {formatCurrency(row.paidMentorFees)}</span>
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