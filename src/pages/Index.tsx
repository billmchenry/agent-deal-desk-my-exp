import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomizableDashboard } from "@/components/dashboard/CustomizableDashboard";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { UniversalFilterBar } from "@/components/filters";

const Index = () => {
  useDocumentTitle("Home");
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <UniversalFilterBar
        title={t("dashboard.welcomeToExp")}
        subtitle={t("dashboard.hiUser")}
      />

      <CustomizableDashboard />
    </DashboardLayout>
  );
};

export default Index;
