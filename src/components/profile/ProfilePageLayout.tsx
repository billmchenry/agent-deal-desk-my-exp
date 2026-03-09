import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";

interface ProfilePageLayoutProps {
  children: React.ReactNode;
}

export function ProfilePageLayout({ children }: ProfilePageLayoutProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  useDocumentTitle(t("nav.myProfile"));

  const isPersonalDetails = location.pathname === "/profile/personal-details";
  const isSettings = location.pathname === "/profile/settings";

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <h1 className="text-page-title font-bold text-foreground mb-4">My Profile</h1>

        <div className="flex border-b mb-6">
          <button
            onClick={() => navigate("/profile/personal-details")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              isPersonalDetails
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Personal Details
          </button>
          <button
            onClick={() => navigate("/profile/settings")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              isSettings
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Settings
          </button>
        </div>

        {children}
      </div>
    </DashboardLayout>
  );
}
