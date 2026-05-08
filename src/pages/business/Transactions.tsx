import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UniversalFilterBar } from "@/components/filters";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";

export default function BusinessTransactions() {
  const { t } = useTranslation();
  useDocumentTitle(t("nav.transactions"));

  return (
    <DashboardLayout>
      <UniversalFilterBar title={t("nav.transactions")} />
      <div className="mt-4 flex min-h-[60vh] items-center justify-center rounded-2xl border border-dashed border-border bg-card text-sm text-muted-foreground">
        {t("transactions.placeholder")}
      </div>
    </DashboardLayout>
  );
}
