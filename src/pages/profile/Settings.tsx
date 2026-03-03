import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { SettingsTab } from "@/components/profile/SettingsTab";
import { useTranslation } from "@/hooks/useTranslation";

export default function Settings() {
  const { t } = useTranslation();
  useDocumentTitle(t("settings.title"));
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">{t("settings.title")}</h1>
        <SettingsTab />
      </div>
    </DashboardLayout>
  );
}
