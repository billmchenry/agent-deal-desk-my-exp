import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomizableDashboard } from "@/components/dashboard/CustomizableDashboard";
import { MentorProgramWidget } from "@/components/dashboard/MentorProgramWidget";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useDemoConfig } from "@/contexts/DemoConfigContext";

const Index = () => {
  useDocumentTitle("Home");
  const { t } = useTranslation();
  const { config, setMentorMode } = useDemoConfig();

  const menteeStatus = config.mentorMode;
  const showWidget = menteeStatus === "needs_mentor" || menteeStatus === "pairing_underway";

  return (
    <DashboardLayout>
      {showWidget && (
        <div className="mb-6">
          <MentorProgramWidget
            status={menteeStatus as "needs_mentor" | "pairing_underway"}
            onStatusChange={(s) => setMentorMode(s)}
          />
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
