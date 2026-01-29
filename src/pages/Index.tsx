import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CappingYearCard } from "@/components/dashboard/CappingYearCard";
import { ActionCenterCard } from "@/components/dashboard/ActionCenterCard";
import { ConnectUplineCard } from "@/components/dashboard/ConnectUplineCard";
import { CompanyUplineCard } from "@/components/dashboard/CompanyUplineCard";
import { TrainingEducationCard } from "@/components/dashboard/TrainingEducationCard";

const Index = () => {
  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Welcome to eXp!</h1>
        <p className="text-muted-foreground">Hi Clifford!</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Left/Center (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <CappingYearCard />
          <ActionCenterCard />
        </div>

        {/* Right Sidebar (1 column) */}
        <div className="space-y-6">
          <ConnectUplineCard />
          <CompanyUplineCard />
          <TrainingEducationCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
