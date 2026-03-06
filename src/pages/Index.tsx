import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomizableDashboard } from "@/components/dashboard/CustomizableDashboard";
import { MentorProgramWidget } from "@/components/dashboard/MentorProgramWidget";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";

type MenteeHomeStatus = "none" | "needs_mentor" | "pairing_underway";

const Index = () => {
  useDocumentTitle("Home");
  const { t } = useTranslation();

  const [menteeStatus, setMenteeStatus] = useState<MenteeHomeStatus>(() => {
    return (sessionStorage.getItem("menteeHomeStatus") as MenteeHomeStatus) || "none";
  });

  const handleStatusChange = (status: "needs_mentor" | "pairing_underway") => {
    setMenteeStatus(status);
    sessionStorage.setItem("menteeHomeStatus", status);
  };

  const demoStatuses: MenteeHomeStatus[] = ["none", "needs_mentor", "pairing_underway"];

  return (
    <DashboardLayout>
      {/* Demo switcher for mentee homepage states */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span className="text-xs text-muted-foreground font-medium">Demo (Mentee):</span>
        {demoStatuses.map((s) => (
          <Button
            key={s}
            variant={menteeStatus === s ? "default" : "outline"}
            size="sm"
            className="text-xs h-7"
            onClick={() => {
              setMenteeStatus(s);
              sessionStorage.setItem("menteeHomeStatus", s);
            }}
          >
            {s === "none" ? "No Widget" : s.replace(/_/g, " ")}
          </Button>
        ))}
      </div>

      {(menteeStatus === "needs_mentor" || menteeStatus === "pairing_underway") && (
        <div className="mb-6">
          <MentorProgramWidget status={menteeStatus} onStatusChange={handleStatusChange} />
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("dashboard.welcomeToExp")}</h1>
        <p className="text-muted-foreground">{t("dashboard.hiUser")}</p>
      </div>

      <CustomizableDashboard />
    </DashboardLayout>
  );
};

export default Index;
