import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HeroBannerCard } from "@/components/dashboard/HeroBannerCard";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { ActionCenterCard } from "@/components/dashboard/ActionCenterCard";
import { NewsAndTrainingCard } from "@/components/dashboard/NewsAndTrainingCard";
import { PromotionalCarousel } from "@/components/dashboard/PromotionalCarousel";
import { ConnectUplineCard } from "@/components/dashboard/ConnectUplineCard";
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
          <HeroBannerCard />
          <StatsRow />
          <ActionCenterCard />
        </div>

        {/* Right Sidebar (1 column) */}
        <div className="space-y-6">
          <NewsAndTrainingCard />
          <PromotionalCarousel />
          <ConnectUplineCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
