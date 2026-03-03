import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomizableDashboard } from "@/components/dashboard/CustomizableDashboard";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";

const Index = () => {
  useDocumentTitle("Home");
  const { t } = useTranslation();
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("dashboard.welcomeToExp")}</h1>
        <p className="text-muted-foreground">{t("dashboard.hiUser")}</p>
      </div>

      <CustomizableDashboard />
    </DashboardLayout>
  );
};

export default Index;
