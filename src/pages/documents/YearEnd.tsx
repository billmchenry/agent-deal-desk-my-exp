import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";

export default function YearEnd() {
  const { t } = useTranslation();
  useDocumentTitle(t("nav.yearEnd"));

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground text-lg">{t("common.comingSoon")}</p>
      </div>
    </DashboardLayout>
  );
}
