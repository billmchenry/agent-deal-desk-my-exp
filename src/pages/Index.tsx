import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomizableDashboard } from "@/components/dashboard/CustomizableDashboard";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { UniversalFilterBar } from "@/components/filters";
import { CappingCelebrationModal } from "@/components/dashboard/CappingCelebrationModal";
import { useDemoConfig } from "@/contexts/DemoConfigContext";

const CELEBRATION_KEY = "cappingCelebrationDismissed_2026";

const Index = () => {
  const { t } = useTranslation();
  const { config } = useDemoConfig();
  useDocumentTitle(t("nav.home"));

  const isCapped = config.cappingMode === "capped";
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isCapped) {
      // Reset dismissed flag when toggling to capped so it shows again
      localStorage.removeItem(CELEBRATION_KEY);
      setShowCelebration(true);
    } else {
      setShowCelebration(false);
    }
  }, [isCapped]);

  const handleDismiss = () => {
    setShowCelebration(false);
    localStorage.setItem(CELEBRATION_KEY, "true");
  };

  return (
    <DashboardLayout>
      <UniversalFilterBar
        title={t("dashboard.welcomeToExp")}
        subtitle={t("dashboard.hiUser")}
      />

      <CustomizableDashboard />
      <CappingCelebrationModal open={showCelebration} onDismiss={handleDismiss} />
    </DashboardLayout>
  );
};

export default Index;
